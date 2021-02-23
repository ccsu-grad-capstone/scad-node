const debug = require('debug')('app:ScadTeamController')
const moment = require('moment')
const ScadTeam = require('../models/ScadTeam')
const yf = require('../services/yahooFantasy')
const ScadLeague = require('../models/ScadLeague')

async function getById(id) {
  debug('Getting ScadTeam by id: ', id)
  return await ScadTeam.findById(id)
}

async function getByYahooIds(yahooLeagueId, yahooTeamId) {
  debug('Getting ScadTeam by YahooIds: ')
  return await ScadTeam.find({ yahooLeagueId: yahooLeagueId, yahooTeamId: yahooTeamId })
}

async function getAllByScadLeagueId(id) {
  debug('Getting all ScadTeams for scadLeagueId', id)
  return await ScadTeam.find({ scadLeagueId: id })
}

async function getAllByYahooLeagueId(yahooGameKey, yahooLeagueId) {
  debug('Getting all ScadTeams by yahooLeagueId', yahooGameKey, yahooLeagueId)
  const sl = await ScadLeague.findOne({ yahooGameKey: yahooGameKey, yahooLeagueId: yahooLeagueId })
  return await ScadTeam.find({ scadLeagueId: sl._id })
}

async function getMyTeamByScadLeagueId(id, access_token, yahooGameKey) {
  debug('Getting my ScadTeam for scadLeagueId', id)

  const scadLeagueTeams = await getAllByScadLeagueId(id)
  
  let myYahooTeams
  if (!yahooGameKey) {
    let yg = await yf.getCurrentYahooGame(access_token)
    myYahooTeams = await yf.getMyTeams(access_token, yg.game_key)
  } else {
    myYahooTeams = await yf.getMyTeams(access_token, yahooGameKey)
  }
  let yahooTeam = myYahooTeams.find((yt) => yt.team_key.includes(scadLeagueTeams[0].yahooLeagueId))
  return scadLeagueTeams.find((st) => st.yahooTeamId === yahooTeam.team_id)
}

async function getMyTeamByYahooLeagueId(yahooGameKey, yahooLeagueId, access_token) {
  debug('Getting my ScadTeam for yahooLeagueId', yahooGameKey, yahooLeagueId)

  const scadLeagueTeams = await getAllByYahooLeagueId(yahooGameKey, yahooLeagueId)
  const myYahooTeam = await yf.getMyTeam(access_token, yahooLeagueId, yahooGameKey)

  return scadLeagueTeams.find((st) => st.yahooTeamId === myYahooTeam.team_id)
}

async function create(scadTeam) {
  debug('Creating new ScadTeam')
  const team = new ScadTeam(scadTeam)

  team.created = moment().format()
  team.updated = moment().format()

  await team.save()
}

async function update(id, scadTeam) {
  debug('Updating ScadTeam: ', id)

  const team = await getById(id)
  if (team) {
    Object.assign(team, scadTeam)
    team.updated = moment().format()
    await team.save()
  
    return
  } else {
    throw('Team not found.')
  }

}

async function remove(id) {
  debug('Removing ScadTeam: ', id)
  return await ScadTeam.findByIdAndRemove(id).exec()
}

module.exports = {
  getById,
  getByYahooIds,
  getAllByScadLeagueId,
  getAllByYahooLeagueId,
  getMyTeamByScadLeagueId,
  getMyTeamByYahooLeagueId,
  create,
  update,
  remove,
}
