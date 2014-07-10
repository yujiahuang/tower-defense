app.controller('stageCtrl', function ($scope, $http) {

  function range(from, to){

    var arr = [];
    for(var i = from; i <= to; i++){

      arr.push(i);

    }
    return arr;

  }

  function randomColors(num){

    var colors = [];
    var color_range = [100, 240];
    var sl = ", 60%, 70%)";
    var h = Math.floor( (Math.random() * color_range[1]) + color_range[0] );
    colors.push("hsl(" + h + sl);
    for(var i = 0; i < num-1; i++){

      h += ((color_range[1]-color_range[0]) / num);
      colors.push("hsl(" + h + sl);

    }
    colors = randomize(colors);

    return colors;

  }

  function randomize(array){

    var l = array.length;
    for(var i = 0; i < 100; i++){

      var a = Math.floor(Math.random()*l);
      var b = Math.floor(Math.random()*l);
      var tmp = array[a];
      array[a] = array[b];
      array[b] = tmp;

    }
    return array;

  }

  $scope.init = function(){

    $scope.colors = randomColors(12);
    $scope.chosen_team = 0;
    $scope.chosen_stage = 0;
    $scope.choosing_team = true;

  }

  $scope.chooseTeam = function(i){

    $scope.chosen_team = i;
    console.log($scope.chosen_team);
    $scope.choosing_team = false;
    $scope.colors = randomColors(15);

  }
  
  $scope.chooseStage = function(i){

    $scope.chosen_stage = i;
    $http({
      url: '/choose',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { team: $scope.chosen_team, stage: $scope.chosen_stage }
    }).success(function(data, status) {
      window.location.replace('/game');
    }).
    error(function(data, status) {

    });


  }




});