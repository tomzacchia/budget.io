var budgetController = (function() {

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

  var data = {
    allItems: {
      exp: {},
      inc: {},      
    },
    totals: {
      exp: 0,
      inc: 0      
    }
  };


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
    }
  }

})();



var UIController = (function() {

  // we store dom class names here in case they change in the future
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  }

  return {
    getInput: function() {
      return {
        // either inc or exp
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
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
      
      // returns a list
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArrray = [ ...fields ];

      fieldsArrray.forEach( el => {
        el.value = '';
      })

      fieldsArrray[0].focus();
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
    var input, newItem;
  
    // 1. Get input data
    input = UICtrl.getInput();

    // 2. Add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the new item to the UI
    UIController.addListItem(newItem, input.type);
    UIController.clearFields();

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