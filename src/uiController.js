const formatNumber = function(num) {

  var numSplit, int, dec;

  num = num.toFixed(2);
  numSplit = num.split('.');

  int = numSplit[0];
  dec = numSplit[1];

  const endOfThousands = int.length - 3;
  const startOfHUndreds = int.length > 4 ? 2 : 1;

  if (int.length > 3) {
    int = `${int.substr(0, endOfThousands)},${int.substr(startOfHUndreds,3)}`;
  }

  return `${int}.${dec}`;
}

const UIController = (function() {

  const DOMStrings = {
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
  };

  const incomeHTMLMarkup = `
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

  const expenseHTMLMarkup = `
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

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    
    addListItem: function(newBudgetItem, newBudgetItemType) {
      var html, newHTML, htmlContainer;
      const isIncome = newBudgetItemType === 'inc';
      const isExpense = newBudgetItemType === 'exp';

      // create HTML string with placeholder text 
      if (isIncome) {
        html = incomeHTMLMarkup;
      } else if (isExpense) {
        html = expenseHTMLMarkup;     
      }

      newHTML = html.replace('%id%', newBudgetItem.id);
      newHTML = newHTML.replace('%description%', newBudgetItem.description);
      newHTML = newHTML.replace('%value%', formatNumber(newBudgetItem.value));

      htmlContainer = isIncome ? 
        DOMStrings.incomeContainer : 
        DOMStrings.expenseContainer;

      document.querySelector(htmlContainer).insertAdjacentHTML('beforeend', newHTML);
    },

    deleteListItem: function(itemID) {
      var el = document.getElementById(itemID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fieldsList, fieldsArrray;
      
      fieldsList = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      fieldsArrray = [ ...fieldsList ];

      fieldsArrray.forEach( inputField => {
        inputField.value = '';
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

export default UIController;