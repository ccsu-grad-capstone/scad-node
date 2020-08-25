const debug = require('debug')('app:draftPicksController')

const DraftPick = require('../models/DraftPick')

async function checkLeague (leagueId, year) {
  try {
    return await DraftPick.find( {yahooLeagueId: leagueId, yahooLeagueYear: year} )
  } catch (error) {
    throw (error)
  }
}

async function getAllByLeague (leagueId, year, limit) {
  debug('Getting all draft picks by league: ')
  try {
    return await DraftPick.find( {yahooLeagueId: leagueId, yahooLeagueYear: year, year: {$gte : year} }).sort( { year: 1 } ).limit(limit)
  } catch (error) {
    throw (error)
  }
}

async function create (dp) {
  debug('Creating new DraftPick')
  try {
    return await new DraftPick(dp).save()
  } catch (error) {
    throw (error)
  }
}

async function update (id, dp) {
  debug('Updating DraftPick: ', id)
  try {
    return await DraftPick.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw (error)
  }
}

async function remove (id) {
  debug('Removing DraftPick: ', id)
  try {
    return await DraftPick.findByIdAndRemove(id).exec()
  } catch (error) {
    throw (error)
  }
}


module.exports = { checkLeague, getAllByLeague, create, update, remove }