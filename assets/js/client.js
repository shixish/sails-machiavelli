playingCards.card.defaults.imgPrefix = '/playingCards/';
vex.defaultOptions.className = 'vex-theme-os';

var Error = function(data){
  this.message = data.error;
}

window.location.game_id = function(){
  return window.location.pathname.split('/')[2];
}

window.location.user_id = function(){
  return window.location.pathname.split('/')[3];
}


$(document).ready(function(){
  var game, user;

  var $controls = $('#controls'),
      $players = $('#players'),
      $hand = $('#hand'),
      $board = $('#board'),
      $name = $('#name'),
      $lobby = $('#lobby');

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

  // function loadGame(game_id, user_id){
  //   Game.load(game_id, function(gobj){
  //     if (gobj instanceof Error){
  //       console.log("Game load error:", gobj.message);
  //       vex.dialog.alert({
  //         message: "Unable to load game data!", 
  //         callback: function(){
  //           newGame();
  //         }
  //       });
  //     }else{
  //       User.load(gobj, user_id, function(uobj){
  //         if (uobj instanceof Error){
  //           console.log("User load error:", uobj.message);
  //           vex.dialog.alert({
  //             message: "Unable to load user data!", 
  //             callback: function(){
  //               newGame();
  //             }
  //           });
  //         }else{
  //           window.game = game = gobj;
  //           window.user = user = uobj;
  //           initBoard();
  //           console.log("Game state sucessfully loaded.", game, user);
  //         }
  //       });
  //     }      
  //     // $('<button>Get Game Data</button>').click(function(e){
  //     //   game.getGameData();
  //     // }).appendTo($controls);
  //   });
  // }

  // function newGame(){
  //   Game.create(function(gobj){
  //     window.game = game = gobj;
  //     console.log("Game:", game);
  //     window.history.pushState({},"", '/game/'+game.uuid);
  //     newUser();
  //   });
  // }

  // function newGame(){
  //   vex.dialog.open({
  //     showCloseButton: false,
  //     escapeButtonCloses: false,
  //     overlayClosesOnClick: false,
  //     message: 'Create a new game:',
  //     input: "<input name=\"name\" type=\"text\" placeholder=\"Your Name\" required />",
  //     buttons: [
  //       $.extend({}, vex.dialog.buttons.YES, {
  //         text: 'Create'
  //       })
  //     ],
  //     callback: function(data) {
  //       if (data.name){
  //         createGame(data.name)
  //       }
  //     }
  //   });
  // }

  // function newUser(){
  //   vex.dialog.open({
  //     showCloseButton: false,
  //     escapeButtonCloses: false,
  //     overlayClosesOnClick: false,
  //     message: 'Joining game lobby. Please provide your name:',
  //     input: "<input name=\"name\" type=\"text\" placeholder=\"Your Name\" required />",
  //     buttons: [
  //       $.extend({}, vex.dialog.buttons.YES, {
  //         text: 'Create'
  //       })
  //     ],
  //     callback: function(data) {
  //       if (data.name){
  //         game.addUser(data.name, function(uobj){
  //           window.user = user = uobj;
  //           console.log(user);
  //           window.history.pushState({},"", '/game/'+game.uuid+'/'+user.uuid);
  //           initBoard();
  //         });
  //       }
  //     }
  //   });
  // }

  // function createGame(name){
  //   Game.create(function(_game){
  //     window.game = game = _game;
  //     console.log("Game:", game);
  //     window.history.pushState({},"", '/game/'+game.uuid);
  //     game.addUser(name, function(uobj){
  //       window.user = user = uobj;
  //       console.log(user);
  //       window.history.pushState({},"", '/game/'+game.uuid+'/'+user.uuid);
  //       initBoard();
  //     });
  //   });
  // }

  function initBoard(){
    // if (user.admin){
    //   $('<button>Add Player</button>').click(function(e){
    //     game.addUser(name, function(uobj){
    //       window.user = user = uobj;
    //       console.log(user);
    //       window.history.pushState({},"", '/game/'+game.uuid+'/'+user.uuid);
    //       initBoard();
    //     });
    //   }).appendTo($controls);
    // }

    if (!game.started){
      // $lobby.show();
      // window.lobby = $lobby = vex.dialog.open({
      //   showCloseButton: false,
      //   escapeButtonCloses: false,
      //   overlayClosesOnClick: false,
      //   message: 'New game lobby:',
      //   input: '<div class="chat"></div>',
      //   buttons: [
      //     // $.extend({}, vex.dialog.buttons.YES, {
      //     //   text: 'Ready'
      //     // })
      //   ],
      //   callback: function(data) {
      //     if (data.name){
      //       createGame(data.name)
      //     }
      //   }
      // });
      App.newlobby(game);
    }

    $('<button>Draw a card</button>').click(function(e){
      user.drawCard(function (card){
        var $card = $(card.getHTML()).appendTo($hand);
      });
    }).appendTo($controls);

    $('<button>Get User Data</button>').click(function(e){
      user.getUserData(user.uuid);
      $hand.html(user.handHTML());
    }).appendTo($controls);

    // $('<button>Get Game Data</button>').click(function(e){
    //   game.getGameData();
    // }).appendTo($controls);

    for (var u in game.users){
      var name = game.users[u];
      $players.append(name);
    }

    //initialize hand:
    $hand.html(user.handHTML());
    updateBoard();
  }

  function updateBoard(pile_state){
    if (pile_state)
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

  // function errorAlert(msg){
  //   vex.dialog.alert({
  //     message: msg, 
  //     callback: function(){
  //       newGame();
  //     }
  //   });
  // }

  // function loadGame(game_id, callback){
  //   Game.load(game_id, function(gobj){
  //     if (gobj instanceof Error){
  //       console.log("Game load error:", gobj.message);
  //       errorAlert("Unable to load game data!");
  //     }else{
  //       window.game = game = gobj;
  //       callback(gobj);
  //     }
  //   });
  // }

  // function loadUser(user_id, callback){
  //   User.load(game, user_id, function(uobj){
  //     if (uobj instanceof Error){
  //       console.log("User load error:", uobj.message);
  //       errorAlert("Unable to load user data!");
  //     }else{
  //       window.user = user = uobj;
  //       initBoard();
  //       callback(uobj);
  //     }
  //   });
  // }

  // //Initialize game state:
  // var game_id = window.location.game_id(),
  //     user_id = window.location.user_id();

  // if (game_id){
  //   loadGame(game_id, function(){//on success
  //     console.log("Game sucessfully loaded:", game);
  //     if (user_id){
  //       loadUser(user_id, function(){
  //         console.log("User sucessfully loaded:", user);
  //       });
  //     }else{
  //       newUser();
  //     }
  //   });
  // }else{
  //   newGame();
  // }

  var LobbyView = Backbone.View.extend({
    // el: $lobby,
    tagName:  "div",
    id: 'lobby',

    // template: JST['assets/templates/lobby.jst'],

    template: function(obj){
      // this.$form = $('<form>');
      var html = 'Waiting in the lobby. There will eventually be a chat in here where you can talk to your bros.<h3>People in lobby:</h3>';
      html += '<div class="people">';
      if (obj.users){
        for (var u in obj.users){
          console.log(obj.users[u]);
          html += obj.users[u];
        }
      }
      html += '</div>';
      return html;
    },
    //_.template($('#item-template').html()),

    initialize: function(obj){
      console.log('initializing');
    },

    render: function() {
      console.log('rendering');
      this.$el.html(this.template(this.model.toJSON()));
      // this.$el.toggleClass('done', this.model.get('done'));
      // this.input = this.$('.edit');
      return this;
    },
  });

  var Machiavilli = Backbone.View.extend({
    el: $("#game"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {

    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      // this.input = this.$("#new-todo");
      // this.allCheckbox = this.$("#toggle-all")[0];

      // this.listenTo(Todos, 'add', this.addOne);
      // this.listenTo(Todos, 'reset', this.addAll);
      // this.listenTo(Todos, 'all', this.render);

      // this.footer = this.$('footer');
      // this.main = $('#main');

      // Todos.fetch();

      var app = this;

      //Initialize game state:
      var game_id = window.location.game_id(),
          user_id = window.location.user_id();

      if (game_id){
        app.loadGame(game_id, function(game){//on success
          console.log("Game sucessfully loaded:", game);
          if (user_id){
            app.loadUser(user_id, function(user){
              console.log("User sucessfully loaded:", user);
            });
          }else{
            app.newUser();
          }
        });
      }else{
        app.newGame();
      }
    },

    initGame: function(game){
      var app = this;
      window.game = app.game = game;
      app.lobby = new LobbyView({model: app.game});
      app.$el.append(app.lobby.render().el);
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      // var done = Todos.done().length;
      // var remaining = Todos.remaining().length;

      // if (Todos.length) {
      //   this.main.show();
      //   this.footer.show();
      //   this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      // } else {
      //   this.main.hide();
      //   this.footer.hide();
      // }

      // this.allCheckbox.checked = !remaining;
    },

    errorAlert: function(msg, callback){
      var app = this;
      vex.dialog.alert({
        message: msg,
        callback: function(){
          if (callback){
            callback();
          }
        }
      });
    },

    loadGame: function(game_id, callback){
      var app = this;
      Game.load(game_id, function(gobj){
        if (gobj instanceof Error){
          console.log("Game load error:", gobj.message);
          app.errorAlert("Unable to load game data!");
        }else{
          app.initGame(gobj);
          callback(gobj);
        }
      });
    },

    loadUser: function(user_id, callback){
      var app = this;
      User.load(app.game, user_id, function(uobj){
        if (uobj instanceof Error){
          console.log("User load error:", uobj.message);
          app.errorAlert("Unable to load user data!");
        }else{
          window.user = app.user = uobj;
          // initBoard();
          callback(uobj);
        }
      });
    },

    // newlobby: function(game){
    //   var lobby = new LobbyView({model: this.game});
    //   this.$el.append(lobby.render().el);
    // },

    newGame: function(){
      var app = this;
      Game.create(function(gobj){
        app.initGame(gobj);
        window.history.pushState({},"", '/game/'+app.game.get('uuid'));
        app.newUser();
      });
    },

    newUser: function(){
      var app = this;
      if (this.game){
        app.getUserName(function(name){
          app.game.addUser(name, function(uobj){
            window.user = app.user = uobj;
            console.log(user);
            window.history.pushState({},"", '/game/'+app.game.get('uuid')+'/'+app.user.get('uuid'));
            // initBoard();
          });
        });
      }else{
        console.error("Can't add user. No game data.");
      }
    },

    getUserName: function(callback){
      var app = this;
      vex.dialog.open({
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        message: 'Joining game lobby. Please provide your name:',
        input: "<input name=\"name\" type=\"text\" placeholder=\"Your Name\" required />",
        buttons: [
          $.extend({}, vex.dialog.buttons.YES, {
            text: 'Create'
          })
        ],
        callback: function(data) {
          if (data.name){
            callback();
          }else{
            app.errorAlert('Invalid Name');
            app.getUserName(callback);
          }
        }
      });
    },

  });

  window.App = new Machiavilli;
});