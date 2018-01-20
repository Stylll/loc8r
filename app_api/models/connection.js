var mongoose = require('mongoose');
//set promise for mongoose
//mongoose.Promise = global.Promise;


//set dburi depending on whether app is in production or development server
var dbURI = "mongodb://127.0.0.1:27017/Loc8r"

if(process.env.NODE_ENV === "production"){
    dbURI = process.env.MONGOLAB_URI; //MONGOLAB_URI is a node environmental variable that has been set
}

module.exports.Connection1 = mongoose.createConnection(dbURI);

module.exports.dbURI = dbURI;

