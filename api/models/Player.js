/**
 * Player
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

 var uuid = require('node-uuid');

module.exports = {

  attributes: {

    uuid: {
        type: 'string',
        required: true,
        defaultsTo: uuid.v4(),
    },
    game: {
        model: 'game',
    },
    name : {
        type: 'string',
        required: true
    },
    hand: {
        model: 'pile',
    },

  }

};