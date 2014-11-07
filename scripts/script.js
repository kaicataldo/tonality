$(function() {

  //Create Grid
  var $container = $(".grid");

  for (var colIndex = 1; colIndex <= 16; colIndex++) {
    var $col = $("<div>", {
      "class": "col col-" + colIndex,
      "id": "col-"+ colIndex
    });
    for (var rowIndex = 1; rowIndex <= 16; rowIndex++) {
      var $row = $("<div>", {
          "class": "box row-" + rowIndex,
          "id": "col" + colIndex + "row" + rowIndex,
          "note": rowIndex
      });
      $col.append($row);
    }
    $container.append($col);
  }

  //Assign sounds to rows
  var sounds = [],
      fadeInVal,
      fadeOutVal;

  for(var soundIndex = 1;soundIndex <= 16; soundIndex++) {
    sounds[soundIndex - 1] = new Howl({
      urls: ['media/'+soundIndex+'.ogg', 'media/'+soundIndex+'.mp3'],
      fadeIn: fadeInVal,
      fadeOut: fadeOutVal
    });
  }

  //Toggle active boxes
  $('.box').click(function() {
    $(this).toggleClass("selected");
  });

  $('.toggle').click(function() {
    toggleClicked();
  });

  $('.clear').click(function() {
    $('.box').removeClass('selected');
  });

  //Start button <-> Stop Button 
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

  //The loop!
  var i = 1;
  
  function gridLoop() {
    if (keepLoop) {
      setTimeout(function() {
        var column = ".col-" + i;
        $(column).children().toggleClass('active');
        if (i == 1) {
          $(".col-16").children().removeClass("active");
        }
        else {
          $(".col-" + (i - 1)).children().toggleClass("active");
        }
        playSound(column);
        i++;
        if (i <= 16){
          gridLoop();        
        }
        else if (i == 17) {
          i = 1;
          gridLoop();
        }
       }, 120);
    }
    else {
      i = 1;
      $(".box").removeClass("active");
      return;
    }
  }

  //Play the notes that are selected
  function playSound(column) {
    var notesToPlay = [];

    $(column).children('.selected').each(function() {
      var addNote = $(this).attr('note');
      notesToPlay.push(addNote);
      console.log("The notes to play are: "+notesToPlay);
      });
      for (var iPlay = 0; iPlay < notesToPlay.length; iPlay++) {
        //console.log(notesToPlay[iPlay]);
        var soundToPlay = eval("sounds[" + (notesToPlay[iPlay]-1) + "]");
        soundToPlay.play();
      }
      notesToPlay = [];
    }

});


