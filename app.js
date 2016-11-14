var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));


//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/20e246c6-85f7-4a9b-a70e-86c25ecf2179?subscription-key=b1e5db1364244e289b73c05c659a3b37';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.onDefault(builder.DialogAction.send('Well i can not do that. I can only call people or find info for you.'));

//Old intents dialogs
//var intents = new builder.IntentDialog();
//bot.dialog('/', intents);

//intents.matches(/^change name/i, [
//    function (session) {
//        session.beginDialog('/profile');
//    },
//    function (session, results) {
//        session.send('Ok... Changed your name to %s', session.userData.name);
//    }
//]);

//intents.onDefault([
//    function (session, args, next) {
//        if (!session.userData.name) {
//            session.beginDialog('/profile');
//        } else {
//            next();
//        }
//    },
//    function (session, results) {
//        session.send('Hello %s!', session.userData.name);
//    }
//]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);


bot.dialog('/find', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What do you want to find?');
    }
]);