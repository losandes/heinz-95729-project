using CognitoBot;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CognitoTestProject
{
    [TestClass]
    public class GiphyServiceTests
    {
        public static GiphyService giphyService;

        [ClassInitialize]
        public static void Setup(TestContext testContext) {
            giphyService = new GiphyService();
        }

        [TestMethod]
        public void TestGetGiphyURL()
        {
            string url = giphyService.GetGiphyUrl("happy");
            bool httpString = url.StartsWith("https://giphy.com/gifs/");
            Assert.IsTrue(httpString);
        }

    }
}
