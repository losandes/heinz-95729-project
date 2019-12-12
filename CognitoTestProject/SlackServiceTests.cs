using CognitoBot;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System;

namespace CognitoTestProject
{
    [TestClass]
    public class SlackServiceTests
    {
        public static SlackService slackService;
        static string  giphyUrl, message;

        [ClassInitialize]
        public static void Setup(TestContext testContext)
        {
            slackService = new SlackService();
            giphyUrl = "https://giphy.com/gifs/hero0fwar-karmawhore-rhyming-g9582DNuQppxC";
            message = "You look happy!. Here's a fun gif for you";

        }

        //Commenting this test, it will only run correctly if the correct oauth key is put into SlackService.cs Line 21
        //Place correct OAuth key, uncomment this and run
        /*
        [TestMethod]
        public void TestSendingResponseToSlackWithSuccessResponse()
        {
            //the test will fail if the corret oauth key is not provided to slackservice
            string channel = "GQJJ7M3HT";
            JObject response = JObject.Parse(slackService.SendResponseToSlack(channel, giphyUrl, message));
            bool status = (bool)response.SelectToken("ok");
            Assert.IsNotNull(status);
            Assert.IsTrue(status);
        }
        */

        [TestMethod]
        public void TestSendingResponseToSlackWithInfailureResponse()
        {
            string channel = "randomString";
            JObject response = JObject.Parse(slackService.SendResponseToSlack(channel, giphyUrl, message));
            bool status = (bool)response.SelectToken("ok");
            Assert.IsNotNull(status);
            Assert.IsFalse(status);
        }

    }
}
