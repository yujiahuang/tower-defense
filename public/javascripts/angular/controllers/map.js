app.controller('mapCtrl', function ($scope) {

  $scope.init = function(){

    $scope.slaves = globals.data.slaves;
    $scope.slave_names = Object.keys($scope.slaves);

  }
  $scope.togglePause = function(){

    globals.is_paused = !globals.is_paused;

  }
  
});