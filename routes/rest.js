/**
 * Created by Magnirokk on 3/1/2018.
 */

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var Product = require('../models/product');

// list of products


app.get('/product', function(req, res) {
    req.Product.find({}, toArray(function(e, results){
        if (e) {
            res.send(results)
        } else {
            res.render('404');
        }
    }));
});

// products matching name

app.get('/product/:name', function(req, res) {
    var name = req.body.name;
    req.collection.findOne({name: name}, function(e, result){
        if (e) {
            res.send(results)
        } else {
            res.render('404');
        }
    });
});

// products with specified price range

app.get('/product/:price', function(req, res) {
    var priceOne = req.body.priceOne;
    var priceTwo = req.body.priceTwo;
    req.collection.find({$range : [ priceOne, priceTwo ]}, function(e, result){
        if (e) {
            res.send(results)
        } else {
            res.render('404');
        }
    });
});