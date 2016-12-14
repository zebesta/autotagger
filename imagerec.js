require('dotenv').load();
var axios = require('axios')
var scraper = require('./scraper')

console.log(process.env.CLARIFAI_CLIENT_ID);
console.log(process.env.CLARIFAI_SECRET_KEY);



  function getCredentials() {
    var data = {
      'grant_type': 'client_credentials',
      'client_id': process.env.CLARIFAI_CLIENT_ID,
      'client_secret': process.env.CLARIFAI_SECRET_KEY
    };
    var url = 'https://api.clarifai.com/v1/token';

    return axios.post(url, data, {
      'transformRequest': [
        function() {
          return transformDataToParams(data);
        }
      ]
    }).then(function(r) {
      localStorage.setItem('accessToken', r.data.access_token);
      localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
      // yolo
    }, function(err) {
      console.log(err);
    });
  }

  function transformDataToParams(data) {
    var str = [];
    for (var p in data) {
      if (data.hasOwnProperty(p) && data[p]) {
        if (typeof data[p] === 'string'){
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
        }
        if (typeof data[p] === 'object'){
          for (var i in data[p]) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
          }
        }
      }
    }
    return str.join('&');
  }

function postImage(imgurl) {
  var accessToken = process.env.CLARIFAI_ACCESS_TOKEN;
  var data = {
    'url': imgurl
  };
  var url = 'https://api.clarifai.com/v1/tag';
  return axios.post(url, data, {
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
  }).then(function(r) {
    // PARSE HERE
    var tags = r.data.results[0].result.tag.classes;
    var probs = r.data.results[0].result.tag.probs;
    console.log(tags);
    console.log(probs);
    scraper(tags[0]);
    // console.log(parseResponse(r));
  }, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
}



postImage('http://markdalton.net/wp-content/uploads/2016/10/9a1439_8a19f1319de247a280bdcaea2c3a44efmv2_d_1980_1320_s_2.jpg');
