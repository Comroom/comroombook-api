var Datastore = require('nedb')
var db = {};

//Users Database
db.users = new Datastore({ filename: './data/users', autoload: true });

//ChatMessage Database
db.chatmessage = new Datastore({ filename: './data/chatmessage', autoload: true});

//Chat Group Database
db.chatlist = new Datastore({ filename: './data/chatlist', autoload: true });

//Message Database
db.message = new Datastore({ filename: './data/message', autoload: true});

//Time Database
db.time = new Datastore({ filename: './data/time', autoload: true});

//for login & logout
// db.loginOut = new Datastore({ filename: './data/loginOut', autoload: true});

module.exports = db;
