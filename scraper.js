require('dotenv').load();
var Twitter = require('twitter');

console.log(process.env.TWITTER_CONSUMER_KEY);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var i = 0;
var params = {
  q: '#kolaches',
  count: 2
};

var twitter_tweets = [];
(function fetch_tweets(params) {
  client.get('search/tweets', params, function (error, tweets, response) {
    if (!error) {
      params.max_id = tweets.statuses[tweets.statuses.length - 1].id
      tweets.statuses.map((t) => twitter_tweets.push(t.text) ? !t.retweeted : null);
      if (i < 10) {
        fetch_tweets(params)
        i++;
      } else {
        console.log(twitter_tweets)
      }
    }
  })
} (params))
