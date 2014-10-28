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

/*

activeBoxes = {
  column1 = [row-3, row-9],
  column2 = [],
  column3 = 
   
*/


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
      $(".col-" + i).toggleClass("active");
      if (i == 1) {
        $(".col-16").removeClass("active");
      }
      else {
        $(".col-" + (i - 1)).toggleClass("active");
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

function playSound(){
  return;

}


});


/*

Col[1]Row[1]

activeBoxes = {
  column1 = [row-3, row-9],
  column2 = [],
  column3 = [],
}

}

    
*/


