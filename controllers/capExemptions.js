const debug = require('debug')('app:capExemptionsController')

const CapExemption = require('../models/CapExemption')

async function checkLeague(scadLeagueId) {
  try {
    return await CapExemption.find({ scadLeagueId: scadLeagueId })
  } catch (error) {
    throw error
  }
}

async function getAllByLeague(scadLeagueId) {
  debug('Getting all CapExemptions by league: ')
  try {
    return await CapExemption.find({ scadLeagueId: scadLeagueId }).sort({ year: 1 })
  } catch (error) {
    throw error
  }
}

async function create(dp) {
  debug('Creating new CapExemption')
  try {
    return await new CapExemption(dp).save()
  } catch (error) {
    throw error
  }
}

async function update(id, dp) {
  debug('Updating CapExemption: ', id)
  try {
    return await CapExemption.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw error
  }
}

async function updateLeagueCEforLeagueRenewal(updates) {
  const capExceptions = await getAllByLeague(updates.oldScadLeagueId, updates.year - 1)
  for (ce of capExceptions) {
    ce.yahooLeagueId = updates.yahooLeagueId
    ce.yahooGameKey = updates.yahooGameKey
    ce.scadLeagueId = updates.scadLeagueId
    let prev = {
      year: updates.year - 1,
      scadLeagueId: updates.oldScadLeagueId,
    }
    ce.prevScadLeagueIds.push(prev)
    await update(ce._id, ce)
  }
}

async function remove(id) {
  debug('Removing CapExemption: ', id)
  try {
    return await CapExemption.findByIdAndRemove(id).exec()
  } catch (error) {
    throw error
  }
}

module.exports = {
  checkLeague,
  getAllByLeague,
  create,
  update,
  updateLeagueCEforLeagueRenewal,
  remove,
}
