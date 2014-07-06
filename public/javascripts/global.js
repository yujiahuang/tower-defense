window.globals = {};

globals.is_paused = false;

// globals.HOST_NAME = "http://localhost:32382";
globals.HOST_NAME = "http://tower-defense-eecamp.herokuapp.com";
globals.getData = function (){

  var req = null;

  req = new XMLHttpRequest();
  req.open( "GET", this.HOST_NAME + "/data", false );
  req.send( null );
  return JSON.parse(req.responseText);

};
globals.data = globals.getData();

globals.current_slave = 'slave';

globals.MAX_SLAVES = 5;
globals.changeSlaveNum = function(n){
  document.getElementById('remaining_slave').innerHTML = n;
}

globals.attackAnimation = function(from, to){
  
  var $attack = $("<div>");
  $attack.addClass("attack");
  $attack.css({
    top: from.y,
    left: from.x
  });
  $("#wrapper").append($attack);
  $attack.animate({
    top: to.y,
    left: to.x
  }, 500, "linear", function(){
    this.remove();
  });

}












