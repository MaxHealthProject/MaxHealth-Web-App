var express = require("express");
var router = express.Router({
    mergeParams:true
});
var methodOverride = require("method-override");
router.use(methodOverride("_method"));

// BLOG Models
var Blog = require("../models/blog");

// SHOWING ALL BLOGS
router.get("/blog", function (req, res) {
    Blog.find({}, function (err, foundBlogs) {
        if (err) {
            res.redirect("notFound.ejs");
        } else {
            res.render("blog.ejs", { blogs: foundBlogs });
        }
    });
});
//ADDED NEW BLOG
router.post("/blog", function(req, res){
    Blog.create(req.body.blog, function(err,newBlogCreated){
        if(err){
            console.log(err);
        }
        else{
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
//ADDING NEW BLOG
router.get("/blog/addNewBlog",function(req,res){
    res.render("createBlog.ejs");
});
//FINDING THE FOLLOWING BLOG
router.get("/blog/:blog_id",function(req, res){
    Blog.findById(req.params.blog_id).populate('blog').exec(
        function(err, foundBlog){
            if(err){
                res.render("notFound.ejs");
            }
            else{
                res.render("post.ejs",{blog:foundBlog});
            }
        }
    )
});
//DELETING THE FOLLOWING BLOG 
router.get("/blog/:blog_id/deleteThisBlog",function(req,res){
    Blog.findByIdAndRemove(req.params.blog_id,function(err){
        if(err){
            res.render("notFound.ejs");
        }
        else{
            res.render("notFound.ejs");
        }
    })
});
//REQUESTING TO UPDATE THE FOLLOWING BLOG
router.get("/blog/:id/editBlog",function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("notFound.ejs");
        }
        else{
            res.render("editBlog.ejs",{
                blog : foundBlog
            });
        }
    });
});
//UPDATING THE BLOG
router.put('/blog/:blog_id', 
    function(req, res) {
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, req.body.blog,
        function(err,updatedBlog) {
            if (err) {
                res.redirect("notFound.ejs");
            } else {
                res.redirect('/blog/'+req.params.blog_id);
            }
        }
    );  
});

module.exports = router;