using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;

namespace CognitoBot
{
    public class SlackService
    {

        public String SendResponseToSlack(String channel, String giphyUrl, String msg)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create("https://slack.com/api/chat.postMessage");
                request.Method = "POST";
                string content = CreateSlackMessage(channel, giphyUrl, msg);
                var postData = System.Text.Encoding.ASCII.GetBytes(content);
                request.ContentType = "application/json";
                request.ContentLength = content.Length;
                request.Headers.Add("Authorization", "Bearer " + "xoxb-1234");

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(postData, 0, content.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return responseString;
            }
            catch (Exception)
            {
                return "";
            }

        }

        private String CreateSlackMessage(String channel, String giphyUrl, String msg)
        {
            JObject json = new JObject();
            json["channel"] = channel;
            json["text"] = msg + "\n" + giphyUrl;
            return json.ToString();
        }

    }
}
