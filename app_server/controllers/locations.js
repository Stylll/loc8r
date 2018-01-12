
//GET 'Home' page
module.exports.homelist = function(req,res){
    res.render('locations-list',{
        title:'Find a place to work with wifi',
        pageHeader:{
            title:"Loc8r",
            strapLine:"Find places to work with wifi near you!"
        },
        locations: [
            {
                name:'StarCups',
                address:'125 High street, Reading, RPG 16s',
                rating:3,
                facilities:['Hot drinks','Food','Premium Wifi'],
                distance:'300m'
            },
            {
                name:'Cafe Hero',
                address:'125 High street, Reading, RPG 16s',
                rating:5,
                facilities:['Hot drinks','Food','Premium Wifi','Fancy Seats'],
                distance:'130m'
            },
            {
                name:'Burger King',
                address:'125 High street, Reading, RPG 16s',
                rating:4,
                facilities:['Hot drinks','Food','Premium Wifi','Cinema','Garden'],
                distance:'600m'
            },
            {
                name:'VMart',
                address:'125 High street, Reading, RPG 16s',
                rating:1,
                facilities:['Food'],
                distance:'100m'
            }
            ],
        sidebar:"Looking for wifi and a seat ? Loc8r helps you find where to work when out and about perhaps with coffee, cake or pint?. let Loc8r help you find the place you are looking for"
    });
};

//GET 'Location Info' page
module.exports.locationInfo = function(req,res){
    res.render('location-info',{
        title:'Location Info',
        locationName:"Starcups",
        locationMap:"http://maps.googleapis.com/maps/api/staticmap?center=51.455041,-0.9690884&zoom=17&size=400x350&sensor=false&markers=51.455041,-0.9690884&scale=2",
        rating:3,
        address:'125 High street, Reading, RPG 16s',
        opening_hours:[
            "Monday - Friday : 7:00pm - 7:00pm",
            "Saturday : 8:00am - 5:00pm",
            "Sunday : Closed"
        ],
        facilities:['Hot drinks','Food','Premium Wifi'],
        reviews:[
            {
                rating:"4",
                customer:"Stephen Stone",
                date:"Jan 13, 2018",
                comment:"What a great place, I cant say enough about it."
            },
            {
                rating:"5",
                customer:"James Jackson",
                date:"Jan 10, 2018",
                comment:"It was ok. Coffee was bad but wifi was wonderful."
            },
            {
                rating:"1",
                customer:"Andrew Higgins",
                date:"Jan 9, 2018",
                comment:"It was a very bad experience for me."
            }
            ],
        sidebar:"<h1>Starcups is on loc8r is simple because it has accessible wifi and enough free sitting space</h1><p>if you've been here and you like it. Please leave a review.</p>"
    });
};

//GET 'Add Review' page
module.exports.addReview = function(req,res){
    res.render('location-review-form',{title:'Review'});
};