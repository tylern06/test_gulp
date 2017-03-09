var express = require("express");
var app = express();
var path = require("path");
var bodyParser= require("body-parser");
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
console.log(path.join(__dirname, "."))
app.use(express.static(path.join(__dirname, "./node_modules")));
// Setting our Views Folder Directory
app.use(express.static(__dirname));

//use if static files are in client folder
// app.use(express.static(path.join(__dirname, "./client")));

// Setting our Views Folder Directory for EJS
// app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
// app.set('view engine', 'ejs');

// email: fernyhoughwedding@zoho.com


// app.get('/', function (req,res){
//   console.log(req.body)
// 	res.render("index");
//  })

// var port = process.env.PORT || 5000;
var port = 8000;

var server = app.listen(port, function(){
	console.log("********** PORT " + port + " PORT **********")
});
