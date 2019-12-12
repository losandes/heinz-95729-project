using CognitoBot;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RestSharp;

namespace CognitoTestProject
{
    [TestClass]
    public class AylienSentimentFetchTest
    {
        [TestMethod]
        public void TestHappySentiment()
        {
            AylienSentimentFetch sentimentFetch = new AylienSentimentFetch();
            Assert.AreEqual("positive", sentimentFetch.getSentimentScore("I am Happy Today").polarity);
        }

        [TestMethod]
        public void TestSadSentiment()
        {
            AylienSentimentFetch sentimentFetch = new AylienSentimentFetch();
            Assert.AreEqual("negative", sentimentFetch.getSentimentScore("I am Sad Today").polarity);
        }

        [TestMethod]
        public void TestHeaders()
        {
            AylienSentimentFetch sentimentFetch = new AylienSentimentFetch();
            var request = new RestRequest(Method.GET);
            sentimentFetch.addHeaders(request);
            Assert.AreEqual(4, request.Parameters.Count);
        }
    }
}
