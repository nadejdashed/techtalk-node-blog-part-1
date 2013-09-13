var express = require("express");
var app = express();
var ejs = require("ejs");

app
  .engine("ejs", ejs.renderFile)
  .set("views", "views")
  .set("view engine", "ejs");


app
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.logger("tiny"))
  .use(app.router)
  .use(express.static("public"))
  .listen(8080);

var posts = [
  {
    title: "Hello!",
    date: "2013-09-10",
    content: "Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum."
  },
  {
    title: "My second post!",
    date: "2013-09-10",
    content: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec id elit non mi porta gravida at eget metus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet."
  }
];

app.get("/", function(req, res){
  posts = posts.sort(function(a,b){ return a.date < b.date; });
  res.render("index", {posts: posts});
});

app.get("/create", function(req, res){
  res.render("create");
});

app.get("/show/:id", function(req, res){
  var id = parseInt(req.params.id, 10);
  res.render("show", {post: posts[id]});
});

app.get("/edit/:id", function(req, res){
  var id = parseInt(req.params.id, 10);
  var post = posts[id];
  res.render("edit", {id: id, title: post.title, content: post.content, date: post.date});
});

app.put("/update", function(req, res){
  console.log(req.body);
  var date = new Date();
  var id = parseInt(req.body.id, 10);
  var post = posts[id];
  post.title = req.body.title;
  post.content = req.body.content;
  res.redirect("/show/"+id);
});

app.post("/create", function(req, res){
  console.log(req.body);
  var date = new Date();
  posts.push({
    title: req.body.title,
    date: [date.getFullYear(), date.getMonth(), date.getDate()].join('-'),
    content: req.body.content
  });
  res.redirect("/");
});
