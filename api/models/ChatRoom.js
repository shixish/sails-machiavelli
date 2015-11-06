// ProjectName/api/models/ChatRoom.js
/**
 * ChatRoom
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    title : {
        type: 'string',
        required: true
    },
    slug  : {
        type: 'string',
        required: true,
        unique: true,
        regex: '^[a-z-]+'
    }

  }

};