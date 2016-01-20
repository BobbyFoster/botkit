if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');
var controller = Botkit.slackbot({
    debug: true,
});
var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['.*'], 'direct_message,direct_mention,mention', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        var http = require('http');
        var message_cleaned = message.text.replace(/[^a-z0-9]+/gi, " ");
        console.log(JSON.stringify(message));
        var options = {
            host: 'localhost',
            port: '8080',
            path: '/?q=' + encodeURIComponent(message_cleaned)
        };
        callback = function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                bot.reply(message, str);
            });
        }
        http.request(options, callback).end();
    });
});
