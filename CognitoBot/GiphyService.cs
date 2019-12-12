using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;

namespace CognitoBot
{
    public class GiphyService : IGiphyService
    {
        public String GetGiphyUrl(String searchTerm)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + searchTerm);
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                String responseText = reader.ReadToEnd();
                JObject json = JObject.Parse(responseText);
                return SelectRandomURL(json);
            }
        }

        private static string SelectRandomURL(JObject json)
        {
            Random rnd = new Random();
            int randomNum = rnd.Next(0, 10);
            String imageUrl = "data[" + randomNum + "].url";
            String giphyUrl = json.SelectToken(imageUrl).ToString();
            return giphyUrl;
        }

    }
}
