/**
 * Controller handler for locations
 * Require request for requesting data from the api
 * Parameters: req request param 
 * Parameters: res result or return param
 */
var request = require('request');
var apiConfig = require('../constants/api');


var renderHomepage = (req,res,body) => {
    /**
     * renders the homepage
     * expects req, res and body parameters
     */
    let message;
    if(!(body instanceof Array)){
        message = "API Lookup error";
        body = [];
    }
    else if(!body.length){
        message = "No places found nearby";
    }
    res.render('locations-list',{
        title:'Find a place to work with wifi',
        pageHeader:{
            title:"Loc8r",
            strapLine:"Find places to work with wifi near you!"
        },
        locations: body,
        message: message,
        sidebar:"Looking for wifi and a seat ? Loc8r helps you find where to work when out and about perhaps with coffee, cake or pint?. let Loc8r help you find the place you are looking for"
    });
}


var renderLocationInfo = (req,res,body) => {
    /**
     * render location info
     * expects req, res and body(location details)
     * renders the location info directly from here
     */
    res.render('location-info', {
        title: body.name,
        locationName: body.name,
        locationMap: "http://maps.googleapis.com/maps/api/staticmap?center="+body.coords.lat+","+body.coords.lng+"&zoom=17&size=400x350&sensor=false&markers="+body.coords.lat+","+body.coords.lng+"&scale=2",
        rating: body.rating,
        address: body.address,
        opening_hours: body.openingHours,
        facilities: body.facilities,
        reviews: body.reviews,
        sidebar: "<h1>"+body.name+" is on loc8r is simple because it has accessible wifi and enough free sitting space</h1><p>if you've been here and you like it. Please leave a review.</p>"
    });
}

var formatDistance = (distance) => {
    /**
     * accepts distance
     * adds unit
     * returns distance to one decimal place
     */
    var numOfDistance, unit;
    if(!distance || typeof(distance) != 'number'){
        return '0';
    }
    if(distance > 1){
        numOfDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
    }
    else{
        numOfDistance = parseInt(distance * 1000,10);
        unit = 'm';
    }
    return numOfDistance + unit;
}

//GET 'Home' page
module.exports.homelist = function(req,res){
    var requestOptions, path
    path = "locations";
    requestOptions = {
        url : apiConfig.apiUrl + path,
        method : "GET",
        json : {},
        qs : {
            lat:51.37809,
            lng:-0.7992599,
            num:50
        }
    };
    request(requestOptions,(err,response,body) => {
        console.log(err);
        console.log(response);
        console.log(body);
        var data = body;
        if(response.statusCode === 200 && data.length){
            for(let i = 0; i < data.length; i++){
                data[i].distance = formatDistance(data[i].distance);
            }
        }
        
        renderHomepage(req,res,data);
    });
    
};

//GET 'Location Info' page
module.exports.locationInfo = function(req,res){
    /**
     * get particular location using location id
     * convert the coords from array to a dict
     * call the renderlocationinfo method passing the req, res and data
     */
    var requestOptions,path;
    path = "locations/"+req.params.locationid;
    requestOptions = {
        url : apiConfig.apiUrl+path,
        method: "GET",
        json : {},
        qs : {}
    };
    request(requestOptions,(err,response,body) => {

        if(response.statusCode === 200){
            //if status code is 200 OK, then return result
            let data = body;
            data.coords = {
                lng : body.coords[0],
                lat : body.coords[1]
            }
            renderLocationInfo(req,res,data);
        }
        else{
            //pass req,res and statuscode to error handler
            showError(req,res,response.statusCode);
        }
        
    });
    
};

//GET 'Add Review' page
module.exports.addReview = function(req,res){
    res.render('location-review-form',{title:'Review'});
};

var showError = (req,res,statusCode) => {
    /**
     * handle api call errors using the statuscode passed
     * display the error using the res param
     */
    let title, message;
    
    //return custom message if statuscode is 404
    if(statusCode === 404){
        title = "404 Page Not Found";
        message = "Sorry, you seem to be lost. The treasure you seek cannot be found";
    }
    else{
        //use generic message
        title = "Sorry, you seem to have upset the node gods";
        message = "The unexpected as occured";
    }
    res.status(statusCode);
    res.render('generic-text',{title:title,content:message});
}


/*
db.locations.save(
{
    name:"Worldmart",
    address:"125 High street, Reading, RPG 16s",
    rating:3,
    facilities:['Hot drinks','Food','Parking Space'],
    coords:[-0.9693284,51.453441],
    openingHours:[
            {
                days:"Monday-Friday",
                opening:"6:00am",
                closing:"9:00pm",
                closed:false
            },
            {
                days:"Saturday",
                opening:"8:00am",
                closing:"5:00pm",
                closed:false
            },
            {
                days:"Sunday",
                closed:true
            }],
    reviews:[]
});


db.locations.update({name:"Worldmart"},{
    $push:{
        reviews:{
            id: ObjectId(),
            rating:"5",
            customer:"Andrew Higgins",
            date:new Date("July 10, 2018"),
            comment:"It was a very bad experience for me."
        }

    }
})

db.locations.update({name:"Worldmart"},{
    $push:{
        reviews:{
            id: ObjectId(),
            rating:"5",
            customer:"Andrew Frack",
            date:new Date("July 10, 2018"),
            comment:"It was a fair experience."
        }

    }
})

*/






