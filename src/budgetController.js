const budgetController = (function() {

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

export default budgetController;