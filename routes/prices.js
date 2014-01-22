var mongo = require('mongodb');
var https = require('https');
var mongoose = require('mongoose');
var db = mongoose.connection;
// var JSON = require('JSON');
mongoose.connect('mongodb://localhost/strollnpi:27017');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("opened db");
})


 
exports.home = function(req, res) {
    /**
     * HOW TO Make an HTTP Call - GET
     */
    // options for GET
    console.log("params %j",req.query);
    var fname = req.query.firstname.toString().toUpperCase();
    var lname = req.query.lastname.toString().toUpperCase();
    var dob = req.query.dob.toString().toUpperCase();
    var payerId = req.query.payer_id.toString().toUpperCase();
    console.log(fname+dob+payerId+lname);
    var path = '/v1.1/demographic/all.json?api_key=yI9B0E8V0W5MLql0Xrut6AIcG1pWNLv_uh32&payer_id='+payerId+'&provider_last_name=SMITSON&provider_first_name=HAROLD&provider_npi=1306849450&member_first_name='+fname+'&member_last_name='+lname+'&member_dob='+dob;
    console.log("path" + path);
    var optionsget = {
        host : 'gds.eligibleapi.com', // here only the domain name
        // (no http/https !)
        port : 443,
        path : path, // the rest of the url with parameters if needed
        method : 'GET' // do GET
    };
     
    console.info('Options prepared:');
    console.info(optionsget);
    console.info('Do the GET call');
     
    // do the GET request
    var reqGet = https.request(optionsget, function(res1) {
        console.log("statusCode: ", res1.statusCode);
        // uncomment it for header details
    //  console.log("headers: ", res.headers);
     
        
        res1.on('data', function(d) {
            console.info('GET result:\n');
            var dataDic = JSON.parse(d);
            console.log(dataDic);
            if ("error" in dataDic) {
                res.send("login failed");
            } else {
               res.send("login successful"); 
            }
            console.info('\n\nCall completed');
        });
     
    });
     
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
};

 
exports.findAll = function(req, res) {
    console.log("in find all");
    var npiCollection = db.collection('npi');
    npiCollection.find({}, function(err, items) {
        res.send("all elements");
    });
};
 
exports.addPrice = function(req, res) {
    var price = req.body;
    console.log('Adding price: ' + JSON.stringify(price));
    db.collection('prices', function(err, collection) {
        collection.insert(price, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updatePrice = function(req, res) {
    var id = req.params.id;
    var price = req.body;
    console.log('Updating price: ' + id);
    console.log(JSON.stringify(price));
    db.collection('prices', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, price, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating price: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(price);
            }
        });
    });
}
 

 
exports.deletePrice = function(req, res) {
    var id = req.params.id;
    console.log('Deleting price: ' + id);
    db.collection('prices', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var prices = [
    {
        name: "Athena Health",
        country: "USA",
        State: "CA",
        City: "SF",
        Zip: "91002",
        prices: [
            {name: "MRI", price: "$300"},
            {name: "X-Ray", price: "$100"}
        ]

    }];
 
    db.collection('prices', function(err, collection) {
        collection.insert(prices, {safe:true}, function(err, result) {});
    });
 
};