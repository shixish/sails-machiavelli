/**
 * CARD
 */
var Card = function(data){
  // for (var i in data){
  //   this[i] = data[i];
  // }
  this.value = data.value;
  this.suite = data.suite;
  this.rank_name = playingCards.defaults.ranks[this.value];
  this.suite_name = playingCards.defaults.suits[this.suite];
  this.ui = new playingCards.card(this.value, this.rank_name, this.suite, this.suite_name);
}
// Card.prototype.id = function(){
//   return 'i'+this.index;//'c' + this.suite + this.value + 
// }
Card.prototype.getHTML = function(){
  return this.ui.getHTML();
}
