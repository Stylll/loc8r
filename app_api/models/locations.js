//schema definition for locations
var mongoose = require('mongoose');
var connection = require('./connection');

var Conn1 = connection.Connection1;

//opening hours schema
var openingHourSchema = new mongoose.Schema({
    days:{type:String,required:true},
    opening:String,
    closing:String,
    closed:{type:Boolean,required:true}
})

//reviews schema
var reviewSchema = new mongoose.Schema({
    //_id : String,
    rating:{type:Number,required:true,min:0,max:5},
    customer:{type:String, required:true},
    date:{type:Date, "default":Date.now},
    comment:{type:String,required:true}
})

//location schema
var locationSchema = new mongoose.Schema({
    //_id:{type:String},
    name:{type:String,required:true},
    address:String,
    rating:{type:Number,"default":0,min:0,max:5},
    facilities:[String],
    coords:{type:[Number],index:"2dsphere"},
    openingHours:[openingHourSchema],
    reviews:[reviewSchema]
},{
    usePushEach:true
});

//create a model using the schema built
var Location = Conn1.model('Location',locationSchema,'locations');


module.exports = Location;



