playingCards.card.defaults.imgPrefix = 'playingCards/';

$(document).ready(function(){
  var game, user;

  var $controls = $('#controls'),
      $hand = $('#hand'),
      $board = $('#board'),
      $name = $('#name');

  // $hand.on('click', 'li', function(e){
  //     var idx = $(this).index();
  //     console.log(idx);
  //     dropCard(idx);
  // });

  
  /**
   * GAME
   */
  var Game = function(data){
    this.uuid = data.uuid;
    this.piles = [];
    this.updatePiles(data.piles);
    this.timestamp = data.timestamp;
    this.users = data.users;
    this.size = data.size;
    // for (var i in data){
    //   this[i] = data[i];
    // }
  }

  Game.prototype.getGameData = function(){
    io.socket.get('/api/'+this.uuid, function (game) {
      console.log("Game:", game);
    });
  }

  Game.prototype.updatePiles = function(pile_data){
    for (var p in pile_data){
      this.piles[p] = new Pile(pile_data[p]);
    }
  }


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
    return $(this.ui.getHTML());
  }


  /**
   * PILE
   */
  var Pile = function(data) {
    for (var i in data){
      this[i] = new Card(data[i]);
    }
  };
  Pile.prototype = [];

  /**
   * USER
   */
  function User(data){
    // this.data = data;
    for (var i in data){
      this[i] = data[i];
    }
  }
  User.prototype.drawCard = function(callback){
    var user = this;
    io.socket.get('/api/'+game.uuid+'/'+user.uuid+'/draw', function (card) {
      console.log("Card:", card);
      card = new Card(card);
      user.hand.push(card);
      if (callback) callback(card);
    });
  }

  User.prototype.getUserData = function(){
    var _this = this;
    io.socket.get('/api/'+game.uuid+'/'+this.uuid+'/', function (user) {
      console.log("User:", user);
    });
  }

  User.prototype.dropCard = function(card_idx, callback){
    if (user.hand[card_idx])
    io.socket.get('/api/'+game.uuid+'/'+user.uuid+"/drop/"+card_idx, function (pile_state) {
      // delete user.hand[card_idx];
      var card = user.hand.splice(card_idx, 1)[0];
      
      if (callback) callback(card, pile_state);
    });
  }


  /**
   * UI FUNCTIONS
   */

  $hand.on('click', '.playingCard', function(){
    // console.log('derp');
    var $this = $(this);
    var index = $this.index();//$this.data('index')
    this.remove();
    user.dropCard(index, function(card, pile_state){
      console.log("Dropped card:", card);
      console.log("Board: ", pile_state);
      // $card.appendTo($board);
      // console.log($card);
      // addCardToBoard(card);
      updateBoard(pile_state);
    });
  });


  function createGame(){
    io.socket.get('/api/create', function (data) {
      window.game = game = new Game(data);
      console.log("Game:", game);
      
      $('<button>Get Game Data</button>').click(function(e){
        game.getGameData();
      }).appendTo($controls);

      // $('<button>New User</button>').click(function(e){
      //   createUser(game, 'Bill');
      // }).appendTo($controls);
      createUser(game, 'Bill');
    });
  }

  function createUser(game, name){
    io.socket.get('/api/'+game.uuid+'/new_user/'+name, function (data) {
      window.user = user = new User(data);
      console.log(user);

      $('<button>Draw a card</button>').click(function(e){
        user.drawCard(function (card){
          var $card = card.getHTML().appendTo($hand);
        });
      }).appendTo($controls);

      $('<button>Get User Data</button>').click(function(e){
        user.getUserData(user.uuid);
        $hand.html('');
        user.hand.forEach(function(card){
          var $card = card.getHTML().appendTo($hand);
        });
      }).appendTo($controls);
    });

  } 

  // function dropCard(card_idx){
  //   if (user.hand[card_idx])
  //   io.socket.get('/api/'+game.uuid+'/'+user.uuid+"/drop/"+card_idx, function (pile_state) {
  //     // delete user.hand[card_idx];
  //     user.hand.splice(card_idx, 1);
  //     updateHand();
  //     updateBoard(pile_state)
  //     console.log("Dropped card. ", pile_state, '/api/'+game.uuid+'/'+user.uuid+"/drop/"+card_idx);
  //   });
  // }

  

  // function updateHand(){
  //   html = '';
  //   $hand.html('');
  //   for (var i in user.hand){
  //     (function(idx){
  //       var $card = $(cardTemplate(user.hand[idx]));
  //       $card.click(function(e){
  //         dropCard(idx);
  //       }).appendTo($hand);
  //     })(i);
  //   }
  // }

  function updateBoard(pile_state){
    game.updatePiles(pile_state);
    html = '';
    $board.html('');
    for (var i in game.piles){
      var $pile = $('<ul id="pile-'+i+'" class="pile">');
      for (var c in game.piles[i]){
        var card = game.piles[i][c];
        // console.log(card);
        $('<li>').append(card.getHTML()).appendTo($pile);
      }
      $pile.appendTo($board);
    }
  }

  // function cardTemplate(card){
  //   return $('<li>').append(card.getHTML());
  // }

  createGame();
  
});


var $board = document.getElementById('fancy-board');

var deck = Deck(false);
deck.mount($board);


// function sortzModule(deck) {
//   deck.sortz = deck.queued(sortz);

//   function sortz(next, reverse) {
//     var cards = deck.cards;

//     // cards.sort(function (a, b) {
//     //   if (reverse) {
//     //     return a.i - b.i;
//     //   } else {
//     //     return b.i - a.i;
//     //   }
//     // });

//     // deck.fan();

//     cards.forEach(function (card, i) {
//       // card.sort(i, function (i) {
//       //   if (i === cards.length - 1) {
//       //     next();
//       //   }
//       // }, reverse);
//     });
//   }
// }
// sortzModule(deck);

// deck.intro();
// deck.sort();

deck.cards.forEach(function (card, i) {
  card.enableMoving();

  card.$el.addEventListener('mousedown', onTouch);
  card.$el.addEventListener('touchstart', onTouch);

  function onTouch () {
  }
});