var budgetController = (function() {

  // some code

})();



var UIController = (function() {

  // some code

})();



var controller = (function(budgetCtrl, UICtrl) {

  var ctrlAddItem = function() {
    // 1. Get input data

    // 2. Add item to the budget controller

    // 3. Add the new item to the UI

    // 4. Calculate the budget

    // 5. Update budget in UI
    console.log('set up successful');
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);