window.globals = {};

globals.is_paused = false;

// globals.HOST_NAME = "http://localhost:32382";
// globals.HOST_NAME = "http://tower-defense-eecamp.herokuapp.com";
globals.getData = function (){

  var req = null;

  req = new XMLHttpRequest();
  req.open( "GET", "/data", false );
  req.send( null );
  return JSON.parse(req.responseText);

};
globals.data = globals.getData();

globals.current_slave = 'slave';

globals.MAX_SLAVES = 5;
globals.changeBreadNum = function(n){
  document.getElementById('bread').innerHTML = n;
}
globals.changeRoyalPassed = function(n){
  document.getElementById('royals_passed').innerHTML = n + "/5";
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

globals.showResult = function(is_win){

  globals.is_paused = true;
  if(is_win){

    $.post("/win", {
      team: this.data.stage_data.team, 
      stage: this.data.stage_data.stage
    }, function(data){
      $("#result .info").html("任務成功");
      $("#result .reward").html("你得到的密碼片段：" +　data);
      $("#result").show();
    });

  }
  else {

    $("#result").show();

  }

}












