const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')

async function getById(id) {
  debug('Getting ScadPlayer by id: ')
  return await ScadPlayer.findById(id)
}

async function getAllByScadLeagueId(id) {
  debug('Getting all ScadPlayers for league scadLeagueId', id)
  return await ScadPlayer.find({ scadLeagueId: id })
}

async function getAllByYahooLeagueId(id) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', id)
  return await ScadPlayer.find({ yahooLeagueId: id })
}

//INCOMPLETE
async function getAllForTeamByScadIds(scadLeagueId, scadTeamId) {
  debug('Getting all ScadPlayers for team by scad ids', id)
  return await ScadPlayer.find({ scadLeagueId: id })
}

//INCOMPLETE
async function getAllForTeamByYahooIds(yahooLeagueId, yahooTeamId) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', id)
  return await ScadPlayer.find({ yahooLeagueId: id })
}

async function create(scadPlayer) {
  debug('Creating new ScadPlayer')
  const player = new ScadPlayer(scadPlayer)

  player.created = moment().format()
  player.updated = moment().format()

  await player.save()
}

async function update(id, scadPlayer) {
  debug('Updating ScadPlayer: ', id)
  const player = await getById(id)

  Object.assign(player, scadPlayer)
  player.updated = moment().format()
  await player.save()

  return player
}

async function remove(id) {
  debug('Removing ScadPlayer: ', id)
  return await ScadPlayer.findByIdAndRemove(id).exec()
}

module.exports = {
  getById,
  getAllByScadLeagueId,
  getAllByYahooLeagueId,
  getAllForTeamByScadIds,
  getAllForTeamByYahooIds,
  create,
  update,
  remove,
}
