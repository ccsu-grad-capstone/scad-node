const debug = require('debug')('app:draftPicksController')

const DraftPick = require('../models/DraftPick')

async function checkLeague(scadLeagueId) {
  try {
    return await DraftPick.find({ scadLeagueId: scadLeagueId })
  } catch (error) {
    throw error
  }
}

async function getAllByLeague(scadLeagueId, limit) {
  debug('Getting all draft picks by league: ')
  try {
    return await DraftPick.find({ scadLeagueId: scadLeagueId }).sort({ year: 1 }).limit(limit)
  } catch (error) {
    throw error
  }
}

async function create(dp) {
  debug('Creating new DraftPick')
  try {
    return await new DraftPick(dp).save()
  } catch (error) {
    throw error
  }
}

async function update(id, dp) {
  debug('Updating DraftPick: ', id)
  try {
    return await DraftPick.findByIdAndUpdate(id, dp, { new: true, runValidators: true }).exec()
  } catch (error) {
    throw error
  }
}

async function updateLeagueDPforLeagueRenewal(updates) {
  const draftPicks = await getAllByLeague(updates.oldScadLeagueId, updates.year - 1)
  for (dp of draftPicks) {
    dp.yahooLeagueId = updates.yahooLeagueId
    dp.yahooGameKey = updates.yahooGameKey
    dp.scadLeagueId = updates.scadLeagueId
    let prev = {
      year: updates.year - 1,
      scadLeagueId: updates.oldScadLeagueId,
    }
    dp.prevScadLeagueIds.push(prev)
    await update(dp._id, dp)
  }
}

async function remove(id) {
  debug('Removing DraftPick: ', id)
  try {
    return await DraftPick.findByIdAndRemove(id).exec()
  } catch (error) {
    throw error
  }
}

module.exports = {
  checkLeague,
  getAllByLeague,
  create,
  updateLeagueDPforLeagueRenewal,
  update,
  remove,
}
