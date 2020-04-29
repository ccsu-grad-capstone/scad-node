const debug = require('debug')('app:draftPicksController')

const DraftPick = require('../models/DraftPick')

async function checkLeague (leagueId, year) {
  try {
    return await DraftPick.find( {yahooLeagueId: leagueId, yahooLeagueYear: year} )
  } catch (error) {
    debug(error)
  }
}

async function getAllByLeague (leagueId, year, limit) {
  debug('Getting all draft picks by league: ')
  try {
    return await DraftPick.find( {yahooLeagueId: leagueId, yahooLeagueYear: year, year: {$gte : year} }).sort( { year: 1 } ).limit(limit)
  } catch (error) {
    debug(error)
  }
}

async function create (dp) {
  debug('Creating new DraftPick')
  try {
    return new DraftPick(dp).save()
  } catch (error) {
    debug(error)
  }
}

async function update (id, dp) {
  debug('Updating DraftPick: ', id)
  try {
    return DraftPick.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    debug(error)
  }
}

async function remove (id) {
  debug('Removing DraftPick: ', id)
  try {
    return DraftPick.findByIdAndRemove(id).exec()
  } catch (error) {
    debug(error)
  }
}


module.exports = { checkLeague, getAllByLeague, create, update, remove }