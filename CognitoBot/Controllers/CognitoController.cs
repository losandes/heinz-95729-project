using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        public HttpResponse Post([FromBody] string value)
        {
            JObject json = JObject.Parse(value);
            return json.SelectToken("challenge");

            /*JObject json = JObject.Parse(value);
            String text = json.SelectToken("event.text");
            AylienSentimentFetch getSentiment = new AylienSentimentFetch();
            String sentiment = getSentiment.getSentimentScore(text);
            if(sentiment.Equals("positive")){
                sentiment = "happy minion";
            }else{
                sentiment = "sad minion";
            }
            String giphyUrl =  getGiphy(sentiment);

            createResponse();*/
        }

        public String getGiphy(String searchText){

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + searchText);
            //request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using(HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using(Stream stream = response.GetResponseStream())
            using(StreamReader reader = new StreamReader(stream))
            {
                String response = reader.ReadToEnd();
                JObject json = JObject.Parse(response);
                String giphyUrl = json.SelectToken("data[0].url");
                return giphyUrl;
            }
        }

        public String createResponse(){
            JObject json = new JObject();
            
            //{
 // "channel": "YOUR_CHANNEL_ID",
//  "text": "Hello, world"
//}
        }
    }
}