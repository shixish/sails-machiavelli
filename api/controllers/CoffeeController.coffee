 # CoffeeController
 #
 # @description :: Server-side logic for managing tests
 # @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers

class CoffeeController

  index: (req, res) ->
    res.json success: true

module.exports = new CoffeeController