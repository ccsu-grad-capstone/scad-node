const debug = require('debug')('app:TransactionsController')

const Transaction = require('../models/Transaction')

async function get (yahooLeagueId) {
  debug('Get Transaction from Mongo')
  try {
    return await Transaction.find({ yahooLeagueId: yahooLeagueId }).exec()
  } catch (error) {
    debug (error)
  }
}

async function create (t) {
  debug('Creating Transaction to Mongo')
  try {
    return await new Transaction(t).save()
  } catch (error) {
    debug (error)
  }
}

async function update (id, t) {
  debug('Updating Transaction with Mongo')
  try {
    return await Transaction.findByIdAndUpdate(id, t, { new: true, runValidators: true }).exec()
  } catch (error) {
    debug (error)
  }
}

async function remove (id) {
  debug('Removing Transaction from Mongo')
  try {
    return await Transaction.findByIdAndRemove(id).exec()
  } catch (error) {
    debug (error)
  }
}


module.exports = { get, create, update, remove }