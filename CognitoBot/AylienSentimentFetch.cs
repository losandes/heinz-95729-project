using RestSharp;

namespace CognitoBot
{
    public class AylienSentimentFetch : ISentimentFetch
    {
        public SentimentResponse getSentimentScore(string text)
        {
            try
            {
                var client = new RestClient("https://api.aylien.com/api/v1/sentiment?mode=tweet&text=" + text);
                var request = new RestRequest(Method.GET);
                addHeaders(request);
                IRestResponse response = client.Execute(request);
                SentimentResponse reply = SimpleJson.DeserializeObject<SentimentResponse>(response.Content);
                return reply;
            }
            catch (System.Exception e) {
                SentimentResponse reply = new SentimentResponse();
                reply.polarity = "positive";
                reply.polarity_confidence = (float) 0.5;
                return reply;
            }
        }

        public void addHeaders(RestRequest request) {
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("X-AYLIEN-TextAPI-Application-ID", "9915cb86");
            request.AddHeader("X-AYLIEN-TextAPI-Application-Key", "b0cdea5fc81ec683cb681eec282fcb12");
        }
        public class SentimentResponse
        {
            public string polarity { get; set; }
            public string subjectivity { get; set; }
            public string text { get; set; }
            public float polarity_confidence { get; set; }
            public float subjectivity_confidence { get; set; }
        }

    }
}
