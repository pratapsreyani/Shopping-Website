var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;


var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

var url = 'mongodb://localhost:27017/shopping';


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({}, function(err, docs){
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
  });
});

// trying to create the same layout as the home page after search is completed

router.get('/search', isLoggedIn, function(req, res, next) {
    res.render('user/search');
});

router.get('/userSearch', isLoggedIn, function(req, res, next) {
    var name = req.body.name;

    Product.find({}, function(err, name){
        console.log(name);
        res.render('user/userSearch', { title: 'Search', products: name });
    });
});


router.get('/addToCart/:id', function(req, res, next) {
   var productId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {});

   Product.findById(productId, function(err, product) {
       if(err) {
           return res.redirect('/');
       }
       // decrease quantity of item
        Product.update({_id: productId}, {$inc: {quantity: -1}});
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
   });
});

// Another direction to updating quantity that is not functioning

router.post('/addToCart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, (err, Product) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!Product)
        return res.render('404');

    Product.quantity  = quantity--;

    Product.save((err) => {
        if (err)
        console.log("Error updating : %s ",err );
    res.redirect('/');
});
});
});

router.get('/delete/:id', function(req, res, next) {
    Product.remove({_id:  req.params.id}, function(err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(req.body);
    res.redirect('/')
})});

router.get('/editProduct/:id', function (req, res, next) {
    let id = req.params.id;

    Product.findById(id, (err, Product) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!Product)
        return res.render('404');

    res.render('adminView/editProduct',
        {title:"Edit Product",
            data: {id: Product._id,
                name: Product.name,
                description:  Product.description,
                quantity:  Product.quantity,
                price:  Product.price,
                imagepath:  Product.imagePath}
        });

});
});

router.post('/editProduct/:id', function(req, res, next) {

    let id = req.params.id;

    Product.findById(id, (err, Product) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!Product)
        return res.render('404');

    Product.name = req.body.name;
    Product.description  = req.body.description;
    Product.quantity  = req.body.quantity;
    Product.price  = req.body.price;
    Product.imagePath  = req.body.imagepath;

    Product.save((err) => {
        if (err)
        console.log("Error updating : %s ",err );
    res.redirect('/');
});
});
});

router.get('/editOrder/:id', function (req, res, next) {
    let user = req.params.user;

    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }

        res.render('user/profile', { orders: orders });

    res.render('adminView/editOrder',
        {title:"Edit Order",
            data: {user: Order.user,
                cart: Order.cart,
                address:  Order.address,
                name:  Order.name,
                payment:  Order.payment
            }
        });

});
});

router.post('/editOrder/:id', function(req, res, next) {

    let name = req.params.name;

    Order.findById(name, (err, Order) => {
        if(err)
        console.log("Error Selecting : %s ", err);
    if (!Order)
        return res.render('404');

    Order.name = req.body.name;
    Order.description  = req.body.description;
    Order.quantity  = req.body.quantity;
    Order.price  = req.body.price;
    Order.imagePath  = req.body.imagepath;

    Order.save((err) => {
        if (err)
        console.log("Error updating : %s ",err );
    res.redirect('/');
});
});
});

//IN CART

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingCart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shoppingCart');
});

router.get('/shoppingCart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shoppingCart', {products: null});
    }
     var cart = new Cart(req.session.cart);
     res.render('shop/shoppingCart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_sS2OZbcIrOQpfVuxxmMFskKN"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: "tok_mastercard", // obtained with Stripe.js // MUST USE STRIPE TEST MASTERCARD -> 5555555555554444
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        // creates new order from schema for user
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});




















// other  modules

const employeeModule = require("./productModule.js");

const displayEmployees 	= employeeModule.displayEmployees;
const addEmployee 		= employeeModule.addEmployee;
const saveEmployee 		= employeeModule.saveEmployee;
const editEmployee 		= employeeModule.editEmployee;
const saveAfterEdit 	= employeeModule.saveAfterEdit;
const deleteEmployee 	= employeeModule.deleteEmployee;

// router specs
router.get('/', function(req, res, next) {
    res.redirect('/employees');
});

router.get('/employees', 			displayEmployees);

router.get('/employees/add', 		addEmployee);
router.post('/employees/add', 		saveEmployee);

router.get('/employees/edit/:id', 	editEmployee);
router.post('/employees/edit/:id', 	saveAfterEdit);

router.get('/employees/delete/:id', deleteEmployee);


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}