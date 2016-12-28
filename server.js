var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');

var imagerec = require('./imagerec');
var scraper = require('./scraper');

var app = express();
app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// image based query to pull dominate image recognition then tags
app.get('/', function(req, res) {
  res.redirect('/home.html')
});

app.get('/img', function(req, res) {
  var hello = imagerec('http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg');
  console.log(hello);
  hello.then(results=>{
    console.log("RESOLVING ON SERVER");
    console.log(hello);
    res.json(results);
  })
  .catch(err=>{
    res.json("Holy shit, theres been an error!");
  });
});

//not being allowed.....
app.post('/img/url', cors(), function(req, res) {
  var imgUrl = req.body.imgUrl;
  console.log(imgUrl);
  var hello = imagerec(imgUrl); //imagerec('http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg');
  console.log("printing hello");
  console.log(hello);
  hello.then(results=>{
    console.log("RESOLVING ON SERVER");
    console.log(hello);
    res.json(results);
  })
  .catch(err=>{
    res.json("Holy shit, theres been an error!");
  });
});

// Direct query with a tag instead of an image
app.get('/tag/:tag', function(req,res) {
  var tag = req.params.tag;
  var scraped = scraper(tag);
  scraped.then(results=>{
    res.json(results);
  })
  .catch(err=>{
    res.json(err);
  });
});



//Start the server  ---- working with Heroku!
var port = process.env.PORT || 4000;        //set port
app.listen(port);
console.log('Magic happens on port ' + port);
