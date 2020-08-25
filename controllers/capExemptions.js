const debug = require('debug')('app:capExemptionsController')

const CapExemption = require('../models/CapExemption')


async function checkLeague (leagueId, year) {
  try {
    return await CapExemption.find( {yahooLeagueId: leagueId, yahooLeagueYear: year} )
  } catch (error) {
    throw (error)
  }
}

async function getAllByLeague (leagueId, year) {
  debug('Getting all CapExemptions by league: ', )
  try {
    return await CapExemption.find( {yahooLeagueId: leagueId, year: {$gte : year} }).sort( { year: 1 } )
  } catch (error) {
    throw (error)
  }
}

async function create (dp) {
  debug('Creating new CapExemption')
  try {
    return await new CapExemption(dp).save()
  } catch (error) {
    throw (error)
  }
}

async function update (id, dp) {
  debug('Updating CapExemption: ', id)
  try {
    return await CapExemption.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw (error)
  }
}

async function remove (id) {
  debug('Removing CapExemption: ', id)
  try {
    return await CapExemption.findByIdAndRemove(id).exec()
  } catch (error) {
    throw (error)
  }
}


module.exports = { checkLeague, getAllByLeague, create, update, remove }