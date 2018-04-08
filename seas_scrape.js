var request = require('request');
var cheerio = require('cheerio');
var download = require('image-downloader');

function img_downloader(imgurl) {
  const options = {
    url: imgurl,
    dest: './'
  }

  download.image(options).then(({filename, image}) => {
    console.log("file saved to", filename);
  }).catch((err) => {
    throw err;
  });
}

function get_urls(url, callback) {
  var urls = [];
  request(url, function(er, res, body) {

    if(er) {
      throw er;
    }

    const $ = cheerio.load(body);

    var m;
    var rex = /src="([^"]+)"/g;

    // var count = $('div.content p').length;

    $('div.content p').each(function() {
      do {
        m = rex.exec($(this).html());
        if(m) {
          urls.push(m[1]);
        }
      } while(m);
      return callback(urls);
    });

  });
}

get_urls('http://bulletin.engineering.columbia.edu/undergraduate-degree-tracks', function(urls) {
  urls.map(function(url) {
    img_downloader('http://bulletin.engineering.columbia.edu' + url);
  });
});

get_urls('http://bulletin.engineering.columbia.edu/bachelor-science-degree-tracks', function(urls) {
  urls.map(function(url) {
    img_downloader('http://bulletin.engineering.columbia.edu' + url);
  });
});

for(var i = 0; i <= 9; i++) {
  get_urls("http://bulletin.engineering.columbia.edu/undergraduate-degree-tracks" + `-${i}`, function(urls) {
    urls.map(function(url) {
      img_downloader('http://bulletin.engineering.columbia.edu' + url);
    });
  });
}
