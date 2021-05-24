const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')
const ScadLeague = require('../models/ScadLeague')
const scadTeamController = require('./scadTeam')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  // debug('Getting ScadPlayer by id:', id)
  return await ScadPlayer.findById(id)
}

async function getByYahooIds(yahooGameKey, yahooLeagueId, yahooPlayerId) {
  // debug(yahooGameKey, yahooLeagueId, yahooPlayerId)
  let sl = await ScadLeague.findOne({ yahooGameKey: yahooGameKey, yahooLeagueId: yahooLeagueId })
  return await ScadPlayer.findOne({ scadLeagueId: sl._id, yahooPlayerId: yahooPlayerId })
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

async function getMyPlayersByScadId(scadLeagueId, accesstoken) {
  debug('Getting all ScadPlayers for my team by scad ids', scadLeagueId)

  let scadLeague = await ScadLeague.findById(scadLeagueId)
  let myt = await yf.getMyTeam(accesstoken, scadLeague.yahooLeagueId, scadLeague.yahooGameKey)
  // debug(myt)
  return await getScadPlayersFromYahooTeam(myt, scadLeague.yahooLeagueId, scadLeague.yahooGameKey)
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

async function getAllForTeamByYahooIds(yahooGameKey, yahooLeagueId, yahooTeamId, accesstoken) {
  debug('Getting all ScadPlayers for league by yahooLeagueId', yahooGameKey, yahooLeagueId, yahooTeamId)

  const yt = await yf.getTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId, yahooGameKey)

  return await getScadPlayersFromYahooTeam(yt, yahooLeagueId, yahooGameKey)
}

async function getScadPlayersFromYahooTeam(yahooTeam, yahooLeagueId, currentSeasonGameKey) {
  debug('getScadPlayersFromYahooTeam')
  let scadPlayers = []
  let yahooGameKey
  if (currentSeasonGameKey) yahooGameKey = currentSeasonGameKey
  else yahooGameKey = yahooTeam.team_key.split('.')[0]
  for (const yp of yahooTeam.roster) {
    scadPlayers.push(await getByYahooIds(yahooGameKey, yahooLeagueId, yp.player_id))
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

  scadPlayer.updated = moment().format()
  return await ScadPlayer.findByIdAndUpdate(id, scadPlayer, { new: true, runValidators: true }).exec()
}

async function remove(id) {
  debug('Removing ScadPlayer: ', id)
  return await ScadPlayer.findByIdAndRemove(id).exec()
}

async function updatePlayersSalaries(list) {
  debug('Updating Players Salaries')
  if (list) {
    for (const p of list) {
      let player = await getById(p._id)
      
      // debug(p)
      // debug(player)

      player.salary = p.newSalary
      player.previousYearSalary = p.prevSalary
      let log

      if (p.wasFranchiseTagged === 'true' || p.wasFranchiseTagged === 'TRUE') {
        player.isFranchiseTag = false
        log = {
          originalSalary: p.prevSalary,
          newSalary: 0,
          type: 'Franchise Tag Reset',
          team: player.history[player.history.length - 1].team,
          user: undefined,
          comment: 'Resetting salary, player was franchised previous year.',
          date: moment().format(),
        }
      } else {
        log = {
          originalSalary: p.prevSalary,
          newSalary: p.newSalary,
          type: 'Offseason Salary Correction',
          team: player.history[player.history.length - 1].team,
          user: undefined,
          comment: 'Salary adjustment',
          date: moment().format(),
        }
      }
      player.history.push(log)
      await update(player._id, player)
      break
    }
  }
}

module.exports = {
  getById,
  getByYahooIds,
  getAllByScadLeagueId,
  getAllByYahooLeagueId,
  getMyPlayersByScadId,
  getMyPlayersByYahooId,
  getAllTeamPlayersByScadTeamId,
  getAllForTeamByYahooIds,
  create,
  update,
  remove,
  updatePlayersSalaries,
}
