/*
TODO:: NEED TO LEVERAGE MODEL AND DB SYSTEM IN ORDER TO USE SAILS MAIN FUNCTIONALITY...
*/


var cards = require('cards'),
  uuid = require('node-uuid'),
  GameStorage = {},
  Deck = cards.Deck, Card = cards.Card, Pile = cards.Pile;

var user_index = 0;

function UserData(name){
  var next_index = 0;
  this.uuid = uuid.v4();
  this.name = name;
  this.hand = new Pile();

  this.addCard = function(card){
    // var index = next_index++;
    // card.index = index;
    // // this.hand[index] = card;
    // console.log(index);
    // // return index;
    this.hand.push(card);
  }
}
// UserData.prototype.getHand = function (card){
//  var json = [];
//  this.hand.forEach(function(card){
//    card.index = 0;
//    json.push(card.toJSON());
//  });
//  return json;
// }
UserData.prototype.toJSON = function (){
  return {
    "name": this.name,
    "uuid": this.uuid, //This is temporary!
    "hand": this.hand.toJSON(),
    "cards": this.hand.length,
  }
}

function GameData(){
  var deck = new cards.DoubleDeck();
  deck.shuffleAll();// Shuffle the deck

  this.started = false;
  this.starting_cards = 7;

  this.deck = deck;
  this.uuid = uuid.v4();
  this.timestamp = new Date();
  this.pile_data = [];
  this.user_data = {};

  GameStorage[this.uuid] = this;
}
GameData.prototype.dealCards = function (){
  //give the user their starting cards
  for (var u in this.user_data){
    var user = this.user_data[u];
    for (var i = 0; i < this.starting_cards; i++){
      var card = this.deck.draw();
      user.addCard(card);
    }
  }
}
GameData.prototype.dropCard = function (user, card_indexes, pile_id){
  var pile;
  if (this.pile_data[pile_id]){
    pile = this.pile_data[pile_id];
  }else{
    pile = new Pile();
    pile_id = this.pile_data.length;
    this.pile_data.push(pile);
  }

  for (var i in card_indexes){
    var idx = card_indexes[i];
    var card = user.hand[idx];
    // console.log(card);
    pile.push(card);
    // delete user.hand[card_idx];
    user.hand.splice(idx, 1);
  }
  var ret = {};
  ret[pile_id] = pile.toJSON()
  return ret;

  // for (var i in card_indexes){
  //  var idx = card_indexes[i];
  //  user.hand.splice(idx, 1);
  // }
}
GameData.prototype.addUser = function (user){
  this.user_data[user.uuid] = user;
}
GameData.prototype.getUser = function (user_id){
  if (this.user_data[user_id])
    return this.user_data[user_id];
  else
    throw new Error('User ID not recognized.');
}
GameData.prototype.users = function (){
  var json = [];
  for (var i in this.user_data){
    json.push(this.user_data[i].name);//toJSON()
  }
  return json;
}
GameData.prototype.piles = function (){
  var json = [];
  for (var i in this.pile_data){
    json.push(this.pile_data[i].toJSON());
  }
  return json;
}
GameData.prototype.toJSON = function(){
  return {
    "uuid": this.uuid,
    "started": this.started,
    "timestamp": this.timestamp,
    "size": this.deck.size(),
    "piles": this.piles(),
    "users": this.users(),
  }
}
// function getGameData(id){
//  if (GameStorage[id]){
//    return GameStorage[id];
//  }else{//new game
//    throw new Error("No game data.");
//  }
// }
function errorResponse(msg){
  return {
    'error': msg,
  };
}

