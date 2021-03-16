const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const ScadLeague = require('../models/ScadLeague')
const scadTeamController = require('./scadTeam')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  debug('Getting ScadPlayer by id:', id)
  return await ScadPlayer.findById(id)
}

async function getByYahooIds(gameKey, yahooLeagueId, yahooPlayerId) {
  // debug(gameKey, yahooLeagueId, yahooPlayerId)
  let sl = await ScadLeague.findOne({yahooGameKey: gameKey, yahooLeagueId: yahooLeagueId})
  return await ScadPlayer.findOne({ scadLeagueId: sl._id, yahooPlayerId: yahooPlayerId })
}

async function getAllByScadLeagueId(id) {
  debug('Getting all ScadPlayers for league scadLeagueId', id)
  return await ScadPlayer.find({ scadLeagueId: id })
}

async function getAllPlayersByScadLeagueIdWithYahooTeam(id, gameKey, accesstoken) {
  debug('Getting all ScadPlayers for league scadLeagueId with yahoo team', id)
  let scadPlayers = await ScadPlayer.find({ scadLeagueId: id })
  let yahooPlayers = await yf.getAllLeaguePlayers(accesstoken, scadPlayers[0].yahooLeagueId)

  for (const sp of scadPlayers) {
    sp.yahooTeamId = yahoo
  }
}

async function getAllByYahooLeagueId(yahooGameKey, yahooLeagueId) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooGameKey, yahooLeagueId)
  let sl = await ScadLeague.findOne({ yahooGameKey: yahooGameKey, yahooLeagueId: yahooLeagueId })
  return await getAllByScadLeagueId(sl._id)
}

async function getMyPlayersByScadId(scadLeagueId, accesstoken) {
  debug('Getting all ScadPlayers for my team by scad ids', scadLeagueId)

  let scadLeague = await ScadLeague.findById(scadLeagueId)
  let myt = await yf.getMyTeam(accesstoken, scadLeague.yahooLeagueId, scadLeague.yahooGameKey)
  return await getScadPlayersFromYahooTeam(myt, scadLeague.yahooLeagueId)
}

async function getMyPlayersByYahooId(yahooGameKey, yahooLeagueId, accesstoken) {
  debug('Getting all ScadPlayers for my team by yahooLeagueId', yahooGameKey, yahooLeagueId)

  let myt = await yf.getMyTeam(accesstoken, yahooLeagueId, yahooGameKey)
  return await getScadPlayersFromYahooTeam(myt, yahooLeagueId)
}

async function getAllTeamPlayersByScadTeamId(scadTeamId, accesstoken) {
  debug('Getting all ScadPlayers for team by scad ids')

  let scadTeam = await scadTeamController.getById(scadTeamId)
  const yt = await yf.getCurrentSeasonTeamWithRoster(accesstoken, scadTeam.yahooLeagueId, scadTeam.yahooTeamId)

  return await getScadPlayersFromYahooTeam(yt, scadTeam.yahooLeagueId)
}

async function getAllForTeamByYahooIds(gameKey, yahooLeagueId, yahooTeamId, accesstoken) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', gameKey, yahooLeagueId, yahooTeamId)

  const yt = await yf.getTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId, gameKey)

  return await getScadPlayersFromYahooTeam(yt, yahooLeagueId)
}

async function getScadPlayersFromYahooTeam(yahooTeam, yahooLeagueId) {
  debug('getScadPlayersFromYahooTeam')
  let scadPlayers = []
  let gameKey = yahooTeam.team_key.split('.')[0]
  for (const yp of yahooTeam.roster) {
    scadPlayers.push(await getByYahooIds(gameKey, yahooLeagueId, yp.player_id))
  }
  return scadPlayers
}

async function create(scadPlayer) {
  debug('Creating new ScadPlayer')
  const player = new ScadPlayer(scadPlayer)

  player.created = moment().format()
  player.updated = moment().format()

  await player.save()

  return player
}

async function update(id, scadPlayer) {
  debug('Updating ScadPlayer: ', id)
  
  const player = await getById(id)

  if (player) {
    Object.assign(player, scadPlayer)
    player.updated = moment().format()
    await player.save()
    debug('Done Updating Player')
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
  getByYahooIds,
  getAllByScadLeagueId,
  getAllPlayersByScadLeagueIdWithYahooTeam,
  getAllByYahooLeagueId,
  getMyPlayersByScadId,
  getMyPlayersByYahooId,
  getAllTeamPlayersByScadTeamId,
  getAllForTeamByYahooIds,
  create,
  update,
  remove,
}
