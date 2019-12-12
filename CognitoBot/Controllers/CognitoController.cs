using System;
using System.Collections.Generic;
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

        private readonly GiphyService _giphyService;
        private readonly SlackService _slackService;
        private readonly AylienSentimentFetch _aylienService;

        public CognitoController(GiphyService giphyService, SlackService slackService, AylienSentimentFetch aylienSentimentFetch)
        {
            _giphyService = giphyService;
            _slackService = slackService;
            _aylienService = aylienSentimentFetch;
        }

        // GET: api/Default for debugging
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "Hello", "World", res.ToString(), pres };
        }

        // POST: api for recieving messages from slack
        [HttpPost]
        public String Post([FromBody] JObject json)
        {
            res = json;
            String bot_id = json.SelectToken("event.bot_id") != null ? json.SelectToken("event.bot_id").ToString() : "";
            if (bot_id == "")
            {
                String text = json.SelectToken("event.text").ToString();
                String channel = json.SelectToken("event.channel").ToString();
                SentimentResponse sentimentResponse = _aylienService.getSentimentScore(text);
                String sentiment = sentimentResponse.polarity;
                if (sentimentResponse.polarity_confidence >= 0.7)
                {
                    string msg = GetMessageString(ref sentiment);
                    String giphyUrl = _giphyService.GetGiphyUrl(sentiment);
                    String response = _slackService.SendResponseToSlack(channel, giphyUrl, msg);
                    Thread.Sleep(1000);
                    pres = response;
                    return response;
                }
            }
            pres = "No response as polarity was too low";
            return "No response as polarity was too low";
        }

        private static string GetMessageString(ref string sentiment)
        {
            string msg;
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

            return msg;
        }
        
    }
}