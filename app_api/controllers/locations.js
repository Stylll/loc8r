//controller for locations route in the api

var mongoose = require('mongoose');
//set promise for mongoose
mongoose.Promise = require('bluebird');

var locationModel = mongoose.model("Location");


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
        console.log("opening controller...");
        console.log(req.params.locationid);
        console.log(locationModel);

        let query = locationModel.findOne({ "name":"Starcups" });
        console.log(query);
        query.exec((err,res) => {
            console.log(res);
        });
        console.log("called query");
            locationModel.findOne({ "name":"Starcups" }).exec((err,location) => {
            console.log("finding...");
            console.log(err);
            console.log(location);
            if(err){
                res.status(404);
                res.json(err);
            }
            else if(!location){
                sendJsonResponse(res,404,{'message':'Location id not found'});
            }
            else{
                console.log("found...");
                res.status(200);
                res.json(location);
            }
            console.log("end...");
        });

        // locationModel.findById(req.params.locationid).exec(function(err,location){
        //     console.log("finding...");
        //     console.log(err);
        //     console.log(location);
        //     if(err){
        //         res.status(404);
        //         res.json(err);
        //     }
        //     else if(!location){
        //         sendJsonResponse(res,404,{'message':'Location id not found'});
        //     }
        //     else{
        //         console.log("found...");
        //         res.status(200);
        //         res.json(location);
        //     }
        //     console.log("end...");
        // });

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


