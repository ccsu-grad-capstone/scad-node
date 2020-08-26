const debug = require('debug')('app:transactionsController')

const Transaction = require('../models/Transaction')

async function get (leagueId, year) {
  try {
    return await Transaction.find( {yahooLeagueId: leagueId, yahooLeagueYear: year} )
  } catch (error) {
    throw (error)
    
  }
}

async function create (transaction) {
  debug('create()')
  try {
    let exists = await Transaction.find( {yahooLeagueId: transaction.yahooLeagueId, yahooLeagueYear: transaction.yahooLeagueYear} ).countDocuments() > 0 ? true : false
    if (exists) {
      debug('Transaction already exists')
      return false
    } else {
      debug('Creating New Transaction')
      return await new Transaction(transaction).save()
    }
  } catch (error) {
    throw (error)
  }
}

async function update (id, dp) {
  debug('Updating Transaction: ', id)
  try {
    return await Transaction.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw (error)
  }
}

async function remove (id) {
  debug('Removing Transaction: ', id)
  try {
    return await Transaction.findByIdAndRemove(id).exec()
  } catch (error) {
    throw (error)
  }
}


module.exports = { get, create, update, remove }