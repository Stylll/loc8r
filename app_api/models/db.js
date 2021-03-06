
var mongoose = require('mongoose');
var readline = require('readline');
var Connection = require('./connection');

mongoose.set('debug',true);

var dbURI = Connection.dbURI;

var Conn1 = Connection.Connection1;

//monitor database connection
Conn1.on('connected',function(){
    console.log('Connected To:'+dbURI);
});
Conn1.on('error',function(err){
    console.log('Connection Error:'+err);
});
Conn1.on('disconnected',function(){
    console.log('Connection Disconnected');
});

//check if platform is windows & emit SIGINT
if(process.platform === "win32"){
    var r1 = readline.createInterface({
        input:process.stdin,
        output:process.stdout
        
    });
    console.log("platform is windows");

    //listen to emit standard
    r1.on("SIGINT", function(){
        process.emit('SIGINT');
        console.log("emitting SIGINT");
    });

    //listen to emit when using nodemon
    r1.on("SIGUSR2", function(){
        process.emit('SIGUSR2');
        console.log("Emitting SIGUSR2");
    });

    //listen to emit for heroku
    r1.on("SIGTERM", function(){
        process.emit('SIGTERM');
        console.log("Emitting SIGTERM");
    });
}

//function to gracefully disconnect database connection
var gracefulShutdown = function(msg,callback){
    Conn1.close(function(){
        console.log('Mongoose Disconnected: '+msg);
        callback();
    })
};

//listen for emited SIGUSR2
process.once('SIGUSR2',function(){
    gracefulShutdown('Nodemon Restart',function(){
        process.kill(process.pid,'SIGUSR2');
    });
});

//listen for emited SIGINT
process.on('SIGINT',function(){
    gracefulShutdown('App Termination',function(){
        process.exit(0);
    });
});

//listen for emited SIGTERM
process.on('SIGTERM',function(){
    gracefulShutdown('Heroku App Shutdown',function(){
        process.exit(0);
    });
});