module.exports = {
  game: function (req, res){
    Game.findOne({uuid: req.param('id')}).populate('players').exec(function (err, game){
      if (game){
        if (game.players){
          for (var p in game.players){
            delete game.players[p].uuid; //Can't show the UUID because it would allow you to log in as someone else
          }
        }
        // console.log(game);
        return res.send(game);
      }else{
        return res.send(errorResponse('Unable to load game: ' + err));
      }
    });
    // try{
    //  var game = getGameData(req.param('id'));
    //  return res.send(game.toJSON());
    // }catch(e){
    //  return res.send(errorResponse(e.message));
    // }
  },
  players: function (req, res){
    if (!req.isSocket) {
      return res.badRequest('Only a client socket can subscribe.');
    }

    // Let's say our client socket has a problem with people named "louie".

    // // First we'll find all users named "louie" (or "louis" even-- we should be thorough)
    // User.find({ or: [{name: 'louie'},{name: 'louis'}] }).exec(function(err, usersNamedLouie){
    //   if (err) {
    //     return res.negotiate(err);
    //   }

    //   User.subscribe(req, _.pluck(usersNamedLouie, 'id'));

    //   return res.ok();
    // });

    Player.find().exec(function (err, players){
      // if (err) {
      //   return res.negotiate(err);
      // }

      // Player.subscribe(req, _.pluck(players, 'id'));

      // return res.ok();

      sails.sockets.emit('Player', 'privateMessage', {from: req.session.userId, msg: 'Hi!'});
      res.json({
        message: 'Message sent!'
      });

      // if (players){
      //   for (var p in players){
      //     delete players[p].uuid; //Can't show the UUID because it would allow you to log in as someone else
      //   }
      //   console.log(players);
      //   return res.send(players);
      // }else{
      //   return res.send(errorResponse('Unable to load game: ' + err));
      // }
    });
    // try{
    //  var game = getGameData(req.param('id'));
    //  return res.send(game.toJSON());
    // }catch(e){
    //  return res.send(errorResponse(e.message));
    // }
  },
  create_game: function (req, res){
    Game.create().exec(function (err, game){
      // console.log('Created game with id ' + game.uuid);
      return res.send(game);
    });
    // var game = new GameData();
    // return res.send(game.toJSON());
    // return res.redirect('/api/' + game.uuid);
  },
  new_user: function (req, res){
    var name = req.param('name'),
        game_id = req.param('id');
    if (name){
      Game.findOne({uuid: game_id}).exec(function (err, game){
        // console.log(err, game);
        if (game){
          //game.addUser(name);
          Player.create({'name': name}).exec(function(err, player){
            if (player){
              game.players.add(player);
              game.save();
              // sails.sockets.emit('Player', 'privateMessage', {from: req.session.userId, msg: 'Hi!'});
              // res.message( 'player', {msg: 'derp'} );
              sails.io.sockets.emit('player', player);
              return res.send(player.toJSON());
            }else{
              return res.send(errorResponse(err));
            }
          });
        }else{
          return res.send(errorResponse(err));
        }
      });
    }

    // if (!req.param('name')){

    // }
    // try{
    //  var game = getGameData(req.param('id')),
    //    name = req.param('name'),
    //    user = new UserData(name);

    //  game.addUser(user);
    //  // this.addUser(new UserData('Jill'));
    //  return res.send(user.toJSON());
    // }catch(e){
    //  return res.send(errorResponse(e.message));
    // }
  },
  // deck: function (req, res){
  //  var game = getGameData(req.param('id'));

  //  console.log("Game is " + (new Date() - game.timestamp)/1000 + " seconds old");

  //  return res.send(game.deck.toJSON());
  // },
  user: function (req, res){
    Player.findOne({'uuid': req.param('user_id')}).exec(function(err, player){
      if (player){
        return res.send(player.toJSON());
      }else{
        return res.send(errorResponse('Unable to load user: ' + err));
      }
    });
    // try{
    //  var game = getGameData(req.param('id')),
    //    user = game.getUser(req.param('user_id'));

    //  // var card = game.deck.draw();
    //  return res.send(user.toJSON());
    // }catch(e){
    //  return res.send(errorResponse(e.message));
    // }
  },
  draw: function (req, res){
    try{
      var game = getGameData(req.param('id')),
        user = game.getUser(req.param('user_id'));

      var card = game.deck.draw();
      user.addCard(card);
      return res.send(card.toJSON());

    }catch(e){
      return res.send(errorResponse(e.message));
    }
  },
  drop: function (req, res){
    try{
      var game = getGameData(req.param('id')),
        user = game.getUser(req.param('user_id')),
        card_idx = req.param('card_idx');

      // console.log(card_idx, user);
      if (user.hand[card_idx]){
        // var card = user.hand[card_idx];
        // console.log(card);
        // game.pile_data.push(new Pile(card));
        // // delete user.hand[card_idx];
        // user.hand.splice(card_idx, 1);
        // res.send(card.toJSON());
        res.send(game.dropCard(user, [card_idx]));
      }else{
        throw new Error('Card not found.');
      }
    }catch(e){
      return res.send(errorResponse(e.message));
    }
  },
  // hand: function (req, res){
  //  try{
  //    var game = getGameData(req.param('id')),
  //      user = game.getUser(req.param('user_id'));

  //    return res.send(user);
  //  }catch(e){
  //    return res.send(errorResponse(e.message));
  //  }

  //  return res.send(game.deck.toJSON());
  // },
  list: function (req, res){
    return res.send(Object.keys(GameStorage));
  },
};

cards.generators.doubleDeck = function(deck) {
  for (var i = 0; i < 2; i++){
    ['C', 'D', 'H', 'S'].forEach(function(suit) {
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'].forEach(function(value) {
        deck.add(new Card(suit, value));
      });
    });
  }
};

cards.Deck.createType('DoubleDeck', 'doubleDeck');

cards.Card.prototype.toJSON = function(){
  return {
    'suite': this.suit,
    'value': this.value,
    // 'index': this.index,
  };
}

cards.Deck.prototype.toJSON = function(){
  var json = [];
  this.deck.forEach(function(card){
    json.push(card.toJSON());
  });
  return json;
}

cards.Pile.prototype.toJSON = function(){
  var json = [];
  this.forEach(function(card){
    json.push(card.toJSON());
  });
  return json;
}

cards.Deck.prototype.size = function(){
  return this.deck.length;
}