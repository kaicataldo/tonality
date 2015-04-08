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
    },
    settingsHidden = false;

  //Initial setup
  createSoundPack();
  buildGrid();
  gridLayout();
  displaySettings();
  buttonOptions();

  //Create tempo knobs
  $('.tempo-knob').knob({
    'min': 1,
    'max': 240,
    'width': 78,
    'height': 66,
    'angleOffset': -125,
    'angleArc': 250,
    'fgColor': '#86c5da',
    'bgColor': '#666',
    'lineCap': 'round',
    'release': function (v) { setTempo('colInterval', v); }
  });

//Event Handlers
  //Toggles selected class
  $('body').on('click', '.box', boxSelected);

  //Event listeners for toggling Start/Stop
    //Click button
   $(".toggle").click(function() {
     toggleClicked();
   });

  //Press spacebar to Start/Stop
  $(window).keypress(function(e) {
    if (e.keyCode === 0 || e.keyCode == 32) {
      if ("activeElement" in document) {
      document.activeElement.blur();
      }
      toggleClicked();
    }
  });

  //Settings panel toggle animation
  $('.settings-toggle').click(function() {
    if (settingsHidden === false) {
      $('.settings-container').animate({bottom:'-168px'},500);
      $('.settings-toggle').html('O');
      $('.settings-toggle').addClass('settings-hover');
      settingsHidden = true;
    }
    else if (settingsHidden === true) {
      $('.settings-container').animate({bottom:'0'},500);
      $('.settings-toggle').html('X');
      $('.settings-toggle').removeClass('settings-hover');
      settingsHidden = false;
    }
  });

  //Reset button
  $(".reset").click(function() {
    $(".box").removeClass("selected");
    for (var i in settings.selectedBoxes) {
      settings.selectedBoxes[i] = [];
    }
  });

  //Measures/beats/subdivision settings
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
  });

//Settings Functions
  //Save which boxes selected
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

  //Start/Stop button toggle
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

  //Grays out min/max settings
  function buttonOptions() {
    if (settings.beats == 4) {
      $('.beats-container .plus').addClass('not-an-option');
      $('.beats-container .minus').removeClass('not-an-option');
    }
    else {
      $('.beats-container .minus').addClass('not-an-option');
      $('.beats-container .plus').removeClass('not-an-option');
    }
    if (settings.measures == 4) {
      $('.measures-container .plus').addClass('not-an-option');
      $('.measures-container .minus').removeClass('not-an-option');
    }
    else if (settings.measures == 1) {
      $('.measures-container .minus').addClass('not-an-option');
      $('.measures-container .plus').removeClass('not-an-option');
    }
    else {
      $('.measures-container .plus, .measures-container .minus').removeClass('not-an-option');
    }
    if (settings.subdivision == 5) {
      $('.subdivision-container .plus').addClass('not-an-option');
      $('.subdivision-container .minus').removeClass('not-an-option');
    }
    else if (settings.subdivision == 3) {
      $('.subdivision-container .minus').addClass('not-an-option');
      $('.subdivision-container .plus').removeClass('not-an-option');
    }
    else {
       $('.subdivision-container .plus, .subdivision-container .minus').removeClass('not-an-option');
    }
  }

  //Set tempo setting
  function setTempo(dataName, dataVal) {
    var milliseconds = Math.round((((60/dataVal)*1000)*100000)/100000)/settings.subdivision;
        //console.log("Sixteenth is precisely "+sixteenth+" milliseconds");
        settings[dataName] = milliseconds;
  }

  //Set beats/measures/subdivision setting
  function settingsChange(settingsType, settingsVal) {
    if (settingsType == 'beats') {
      if (settingsVal == 'plus') {
        if (settings.beats < 4) {
          settings.beats++;
          buildGrid();
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.beats > 3) {
          settings.beats--;
          buildGrid();
        }
      }
    }
    if (settingsType == 'measures') {
      if (settingsVal == 'plus') {
        if (settings.measures < 4) {
          settings.measures++;
          buildGrid();
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.measures > 1) {
          settings.measures--;
          buildGrid();
        }
      }
    }
    else if (settingsType == 'subdivision') {
      if (settingsVal == 'plus') {
        if (settings.subdivision < 5) {
          settings.subdivision++;
          buildGrid();
        }
      }
      else if (settingsVal == 'minus') {
        if (settings.subdivision > 3) {
          settings.subdivision--;
          buildGrid();
        }
      }
    }
    gridLayout();
    displaySettings();
    buttonOptions();
  }
  
  //Applies class for layout
  function gridLayout() {
    $('.grid').removeClass().addClass('grid');
    if (settings.beats == 3) {
      if (settings.subdivision == 4) {
        $('.grid').addClass('grid-3-4');
      }
      else if (settings.subdivision == 3) {
        $('.grid').addClass('grid-3-3');
      }
      else if (settings.subdivision == 5) {
        $('.grid').addClass('grid-3-5');
      }
    }
    else if (settings.beats == 4) {
      if (settings.subdivision == 4) {
        $('.grid').addClass('grid-4-4');
      }
      else if (settings.subdivision == 3) {
        $('.grid').addClass('grid-4-3');
      }
      else if (settings.subdivision == 5) {
        $('.grid').addClass('grid-4-5');
      }
    }
    gridMeasuresLayout();
  }

  //Fixes grid alignment based on number of measures
  function gridMeasuresLayout() {
    if (settings.measures == 1) {
      $('.grid').css({ 
        'text-align': 'center',
        'display': 'block'
      });
    }
    if (settings.measures != 1) {
      $('.grid').css({ 
        'text-align': 'initial',
        'display': 'inline-block'
      });
    }
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
    for (var soundIndex = 1; soundIndex<=16; soundIndex++) {
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

  //Loop through every column and find selected boxes
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