var express = require("express");
var router = express.Router();

// Mongoose
var mongoose = require("mongoose");

// Models
var Product = require("../models/product.js");
var User = require("../models/user.js");
var BoughtTogether = require("../models/boughtTogether.js");
var Blog = require("../models/blog.js");


// Landing page route
router.get("/", function (req, res) {
    res.render("landing.ejs");
});


// Featured page route
router.get("/featured", function (req, res) {
    Product.find({}, function (err, foundProducts) {
        if (err) {
            console.log("Unable to find products from db");
            res.redirect("/");
        } else {
            var featuredBlog = [];
            Blog.find({}, function (err2, foundBlogs) {
                if (err2) {
                    console.log("Unable to find Blogs from db");
                    res.redirect("/");
                }
                else {
                    var x = Math.floor(Math.random() * (foundBlogs.length - 3));
                    featuredBlog = foundBlogs.splice(x, 3);
                    // console.log(x);
                    res.render("featured.ejs", { products: foundProducts, blogs: featuredBlog });

                }
            });
            // console.log(featuredBlog+" hjadh");
        }
    });
});


// OTC -> Over The Counter(Non-Prescription drugs)
router.get("/otc", function (req, res) {
    Product.find({}, function (err, foundProducts) {
        if (err) {
            console.log("Unable to find products from db");
            res.redirect("/");
        } else {
            res.render("otc.ejs", { products: foundProducts });
        }
    });

});


// Add new Product
router.get("/otc/new", isAdmin, function (req, res) {
    res.render("addProduct.ejs");
});

router.post("/otc", isAdmin, function (req, res) {
    // console.log(req.body.product);
    Product.create(req.body.product, function (err, newProductAdded) {
        if (err) {
            console.log(err);
        }
        else {
            Product.find({}, function (err, foundProducts) {
                if (err) {
                    res.redirect("notFound.ejs");
                } else {
                    res.render("otc.ejs", { products: foundProducts });
                }
            });
        }
    })
});


router.get("/otc/find/:id", function (req, res) {
    Product.find({ category: req.params.id }, function (err, foundProducts) {
        if (err) {
            res.render("notFound.ejs");
        } else {
            res.render("find.ejs", { products: foundProducts });
        }
    });
});


// Show OTC product
router.get("/otc/:id", function (req, res) {
    var id = req.params.id;

    Product.findById(id, function (err, foundProduct) {
        if (err) {
            console.log("Unable to find product");
            res.redirect("/otc");
        } else {
            fetchBoughtTogetherProducts(res, id, foundProduct, renderShowPage);
        }
    });
});


// Edit Product
router.get("/otc/:id/edit", isAdmin, function (req, res) {
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            res.render("notFound.ejs");
        } else {
            res.render("editProduct.ejs", {
                product: foundProduct
            });
        }
    });
});
router.put("/otc/:id", isAdmin, function (req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product,
        function (err, updatedProduct) {
            if (err) {
                res.render("notFound.ejs");
            }
            else {
                res.redirect('/otc/' + req.params.id);
            }
        })
});


// Delete Product
router.delete("/otc/:id", isAdmin, function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.render("notFound.ejs");
        } else {
            res.redirect("/otc");
        }
    });
});


function fetchBoughtTogetherProducts(res, id, foundProduct, callback) {
    BoughtTogether.find({ items: id }, function (err, data) {
        var IdArr = [];
        data.some(function (obj, index) {
            if (IdArr.length >= 6) {   // fix number of suggested products
                return true; // to break the loop
            }
            var secondItemIndex = 1 - obj.items.indexOf(id);
            IdArr.push(new mongoose.Types.ObjectId(obj.items[secondItemIndex]));
        });
        console.log(IdArr);
        callback(res, foundProduct, IdArr);
    }).sort({ support: -1 });

}

function renderShowPage(res, foundProduct, IdArr) {
    //console.log(IdArr);

    Product.find({ _id: { $in: IdArr } }, function (err, suggestedProducts) {
        if (err) {
            console.log(err);
        } else {
            suggestedProducts.forEach(function (suggestedProduct, index) {
                console.log(suggestedProduct.name);
            });
            res.render("show.ejs", { foundProduct: foundProduct, suggestedProducts: suggestedProducts });
        }

    });

}


// Middleware
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        res.render("notAdmin.ejs");
    }
}

module.exports = router;