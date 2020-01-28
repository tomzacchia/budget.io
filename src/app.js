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

    input = UICtrl.getInput();

    if (input.description && input.value > 0)  {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      UIController.renderListItem(newItem, input.type);
      UIController.clearFields();

      updateBudget();
      updatePercentages();
    }

  }

  var ctrlDeleteItem = function(event) {
    var splitID, type, budgetItemID, itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
 
    if (itemID) {
      const positionOfType = 0;
      splitID = itemID.split('-');
      type = splitID[positionOfType];
      budgetItemID = splitID[positionOfID];

      budgetCtrl.deleteItem(type, budgetItemID);

      UICtrl.deleteListItem(itemID);

      updateBudget();
      updatePercentages();
    }

  }

  var updatePercentages = function() {
    budgetCtrl.calculatePercentages();

    var percentages = budgetCtrl.getPercentages();

    UICtrl.displayPercentages(percentages);
  };

  var updateBudget = function() {
    budgetController.calculateBudget();

    var budget = budgetCtrl.getBudget();

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