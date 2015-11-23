$(function () {

    // OPEN WEBGL-EARTH
    var options = { zoom: 3.0,
      position: [34.0500,118.2500],
      // center: [46.8011, 8.2266],
      sky: true,
      atmosphere : true };
    var earth = new WE.map('earth_div', options)
    if (earth){
      console.log('Open webgl-earth initialized: ' + earth)
    }
    var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
          tileSize: 256,
          tms: true
        });
    natural.addTo(earth);
    var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
          opacity: 0.6
        });
    toner.addTo(earth);

    // Start a rotation animation
    rotation = setInterval(function() {

      var c = earth.getPosition();

      if(c[0] && c[1]){
        earth.setCenter([c[0], c[1] + 0.1]);
      }

    }, 30);

    var markers = []

  //GOOGLE WEBGL-GLOBE (LOCAL)
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {

      // Where to put the globe?
      var container = document.getElementById( 'globe-container' );

      // Make the globe
      var globe = new DAT.Globe( container );
      console.log('Google webGl-globe initialized: ' + globe);

      // We're going to ask a file for the JSON data.
      var xhr = new XMLHttpRequest();

      // Where do we get the data?
      xhr.open( 'GET', 'assets/js/tweets.json', true );

      // What do we do when we have it?
      xhr.onreadystatechange = function() {

          // If we've received the data
          if ( xhr.readyState === 4 && xhr.status === 200 ) {

              // Parse the JSON
              var data = JSON.parse( xhr.responseText );

              // Tell the globe about your JSON data
              for ( var i = 0; i < data.length; i ++ ) {
                  globe.addData( data[i][1], {format: 'magnitude', name: data[i][0]} );
              }

              // Create the geometry
              globe.createPoints();

              // Begin animation
              globe.animate();

          }

      };

      // Begin request
      xhr.send( null );

      //GOOGLE GLOBE POPULATION EXAMPLE
      // var container = document.getElementById('container');
      // var globe = new DAT.Globe(container);
      //
      // console.log('Google webGl-globe initialized: ' + globe);
      // var i, tweens = [];
      //
      // var settime = function(globe, t) {
      //   return function() {
      //     new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
      //     var y = document.getElementById('year'+years[t]);
      //     if (y.getAttribute('class') === 'year active') {
      //       return;
      //     }
      //     var yy = document.getElementsByClassName('year');
      //     for(i=0; i<yy.length; i++) {
      //       yy[i].setAttribute('class','year');
      //     }
      //     y.setAttribute('class', 'year active');
      //   };
      // };
      //
      // for(var i = 0; i<years.length; i++) {
      //   var y = document.getElementById('year'+years[i]);
      //   y.addEventListener('mouseover', settime(globe,i), false);
      // }
      //
      // var xhr;
      // TWEEN.start();
      //
      //
      // xhr = new XMLHttpRequest();
      // xhr.open('GET', '/globe/population909500.json', true);
      // xhr.onreadystatechange = function(e) {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       var data = JSON.parse(xhr.responseText);
      //       window.data = data;
      //       for (i=0;i<data.length;i++) {
      //         globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
      //       }
      //       globe.createPoints();
      //       settime(globe,0)();
      //       globe.animate();
      //       document.body.style.backgroundImage = 'none'; // remove loading
      //     }
      //   }
      // };
      // xhr.send(null);
    }

    var socket = io();

      socket.on('connect', function() {
        console.log('Connected!');
      });

      socket.on('tweets', function(tweet) {
        var html = '<div class="row"><div class="col-md-6 col-md-offset-3 tweet"><img src="' + tweet.user_profile_image + '" class="avatar pull-left"/><div class="names"><span class="full-name">' + tweet.name + ' </span><span class="username">@' +tweet.screen_name + '</span></div><div class="contents"><span class="text">' + tweet.text + '</span></div><span class="coordinates"> Location:' + tweet.location.lat + ', ' + tweet.location.lng + '</span></div></div>';
        $('#tweet-container').append(html);

        markers.push(WE.marker([tweet.location.lat, tweet.location.lng]).addTo(earth).bindPopup("This user has tweeted from <b>" + tweet.location.lat + ', ' + tweet.location.lng + '</b>', {maxWidth: 150,maxHeight:100, closeButton: true}));
      });
});
