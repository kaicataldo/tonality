$(function() {
  var settings = {
    soundPack: [],
    fadeInVal: 0,
    fadeOutVal: null,
    loopStatus: null,
    currentCol: 1,
    colInterval: 120,
    measures: 1,
    beats: 4,
    subdivision: 4,
    defaulCols: 16,
    totalCol: 16,
    selectedBoxes: {}
  };

  //Initial setup
  createSoundPack();
  buildGrid();
  displaySettings();

  //Create settings knobs + knob event handlers
  $('.tempo-knob').knob({
    'min': 1,
    'max': 240,
    'width': 80,
    'angleOffset': -125,
    'angleArc': 250,
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
  $(".reset").click(function() {
    $(".box").removeClass("selected");
    for (var i in settings.selectedBoxes) {
      settings.selectedBoxes[i] = [];
    }
  });

  //Measures/Beats/Subdivision settings
  $('.settings-button').click(function() {
    var settingsOption = $(this).attr('data-option');

    if ($(this).hasClass('settings-beats')) {
      settingsChange('beats', settingsOption);
    }
    else if ($(this).hasClass('settings-measures')) {
      settingsChange('measures', settingsOption);
    }
    else if ($(this).hasClass('settings-subdivision')) {
      settingsChange('subdivision', settingsOption);
    }
    buildGrid();
  });

//Settings Functions
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

  //Set tempo
  function setTempo(dataName, dataVal) {
    var milliseconds = Math.round((((60/dataVal)*1000)*100000)/100000)/settings.subdivision;
        //console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
        settings[dataName] = milliseconds;
  }

  //Set Beats/Measures/Subdivision
  function settingsChange(settingsType, settingsVal) {
    if (settingsType == 'beats') {
      if (settingsVal == 'plus') {
        if (settings.beats < 4) {
          settings.beats++;
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.beats > 3) {
          settings.beats--;
        }
      }
    }
    if (settingsType == 'measures') {
      if (settingsVal == 'plus') {
        if (settings.measures < 4) {
          settings.measures++;
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.measures > 1) {
          settings.measures--;
        }
      }
    }
    else if (settingsType == 'subdivision') {
      if (settingsVal == 'plus') {
        if (settings.subdivision < 5) {
          settings.subdivision++;
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.subdivision > 3) {
          settings.subdivision--;
        }
      }
    }
    displaySettings();
  }
  
  //Display settings values
  function displaySettings() {
    if (settings.subdivision == 3) {
      $('.display-subdivision').html('Triplets');
    }
    else if (settings.subdivision == 4) {
      $('.display-subdivision').html('Sixteenths');
    }
    else if (settings.subdivision == 5) {
      $('.display-subdivision').html('Quintuplets');
    }
    $('.display-beats').html(settings.beats);
    $('.display-measures').html(settings.measures);
  }

//Tonal Sequencer Functions
  //Dynamically create sound file references
  function createSoundPack() {
    for(var soundIndex = 1; soundIndex<=16; soundIndex++) {
      settings.soundPack[soundIndex-1] = new Howl({
        urls: ['media/'+soundIndex+'.ogg', 'media/'+soundIndex+'.mp3'],
        fadeIn: settings.fadeInVal,
        fadeOut: settings.fadeOutVal,
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
    settings.currentCol = 1;
    findDownbeat();
    console.log(settings.selectedBoxes);
  }

  //Marks downbeats
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

  //Populates grid with selected boxes
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
        playSound();
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
  function playSound() {
    var notesToPlay = settings.selectedBoxes["col" + settings.currentCol];
    for (var i = 0; i < notesToPlay.length; i++) {
      var soundToPlay = eval("settings.soundPack[" + (notesToPlay[i]-1) + "]");
      soundToPlay.play();
    }
    notesToPlay = [];
  }

});