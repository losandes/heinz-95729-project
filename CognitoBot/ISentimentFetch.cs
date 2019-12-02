using static CognitoBot.AylienSentimentFetch;

namespace CognitoBot
{
    interface ISentimentFetch
    {
        public SentimentResponse getSentimentScore(string text);
    }
}
