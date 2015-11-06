var Message = Backbone.Model.extend({
  
});

var MessageStore = Backbone.Collection.extend({
  model: Message,
  url: '/',
  initialize: function(game_uuid) {
    this.url = "/" + game_uuid + '/messages';
  }
});

var MessageView = Backbone.View.extend({
  events: { 
    "submit #chatForm" : "handleNewMessage"
  },

  handleNewMessage: function(data) {
    var inputField = $('input[name=newMessageString]');
    messages.create({content: inputField.val()});
    inputField.val('');
  },

  render: function() {
    var data = messages.map(function(message) { return message.get('content') + 'n'});
    var result = data.reduce(function(memo,str) { return memo + str }, '');
    $("#chatHistory").text(result);
    return this;
  }
});