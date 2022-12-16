// // const dialogflow = require('dialogflow');

const {
    dialogflow,
    Image,
    BasicCard,
    Suggestions,
} = require('actions-on-google');
const dbExecutor = require('./dbExecutor');

const app = dialogflow({ debug: true });
const Personalization = require('./Personalization');
const Menu = require('./Menu');
const ResponseCodes = require('./ResponseCodes');

app.intent('Default Welcome Intent', (conv, event) => {
    conv.ask(
        'Welcome to Starbux! You can say things like: Hear menu or place an order'
    );
    conv.ask(
        new BasicCard({
            text: `Welcome to Starbux! You can say things like: Hear menu, place an order or personalize. Say help if you ever need help.`,
            title: 'Welcome to Starbux!',
            image: new Image({
                url: 'https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/starbux_welcome_picture.jpg',
                alt: 'Welcome_To_Starbux_Image',
            }),
        })
    );
    conv.ask(
        new Suggestions(['Hear Menu', 'Place an order', 'Personalize', 'Help'])
    );
});

app.intent('Default Fallback Intent', (conv, event) => {
    conv.ask(
        `Sorry I didn't get that, you can say things like Hear the menu, place an order or personalize`
    );
    conv.ask(
        new BasicCard({
            text: `Sorry I didn't get that, you can say things like Hear the menu, place an order or personalize`,
            title: `Sorry I didn't get that 😔`,
            image: new Image({
                url: 'https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/starbux_sad_but_rad.png',
                alt: 'Starbux_sad_but_rad',
            }),
        })
    );
    conv.ask(new Suggestions(['Hear Menu', 'Place an order', 'Personalize']));
});

app.intent('Personalize', async (conv) => {
    let responseCode = await new Personalization().relay();

    conv.ask(
        'Please tell me your favorite drink and your favorite pick up location'
    );
});

app.intent('Personalize-followup', async (conv, event) => {
    console.log('Personalize-followup');
    let updateStatus = await new Personalization().update(
        event.Coffee,
        event.location['street-address']
    );

    console.log('updateStatus: ' + updateStatus);

    conv.ask(
        `Okay I have updated your favorite drink to ${event.Coffee} and your favorite pick up location to ${event.location['street-address']}`
    );
    conv.ask(
        `Is there anything else you'd like to do? You can say things like order coffee or hear the menu`
    );
    conv.ask(new Suggestions(['Order Coffee', 'Hear Menu']));
});

app.intent('Menu', async (conv, event) => {
    let menu = new Menu();
    conv.ask(
        `The menu consists of ${menu.renderMenu()}, and toppings consists of ${menu.renderToppings()}. Would you like to Order Coffee or Personalize?`
    );
    conv.ask(new Suggestions(['Order Coffee', 'Personalize']));
});

app.intent('Help', (conv, event) => {
    conv.ask(
        `Let me help you. To order a custom drink, you can say 'order cinammon latte', once you've added everything to your cart you can say 'checkout' and the system will place your order for pickup at the location of your choosing.`
    );
});

app.intent('order.additem', async (conv) => {
    console.log('additem');

    // user id is assumed to be always one
    // this isn't correct in production, but within the scope of project, user
    // authentication / authorization will be too much work
    user_id = 1;

    params = conv.body.queryResult.parameters;
    items = params['number-coffee'];

    await new dbExecutor().insertCartItem(user_id, items);

    conv.ask('Coffee added to order.');
});

app.intent('order.showcart', async (conv) => {
    console.log('showcart');

    // id is fixed to 1 for the same reason
    user_id = 1;

    var result = await new dbExecutor().showCartItem(1).then();

    if (result.length == 0) {
        reply = 'Your cart is empty! Maybe consider add some coffees!';
    } else {
        reply = 'Your cart includes ';
        result.forEach(function (value, i) {
            if (i == 0) {
                reply =
                    reply + result[0].number + ' cups of ' + result[0].coffee;
            } else {
                reply =
                    reply +
                    ' and ' +
                    result[i].number +
                    ' cups of ' +
                    result[i].coffee;
            }
        });
    }
    console.log(reply);
    conv.ask(reply);
});

app.intent('order.clearcart', async (conv) => {
    console.log('clear cart');

    // id is fixed to 1 for the same reason
    user_id = 1;

    await new dbExecutor().clearCart(user_id);

    conv.ask('Your cart has been cleared.');
});

exports.handler = app;
