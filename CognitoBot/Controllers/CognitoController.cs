using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CognitoBot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CognitoController : ControllerBase
    {

        // GET: api/Default
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "Hello", "World" };
        }

        // POST: api/Default
        [HttpPost]
        public String Post([FromBody] string value)
        {
            JObject json = JObject.Parse(value);
            String text = json.SelectToken("event.text").ToString();
            String channel = json.SelectToken("event.channel").ToString();
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

            return createResponse(channel,giphyUrl);
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
    }
}