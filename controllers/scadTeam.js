const debug = require('debug')('app:ScadTeamController')
const moment = require('moment')
const ScadTeam = require('../models/ScadTeam')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  debug('Getting ScadTeam by id: ')
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

async function getAllByYahooLeagueId(id) {
  debug('Getting all ScadTeams by yahooLeagueId', id)
  return await ScadTeam.find({ yahooLeagueId: id })
}

async function getMyTeamByScadLeagueId(id, access_token) {
  debug('Getting my ScadTeam for scadLeagueId', id)

  const scadLeagueTeams = await getAllByScadLeagueId(id)
  const myYahooTeams = await yf.getMyTeams(access_token)

  let yahooTeam = myYahooTeams.find((yt) => yt.team_key.includes(scadLeagueTeams[0].yahooLeagueId))
  return scadLeagueTeams.find((st) => st.yahooTeamId === yahooTeam.team_id)
}

async function getMyTeamByYahooLeagueId(yahooLeagueId, access_token) {
  debug('Getting my ScadTeam for yahooLeagueId', yahooLeagueId)

  const scadLeagueTeams = await getAllByYahooLeagueId(yahooLeagueId)
  const myYahooTeam = await yf.getMyTeam(access_token, yahooLeagueId)

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

  Object.assign(team, scadTeam)
  team.updated = moment().format()
  await team.save()

  return team
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
