const fs = require('fs')
const express = require('express')
const serveStatic = require('serve-static')
const { spawn } = require('child_process')  // Child process to integrate python into server code
const app = express()
const { once } = require('events')
const path = require('path');
const bodyParser = require('body-parser') /// Need to get post from from

//npm install alert

// serve this directory as a static web server
app.use(serveStatic(__dirname))



const pypath = './ml/src/knn.py'
//var vars = ['Cab','Creative','Cafe/Espresso Bars','Carry in Wine and Beer','$15-$30','Quiet for Conversation']
//var vars = ['Cab','Authentic']

//vars.splice(0, 0, pypath)

//Python Integration Portion

//Make sure Python is running in the environment ex. Output on console should be your verion number (i.e. Python 3.6.2)
//const childPython = spawn('python', ['--version']);

//Test to make sure directory is properly integrated and python script will run
//const childPython = spawn('python', ['./ml/src/testing/test.py'])

//Test for inputting system arguments into python scripts
//Gets python file and runs the python script with an array index 0 is the python file, and every index after that should be feature number
//const childPython = spawn('python', ['./ml/src/testing/test2.py',12])

//Machine Learning Python Script
//const childPython = spawn('python', vars)

async function ml_alg(features){

      const childPython = spawn('python', features)
      var result = '';

      childPython.stdout.on('data', (data) => 
      {
  
        result += data.toString();
        console.log(result);

      });

      childPython.stdout.on('close', (code) => 
      {
        
        console.log(`Child process exited with code ${code}`);
        //console.log("I am the result on closed: ", result);
        //console.log(typeof(result));
        return result;

      });

      childPython.stderr.on('data', (err) => 
      {

        console.log(`stderr: ${err}`);
        return("Error");

      });

      await once(childPython, 'close');

      return result;
        
  }

async function grabvals(features) {

  features.splice(0, 0, pypath)
  try
  {
    const output = await ml_alg(features);
    console.log("I am the output",output);

    return(output);
    //console.log(typeof(output));
  }

  catch(err) 
  {
    console.log(err);
    throw(err);
  }
}
//
//console.log("The end result",feats);

// app.get('/example', (req, res) => {
//   res.send(`Full name is:${req.body.fname} ${req.body.lname}.`);
// });


// 404 - return the SPA index for any files that aren't found
app.use(function (req, res, next) {
  'use strict'

  res.writeHead(200, { 'Content-Type': 'text/html'})
  fs.createReadStream('./index.html').pipe(res)
  next()
});

// // For parsing application/json
app.use(express.json());
  
// // For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/test',async (req, res) =>{
  var inputs = [req.body.one,req.body.two];
  // app.set('views', path.join(__dirname, 'views'));
  // app.engine('html', require('ejs').renderFile);
  // app.set('view engine', 'ejs');

  //console.log(typeof(req.body.one)) 
  //console.log(typeof(req.body.two))
  //const webout = await grabvals(inputs)

  //// 
  /// Get ML String to Post here
  ////

  //Somehow getting  code: 'ERR_STREAM_WRITE_AFTER_END'
  // const webout = await grabvals(inputs)
  //
  grabvals(inputs)
  res.write('<html>')
  res.write('<head><title><h1>Recommendations</h1></title></head>')
  res.write(`<body><h2>${inputs}</h2></body>`) // change ${webout}
  res.write('</html>')
  res.end()
})

// response to port 3001
app.listen(3001)
console.log('The app is running at http://localhost:3001')
