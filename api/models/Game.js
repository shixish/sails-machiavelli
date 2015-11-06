/**
 * Game
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs         :: http://sailsjs.org/#!documentation/models
 */
var uuid = require('node-uuid');


module.exports = {

  attributes: {

    uuid: {
      type: 'string',
      required: true,
      defaultsTo: uuid.v4(),
    },
    started: {
      type: 'boolean',
      required: true,
      defaultsTo: false,
    },
    timestamp: {
      type: 'date',
      required: true,
      defaultsTo: new Date(),
    },
    deck: {
      model: 'pile',
      via: 'game'
    },
    piles: {
      collection: 'pile',
      via: 'game'
    },
    players: {
      collection: 'player',
      via: 'game'
    },

  },
  
  //Methods:
  addUser: function(){

  },

};