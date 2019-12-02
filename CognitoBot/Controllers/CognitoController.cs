using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using RestSharp;

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
            return new string[] { "Hello", "World" , res.ToString(), pres };
        }

        // POST: api/Default
        [HttpPost]
        public String Post([FromBody] JObject json)
        {
            String text = json.SelectToken("event.text").ToString();
            String channel = json.SelectToken("event.channel").ToString();
            res = json;
            AylienSentimentFetch getSentiment = new AylienSentimentFetch();
            String sentiment = getSentiment.getSentimentScore(text);
            if (sentiment.Equals("positive"))
            {
                sentiment = "happy minion";
            }
            else
            {
                sentiment = "sad minion";
            }
            String giphyUrl = getGiphy(sentiment);

            String content = createResponse(channel, giphyUrl);
            return sendResponseToSlack(content);
        }

        public String getGiphy(String searchText)
        {

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create("http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + searchText);
            //request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse())
            using (System.IO.Stream stream = response.GetResponseStream())
            using (System.IO.StreamReader reader = new System.IO.StreamReader(stream))
            {
                String responseText = reader.ReadToEnd();
                JObject json = JObject.Parse(responseText);
                String giphyUrl = json.SelectToken("data[0].url").ToString();
                return giphyUrl;
            }
        }

        public String createResponse(String channel, String giphyUrl)
        {
            JObject json = new JObject();
            json["channel"] = channel;
            json["text"] = giphyUrl;
            return json.ToString();
        }

        public String sendResponseToSlack(String content)
        {
            var request = (HttpWebRequest)WebRequest.Create("https://slack.com/api/chat.postMessage");
            request.Method = "POST";
            var postData = System.Text.Encoding.ASCII.GetBytes(content);
            request.ContentType = "application/json";
            request.ContentLength = content.Length;
            request.Headers.Add("Authorization", "Bearer " + "xoxb-798833029521-823150967955-eqPjF5x1OtROkqpZPAArxGvb");

            using (var stream = request.GetRequestStream())
            {
                stream.Write(postData, 0, content.Length);
            }

            var response = (HttpWebResponse)request.GetResponse();
            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            pres = responseString;
            return responseString;
        }
    }
}