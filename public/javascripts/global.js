window.globals = {};

globals.is_paused = false;
globals.HOST_NAME = "http://localhost:32382";
globals.getData = function (){

  var req = null;

  req = new XMLHttpRequest();
  req.open( "GET", this.HOST_NAME + "/data", false );
  req.send( null );
  return JSON.parse(req.responseText);

};
globals.data = globals.getData();