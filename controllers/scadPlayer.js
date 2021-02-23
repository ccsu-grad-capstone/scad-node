const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const ScadLeague = require('../models/ScadLeague')
const scadTeamController = require('./scadTeam')
const yf = require('../services/yahooFantasy')

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

async function getAllByYahooLeagueId(yahooGameKey, yahooLeagueId) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooGameKey, yahooLeagueId)
  let sl = await ScadLeague.findOne({ yahooGameKey: yahooGameKey, yahooLeagueId: yahooLeagueId })
  return await getAllByScadLeagueId(sl._id)
}

async function getMyPlayersByScadId(scadLeagueId, access_token) {
  debug('Getting all ScadPlayers for my team by scad ids', scadLeagueId)

  let scadLeague = await ScadLeague.findById(scadLeagueId)
  let myt = await yf.getMyTeam(access_token, scadLeague.yahooLeagueId, scadLeague.yahooGameKey)
  return await getScadPlayersFromYahooTeam(myt, scadLeague.yahooLeagueId)
}

async function getMyPlayersByYahooId(yahooGameKey, yahooLeagueId, access_token) {
  debug('Getting all ScadPlayers for my team by yahooLeagueId', yahooGameKey, yahooLeagueId)

  let myt = await yf.getMyTeam(access_token, yahooLeagueId, yahooGameKey)
  return await getScadPlayersFromYahooTeam(myt, yahooLeagueId)
}

async function getAllTeamPlayersByScadTeamId(scadTeamId, access_token) {
  debug('Getting all ScadPlayers for team by scad ids')

  let scadTeam = await scadTeamController.getById(scadTeamId)
  const yt = await yf.getCurrentSeasonTeamWithRoster(access_token, scadTeam.yahooLeagueId, scadTeam.yahooTeamId)

  return await getScadPlayersFromYahooTeam(yt, scadTeam.yahooLeagueId)
}

async function getAllForTeamByYahooIds(gameKey, yahooLeagueId, yahooTeamId, access_token) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', gameKey, yahooLeagueId, yahooTeamId)

  const yt = await yf.getTeamWithRoster(access_token, yahooLeagueId, yahooTeamId, gameKey)

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

  if (player) {
    Object.assign(player, scadPlayer)
    player.updated = moment().format()
    await player.save()
  
    return player
  } else {
    throw ('Player not found.')
  }
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
