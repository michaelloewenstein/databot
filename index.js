const Botkit = require('botkit'),
    db = require('./lib/db'),
    dbConfig = require('./config/db.json'),
    _ = require('lodash');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({
            mongoUri: process.env.MONGOLAB_URI
        }),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scopes: ['commands'],
});

controller.setupWebserver(process.env.PORT, function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

controller.on('slash_command', function(slashCommand, message) {

    switch (message.command) {
        case "/query":
            if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "I will give you data! " +
                    "Try typing `/query list` for db list. " +
                    "Try /query [database name] [query] to start pulling your data");
                return;
            }
            if (message.text === "list") {
                var databases = _.map(dbConfig.databases, d => d.name).toString();
                slashCommand.replyPublic(message, databases);
                return;
            }
            var words = message.text.split(" ", 2);
            var dbName = words[0];
            var query = message.text.replace(dbName, '');

            var dbConfigNames = _.map(dbConfig.databases, 'name')
            if (_.includes(dbConfigNames, dbName)) {
                var dbObj = _.first(_.filter(dbConfig.databases, {
                    'name': dbName
                }));
                slashCommand.replyPublic(message, ':gear:' + 'Executing..', function() {
                });

                db.execute(dbObj, query).then((result) => {
                    if(_.has(result, 'rows')){
                        slashCommand.replyPublicDelayed(message, JSON.stringify(result.rows), function() {});
                    }
                    else{
                        slashCommand.replyPublicDelayed(message, JSON.stringify(result), function() {});
                    }
                }).catch(e => {
                    slashCommand.replyPublicDelayed(message, e.toString(), function() {});
                })
            }
            else{
                return slashCommand.replyPublicDelayed(message, ':dash:' + "I'm afraid I don't know how to do that yet.");  
            }
            break;
        default:
            slashCommand.replyPublicDelayed(message, "I'm afraid I don't know how to " + message.command + " yet.");

    }
});
