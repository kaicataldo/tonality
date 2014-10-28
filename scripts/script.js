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
  if (keepLoop === true) {
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
  if ($(column).children('.selected').html() == '1') {
      console.log('1');
  }
  if ($(column).children('.selected').html() == '2') {
      console.log('2');
  }
}

});


