/**
 * GAME
 */
var Game = Backbone.Model.extend({
  addUser: function(name, callback){
    io.socket.get('/api/'+this.get('uuid')+'/new_user/'+name, function (data) {
      var user = new User(data);
      console.log(data, user);
      callback(user);
    });
  },
},{
  //Static methods:
  create: function(callback){
    io.socket.get('/api/create', function (data) {
      if (data.error){
        callback(new Error(data));
      }else{
        callback(new Game(data));
      }
    });
  },
  load: function(id, callback){
    io.socket.get('/api/'+id, function (data) {
      if (data.error){
        callback(new Error(data));
      }else{
        callback(new Game(data));
      }
    });
  }
});

// var Game = function(data){
//   this.uuid = data.uuid;
//   this.piles = [];
//   this.updatePiles(data.piles);
//   this.timestamp = data.timestamp;
//   this.users = data.users;
//   this.size = data.size;
//   this.started = data.started;
//   // for (var i in data){
//   //   this[i] = data[i];
//   // }
// }
// // Game.prototype.getGameData = function(){
// //   io.socket.get('/api/'+this.uuid, function (game) {
// //     console.log("Game:", game);
// //   });
// // }
// Game.prototype.updatePiles = function(pile_data){
//   for (var p in pile_data){
//     this.piles[p] = new Pile(pile_data[p]);
//   }
// }
// Game.prototype.addUser = function(name, callback){
//   io.socket.get('/api/'+this.uuid+'/new_user/'+name, function (data) {
//     callback(new User(data));
//   });
// }
// Game.create = function(callback){
//   io.socket.get('/api/create', function (data) {
//     if (data.error){
//       callback(new Error(data));
//     }else{
//       callback(new Game(data));
//     }
//   });
// }
// Game.load = function(id, callback){
//   io.socket.get('/api/'+id, function (data) {
//     if (data.error){
//       callback(new Error(data));
//     }else{
//       callback(new Game(data));
//     }
//   });
// }