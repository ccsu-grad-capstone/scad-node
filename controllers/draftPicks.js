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

async function updateLeagueDPforLeagueRenewal(update) {
  const draftPicks = await getAllByLeague(update.oldScadLeagueId, update.year - 1)
  for (dp of draftPicks) {
    dp.yahooLeagueId = update.yahooLeagueId
    dp.yahooGameKey = update.yahooGameKey
    dp.scadLeagueId = update.scadLeagueId
    let prev = {
      year: update.year - 1,
      scadLeagueId: update.oldScadLeagueId,
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
