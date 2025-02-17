var blurElement = { a: 6 };

function iconBlur() {
  console.log(blurElement.a);
  TweenMax.set(['.preloader__icon svg'], {
    webkitFilter: "blur(" + blurElement.a + "px)",
    filter: "blur(" + blurElement.a + "px)"
  });
}

Image.prototype.load = function(url, callback) {
  var thisImg = this,
      xmlHTTP = new XMLHttpRequest();

  thisImg.completedPercentage = 0;

  xmlHTTP.open('GET', url, true);
  xmlHTTP.responseType = 'arraybuffer';

  xmlHTTP.onload = function(e) {
    var h = xmlHTTP.getAllResponseHeaders(),
        m = h.match(/^Content-Type\:\s*(.*?)$/mi),
        mimeType = m ? m[1] : 'image/gif';
    // Create a blob from the response
    var blob = new Blob([this.response], { type: mimeType });
    thisImg.src = window.URL.createObjectURL(blob);

    $('body').append('<style type="text/css"> .home-intro { background-image:url(' + window.URL.createObjectURL(blob) + ')}</style>');

    if (callback) callback(this);
  };

  xmlHTTP.onprogress = function(e) {
    if (e.lengthComputable) {
      thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
    }
  };

  xmlHTTP.onloadstart = function() {
    thisImg.completedPercentage = 0;
  };

  xmlHTTP.onloadend = function() {
    thisImg.completedPercentage = 100;
  };

  xmlHTTP.send();
};

function preloadImages() {
  var images = $('img[src^="assets/images/"], img[src^="assets/svgs/"]');
  var totalImages = images.length;
  var loadedImages = 0;

  if (totalImages === 0) {
    completePreloader();
    return;
  }

  images.each(function() {
    var img = new Image();
    var src = $(this).attr('src');

    img.load(src, function() {
      loadedImages++;
      var progress = (loadedImages / totalImages) * 100;

      TweenMax.to('.preloader__progress', 0.2, { width: progress + '%' });

      blurElement.a = (6 - (progress / 17));
      iconBlur();

      if (loadedImages === totalImages) {
        completePreloader();
      }
    });
  });
}

function completePreloader() {
  blurElement.a = 0;
  iconBlur();
  setTimeout(function(){
    $('.preloader, .grid-reveal').addClass('loaded');
  }, 1000);
}

if ($('.preloader').length) {
  preloadImages();
}