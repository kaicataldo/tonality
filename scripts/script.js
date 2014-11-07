$(function() {

  var settings = {
    soundPack:[],
    fadeInVal:100,
    fadeOutVal:null,
    loopStatus:null,
    currentCol:1,
    colInterval:120,
    beats:4,
    subdivision:4,
    defaulCols: 16,
    totalCols: 16,
    selectedBlocks: []
  };

  buildGrid();
  createSoundPack();

  //Renders Tempo knob
  $(".knob").knob({
    'min': 1,
    'max': 240,
    'width': '100',
    'release': getOptions()
  });

  //Toggles selected class
  $(".box").click(function() {
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

  $(".rebuild").click(function() {
    getOptions();
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

  function resetGrid() {
    $(".col").remove();
    buildGrid();
  }

  //Dynamically build HTML grid
  function buildGrid() {
    var container = $(".grid");
    settings.totalCols = settings.beats * settings.subdivision;
    //Loop through each row.
    for (var colIndex = 1; colIndex <= settings.totalCols; colIndex++) {
        //Create the skeleton for the row.
        var col = $("<div>", {
            "class": "col col-"+ colIndex,
            "id": "col-"+ colIndex
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
  }

  function saveSelected() {
    console.log("");
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

  //Gets the values from each HTML <input> and assigns to the appropriate setting
  function getOptions() {
    $(".option").each( function(el) {
      var dataName = $(this).attr("data-option");
      var dataVal = $(this).val();
      //console.log($(this).val());
      if (dataName === "colInterval") {
        var milliseconds = Math.round((((60/dataVal)*1000)*100000)/100000)/settings.subdivision;
        //console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
        settings[dataName] = milliseconds;
      } else {
        settings[dataName] = dataVal;
      }
    });
  }

<<<<<<< HEAD
  //Start button <-> Stop Button 
  function toggleClicked() {
    if ($('.toggle').html() == 'Start') {
      $('.toggle').html('Stop');
      getOptions();
      settings.loopStatus = true;
      gridLoop();
    }
    else if ($('.toggle').html() == 'Stop') {
      $('.toggle').html('Start');
      settings.loopStatus = false;
    }
  }

  //Options and Settings
  function getOptions() {
    $(".option").each( function(el) {
      console.log($(this).val());
      if ($(this).val() !== ( undefined || "" ) ) {
        if ($(this).attr("data-option") === "colInterval") {
          var sixteenth = Math.round((((60/$(this).val())*1000)*100000)/100000)/4;
          console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
          settings[$(this).attr("data-option")] = sixteenth;
        } else {
          settings[$(this).attr("data-option")] = $(this).val();
        }
      }
    });
  }

=======
>>>>>>> beats-subdivisions
  //Loop through every column
  function gridLoop() {
    getOptions();
    if (settings.totalCols !== settings.defaultCols) {
      resetGrid();
    }
    insideLoop();
    function insideLoop() {
      if (settings.loopStatus) {
        settings.totalCols = settings.beats * settings.subdivision;
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
            insideLoop();        
          }
          else if (settings.currentCol == settings.totalCols + 1) {
            settings.currentCol = 1;
            insideLoop();
          }
         }, settings.colInterval);
      }
      else {
        settings.currentCol = 1;
        $(".box").removeClass("active");
        return;
      }
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


