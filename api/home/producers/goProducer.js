module.exports.name = 'producers-goProducer'
module.exports.dependencies = ['stringHelper']
module.exports.factory = (stringHelper) => {
  'use strict'

  const BEGIN = '```go\n'
  const TEMPLATE = `package main
import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "{{url}}"
{{body}}
  req, _ := http.NewRequest("{{method}}", url, payload)

{{headers}}
  res, _ := http.DefaultClient.Do(req)
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)

  fmt.Println(res)
  fmt.Println(string(body))
}`
  const HEADER = '  req.Header.Add("{{key}}", "{{value}}")\n'
  const BODY = '  payload := strings.NewReader("{{body}}")\n'
  const END = '\n```\n\n'

  return new Producer()

  function Producer () {
    var self = {
      produce: produce
    }

    function produce (config, callback) {
      var output = TEMPLATE
        .replace(/{{method}}/, stringHelper.getMethod(config.method))
        .replace(/{{url}}/, stringHelper.getUrl(config))

      if (config.headers) {
        output = output.replace(/{{headers}}/, getHeaders(config.headers))
      } else {
        output = output.replace(/{{headers}}/, '')
      }

      if (config.body) {
        output = output.replace(/{{body}}/, getBody(config.body))
      } else {
        output = output.replace(/{{body}}/, '')
      }

      callback(null, BEGIN + output + END)
    }

    function getHeaders (headers) {
      var output = ''
      var key

      if (!headers) {
        return output
      }

      for (key in headers) {
        if (headers.hasOwnProperty(key)) {
          output += HEADER
            .replace(/{{key}}/, key)
            .replace(/{{value}}/, headers[key])
        }
      }

      return output
    }

    function getBody (body) {
      var output = ''

      if (!body) {
        return output
      }

      return BODY.replace(/{{body}}/, stringHelper.replaceDoubleQuotes(body))
    }

    return self
  }
}
