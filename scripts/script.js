//ready function - this script won't load until the dom has been loaded
$(function() {
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
  console.log(notesToPlay);
}

});


