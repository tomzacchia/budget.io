/*
--------------------------------------------------------------
  budget controller
--------------------------------------------------------------
*/
var budgetController = (function() {

  var data = {
    allItems: {
      exp: {},
      inc: {},      
    },
    totals: {
      exp: 0,
      inc: 0      
    },
    budget: 0,
    percentageExp: 0
  };

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = Object.values(data.allItems[type]).reduce( (acc, el) => {
      return acc += el.value;
    }, 0);

    data.totals[type] = sum;
  } 

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      ID = '_' + Math.random().toString(36).substr(2, 9);
      // https://gist.github.com/gordonbrander/2230317

      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      data.allItems[type][ID] = newItem;

      return newItem;
    },

    calculateBudget: function() {
      // calculate total income and expenses at the same time to update %
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate budget
      data.budget = data.totals.inc - data.totals.exp;

      // calculate % of income that is an expense
      if (data.totals.inc > 0) {
        data.percentageExp = Math.round((data.totals.exp / data.totals.inc) * 100);
      };
      
    },

    getBudget: function() {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentageExp
      }
    },

    testing: function() {
      return data;
    }
  }

})();




/*
--------------------------------------------------------------
  UI controller
--------------------------------------------------------------
*/
var UIController = (function() {

  // we store dom class names here in case they change in the future
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    netBudget: '.budget__value',
    totalIncome: '.budget__income--value',
    totalExpense: '.budget__expenses--value',
    percentage: '.budget__expenses--percentage'
  }

  return {
    getInput: function() {
      return {
        // either inc or exp
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    
    addListItem: function(obj, type) {
      var html, newHTML, htmlContainer;

      // create HTML string with placeholder text 
      if (type === 'inc') {
        html = `
          <div class="item clearfix" id="income-%id%">
            <div class="item__description"> %description% </div>
            <div class="right clearfix">
              <div class="item__value"> + %value% </div>
              <div class="item__delete">
                  <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                  </button>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'exp') {
        html = `
          <div class="item clearfix" id="expense-%id%">
            <div class="item__description"> %description% </div>
            <div class="right clearfix">
                <div class="item__value"> - %value% </div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn">
                      <i class="ion-ios-close-outline"></i>
                    </button>
                </div>
            </div>
          </div>
        `;     
      }

      // Replace placeholder text with newItem data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      // Insert HTML into DOM
      htmlContainer = type === 'inc' ? 
        DOMStrings.incomeContainer : 
        DOMStrings.expenseContainer;
      document.querySelector(htmlContainer).insertAdjacentHTML('beforeend', newHTML);
    },

    clearFields: function() {
      var fields, fieldsArrray;
      
      // returns a list, convert to array
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      fieldsArrray = [ ...fields ];

      fieldsArrray.forEach( el => {
        el.value = '';
      })

      fieldsArrray[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMStrings.netBudget).textContent = obj.budget;
      document.querySelector(DOMStrings.totalIncome).textContent = obj.totalInc;
      document.querySelector(DOMStrings.totalExpense).textContent = obj.totalExp;
      document.querySelector(DOMStrings.percentage).textContent = `${obj.percentage}%`;
    },

    getDOMString: function() {
      return DOMStrings; // exposing DOMStrings to the public
    }
  }

})();





/*
--------------------------------------------------------------
  Controller
--------------------------------------------------------------
*/
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
    }

  }

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
      })      
    }
  }

})(budgetController, UIController);

controller.init();