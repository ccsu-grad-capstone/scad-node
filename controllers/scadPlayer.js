const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const scadLeagueController = require('./scadLeague')
const scadTeamController = require('./scadTeam')
const yf = require('../services/yahooFantasy')
const ScadLeague = require('../models/ScadLeague')

async function getById(id) {
  debug('Getting ScadPlayer by id: ')
  return await ScadPlayer.findById(id)
}

async function getByYahooIds(yahooLeagueId, yahooPlayerId) {
  return await ScadPlayer.find({ yahooPlayerId: yahooPlayerId, yahooLeagueId: yahooLeagueId })
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

async function getAllTeamPlayersByScadTeamId(scadTeamId, access_token) {
  debug('Getting all ScadPlayers for team by scad ids')

  let scadTeam = await scadTeamController.getById(scadTeamId)
  const yt = await yf.getTeamWithRoster(access_token, scadTeam.yahooLeagueId, scadTeam.yahooTeamId)

  let scadPlayers = []
  for (const yp of yt.roster) {
    scadPlayers.push(await getByYahooIds(scadTeam.yahooLeagueId, yp.player_id))
  }
  
  return scadPlayers
}

async function getAllForTeamByYahooIds(yahooLeagueId, yahooTeamId, access_token) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooLeagueId)

  const yt = await yf.getTeamWithRoster(access_token, yahooLeagueId, yahooTeamId)

  let scadPlayers = []
  for (const yp of yt.roster) {
    scadPlayers.push(await getByYahooIds(yahooLeagueId, yp.player_id))
  }

  return scadPlayers
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
  getAllTeamPlayersByScadTeamId,
  getAllForTeamByYahooIds,
  create,
  update,
  remove,
}
