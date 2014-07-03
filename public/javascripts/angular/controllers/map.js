app.controller('mapCtrl', function ($scope) {

  // $scope.pause = false;
  $scope.togglePause = function(){

    // $scope.pause = !$scope.pause;
    is_paused = !is_paused;
    console.log(is_paused);
    // togglePause();

  }
  
});