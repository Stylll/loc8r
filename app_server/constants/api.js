/**
 * api module to hold api configs like:
 * addresses
 * links
 */

var apiUrl = "http://127.0.0.1:3000/api/";


if(process.env.NODE_ENV === "production"){
    apiUrl = "https://captainloc8r.herokuapp.com/api/"; 
}

module.exports.apiUrl = apiUrl;

