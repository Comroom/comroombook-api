var Datastore = require('nedb')
var db = {};

//Users Database
db.users = new Datastore({ filename: './data/users', autoload: true });

//Chat Database
db.chat = new Datastore({ filename: './data/chat', autoload: true});

//Message Database
db.message = new Datastore({ filename: './data/message', autoload: true});

//Time Database
db.time = new Datastore({ filename: './data/message', autoload: true});

module.exports = db;
