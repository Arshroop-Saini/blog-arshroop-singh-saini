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
app.use(express.static("public"));

mongoose.connect("mongodb+srv://arshroop:Asdfjkl123@personalblog.spfgz.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true });

const postSchema =  {
  title: String,
  date: Date,
  description: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  }).sort({date:"desc"});
});

app.post('/getPosts', (req,res)=>{
  let payload= req.body.payload;
  console.log(payload);
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

setInterval(() => {
  http.get("https://blog-arshroop-singh-saini.herokuapp.com/");
}, 25 * 60 * 1000); // every 25 minutes

app.listen(port, function() {
  console.log("Server started sucessfully");
});
