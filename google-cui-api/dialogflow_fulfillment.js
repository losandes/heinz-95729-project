'use strict';
 
var https = require ('https');
const functions = require('firebase-functions');
const DialogFlowApp = require('actions-on-google').DialogFlowApp;
const {WebhookClient} = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({ request, response });
    console.log('Request Headers: ' + JSON.stringify(request.headers));
    console.log('Request Body: ' + JSON.stringify(request.body));
    console.log(request.body.queryResult);
    console.log(request.body.queryResult.intent);
    let intent = request.body.queryResult.intent.displayName;
    let action = request.body.queryResult.action;

    response.setHeader('Content-Type','application/json');

    const parameters = request.body.queryResult.parameters;

    var product_name = parameters['product'];
    var unit_number = parameters['number-integer'];
    console.log("I can retrieve product name: " + product_name);
    console.log("I can retrieve unit-number");
    
    switch(intent) {
        case ("check-product-price"):
            if (unit_number <= 0) {
                parameters['number-integer'] = None;
                zero_product_wanted(response);
            } 
            get_product_price(product_name, response);
            break;
        case ("add-to-shopping-cart - yes"):
            console.log(agent.context.get('check-product-price-followup').parameters);
            add_product_cart(agent.context.get('check-product-price-followup').parameters['product'],agent.context.get('check-product-price-followup').parameters['number-integer'] , response);
            break;
        case("check-shopping-cart"):
            get_cart_list(response);
            break;
        case("delete-product-in-shopping-cart - yes - custom"):
            remove_product_cart(agent.context.get('delete-product-in-shopping-cart-yes-followup').parameters['product'], response);
            break;
        case("delete no - checkout - yes"):
            remove_all_from_cart(response);
            break;
        default:
            console.log(intent);
            console.log("in the default methode");
    }
    
    // get_product_price(product_name, response);
});

function zero_product_wanted(CloudFnResponse) {
    console.log("want zero product");

    var chat = "Zero unit wanted, please try again. What do you want to buy today?" ;
    CloudFnResponse.send(buildChatResponse(chat));
}

function add_product_cart(product_name_param, unit_number, CloudFnResponse) {
    console.log("add product to cart function");


    var post_data = JSON.stringify({
      "product_name": product_name_param,
      "unit_number": unit_number
  });

    const options = {
        hostname: 'test-api-google-heroku.herokuapp.com',
        path: '/cart',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };


    const req = https.request(options, (res) => {
        let data = '';

        console.log('Status Code:', res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Body: ', JSON.parse(data));

            var chat = "The " + product_name_param + " you want to buy is added to the shopping cart. Is there anything you want to buy today?";
            CloudFnResponse.send(buildChatResponse(chat));
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    req.write(post_data);
    req.end();

}

function remove_product_cart(product_name_param, CloudFnResponse) {
    console.log("remove product from cart function");


    var delete_data = JSON.stringify({
      "product_name": product_name_param,
    });

    const options = {
        hostname: 'test-api-google-heroku.herokuapp.com',
        path: '/cart',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(delete_data)
        }
    };


    const req = https.request(options, (res) => {
        let data = '';

        console.log('Status Code:', res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Body: ', JSON.parse(data));

            var chat = "No problem, " +  product_name_param +" is removed from your shopping cart . Do you want to check out now?";
            CloudFnResponse.send(buildChatResponse(chat));
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    req.write(delete_data);
    req.end();

}

function get_cart_list(CloudFnResponse) {
    
    let pathString = "/cart/";
    var request = https.get({
        host: "test-api-google-heroku.herokuapp.com",
        path: pathString,
        
    }, function (response) {
        var json = "";
        response.on('data', function(chunk) {
            console.log("received JSON response: " + chunk);
            json += chunk;
        });

        response.on('end', function(){
          console.log("Inside end function");
            var jsonList = JSON.parse(json);
            var chat = "";
            var sum_price = 0;
            if (jsonList.length == 0) {
                chat = "There is nothing in your shopping cart right now. Do you want to buy anything? Please say out the thing you want to buy";
            } else {
                chat += "Here is the current list of your shopping cart: You have " ;
                for (let i = 0; i < jsonList.length; i++) {
                    chat += jsonList[i].unit_number;
                    chat += " unit of "
                    chat += jsonList[i].product_name;
                    chat += ", costing ";
                    chat += jsonList[i].sub_total +" , ";
                    sum_price += parseFloat(jsonList[i].sub_total);
                }
                chat += " , The final total will be "+ sum_price.toFixed(2)+ " do you want to remove anything before checkout, please answer yes or no.";
            }
            
            
            console.log(chat);

            
            CloudFnResponse.send(buildChatResponse(chat));
        });

    });
}


function get_product_price(product_name, CloudFnResponse) {
    
    let pathString = "/product/"+product_name;
    var request = https.get({
        host: "test-api-google-heroku.herokuapp.com",
        path: pathString,
        //headers: {}
    }, function (response) {
        var json = "";
        response.on('data', function(chunk) {
            console.log("received JSON response: " + chunk);
            json += chunk;
        });

        response.on('end', function(){
          console.log("Inside end function");
            var jsonData = JSON.parse(json);
            console.log(jsonData);
            var tryData = jsonData;
            console.log(tryData);

            var chat = "One unit of" + product_name + " is "+ tryData + " dollars. Do you want to add it to your shopping cart? Please answer yes or no" ;
            CloudFnResponse.send(buildChatResponse(chat));
        });

    });
}

function remove_all_from_cart(CloudFnResponse) {
    var delete_data = JSON.stringify({});

    const options = {
        hostname: 'test-api-google-heroku.herokuapp.com',
        path: '/delete/cart',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(delete_data)
        }
    };


    const req = https.request(options, (res) => {
        let data = '';

        console.log('Status Code:', res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Body: ', JSON.parse(data));

            var chat = "Great! Checkout succeeded! Your item is our the way. bye!";
            CloudFnResponse.send(buildChatResponse(chat));
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    req.write(delete_data);
    req.end();
}

function buildChatResponse(chat) {
    return JSON.stringify({"fulfillmentText": chat});
}