//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const http = require('http');
const port= process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));

mongoose.connect("mongodb+srv://arshroop:Asdfjkl123@personalblog.spfgz.mongodb.net/", {useNewUrlParser: true, useUnifiedTopology: true });

const postSchema =  {
  title: {type:String,
    required:true},
  date: {type: Date,
    required:true},
  description: {type: String,
    required:true},
  content: {type: String,
    required:true},
};

const Post = mongoose.model("Post", postSchema);

app.get('/',function(req,res){
  var noMatch = null;
      if(req.query.search) {
          const search = new RegExp(escapeRegex(req.query.search), 'gi');
          
          Post.find({title:search}, function(err, posts){
          
             if(err){
                 console.log(err);
             } else {
                if(posts.length < 1) {
                    noMatch = "No posts found";
                }
                res.render("home", {
                  posts: posts,
                  noMatch: noMatch,
                  });   
             }
            }).sort({date:"desc"});
      } else {
          // Get all posts from DB
         Post.find({}, function(err, posts){
          if(err){
            console.log(err);
          }else{
        res.render("home", {
          posts: posts,
          noMatch: noMatch,
          });
        }
      }).sort({date:"desc"});
      }
    });



app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    date: req.body.postDate,
    description: req.body.postDescription,
    content: req.body.postBody,
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      date: post.date,
      description: post.description,
      content: post.content,
      _id: requestedPostId 
    });
  });

});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

setInterval(() => {
  http.get("https://blog-arshroop-singh-saini.herokuapp.com/");
}, 25 * 60 * 1000); // every 25 minutes

app.listen(port, function() {
  console.log("Server started sucessfully");
});
