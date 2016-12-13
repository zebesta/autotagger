require('dotenv').load();
var Twitter = require('twitter');

console.log(process.env.TWITTER_CONSUMER_KEY);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
function scraper(hashtag){
  hashtag = '#'+hashtag;
  console.log(hashtag);
  var params = {
    q: hashtag,
    count: 100
  };
  var i = 1;
  var twitter_tweets = [];
  (function fetch_tweets(params) {
    client.get('search/tweets', params, function (error, tweets, response) {
      if (!error) {
        params.max_id = tweets.statuses[tweets.statuses.length - 1].id
        //push on to array if not retweet
        tweets.statuses.map((t) => !t.retweeted_status ? twitter_tweets.push(t.text)  : null);
        if (twitter_tweets.length < 1000) {
          console.log(i);
          fetch_tweets(params)
          i++;
        } else {
          // console.log(twitter_tweets)
          extractHashtags(twitter_tweets);
        }
      }
    })
  } (params))
}

function extractHashtags(twitter_tweets){
  var allTags = [];
  for(var i = 0; i<twitter_tweets.length; i++){
    // var re = /(^|\s+|\n+)(#[a-z\d-]+)/gi
    var re = /(#[a-z\d-]+)/gi
    var hashtags = twitter_tweets[i].match(re);
    // console.log(hashtags);
    allTags.push(hashtags)
  }
  // console.log(allTags);
  countHashtags(allTags);
}


function countHashtags(hashtags){
  tags = {};
  for(var i = 0; i<hashtags.length; i++){
    if(null != hashtags[i]){
      for(var j = 0; j<hashtags[i].length; j++){
        if ( tags.hasOwnProperty( hashtags[i][j] ) ) {
            tags[ hashtags[i][j] ] = tags[ hashtags[i][j] ] + 1;
        } else {
            tags[ hashtags[i][j] ] = 1;
        }
      }
    }
  }
  var sortable = [];
  for (var tag in tags){
    sortable.push([tag, tags[tag]])
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1]
  })
    console.log(sortable);
}


module.exports = scraper;
