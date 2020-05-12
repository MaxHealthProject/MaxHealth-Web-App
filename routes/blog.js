var express = require("express");
var router = express.Router({
    mergeParams: true
});
var methodOverride = require("method-override");
router.use(methodOverride("_method"));

// BLOG Models
var Blog = require("../models/blog");

// SHOW ALL BLOGS
router.get("/blog", function (req, res) {
    Blog.find({}, function (err, foundBlogs) {
        if (err) {
            res.redirect("notFound.ejs");
        } else {
            res.render("blog.ejs", { blogs: foundBlogs });
        }
    });
});


// NEW BLOG
router.get("/blog/new", isAdmin, function (req, res) {
    res.render("newBlog.ejs");
});

router.post("/blog", isAdmin, function (req, res) {
    Blog.create(req.body.blog, function (err, newBlogCreated) {
        if (err) {
            console.log(err);
        }
        else {
            Blog.find({}, function (err, foundBlogs) {
                if (err) {
                    res.redirect("notFound.ejs");
                } else {
                    res.render("blog.ejs", { blogs: foundBlogs });
                }
            });
        }
    })
});


// SHOW POST
router.get("/blog/:blog_id", function (req, res) {
    Blog.findById(req.params.blog_id, function (err, foundBlog) {
        if (err) {
            res.render("notFound.ejs");
        }
        else {
            res.render("post.ejs", { blog: foundBlog });
        }
    }
    )
});


// DELETE BLOG 
router.delete("/blog/:blog_id", isAdmin, function (req, res) {
    Blog.findByIdAndRemove(req.params.blog_id, function (err) {
        if (err) {
            res.render("notFound.ejs");
        }
        else {
            res.redirect("/blog");
        }
    })
});


// EDIT BLOG
router.get("/blog/:id/edit", isAdmin, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("notFound.ejs");
        }
        else {
            res.render("editBlog.ejs", {
                blog: foundBlog
            });
        }
    });
});


// UPDATING THE BLOG
router.put('/blog/:blog_id', isAdmin, function (req, res) {
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, req.body.blog,
        function (err, updatedBlog) {
            if (err) {
                res.redirect("notFound.ejs");
            } else {
                res.redirect('/blog/' + req.params.blog_id);
            }
        }
    );
});


// Middleware
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        res.render("notAdmin.ejs");
    }
}

module.exports = router;