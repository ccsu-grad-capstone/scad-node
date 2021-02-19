const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const scadTeamController = require('./scadTeam')
const yf = require('../services/yahooFantasy')
const ScadLeague = require('../models/ScadLeague')

async function getById(id) {
  debug('Getting ScadPlayer by id: ')
  return await ScadPlayer.findById(id)
}

async function getByYahooIds(yahooLeagueId, yahooPlayerId) {
  return await ScadPlayer.findOne({ yahooPlayerId: yahooPlayerId, yahooLeagueId: yahooLeagueId })
}

async function getAllByScadLeagueId(id) {
  debug('Getting all ScadPlayers for league scadLeagueId', id)
  return await ScadPlayer.find({ scadLeagueId: id })
}

async function getAllByYahooLeagueId(id) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', id)
  return await ScadPlayer.find({ yahooLeagueId: id })
}

async function getMyPlayersByScadId(scadLeagueId, access_token) {
  debug('Getting all ScadPlayers for my team by scad ids', scadLeagueId)

  let scadLeague = await ScadLeague.findById(scadLeagueId)
  let myt = await yf.getMyTeam(access_token, scadLeague.yahooLeagueId)
  return await getScadPlayersFromYahooTeam(myt, scadLeague.yahooLeagueId)
}

async function getMyPlayersByYahooId(yahooLeagueId, access_token) {
  debug('Getting all ScadPlayers for my team by yahooLeagueId', yahooLeagueId)

  let myt = await yf.getMyTeam(access_token, yahooLeagueId)
  return await getScadPlayersFromYahooTeam(myt, yahooLeagueId)
}

async function getAllTeamPlayersByScadTeamId(scadTeamId, access_token) {
  debug('Getting all ScadPlayers for team by scad ids')

  let scadTeam = await scadTeamController.getById(scadTeamId)
  const yt = await yf.getTeamWithRoster(access_token, scadTeam.yahooLeagueId, scadTeam.yahooTeamId)

  return await getScadPlayersFromYahooTeam(yt, scadTeam.yahooLeagueId)
}

async function getAllForTeamByYahooIds(yahooLeagueId, yahooTeamId, access_token) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooLeagueId)

  const yt = await yf.getTeamWithRoster(access_token, yahooLeagueId, yahooTeamId)

  return await getScadPlayersFromYahooTeam(yt, yahooLeagueId)
}

async function getScadPlayersFromYahooTeam(yahooTeam, yahooLeagueId) {
  debug('getScadPlayersFromYahooTeam')
  let scadPlayers = []
  for (const yp of yahooTeam.roster) {
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
