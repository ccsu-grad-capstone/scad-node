const debug = require('debug')('app:capExemptionsController')

const CapExemption = require('../models/CapExemption')

async function getAllByLeague (leagueId) {
  debug('Getting all CapExemptions by league: ', )
  try {
    return await CapExemption.find( {yahooLeagueId: leagueId} ).sort( { year: 1 } )
  } catch (error) {
    debug(error)
  }
}

async function create (dp) {
  debug('Creating new CapExemption')
  try {
    return new CapExemption(dp).save()
  } catch (error) {
    debug(error)
  }
}

async function update (id, dp) {
  debug('Updating CapExemption: ', id)
  try {
    return CapExemption.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    debug(error)
  }
}

async function remove (id) {
  debug('Removing CapExemption: ', id)
  try {
    return CapExemption.findByIdAndRemove(id).exec()
  } catch (error) {
    debug(error)
  }
}


module.exports = { getAllByLeague, create, update, remove }