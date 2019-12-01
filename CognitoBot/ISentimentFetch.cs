using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitoBot
{
    interface ISentimentFetch
    {
        public string getSentimentScore(string text);
    }
}
