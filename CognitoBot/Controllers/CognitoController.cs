using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CognitoBot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CognitoController : ControllerBase
    {

        // GET: api/Default
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "Hello", "World" };
        }

        // POST: api/Default
        [HttpPost]
        public string Post([FromBody] string value)
        {
            return "Hello Post world";
        }
    }
}