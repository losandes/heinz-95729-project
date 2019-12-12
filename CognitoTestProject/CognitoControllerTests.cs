using CognitoBot.Controllers;
using CognitoBot;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net.Http;
using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Linq;

namespace CognitoTestProject
{
    [TestClass]
    public class CognitoControllerTests
    {
        static CognitoController controller;
        static String highPolarityTextJsonString;
        static String lowPolarityTextJsonString;

        [ClassInitialize]
        public static void Setup(TestContext testContext)
        {
            controller = new CognitoController(new GiphyService(), new SlackService(), new AylienSentimentFetch());
            highPolarityTextJsonString = "{\"token\":\"r0zAl4mzocXVLFOqWCKvnzY1\",\"team_id\":\"TPGQH0VFB\",\"api_app_id\":\"AQJ3Q8UQ4\"," +
                "\"event\":{\"client_msg_id\":\"dd67aaab-7ba2-4d4a-b865-5d27c142e28c\",\"type\":\"message\",\"text\":\"I am really sad\"," +
                "\"user\":\"UPP8YFCBF\",\"ts\":\"1575516436.005800\",\"team\":\"TPGQH0VFB\",\"blocks\":[{\"type\":\"rich_text\"," +
                "\"block_id\":\"JVHT\",\"elements\":[{\"type\":\"rich_text_section\",\"elements\":[{\"type\":\"text\",\"text\":\"I am really sad\"}]}]}]," +
                "\"channel\":\"GQJJ7M3HT\",\"event_ts\":\"1575516436.005800\",\"channel_type\":\"group\"},\"type\":\"event_callback\"," +
                "\"event_id\":\"EvRA5C7X7E\",\"event_time\":1575516436,\"authed_users\":[\"UQ74EUFU3\"]}";

            lowPolarityTextJsonString = "{\"token\":\"r0zAl4mzocXVLFOqWCKvnzY1\",\"team_id\":\"TPGQH0VFB\",\"api_app_id\":\"AQJ3Q8UQ4\"," +
                "\"event\":{\"client_msg_id\":\"dd67aaab-7ba2-4d4a-b865-5d27c142e28c\",\"type\":\"message\",\"text\":\"something\"," +
                "\"user\":\"UPP8YFCBF\",\"ts\":\"1575516436.005800\",\"team\":\"TPGQH0VFB\",\"blocks\":[{\"type\":\"rich_text\"," +
                "\"block_id\":\"JVHT\",\"elements\":[{\"type\":\"rich_text_section\",\"elements\":[{\"type\":\"text\",\"text\":\"something\"}]}]}]," +
                "\"channel\":\"GQJJ7M3HT\",\"event_ts\":\"1575516436.005800\",\"channel_type\":\"group\"},\"type\":\"event_callback\"," +
                "\"event_id\":\"EvRA5C7X7E\",\"event_time\":1575516436,\"authed_users\":[\"UQ74EUFU3\"]}";
        }

        [TestMethod]
        public void TestGet()
        {
            IEnumerable<String> response = controller.Get();
            string[] responseList = response.ToArray();
            Assert.AreEqual(4, responseList.Length);
            IEnumerator em = response.GetEnumerator();
            if (em.MoveNext())
            {
                string hello = em.Current.ToString();
                Assert.AreEqual("Hello", hello);
                if (em.MoveNext())
                {
                    string world = em.Current.ToString();
                    Assert.AreEqual("World", world);
                }
            }
        }

        [TestMethod]
        public void TestPostWithHighPolarity()
        {
            String response = controller.Post(JObject.Parse(highPolarityTextJsonString));
            Assert.AreNotEqual("No response as polarity was too low", response);
        }

        [TestMethod]
        public void TestPostWithLowPolarity()
        {
            String response = controller.Post(JObject.Parse(lowPolarityTextJsonString));
            Assert.AreEqual("No response as polarity was too low", response);
        }

    }
}
