//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


const homeStartingContent = "Blogs, short for weblogs, are online platforms where individuals or organizations publish regularly updated content, typically in a chronological format. These entries, known as blog posts, can cover a wide range of topics, including personal experiences, hobbies, travel, technology, health, politics, and virtually any subject of interest. Blogs often include text, images, videos, and links to other websites, creating a multimedia-rich platform for sharing information, opinions, and stories.";
const aboutContent = "We are thrilled to introduce our brand new website that has been carefully crafted to empower you to share your thoughts, knowledge, and experiences with the world. Our platform provides a seamless and user-friendly experience for both bloggers and readers, and it's all thanks to the magic of MongoDB database technology.";
const contactContent = "";
 
const app = express();
 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todoblog", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({})
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => {
      // Handle the error here
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

 post.save();
  
  res.redirect("/");

});

app.get("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({_id: requestedPostId}).exec();
    
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } 
  }
   catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
