var request = require('request');
var cheerio = require('cheerio');

function get_urls(url, callback) {
  var urls = [];
  request(url, function(er, res, body) {

    if(er) {
      throw er;
    }

    const $ = cheerio.load(body);

    var m;
    var rex = /src="([^"]+)"/g;

    var count = $('div.content p').length;
    var i = 0;

    $('div.content p').each(function() {
      do {
        m = rex.exec($(this).html());
        if(m) {
          urls.push(m[1]);
        }
      } while(m);

      i++;
      if(i >= count) {
        return callback(urls);
      }
    });

  });
}

get_urls('http://bulletin.engineering.columbia.edu/undergraduate-degree-tracks-0', function(urls) {
  console.log(urls);
});
