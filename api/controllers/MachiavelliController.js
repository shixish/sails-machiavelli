var cards = require('cards'),
	uuid = require('node-uuid'),
	GameStorage = {},
	Deck = cards.Deck, Card = cards.Card, Pile = cards.Pile;

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
// 	var json = [];
// 	this.hand.forEach(function(card){
// 		card.index = 0;
// 		json.push(card.toJSON());
// 	});
// 	return json;
// }
UserData.prototype.toJSON = function (){
	return {
		"name": this.name,
		"uuid": this.uuid, //This is temporary!
		"hand": this.hand.toJSON(),
	}
}

function GameData(){
	var deck = new cards.DoubleDeck();
	deck.shuffleAll();// Shuffle the deck 

	this.deck = deck;
	this.uuid = uuid.v4();
	this.timestamp = new Date();
	this.pile_data = [];
	this.user_data = {};

	GameStorage[this.uuid] = this;
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
	// 	var idx = card_indexes[i];
	// 	user.hand.splice(idx, 1);
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
		"timestamp": this.timestamp,
		"size": this.deck.size(),
		"piles": this.piles(),
		"users": this.users(),
	}
}
function getGameData(id){
	if (GameStorage[id]){
		return GameStorage[id];
	}else{//new game
		throw new Error("No game data.");
	}
}
function errorResponse(msg){
	return {
		'Error': msg,
	};
}

module.exports = {
	game: function (req, res){
		try{
			var game = getGameData(req.param('id'));
			return res.send(game.toJSON());
		}catch(e){
			return res.send(errorResponse(e.message));
		}
	},
	create_game: function (req, res){
		var game = new GameData();
		return res.send(game.toJSON());
		// return res.redirect('/api/' + game.uuid);
	},
	new_user: function (req, res){
		// if (!req.param('name')){

		// }
		try{
			var game = getGameData(req.param('id')),
				name = req.param('name'),
				user = new UserData(name);

			game.addUser(user);
			// this.addUser(new UserData('Jill'));
			return res.send(user.toJSON());
		}catch(e){
			return res.send(errorResponse(e.message));
		}
	},
	// deck: function (req, res){
	// 	var game = getGameData(req.param('id'));

	// 	console.log("Game is " + (new Date() - game.timestamp)/1000 + " seconds old");

	// 	return res.send(game.deck.toJSON());
	// },
	user: function (req, res){
		try{
			var game = getGameData(req.param('id')),
				user = game.getUser(req.param('user_id'));

			// var card = game.deck.draw();
			return res.send(user.toJSON());
		}catch(e){
			return res.send(errorResponse(e.message));
		}
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
	// 	try{
	// 		var game = getGameData(req.param('id')),
	// 			user = game.getUser(req.param('user_id'));

	// 		return res.send(user);
	// 	}catch(e){
	// 		return res.send(errorResponse(e.message));
	// 	}

	// 	return res.send(game.deck.toJSON());
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