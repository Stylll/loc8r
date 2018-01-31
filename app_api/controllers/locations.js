//controller for locations route in the api

var locationModel =require("../models/locations");

//function to compute standard values for distance calculations
var theEarth = (function(){
    const earthRadius = 6371; //km, miles is 3959

    var getDistanceFromRadius = function(rad){
        return parseFloat(rad * earthRadius);
    };
    var getRadiusFromDistance = function(dist){
        return parseFloat(dist / earthRadius);
    };

    return {
        getDistanceFromRadius : getDistanceFromRadius,
        getRadiusFromDistance : getRadiusFromDistance
    }
})();

//function to process locations gotten from db to proper new array
var locationProcessor = function(locations){
    var newLocations = [];
    locations.forEach(function(loc){
        newLocations.push({
            name : loc.obj.name,
            address : loc.obj.address,
            rating : loc.obj.rating,
            facilities : loc.obj.facilities,
            distance : theEarth.getDistanceFromRadius(loc.dis),
            _id : loc.obj._id
        });
    });

    return newLocations;
}

//request response handler
sendJsonResponse = function(res,status,message){
    res.status(status);
    res.json(message);
}

//function to pull location form data into schema object
var createLocationObject = function(req){
return {
    name:req.body.name,
    address:req.body.address,
    facilities:req.body.facilities.split(","),
    coords:[parseFloat(req.body.lng),parseFloat(req.body.lat)],
    openingHours:[{
        days:req.body.days1,
        opening:req.body.opening1,
        closing:req.body.closing1,
        closed:req.body.closed1
    },
    {
        days:req.body.days2,
        opening:req.body.opening2,
        closing:req.body.closing2,
        closed:req.body.closed2
    },
    {
        days:req.body.days3,
        opening:req.body.opening3,
        closing:req.body.closing3,
        closed:req.body.closed3
    }]
}
}

//function to update location with new req.body values
var updateLocation = (req,location) => {
    location.name = req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(",");
    location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)],
    location.openingHours[0].days = req.body.days1;
    location.openingHours[0].opening = req.body.opening1;
    location.openingHours[0].closing = req.body.closing1;
    location.openingHours[0].closed = req.body.closed1;
    location.openingHours[1].days = req.body.days2;
    location.openingHours[1].opening = req.body.opening2;
    location.openingHours[1].closing = req.body.closing2;
    location.openingHours[1].closed = req.body.closed2;
    location.openingHours[2].days = req.body.days3;
    location.openingHours[2].opening = req.body.opening3;
    location.openingHours[2].closing = req.body.closing3;
    location.openingHours[2].closed = req.body.closed3;
}

module.exports.locationsListByDistance = function(req,res){
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var num = parseInt(req.query.num || 10);

    if(!lng && lng !== 0 || !lat && lat !== 0){
        sendJsonResponse(res,404,{'message':'lng and lat are required'});
            return;
    }

    var point = {
        type : "Point",
        coordinates:[lng,lat]
    };

    console.log(point);

    var options = {
        spherical : true,
        num : num,
        maxDistance : theEarth.getRadiusFromDistance(200)
    };

    //now use the geoNear method
    locationModel.geoNear([lng,lat],options,function(err,location,status){
        if(err){
            sendJsonResponse(res,404,err);
            return;
        }
        else if(!location){
            sendJsonResponse(res,404,{'message':'No location was found'});
            return;
        }
        else{
            sendJsonResponse(res,200,locationProcessor(location));
            return;
        }
    });
} 

module.exports.locationsCreate = function(req,res){
    locationModel.create(createLocationObject(req),function(err,location){
        if(err){
            sendJsonResponse(res,404,err);
            return;
        }
        else if(!location){
            sendJsonResponse(res,404,"could not create location");
            return;
        }
        else{
            sendJsonResponse(res,200,location);
            return;
        }
    });
} 

/**
 * method to get only one location details from the db 
 */
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
    if(req.params && req.params.locationid){
        locationModel.findById(req.params.locationid)
        .select("-rating -reviews")
        .exec((err,location) => {
            if(err){
                sendJsonResponse(res,404,err);
            }
            else if(!location){
                sendJsonResponse(res,404,{'message':'Location not found'});
            }
            else{
               updateLocation(req,location);

               location.save((err,location) => {
                    if(err){
                        sendJsonResponse(res,404,err);
                    }
                    else{
                        //return saved location object
                        sendJsonResponse(res,201,location);
                    }
               });
            }
        })
    }
    else{
        sendJsonResponse(res,404,{'message':'location id is required'});
    }
} 

module.exports.locationsDeleteOne = function(req,res){
    /*location controller for handling delete
        */
    if(req.params && req.params.locationid){
        locationModel.findByIdAndRemove(req.params.locationid)
        .exec((err,location) => {
            if(err){
                sendJsonResponse(res,404,err);
            }
            else{
                sendJsonResponse(res,204,{'message':'location deleted'});
            }
        });
    }
    else{
        sendJsonResponse(res,404,{'message':'location id is required'});
    }
} 



