var HARDNESS = globals.data.info.hardness;
// could be 0 to 5. 5 would generate a freaking straight road.
var MAGIC_NUM = 32382;
var ROYALS_ALLOWED = 5;
var TOTAL_ROYALS = 10 + 5 * HARDNESS;

var data;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var path;
var royals = [];
var slaves = [];
var dying_royals = [];
var next_royal_frame = 0;
var accumulator = 0;
var royal_passed = 0;
var remaining_royals = TOTAL_ROYALS;

var bread = globals.data.info.bread;

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
  this.type = type;
  this.death_count_down = 30;

  // methods
  this.move = function(){
    this.offset += this.speed;
    var new_position = path.getPointAt(this.offset);
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
  this.accumulator = 1;
  this.can_attack = false;

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

  return randomPoints();

};

function randomPoints(){

  var points = [];
  var n = 12 - HARDNESS*2; // how many points
  var y_top = [HEIGHT*0.05 + 86, HEIGHT*0.45]; // add a constant to leave space for toolbox
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

}

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


}

function onFrame(event) {
 
  if(!globals.is_paused){

    // move dying royals
    var not_yet_heaven = [];
    dying_royals.forEach(function(r, i){

      r.move();
      r.death_count_down--;
      if(r.death_count_down >　0) not_yet_heaven.push(r);

    });
    dying_royals = not_yet_heaven;

    // move royals and calculate royals' health
    var alive_royals = [];
    royals.forEach(function(r, i){

      // move royals
      r.move();

      // increment accumulator
      slaves.forEach(function(s, i){

        if(s.can_attack) s.accumulator++;
        if(s.accumulator > 60) s.accumulator = 0;

      });

      // collect alive royals
      if(calcAttack(r, i) > 0){

        if(r.offset < path.length) alive_royals.push(r);
        else {

          r.appearance.opacity = 0;
          royal_passed++;
          globals.changeRoyalPassed(royal_passed);
          if(royal_passed >= ROYALS_ALLOWED) lose();

        }

      }
      else {

        dying_royals.push(r);
        var range = data.royals[r.type].bread_range;
        bread += Math.floor(Math.random() * range[1] + range[0]);
        globals.changeBreadNum(bread);

      }

    });
    royals = alive_royals;
    console.log("alive: " +　royals.length);

    // generate royals
    if(remaining_royals > 0){

      if(accumulator == next_royal_frame){

        randomRoyal();
        // 18 seconds with 60 fps
        next_royal_frame = Math.floor(Math.random() * (18*60/(HARDNESS+1)) + 1);
        accumulator = 0;

        remaining_royals--;

      }
      accumulator++;

    }

    // check for win
    if(dying_royals.length == 0 && royals.length == 0 && remaining_royals == 0) win();

  }  
}

function randomRoyal(){

  // var keys = Object.keys(data.royals);
  var weighted_keys = getWeightedRoyals(data.royals);
  var r = Math.floor(Math.random() * weighted_keys.length);

  var royal = new Royal(weighted_keys[r]);
  console.log(weighted_keys[r]);
  royals.push(royal);

}

function getWeightedRoyals(hash){

  var weighted = [];
  for(var key in hash){

    for(var i = 0; i < hash[key].probability_weight; i++){

      weighted.push(key);

    }
  }
  console.log(weighted);

  return weighted;

}

/*------- define slaves -------*/

function onMouseDown(event) {

  var bread_needed = data.slaves[globals.current_slave].bread;
  if(!globals.is_paused && bread >= bread_needed){

    var slave = new Slave(globals.current_slave, event.point);
    slaves.push(slave);

  }
}

function onMouseDrag(event) {
  
  var bread_needed = data.slaves[globals.current_slave].bread;
  if(!globals.is_paused && bread >= bread_needed){

    var slave = slaves[slaves.length-1];
    slave.changePosition(event.point);

  }
}

function onMouseUp(event) {

  var bread_needed = data.slaves[globals.current_slave].bread;
  if(!globals.is_paused && bread >= bread_needed){

    var slave = slaves[slaves.length-1];
    slave.can_attack = true;
    slave.hideOuterCircle();
    bread -= bread_needed;
    globals.changeBreadNum(bread);

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

    if(i_min != MAGIC_NUM && d_min < slaves[i_min].range){

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
    if(royal.health < 0) royal.health = 0;
    window.setTimeout(function(){
      if(royal.health > 0) royal.appearance.opacity = royal.health*0.8/1000 + 0.2;
      else royal.appearance.opacity = 0;
    }, 500); // wait for the attack animation
    return royal.health;
    
  }
  else {

    return 0;

  }

}

/*------- win/lose -------*/

function lose(){

  console.log("You lose.");
  globals.showResult(false);

}

function win(){

  console.log("You win.");
  globals.showResult(true);

}



