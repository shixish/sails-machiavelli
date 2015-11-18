/**
 * USER
 */
var User = Backbone.Model.extend({
  drawCard: function(callback){
    var _this = this;
    io.socket.get('/api/'+_this.game.get('uuid')+'/'+_this.get('uuid')+'/draw', function (card) {
      console.log("Card:", card);
      card = new Card(card);
      _this.hand.push(card);
      if (callback) callback(card);
    });
  },
  getUserData: function(){
    var _this = this;
    io.socket.get('/api/'+_this.game.get('uuid')+'/'+_this.get('uuid')+'/', function (data) {
      console.log("User:", data);
    });
  },
  dropCard: function(card_idx, callback){
    var _this = this;
    if (user.hand[card_idx]){
      io.socket.get('/api/'+_this.game.get('uuid')+'/'+_this.get('uuid')+"/drop/"+card_idx, function (pile_state) {
        // delete user.hand[card_idx];
        var card = _this.hand.splice(card_idx, 1)[0];
        
        if (callback) callback(card, pile_state);
      });
    }
  },
  handHTML: function(){
    var html = '';
    this.hand.forEach(function(card){
      html += card.getHTML();
    });
    return html;
  },
},{
  //Static methods:
  load: function(game, id, callback){
    io.socket.get('/api/'+game.get('uuid')+'/'+id+'/', function (data) {
      if (data.error){
        callback(null, data.error);
      }else{
        callback(new User(data));
      }
    });
  },
});

// function User(data){
//   this.uuid = data.uuid;
//   this.name = data.name;
//   this.hand = new Pile();
//   this.count = data.count; //card count
//   for (var c in data.hand){
//     this.hand.push(new Card(data.hand[c]));
//   }
// }
// User.prototype.drawCard = function(callback){
//   var user = this;
//   io.socket.get('/api/'+game.uuid+'/'+user.uuid+'/draw', function (card) {
//     console.log("Card:", card);
//     card = new Card(card);
//     user.hand.push(card);
//     if (callback) callback(card);
//   });
// }
// User.prototype.getUserData = function(){
//   var _this = this;
//   io.socket.get('/api/'+game.uuid+'/'+this.uuid+'/', function (user) {
//     console.log("User:", user);
//   });
// }
// User.prototype.dropCard = function(card_idx, callback){
//   if (user.hand[card_idx])
//   io.socket.get('/api/'+game.uuid+'/'+user.uuid+"/drop/"+card_idx, function (pile_state) {
//     // delete user.hand[card_idx];
//     var card = user.hand.splice(card_idx, 1)[0];
    
//     if (callback) callback(card, pile_state);
//   });
// }
// User.prototype.handHTML = function(){
//   var html = '';
//   this.hand.forEach(function(card){
//     html += card.getHTML();
//   });
//   return html;
// }
// User.load = function(game, id, callback){
//   io.socket.get('/api/'+game.uuid+'/'+id+'/', function (data) {
//     if (data.error){
//       callback(new Error(data));
//     }else{
//       callback(new User(data));
//     }
//   });
// }