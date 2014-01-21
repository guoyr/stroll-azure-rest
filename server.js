var express = require('express'),
    prices = require('./routes/prices'),
    mongoose = require('mongoose');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/prices', prices.findAll);
app.get('/prices/:npi', prices.findByNpi);
app.post('/prices', prices.addPrice);
app.put('/prices/:id', prices.updatePrice);
app.delete('/prices/:id', prices.deletePrice);
 
app.listen(80);
console.log('Listening on port 80...');