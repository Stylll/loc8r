//controller for locations route in the api

var locationModel =require("../models/locations");


sendJsonResponse = function(res,status,message){
    res.status(status);
    res.json(message);
}

module.exports.locationsListByDistance = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.locationsCreate = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.locationsReadOne = function(req,res){
    if(req.params && req.params.locationid){

        locationModel.findById(req.params.locationid).exec(function(err,location){
            console.log("finding...");
            if(err){
                res.status(404);
                res.json(err);
            }
            else if(!location){
                sendJsonResponse(res,404,{'message':'Location id not found'});
            }
            else{
                console.log("found...");
                sendJsonResponse(res,200,location);
            }
            console.log("end...");
        });

    }
    else{
        sendJsonResponse(res,404,{'message':'No locationid in request'});
    }
    
} 

module.exports.locationsUpdateOne = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 

module.exports.locationsDeleteOne = function(req,res){
    sendJsonResponse(res,200,{'status':'Success'});
} 


