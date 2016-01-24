var Datastore = require('nedb')
var db = {};

//Users Database
db.users = new Datastore({ filename: './data/users', autoload: true });

module.exports = db;
