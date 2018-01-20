
var mongoose = require('mongoose');
var locationModel = mongoose.Location;



sendJsonResponse = function(res,status,message){
    res.status(status);
    res.json(message);
}

module.exports.reviewsCreate = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.reviewsReadOne = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.reviewsUpdateOne = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.reviewsDeleteOne = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 


