/**
 * Card
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    
    suite : {
        type: 'string',
        required: true
    },
    value : {
        type: 'string',
        required: true
    },
    pile: {
        model: 'pile'
    }

  }

};