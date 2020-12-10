var express = require('express');
var router = express.Router();
var passport = require('passport');
var ObjectID = require('mongodb').ObjectID
var MongoClient = require('mongodb').MongoClient

var Order = require('../models/order');
var Cart = require('../models/cart');
var Product = require('../models/product');
var User = require('../models/user');


var url = 'mongodb://localhost:27017/shopping';

router.get('/adminHome', function(req, res, next) {
    Product.find(function(err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('adminView/home', { title: 'Shopping Cart', products: productChunks });
    });
});


router.get('/customers', notLoggedIn, function (req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        res.render('adminView/customers', {orders: orders} );
    });
});

router.get('/addProduct', notLoggedIn, function (req, res, next) {
    res.render('adminView/addProduct');
});

router.post('/addProduct', notLoggedIn, function (req, res, next) {
    var product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;
    product.quantity = req.body.quantity;
    product.price = req.body.price;
    product.imagePath = req.body.imagepath;

    res.redirect('/');
    product.save();

});

router.get('/delete/:id', function(req, res, next) {
    Order.remove({}, function(err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(req.body);
        res.redirect('/')
    })});




module.exports = router;

// separate activities able by changing access between logged in and not logged in

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}