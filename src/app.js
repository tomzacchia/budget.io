import budgetController from './budgetController';
import UIController from './uiController';

const controller = (function(budgetCtrl, UICtrl) {

  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMString();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // event delegation
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  }

  var ctrlAddItem = function() {
    var input, newItem;
  
    // 1. Get input data
    input = UICtrl.getInput();

    if (input.description && input.value > 0)  {
      // 2. Add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the new item to the UI
      UIController.addListItem(newItem, input.type);
      UIController.clearFields();

      // 4. Calculate and update budget
      updateBudget();
      updatePercentages();
    }

  }

  var ctrlDeleteItem = function(event) {
    var itemDataset, splitID, type, budgetItemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-_2qnlw1uq0
      splitID = itemID.split('-');
      type = splitID[0];
      budgetItemID = splitID[1];

      // 1. Delete item from data structure
      budgetCtrl.deleteItem(type, budgetItemID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show budget
      updateBudget();
      updatePercentages();
    }

  }

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read from budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetController.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Update budget in UI
    UICtrl.displayBudget(budget);
  }

  return {
    init: function() {
      console.log('App has started');
      setUpEventListeners();

      UICtrl.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: 0
      });
      
      UICtrl.displayMonth();
    }
  }

})(budgetController, UIController);

controller.init();