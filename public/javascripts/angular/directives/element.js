app.directive('slave', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      element.css("background-color", attrs.color);

    }
  };
});

app.directive('royal', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      element.css("background-color", attrs.color);

    }
  };
});