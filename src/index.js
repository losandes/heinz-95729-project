// // const dialogflow = require('dialogflow');

const { dialogflow, Image } = require('actions-on-google');

const app = dialogflow({ debug: true });
console.log('in index.js');

app.intent('Default Welcome Intent', (conv) => {
    console.log(JSON.stringify(conv));

    console.log('in default welcome intent handler');
    conv.ask('Hello from the a team!');
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(`Sorry I didn't get that`);
    conv.ask(
        new Image({
            url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
            alt: 'A cat',
        })
    );
});

app.intent('order.additem', (conv) => {
    console.log(JSON.stringify(conv));

    conv.ask('What would you like to order?');
});

app.intent('order.additem - yes', (conv) => {
    console.log(JSON.stringify(conv));

    conv.ask('What would you like to order?');
});

exports.handler = app;
