const debug = require('debug')('app:diagnosticsController')

const Diagnostic = require('../models/Diagnostic')

async function get(yahooLeagueId) {
  debug('Get diagnostic from Mongo')
  try {
    return await Diagnostic.find({ yahooLeagueId: yahooLeagueId }).exec()
  } catch (error) {
    throw error
  }
}

async function create(d) {
  debug('Creating diagnostic to Mongo')
  try {
    return await new Diagnostic(d).save()
  } catch (error) {
    throw error
  }
}

async function update(id, d) {
  debug('Updating diagnostic with Mongo')
  try {
    return await Diagnostic.findByIdAndUpdate(id, d, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw error
  }
}

async function remove(id) {
  debug('Removing diagnostic from Mongo')
  try {
    return await Diagnostic.findByIdAndRemove(id).exec()
  } catch (error) {
    throw error
  }
}

module.exports = { get, create, update, remove }
