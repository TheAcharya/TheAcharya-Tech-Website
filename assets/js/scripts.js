var blurElement = {a:6};


function iconBlur() {
  console.log(blurElement.a);
  TweenMax.set(['.preloader__icon svg'], {
    webkitFilter:"blur(" + blurElement.a + "px)",
    filter:"blur(" + blurElement.a + "px)"
  });
};

Image.prototype.load = function( url, callback ) {
    var thisImg = this,
        xmlHTTP = new XMLHttpRequest();

    thisImg.completedPercentage = 0;

    xmlHTTP.open( 'GET', url , true );
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function( e ) {
        var h = xmlHTTP.getAllResponseHeaders(),
            m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
            mimeType = m[ 1 ] || 'image/gif';
            // Remove your progress bar or whatever here. Load is done.

        var blob = new Blob( [ this.response ], { type: mimeType } );
        thisImg.src = window.URL.createObjectURL( blob );

        $('body').append('<style type="text/css"> .home-intro { background-image:url(' + window.URL.createObjectURL( blob ) +')} </style>');

        if ( callback ) callback( this );
    };

    xmlHTTP.onprogress = function( e ) {
        if ( e.lengthComputable )
            thisImg.completedPercentage = parseInt( ( e.loaded / e.total ) * 100 );
        // Update your progress bar here. Make sure to check if the progress value
        // has changed to avoid spamming the DOM.
        // Something like:
        // if ( prevValue != thisImage completedPercentage ) display_progress();
    };

    xmlHTTP.onloadstart = function() {
        // Display your progress bar here, starting at 0
        thisImg.completedPercentage = 0;
    };

    xmlHTTP.onloadend = function() {
        // You can also remove your progress bar here, if you like.
        thisImg.completedPercentage = 100;
    }

    xmlHTTP.send();
};

function preloader() {

  // Loadbar Animation
  TweenMax.defaultEase = Power2.easeInOut;

  var preloaderFill = new TimelineMax({paused:false, onComplete:function(){



  }});

  // animation
  preloaderFill
    .to('.preloader__progress', 10, {width: '100%'})
    .to(blurElement, 10, {a:0, onUpdate:iconBlur}, 0);


  if($(window).width() < 7000){


    $(window).on('load', function(){


      preloaderFill.totalProgress(1).kill();

      setTimeout(function(){
        $('.preloader, .grid-reveal').addClass('loaded');
      }, 1000);

    });

  }else{

    preloaderFill.pause();
    
    var img = new Image();
    img.load('assets/images/particles-6.gif');

    var loadChecker = setInterval(function(){

      var loadPercentage = img.completedPercentage / 100;

      preloaderFill.totalProgress(img.completedPercentage / 100);

      TweenMax.to('.preloader__progress', 0.2, {width: img.completedPercentage + '%'});
      blurElement.a = (6 - (img.completedPercentage / 17));
      iconBlur();

      if(loadPercentage == 1){

        clearInterval(loadChecker);
        blurElement.a = 0;
        iconBlur();
        setTimeout(function(){
          $('.preloader, .grid-reveal').addClass('loaded');
        }, 1000);

      }

      console.log('internal');

    }, 1500);


  }



}

if ($('.preloader').length ) {
  preloader();
}
