app.controller('mapCtrl', function ($scope) {

  $scope.init = function(){

    $scope.slaves = globals.data.slaves;
    $scope.slave_names = Object.keys($scope.slaves);
    $scope.royals = globals.data.royals;
    $scope.royal_names = Object.keys($scope.royals);
    $scope.current_slave = 0;

  }
  $scope.togglePause = function($event){

    globals.is_paused = !globals.is_paused;
    console.log($event);
    if(globals.is_paused) $($event.target).attr("icon", "play"); 
    else $($event.target).attr("icon", "pause"); 

  }
  $scope.chooseSlave = function(s, i){

    globals.current_slave = s;
    $scope.current_slave = i;
    
  }
  
});