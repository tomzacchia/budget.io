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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);      
    } else {
      this.percentage = -1;
    }
  };

  // Expense.prototype.getPercentage = function() {
  //   return this.percentage;
  // }

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

    deleteItem: function(type, id) {
      delete data.allItems[type][id];
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

    calculatePercentages: function() {
      Object.keys(data.allItems.exp).forEach( key => {
        data.allItems.exp[key].calcPercentage(data.totals.inc);
      })
    },

    getBudget: function() {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentageExp
      }
    },

    getPercentages: function() {
      var percentages = Object.values(data.allItems.exp).map( el => {
        return {
          id: el.id,
          percentage: el.percentage
        }
      })

      return percentages;
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
    percentage: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentage: '.item__percentage',
    monthText: '.budget__title--month'
  }

  var formatNumber = function(num) {

    var numSplit, int, dec;

    num = num.toFixed(2);
    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = `${int.substr(0, int.length - 3)},${int.substr(1,3)}`;
    }

    return `${int}.${dec}`;
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
          <div class="item clearfix" id="inc-%id%">
            <div class="item__description"> %description% </div>
            <div class="right clearfix">
              <div class="item__value"> + %value% </div>
              <div class="item__delete">
                  <button class="item__delete--btn">
                    <i class="far fa-times-circle"></i>
                  </button>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'exp') {
        html = `
          <div class="item clearfix" id="exp-%id%">
            <div class="item__description"> %description% </div>
            <div class="right clearfix">
                <div class="item__value"> - %value% </div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn">
                      <i class="far fa-times-circle"></i>
                    </button>
                </div>
            </div>
          </div>
        `;     
      }

      // Replace placeholder text with newItem data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', formatNumber(obj.value));

      // Insert HTML into DOM
      htmlContainer = type === 'inc' ? 
        DOMStrings.incomeContainer : 
        DOMStrings.expenseContainer;
      document.querySelector(htmlContainer).insertAdjacentHTML('beforeend', newHTML);
    },

    deleteListItem: function(itemID) {
      var el = document.getElementById(itemID);
      el.parentNode.removeChild(el);
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
      document.querySelector(DOMStrings.netBudget).textContent = formatNumber(obj.budget);
      document.querySelector(DOMStrings.totalIncome).textContent = formatNumber(obj.totalInc);
      document.querySelector(DOMStrings.totalExpense).textContent = formatNumber(obj.totalExp);
      document.querySelector(DOMStrings.percentage).textContent = `${obj.percentage}%`;
    },

    displayPercentages: function(percentagesArray) {
      var fields = [...document.querySelectorAll(DOMStrings.expensesPercentage)];

      fields.forEach( (field, index) => {
        field.textContent = percentagesArray[index].percentage + '%';
      })
    },

    displayMonth: function() {
      var date, month, year, monthMap;

      date = new Date();
      monthMap = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ]

      month = monthMap[date.getMonth()];
      year = date.getFullYear();

      document.querySelector(DOMStrings.monthText).textContent = `${month}, ${year}`;
    },

    changedType: function() {
      var fields = document.querySelectorAll(`
        ${DOMStrings.inputType},
        ${DOMStrings.inputDescription},
        ${DOMStrings.inputValue}
      `);

      fields = [...fields];

      var btn = document.querySelector(DOMStrings.inputBtn);

      fields.forEach(el => {
        el.classList.toggle('red-focus');
      });
      btn.classList.toggle('red');
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