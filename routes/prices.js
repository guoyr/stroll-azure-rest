var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('pricedb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'pricedb' database");
        db.collection('prices', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'prices' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving price: ' + id);
    db.collection('prices', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('prices', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
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