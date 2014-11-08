$(function() {
  var settings = {
    soundPack: [],
    fadeInVal: 0,
    fadeOutVal: null,
    loopStatus: null,
    defVolume: .5,
    downbeatVol: 1,
    currentCol: 1,
    colInterval: 120,
    measures: 1,
    beats: 4,
    subdivision: 4,
    defaulCols: 16,
    totalCol: 16,
    selectedBoxes: {}
  };

//Setup
  createSoundPack();
  buildGrid();

  //Renders Tempo knob
  $(".knob").knob({
    'min': 1,
    'max': 240,
    'width': 100,
    'change': function (v) { setTempo('colInterval', v) },
    'release': function (v) { setTempo('colInterval', v) }
  });

//Event Handlers
  //Toggles selected class
  $('body').on('click', '.box', boxSelected);

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
    for (var i in settings.selectedBoxes) {
      settings.selectedBoxes[i] = [];
    }
  });
    
  //Measures/Beats/Subdivision listeners
  $('.measures-container input').on('change', function() {
    settings.measures = $('input[name="measures"]:checked', '.measures-container').val(); 
    buildGrid();
  });

  $('.beats-container input').on('change', function() {
    settings.beats = $('input[name="beats"]:checked', '.beats-container').val(); 
    buildGrid();
  });

  $('.subdivision-container input').on('change', function() {
    settings.subdivision = $('input[name="subdivision"]:checked', '.subdivision-container').val(); 
    //console.log("Subdivision is now: "+settings.subdivision);
    buildGrid();
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

  //Dynamically create sound file references
  function createSoundPack() {
    for(var soundIndex = 1; soundIndex<=16; soundIndex++) {
      settings.soundPack[soundIndex-1] = new Howl({
        urls: ['media/'+soundIndex+'.ogg', 'media/'+soundIndex+'.mp3'],
        fadeIn: settings.fadeInVal,
        fadeOut: settings.fadeOutVal,
        volume: settings.defVolume,
      });
    }
  }

  //Dynamically build HTML grid
  function buildGrid() {
    var container = $(".grid");
    $(".grid").html("");
    settings.totalCol = settings.measures * settings.beats * settings.subdivision;
    //Loop through each row.
    for (var colIndex = 1; colIndex <= settings.totalCol; colIndex++) {
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
            "data-col": colIndex,
            "data-row": rowIndex,
        });
        //Append to the row div.
        col.append(row);
      }
      //Finally append this row to the container.
      container.append(col);

      if ((settings.selectedBoxes["col"+colIndex] != undefined) || (settings.selectedBoxes["col"+colIndex] != null)){
        console.log(settings.selectedBoxes["col"+colIndex]);
        populateColNotes(colIndex, settings.selectedBoxes["col"+colIndex]);
      } else {
        settings.selectedBoxes["col"+colIndex] = [];
      }
    }
    findDownbeat();
    console.log(settings.selectedBoxes);
  }

  function findDownbeat() {
    var markedColumns = $('.grid').find(".col");
    var measureMarkers = settings.beats * settings.subdivision;

    $(markedColumns).children().removeClass('downbeat downbeat-measure');
    for (var i = 0; i < markedColumns.length; i++ ) {
      if (i % settings.subdivision === 0) {
        $(markedColumns[i]).children().addClass('downbeat');
        //console.log(i + "downbeats");
      }
    }
    for (var j = 0; j < markedColumns.length; j++ ) {
      if (j % measureMarkers === 0) {
        //console.log(j + "measure beats");
        $(markedColumns[j]).children().addClass('downbeat-measure');
      }
    }
  }

  function populateColNotes(col, array) {
    for (var i = 0; i < array.length; i++) {
      console.log("i is: "+i);
      console.log("Col is: "+col);
      console.log("Row is: "+array[i]);
      var selector = $(".col-"+col).find(".row-"+array[i]).addClass("selected");
      console.log(selector);
    }
  }


  //Loop through every column
  function gridLoop() {
    if (settings.loopStatus) {
      settings.totalCol = settings.measures * settings.beats * settings.subdivision;
      setTimeout( function() {
        $(".col-" + settings.currentCol).children().toggleClass("active");
        if (settings.currentCol === 1) {
          $(".col-" + settings.totalCol).children().removeClass("active");
        }
        else {
          $(".col-"+(settings.currentCol - 1)).children().removeClass("active");
        }
        //
        if ( (settings.currentCol === 1) || (settings.currentCol % settings.subdivision === 0) ) {
          playSound(settings.downbeatVol);
        } else {
          playSound(settings.defVolume);
        }
        settings.currentCol++;
        if (settings.currentCol <= settings.totalCol){
          gridLoop();        
        }
        else if (settings.currentCol == settings.totalCol + 1) {
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
  function playSound(noteVol) {
    var notesToPlay = settings.selectedBoxes["col" + settings.currentCol];
    for (var i = 0; i < notesToPlay.length; i++) {
      var soundToPlay = eval("settings.soundPack[" + (notesToPlay[i]-1) + "]");
      soundToPlay.play();
      soundToPlay.volume(noteVol);
    }
    notesToPlay = [];
  }


  //Set tempo
  function setTempo(dataName, dataVal) {
    var milliseconds = Math.round((((60/dataVal)*1000)*100000)/100000)/settings.subdivision;
        //console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
        settings[dataName] = milliseconds;
  }

  //When Box is Selected
  function boxSelected() {
    var col = $(this).attr('data-col');
    var row = $(this).attr('data-row');
    var array = settings.selectedBoxes["col"+col];
    if (array.indexOf(row) !== -1) {
      array.splice(array.indexOf(row), 1);
    } else {
      array.push(row);
    }
    $(this).toggleClass("selected");
  }

});