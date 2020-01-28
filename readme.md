# [Budget App](https://rawcdn.githack.com/tomzacchia/budget.io/f8eee35a0833ec027b1c18093ce3debebddaf32c/index.html)

![App](https://github.com/tomzacchia/budget.io/blob/master/Screen%20Shot%202019-11-20%20at%2011.53.20%20PM.png)

Budget.io is an applicaton made using HTML, CSS and JS and explores the concept of 
DOM manipulation using Vanilla JS. This project was created as part of the video series 
[The Complete Javascript Course 2019 by Jonas Schmedtmann](https://www.udemy.com/course/the-complete-javascript-course/).

# Lessons learned
- **Advanced JS Concepts**:  Throughout working on this project it became evident that in the past I had taken a lot of advanced JS concepts for granted, such as closures, IIFEs, Modueles etc... Jonas does a great job of explaining these concepts in depth, which allowed me to make use of them throughout the application. What I enjoyed most about working on the application was the use of Modules, in particular how the use of Modules allows developers to separate concerns and isolate code.
- **UI Flow Diagrams**: It is very easy to get lost in the big picture when starting a project. There tends to be a lot of overthinking, which delays the coding process. I'm not trying to say that one should always jump straight into code, however getting lost in the weeds is equally unproductive. The architecture planning that was done prior to coding helped to overcome this hurdle and provides a reference throughout the coding process. [UI Flow Diagaram](https://github.com/tomzacchia/budget.io/blob/dev/References/part%201%20architecture.png)

# The Great Refactor
I recently started reading Code Clean by Robert C. Martin, aka Uncle Bob, and a lot of the material made me reflect on some projects that I have done in the past. This project sat in a corner collecting dust and I finally had the bravery to go through the code to see where things could be improved, and believe me there was a lot mediocre code that I regret writing. To illustrate this point I will attach a function that was one of the first to be refactored.

```javascript
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
```

## Refactored to:

```javascript
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
```

I remember reading the following line
```javascript 
int = `${int.substr(0, int.length - 3)},${int.substr(1,3)}`; 
```
and thinking to myself: "What the hell does int.length-3 represent and why were the integer values 1 and 3 chosen". Needless to say im embarrassed to admit that it took me a few minutes to understand what the me of the past meant when he wrote this line. Obviously in the moment it is easy to know why these integer values were selected however code can be self documenting if meaningful variables are declared.

One of the little annecdotes from Code Clean that really stuck with me was the fact that when you write code the goal should not be to make a program work but rather write code that is meant to be read by others. Or put another way, to minimize the number of WTFs/minute for you and your peers.
