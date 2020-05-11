var express = require("express");
var router = express.Router();

// Body-parser
var bodyParser = require("body-parser");

// Models
var Product = require("../models/product.js");
var User = require("../models/user.js");
var Transaction = require("../models/transaction.js");


// Account settings Route
router.get("/account", isLoggedIn, function (req, res) {
    User.findById(req.user.id, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("account.ejs", { foundUser: foundUser });
        }
    });

});

router.put("/account", isLoggedIn, function (req, res) {
    var mobileNo = req.body.mobileNo;
    var addressLine = req.body.userAddress;
    console.log(addressLine);
    User.findByIdAndUpdate(req.user.id, { mobileNo: mobileNo, address: addressLine }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/account");
        }
    })
});


// Previous Orders Route
router.get("/orders", isLoggedIn, function (req, res) {
    var userId = req.user.id;
    var arr = [];
    var cartAmount = 0;
    Transaction.find({ userId: userId }, function (err, foundTransactions) {
        if (err) {
            console.log(err);
        } else {
            foundTransactions.forEach(function (transaction, index) {
                cartAmount += transaction.cartAmount;
                var arr2 = transaction.pIds;
                arr = Array.from(new Set(arr.concat(arr2)));
            });
            //console.log(arr);

            Product.find({ _id: arr }, function (err, foundProducts) {
                res.render("orders.ejs", { foundProducts: foundProducts, cartAmount: cartAmount });
            });
        }
    });
});


// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}


module.exports = router;