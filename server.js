var express = require('express');
var cors = require('cors')

var imagerec = require('./imagerec');
var scraper = require('./scraper');

var app = express();
app.use(express.static('public'))
app.use(cors());


// image based query to pull dominate image recognition then tags
app.get('/', function(req, res) {
  var hello = imagerec('http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg');
  console.log(hello);
  hello.then(results=>{
    console.log("RESOLVING ON SERVER");
    console.log(hello);
    res.json(results);
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
