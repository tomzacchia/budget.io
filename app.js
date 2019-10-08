var budgetController = (function() {

  // some code

})();



var UIController = (function() {

  // we store dom class names here in case they change in the future
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },
    
    getDOMString: function() {
      return DOMStrings; // exposing DOMStrings to the public
    }
  }

})();



var controller = (function(budgetCtrl, UICtrl) {

  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMString();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });    
  }

  var ctrlAddItem = function() {
    // 1. Get input data
    var input = UICtrl.getInput();
    console.log(input);

    // 2. Add item to the budget controller

    // 3. Add the new item to the UI

    // 4. Calculate the budget

    // 5. Update budget in UI
  }

  return {
    init: function() {
      console.log('App has started');
      setUpEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();