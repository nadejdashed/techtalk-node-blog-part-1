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

var posts = require("./posts").data();

var pageSize = 5;

var showPage = function(req, res){
  posts = posts.sort(function(a,b){ return a.date < b.date; });

  var page = parseInt(req.params.page, 10) || 0;
  var start = page * pageSize;
  var end = (posts.length <= (start + pageSize)) ? posts.length : start + pageSize;
  var _posts = posts.slice(start, end);
  res.render("index", {posts: _posts, pages: Math.ceil(posts.length / pageSize), page: page || 0, pageSize: pageSize});
}

app.get("/", showPage);

app.get("/:page", showPage);

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

app.delete("/delete/:id", function(req, res){
  if(req.params.id){
    var id = parseInt(req.params.id, 10);
    posts.splice(id, 1);
  }
  res.redirect("/");
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
