using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using static CognitoBot.AylienSentimentFetch;

namespace CognitoBot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CognitoController : ControllerBase
    {
        static JObject res = new JObject();
        static String pres = "";

        // GET: api/Default
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "Hello", "World", res.ToString(), pres };
        }

        // POST: api/Default
        [HttpPost]
        public String Post([FromBody] JObject json)
        {
            res = json;
            String bot_id = json.SelectToken("event.bot_id") != null ? json.SelectToken("event.bot_id").ToString() : "";
            if (bot_id == "")
            {
                String text = json.SelectToken("event.text").ToString();
                String channel = json.SelectToken("event.channel").ToString();
                AylienSentimentFetch getSentiment = new AylienSentimentFetch();
                SentimentResponse sentimentResponse = getSentiment.getSentimentScore(text);
                String sentiment = sentimentResponse.polarity;
                if (sentimentResponse.polarity_confidence >= 0.7)
                {
                    String msg = "";
                    if (sentiment.Equals("positive"))
                    {
                        sentiment = "cheers";
                        msg = "You look happy!. Here's a fun gif for you";
                    }
                    else
                    {
                        sentiment = "happy minion";
                        msg = "You sound sad. Here's something to cheer you up";
                    }
                    String giphyUrl = getGiphy(sentiment);
                    String content = createResponse(channel, giphyUrl, msg);
                    Thread.Sleep(1000);

                    return sendResponseToSlack(content);
                }
            }
            pres = "No response as polarity was too low";
            return "No response as polarity was too low";
        }

        public String getGiphy(String searchText)
        {

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + searchText);
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                String responseText = reader.ReadToEnd();
                JObject json = JObject.Parse(responseText);
                Random rnd = new Random();
                int randomNum = rnd.Next(0, 10);
                String imageUrl = "data[" + randomNum + "].url";
                String giphyUrl = json.SelectToken(imageUrl).ToString();
                return giphyUrl;
            }
        }

        public String createResponse(String channel, String giphyUrl, String msg)
        {
            JObject json = new JObject();
            json["channel"] = channel;
            json["text"] = msg + "\n" + giphyUrl;
            return json.ToString();
        }

        public String sendResponseToSlack(String content)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create("https://slack.com/api/chat.postMessage");
                request.Method = "POST";
                var postData = System.Text.Encoding.ASCII.GetBytes(content);
                request.ContentType = "application/json";
                request.ContentLength = content.Length;
                request.Headers.Add("Authorization", "Bearer " + "xoxb-798833029521-823150967955-hJ1uMxnPoARtEMoTwqoGkYVq");

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(postData, 0, content.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                pres = responseString;
                return responseString;
            }
            catch (Exception e) {
                pres = "Exception Occurred";
                return "";
            }
            
        }
    }
}