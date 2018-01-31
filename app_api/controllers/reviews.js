
var locationModel =require("../models/locations");


//function to add review to a location
var addReview = (res,req,location) => {
    //push new review into the location review object
    location.reviews.push(reviewProcessor(req));

    //save the location object
    location.save((err,location) => {
        if(err){
            console.log("getting error:", err);
            sendJsonResponse(res,400,err);
            return;
        }
        else if(!location){
            sendJsonResponse(res,404,{"message":"Location not found while saving review"});
            return;
        }
        else{
            var thisReview;
            //update average rating
            updateAverageRating(location._id);

            //get the last or latest review and return for display
            thisReview = location.reviews[location.reviews.length - 1];

            sendJsonResponse(res,201,thisReview);
            return;
        }
    });
}

//function to update a review from req.body
var updateReview = (req,review) => {
    review.customer = req.body.customer;
    review.rating = req.body.rating;
    review.comment = req.body.comment;
}

//generate standard review object
var reviewProcessor = function(req){
    return {
        rating:req.body.rating,
        customer:req.body.customer,
        comment:req.body.comment
    }
}

//function to update average rating for a location
var updateAverageRating = (locationid) => {
    locationModel.findById(locationid)
    .select("rating reviews")
    .exec((err,location) => {
        if(!err){
            doAverageRating(location);
        }
    })
}

//function to do average rating
var doAverageRating = (location) => {
    var reviewCount, ratingAverage, ratingTotal = 0;
    if(location.reviews && location.reviews.length > 0){
        reviewCount = location.reviews.length;
        for(let i = 0; i < reviewCount; i++){
            ratingTotal += location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount,10);
        location.rating = ratingAverage;
        location.save(function(err,location){
            if(err){
                console.log(err);
            }
            else{
                console.log("Average rating updated to ", ratingAverage);
            }
        })
    }
    
}


sendJsonResponse = function(res,status,message){
    res.status(status);
    res.json(message);
}

module.exports.reviewsCreate = function(req,res){
    if(req.params && req.params.locationid){
        locationModel.findById(req.params.locationid)
        .select('reviews')
        .exec(function(err,location){
            if(err){
                sendJsonResponse(res,404,err);
                return;
            }
            else if (!location){
                sendJsonResponse(res,404,{'message':'Location not found'});
                return;
            }
            else{
                console.log(location);
                addReview(res,req,location);
            }
        });
    }
    else{
        sendJsonResponse(res,404,{'message':'Location id is required'});
    }
} 

module.exports.reviewsReadOne = function(req,res){
    if(req.params && req.params.locationid && req.params.reviewid){
        locationModel.findById(req.params.locationid)
        .select('name reviews')
        .exec(function(err,location){
            var review, response;
            if(!location){
               sendJsonResponse(res,404,{"message":"location not found"}); 
               return;
            }
            if(err){
                sendJsonResponse(res,404,err);
            }
            if(location.reviews && location.reviews.length > 0){
                review = location.reviews.id(req.params.reviewid);
                //check if the review id exists
                if(!review){
                    sendJsonResponse(res,404,{"message":"review not found"});
                    return;
                }
                else{
                    response = {
                        location : {
                            name : location.name,
                            id : req.params.locationid
                        },
                        review : review
                    }
                    sendJsonResponse(res,200,response);
                }
            }
            else{
                sendJsonResponse(res,404,{"message":"no reviews found"});
            }
        });
    }
    else{
        sendJsonResponse(res,404,{"message":"location id and review are required"});
    }
} 

module.exports.reviewsUpdateOne = function(req,res){
    if(req.params && req.params.locationid && req.params.reviewid){
        locationModel.findById(req.params.locationid)
        .select("reviews")
        .exec((err,location) => {
            if(err){
                sendJsonResponse(res,404,err);
            }
            else if(!location){
                sendJsonResponse(res,404,{"message":"location not found"});
            }
            else if(!location.reviews && location.reviews.length <= 0) {
                sendJsonResponse(res,404,{"message":"No reviews found"});
            }
            else{
                let review = location.reviews.id(req.params.reviewid);
                if(review){
                    //update the review with the new data in req.body
                    updateReview(req,review);
                    location.save((err,location) => {
                        if(err){
                            sendJsonResponse(res,404,err);
                        }
                        else{
                            updateAverageRating(location._id);
                            sendJsonResponse(res,201,review);
                        }
                    });
                }
                else{
                    sendJsonResponse(res,404,{"message":"review not found"});
                }
            }
        })
    }
    else{
        sendJsonResponse(res,404,{"message":"location id and review are required"});
    }
} 

module.exports.reviewsDeleteOne = function(req,res){
    /*
    Review controller to handle deletion
    */
    if(req.params && req.params.locationid && req.params.reviewid){
        locationModel.findById(req.params.locationid)
        .exec((err,location) => {
            if(err){
                sendJsonResponse(res,404,err);
                return;
            }
            else if(!location){
                sendJsonResponse(res,404,{'message':'location not found'});
                return;
            }
            else{
                if(location.reviews && location.reviews.length > 0){
                    /**
                     * Check if the review exists and delete it
                     * Save the location
                     * Update the averagerating
                     */
                    if(location.reviews.id(req.params.reviewid)){
                        location.reviews.id(req.params.reviewid).remove();

                        location.save((err,location) => {
                            if(err){
                                sendJsonResponse(res,404,err);
                            }
                            else{
                                updateAverageRating(location._id);
                                sendJsonResponse(res,204,null);
                            }
                        });
                    }
                    else{
                        sendJsonResponse(res,404,{'message':'review not found'});
                        return;
                    }
                    
                }
                else{
                    sendJsonResponse(res,404,{'message':'no reviews found'});
                    return;
                }
            }
        });
    }
    else{
        sendJsonResponse(res,404,{'message':'location id and review is required'});
    }
} 


