app.directive('button', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      element.css({
        "background-color": attrs.color,
        "z-index": Math.floor(Math.random()*24)
      });

    }
  };
});