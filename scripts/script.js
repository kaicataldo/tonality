//ready function - this script won't load until the dom has been loaded
$(function() {
  var sound1 = new Howl({
    urls: ['media/16.ogg']
  });
  var sound2 = new Howl({
    urls: ['media/15.ogg']
  });
  var sound3 = new Howl({
    urls: ['media/14.ogg']
  });
  var sound4 = new Howl({
    urls: ['media/13.ogg']
  });
  var sound5 = new Howl({
    urls: ['media/12.ogg']
  });
  var sound6 = new Howl({
    urls: ['media/11.ogg']
  });
  var sound7 = new Howl({
    urls: ['media/10.ogg']
  });
  var sound8 = new Howl({
    urls: ['media/9.ogg']
  });
  var sound9 = new Howl({
    urls: ['media/8.ogg']
  });
  var sound10 = new Howl({
    urls: ['media/7.ogg']
  });
  var sound11 = new Howl({
    urls: ['media/6.ogg']
  });
  var sound12 = new Howl({
    urls: ['media/5.ogg']
  });
  var sound13 = new Howl({
    urls: ['media/4.ogg']
  });
  var sound14 = new Howl({
    urls: ['media/3.ogg']
  });
  var sound15 = new Howl({
    urls: ['media/2.ogg']
  });
  var sound16 = new Howl({
    urls: ['media/1.ogg']
  });

  var i = 1;
  var keepLoop;

  //toggles selected class
  $('.box').click(function() {
    $(this).toggleClass("selected");
  });

  $('.toggle').click(function() {
    toggleClicked();
  });

  $('.clear').click(function() {
    $('.box').removeClass('selected');
  });

  //Play
  function toggleClicked() {
    if ($('.toggle').html() == 'Start') {
      $('.toggle').html('Stop');
      keepLoop = true;
      gridLoop();
    }
    else if ($('.toggle').html() == 'Stop') {
      $('.toggle').html('Start');
      keepLoop = false;
    }
  }

  function gridLoop() {
    if (keepLoop) {
      setTimeout(function() {
        var column = ".col-" + i;
        $(column).children().toggleClass('active');
        playSound(column);
        if (i == 1) {
          $(".col-16").children().removeClass("active");
        }
        else {
          $(".col-" + (i - 1)).children().toggleClass("active");
        }
        i++;
        if (i <= 16){
          gridLoop();        
        }
        else if (i == 17) {
          i = 1;
          gridLoop();
        }
       }, 500);
    }
    else {
      i = 1;
      $(".box").removeClass("active");
      return;
    }
  }

  function playSound(column) {
    var notesToPlay = [];

    $(column).children('.selected').each(function () {
      var addNote = $(this).html();
      notesToPlay.push(addNote); 
    });
    //console.log(notesToPlay);
    for (i = 0; i < notesToPlay.length; i++) {
      soundToPlay = 'sound' + notesToPlay[i];
      soundToPlay.play();
    }
  }

});


