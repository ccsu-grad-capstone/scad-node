const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const scadLeagueController = require('./scadLeague')
const yf = require('../services/yahooFantasy')
const ScadLeague = require('../models/ScadLeague')

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
async function getMyPlayersByScadId(scadLeagueId, access_token) {
  debug('Getting all ScadPlayers for my team by scad ids', scadLeagueId)
  let scadLeague = scadLeagueController.getById(id)
  let myYahooTeam = yf.getMyTeam(access_token, ScadLeague.yahooLeagueId)


  return await ScadPlayer.find({ scadLeagueId: scadLeagueId })
}

//INCOMPLETE
async function getMyPlayersByYahooId(yahooLeagueId) {
  debug('Getting all ScadPlayers for my team by yahooLeagueId', yahooLeagueId)

  let scadPlayers = await ScadPlayer.find({ yahooLeagueId: yahooLeagueId })

  return 
}

//INCOMPLETE
async function getAllForTeamByScadIds(scadLeagueId, scadTeamId) {
  debug('Getting all ScadPlayers for team by scad ids', scadLeagueId)
  return await ScadPlayer.find({ scadLeagueId: scadLeagueId })
}

//INCOMPLETE
async function getAllForTeamByYahooIds(yahooLeagueId, yahooTeamId) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooLeagueId)

  let scadPlayers = await ScadPlayer.find({ yahooLeagueId: yahooLeagueId })


  return 
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
  getMyPlayersByScadId,
  getMyPlayersByYahooId,
  getAllForTeamByScadIds,
  getAllForTeamByYahooIds,
  create,
  update,
  remove,
}
