/**
 * PILE
 */
var Pile = function(data) {
  for (var i in data){
    this[i] = new Card(data[i]);
  }
};
Pile.prototype = [];