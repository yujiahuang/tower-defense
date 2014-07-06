var HARDNESS = 2; // could be 0 to 5. 5 would generate a freaking straight road.
var MAGIC_NUM = 32382;
var remaining_slaves = globals.MAX_SLAVES;

var data;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var path;
var royals = [];
var slaves = [];
var next_royal_frame = 0;
var accumulator = 0;

init();

function init(){

  // generate path

  path = new Path(generatePoints());
  path.strokeWidth = 30;
  path.strokeColor = 'black';
  path.smooth();

  // get data
  data = globals.data;

}

/*------- data structure -------*/

function Royal (type) {

  var d = data['royals'][type];
  var appearance = new Path.Circle(path.getPointAt(0), 5);
  appearance.fillColor = d.color;

  // properties
  this.offset = 0;
  this.health = d.health;
  this.appearance = appearance;
  this.center = appearance.position;
  this.speed = d.speed;
  this.attack = d.attack;

  // methods
  this.changePosition = function(new_position){

    this.center = new_position;
    this.appearance.position = new_position;

  };

}

function Slave(type, position) {

  var d = data['slaves'][type];
  var range = d['range'];
  var outer_circle = new Path.Circle(position, range);
  var inner_circle = new Path.Circle(position, 5);
  outer_circle.fillColor = d.color;
  outer_circle.opacity = 0.5;
  inner_circle.fillColor = d.color;

  // properties
  this.attack = d.attack;
  this.health = d.health;
  this.center = position;
  this.inner_circle = inner_circle;
  this.outer_circle = outer_circle;
  this.range = range;
  this.accumulator = 0;

  // methods
  this.changePosition = function(new_position){

    this.center = new_position;
    this.inner_circle.position = new_position;
    this.outer_circle.position = new_position;

  };
  this.hideOuterCircle = function(){

    this.outer_circle.visible = false;

  };

}

/*------- generate path -------*/

function generatePoints(){

  var points = [];
  var n = 12 - HARDNESS*2; // how many points
  var y_top = [HEIGHT*0.05 + 55, HEIGHT*0.45]; // 55 is to leave space for toolbox
  var y_bottom = [HEIGHT*0.55, HEIGHT*0.95];

  // first one must be at x = 0. 60 is for hidding the beginning
  points.push(new Point(-60, Math.random()*(y_top[1]-y_top[0])+y_top[0]));
  for(var i = 1; i < n-1; i++){

    var x_range = [WIDTH/n*i, WIDTH/n*(i+1)];
    var y_range;
    if(i%2)
      y_range = y_bottom;
    else
      y_range = y_top;

    var x = Math.random()*(x_range[1]-x_range[0])+x_range[0];
    var y = Math.random()*(y_range[1]-y_range[0])+y_range[0];
    points.push(new Point(x, y));

  }
  // last one must be at x = w;
  points.push(new Point(WIDTH+60, Math.random()*(y_bottom[1]-y_bottom[0])+y_bottom[0]));

  return points;

};

/*------- GET data -------*/

function getData(){

  var req = null;

  req = new XMLHttpRequest();
  req.open( "GET", HOST_NAME + "/data", false );
  req.send( null );
  data = JSON.parse(req.responseText);
  console.log(data);

}

/*------- generate royals -------*/

function onResize(event) {
  // Whenever the window is resized, recenter the path:
  // path.position = view.center;
}

function onFrame(event) {
 
  if(!globals.is_paused){

    // move royals and calculate royals' health
    var alive_royals = [];
    royals.forEach(function(r, i){

      // move royals
      r.offset += r.speed;
      r.changePosition(path.getPointAt(r.offset));

      //
      slaves.forEach(function(s, i){

        s.accumulator++;
        if(s.accumulator > 60) s.accumulator = 0;

      });

      // collect alive royals
      if(calcAttack(r, i) > 0 && r.offset < path.length){

        alive_royals.push(r);

      }

    });
    royals = alive_royals;
    console.log(royals.length);

    // generate royals
    if(accumulator == next_royal_frame){
     
      randomRoyal();
      // 18 seconds with 60 fps
      next_royal_frame = Math.floor(Math.random() * (18*60/(HARDNESS+1)) + 1);
      accumulator = 0;

    }
    accumulator++;

  }  
}

function randomRoyal(){

  var keys = Object.keys(data.royals);
  var r = Math.floor(Math.random() * keys.length);

  var royal = new Royal(keys[r]);
  royals.push(royal);

  // window.setTimeout(randomRoyal, 18000/(HARDNESS+1));

}


/*------- define slaves -------*/

function onMouseDown(event) {

  if(!globals.is_paused && remaining_slaves > 0){

    var slave = new Slave(globals.current_slave, event.point);
    slaves.push(slave);

  }
}

function onMouseDrag(event) {
  
  if(!globals.is_paused && remaining_slaves > 0){

    var slave = slaves[slaves.length-1];
    slave.changePosition(event.point);

  }
}

function onMouseUp(event) {

  if(!globals.is_paused && remaining_slaves > 0){

    var slave = slaves[slaves.length-1];
    slave.hideOuterCircle();
    remaining_slaves--;
    globals.changeSlaveNum(remaining_slaves);

  }
}

/*------- calculate attack -------*/

var test = false;

function calcAttack(royal, index){

  var p = royal.center;
  var h = royal.health;
  var d_min = MAGIC_NUM;
  var i_min = MAGIC_NUM;
  if(slaves.length > 0){

    // find min
    for(var i = 0; i < slaves.length; i++){

      var d = slaves[i].center.getDistance(p);
      var a = slaves[i].accumulator;
      if(d < d_min && a == 0){

        d_min = d;
        i_min = i;

      }
    }

    if(i_min != MAGIC_NUM && d_min < slaves[i_min].range){// && slaves[i_min].accumulator == 0){

      h = harmRoyal(royal, slaves[i_min].attack);
      var future_royal = path.getPointAt(royal.offset + 20*royal.speed);
      globals.attackAnimation(slaves[i_min].center, future_royal);

    }
  }
  
  return h; // return the ramaining health of the royal

}

function harmRoyal(royal, harm){ // return the ramaining health of the royal

  if(royal.health > 0){

    royal.health-=harm;
    royal.appearance.fillColor.brightness = royal.health/1000;
    return royal.health;
    
  }
  else {

    return 0;

  }

}








