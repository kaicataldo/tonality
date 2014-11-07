$(function() {
  var settings = {
    soundPack:[],
    fadeInVal:100,
    fadeOutVal:null,
    loopStatus:null,
    currentCol:1,
    colInterval:120,
    measures: 1,
    beats:4,
    subdivision:4,
    defaulCols: 16,
    totalCols: 16,
    selectedBlocks: []
  };

//Setup
  buildGrid();
  createSoundPack();

  //Renders Tempo knob
  $(".knob").knob({
    'min': 1,
    'max': 240,
    'width': 100,
    'release': function (v) { setTempo('colInterval', v)}
  });

//Event Handlers
  //Toggles selected class
  $('body').on('click', '.box', function() {
    $(this).toggleClass("selected");
  });

  //Event listeners for toggling Start/Stop
    //Click button
   $(".toggle").click(function() {
     toggleClicked();
   });

    //Press spacebar
  $(window).keypress(function(e) {
    if (e.keyCode == 0 || e.keyCode == 32) {
      if ("activeElement" in document) {
      document.activeElement.blur();
      }
      toggleClicked();
    }
  });
 
  //Reset button
  $(".clear").click(function() {
    $(".box").removeClass("selected");
  });
    
  //Measures/Beats/Subdivision listeners
  $('.measures-container input').on('change', function() {
    settings.measures = $('input[name="measures"]:checked', '.measures-container').val(); 
    resetGrid();
  });

  $('.beats-container input').on('change', function() {
    settings.beats = $('input[name="beats"]:checked', '.beats-container').val(); 
    resetGrid();
  });

  $('.subdivision-container input').on('change', function() {
    settings.subdivision = $('input[name="subdivision"]:checked', '.subdivision-container').val(); 
    console.log("Subdivision is now: "+settings.subdivision);
    resetGrid();
  });

  //Start button <-> Stop Button 
  function toggleClicked() {
    if ($('.toggle').html() == 'Start') {
      $('.toggle').html('Stop');
      settings.loopStatus = true;
      gridLoop();
    }
    else if ($('.toggle').html() == 'Stop') {
      $('.toggle').html('Start');
      settings.loopStatus = false;
    }
  }

//Functions
  //Dynamically build HTML grid
  function buildGrid() {
    var container = $(".grid");
    settings.totalCols = settings.measures * settings.beats * settings.subdivision;
    //Loop through each row.
    for (var colIndex = 1; colIndex <= settings.totalCols; colIndex++) {
      //Create the skeleton for the row.
      var col = $("<div>", {
          "class": "col col-" + colIndex,
          "id": "col-"+colIndex
      });
      //Loop through each column
      for (var rowIndex = 1; rowIndex <= 16; rowIndex++) {
        //Create skeleton for the column.
        var row = $("<div>", {
            "class": "box row-"+rowIndex,
            "id": "col"+colIndex+"row"+rowIndex,
            "note": rowIndex
        });
        //Append to the row div.
        col.append(row);
      }
      //Finally append this row to the container.
      container.append(col);
    }
    findDownbeat();
  }

  //Dynamically create sound file references
  function createSoundPack() {
    for(var soundIndex = 1; soundIndex<=16; soundIndex++) {
      settings.soundPack[soundIndex-1] = new Howl({
        urls: ['media/'+soundIndex+'.ogg', 'media/'+soundIndex+'.mp3'],
        fadeIn: settings.fadeInVal,
        fadeOut: settings.fadeOutVal
      });
    }
  }

  function resetGrid() {
    var container = $(".grid");
    var newTotalCols = settings.measures * settings.beats * settings.subdivision;

    if (newTotalCols !== settings.totalCols) {
      if (newTotalCols > settings.totalCols) {
        for (var currentCol = settings.totalCols + 1; currentCol <= newTotalCols; currentCol++) {
          console.log(settings.totalCols+" and "+currentCol);
          //Create the skeleton for the row.
          var col = $("<div>", {
              "class": "col col-"+ currentCol,
              "id": "col-"+ currentCol
          });
          //Loop through each column
          for (var rowIndex = 1; rowIndex <= 16; rowIndex++) {
            //Create skeleton for the column.
            var row = $("<div>", {
                "class": "box row-"+rowIndex,
                "id": "col"+currentCol+"row"+rowIndex,
                "note": rowIndex
            });
            //Append to the row div.
            col.append(row);
          }
            //Finally append this row to the container.
            container.append(col);
        }
      } 
      else if (newTotalCols < settings.totalCols) {
        console.log("delete "+ (settings.totalCols - newTotalCols) +" columns");
        for (var currentCol = settings.totalCols; currentCol > newTotalCols; currentCol--) {
          console.log(currentCol);
          $(".grid").children().last().remove();
        }
      }
    }
    $(".box").removeClass("active");
    settings.totalCols = newTotalCols;
    settings.currentCol = 1;
    findDownbeat();
  }

  function findDownbeat() {
    var markedColumns = $('.grid').find(".col");
    var measureMarkers = settings.beats * settings.subdivision;

    $(markedColumns).children().removeClass('downbeat downbeat-measure');
    for (i = 0; i < markedColumns.length; i++ ) {
      if (i % settings.subdivision === 0) {
        $(markedColumns[i]).children().addClass('downbeat');
        console.log(i + "downbeats");
      }
    }
    for (j = 0; j < markedColumns.length; j++ ) {
      if (j % measureMarkers === 0) {
        console.log(j + "measure beats");
        $(markedColumns[j]).children().addClass('downbeat-measure');
      }
    }
  }

  //Set tempo
  function setTempo(dataName, dataVal) {
    var milliseconds = Math.round((((60/dataVal)*1000)*100000)/100000)/settings.subdivision;
        //console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
        settings[dataName] = milliseconds;
  }

  //Loop through every column
  function gridLoop() {
    if (settings.loopStatus) {
      settings.totalCols = settings.measures * settings.beats * settings.subdivision;
      setTimeout( function() {
        $(".col-" + settings.currentCol).children().toggleClass("active");
        if (settings.currentCol == 1) {
          $(".col-"+settings.totalCols).children().removeClass("active");
        }
        else {
          $(".col-"+(settings.currentCol - 1)).children().removeClass("active");
        }
        playSound(".col-" + settings.currentCol);
        settings.currentCol++;
        if (settings.currentCol <= settings.totalCols){
          gridLoop();        
        }
        else if (settings.currentCol == settings.totalCols + 1) {
          settings.currentCol = 1;
          gridLoop();
        }
       }, settings.colInterval);
    }
    else {
      settings.currentCol = 1;
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
      //console.log("The notes to play are: "+notesToPlay);
      });
      for (var iPlay = 0; iPlay < notesToPlay.length; iPlay++) {
        var soundToPlay = eval("settings.soundPack[" + (notesToPlay[iPlay]-1) + "]");
        soundToPlay.play();
      }
      notesToPlay = [];
    }

});


