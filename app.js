var budgetController = (function() {
  // From the outside we do not have access to scope within this IIFE, by default variables and methods inside of IFFEs are private
;
  var x = 23;

  var add = function(a) {
    return x + a;
  }

  // inner functions always have access to outer function VO due to closure
  return {
    publicTest: function(b) {
      return add(b)
    }
  }

})();

var UIController = (function() {

  // some code

})();


var controller = (function(budgetCtrl, UICtrl) {

  var z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: function() {
      console.log(z);
    }
  }

})(budgetController, UIController);