console.log("loading map");

/*------- path -------*/

var hardness = 2;
var w = window.innerWidth;
var h = window.innerHeight;

var generate_Points = function(){

  var points = [];
  var n = 12 - hardness*2; // how many points
  var y_top = [h*0.05, h*0.45];
  var y_bottom = [h*0.55, h*0.95];

  // first one must be at x = 0. 60 is for hidding the beginning
  points.push(new Point(-60, Math.random()*(y_top[1]-y_top[0])+y_top[0]));
  for(var i = 1; i < n-1; i++){

    var x_range = [w/n*i, w/n*(i+1)];
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
  points.push(new Point(w+60, Math.random()*(y_bottom[1]-y_bottom[0])+y_bottom[0]));

  return points;

};

var path = new Path(generate_Points());
path.strokeWidth = 30;
path.strokeColor = 'black';
path.smooth();

/*------- royals -------*/

var offset = 0;
var royal = new Path.Circle(path.getPointAt(offset), 5);
royal.fillColor = 'red';
var royal_life = 1000;

function onResize(event) {
  // Whenever the window is resized, recenter the path:
  // path.position = view.center;
}

function onFrame(event) {
 
  offset++;
  royal.position = path.getPointAt(offset);
  calcAttack(royal);

}

/*------- slaves -------*/

var slaves = [];
var slave_centers = [];

function onMouseDown(event) {

  var s = new Path.Circle(event.point, 100);
  var c = new Path.Circle(event.point, 5);
  s.fillColor = new Color(178/255, 115/255, 37/255, 0.5);
  c.fillColor = new Color(178/255, 115/255, 37/255, 1);

  slaves.push(s);
  slave_centers.push(c);

}

function onMouseDrag(event) {
  
  var s = slaves[slaves.length-1];
  var c = slave_centers[slave_centers.length-1];
  s.position = new Point(event.point);
  c.position = new Point(event.point);

}

/*------- attack -------*/

var calcAttack = function(r){

  slaves.forEach(function(s){

    if(s.position.getDistance(r.position) < 100){

      harmRoyal(1);

    }

  });

}

var harmRoyal = function(harm){

  if(royal_life > 0){

    royal_life-=harm;
    royal.fillColor.brightness = royal_life/1000;
    
  }

}








