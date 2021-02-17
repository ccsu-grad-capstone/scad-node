const debug = require('debug')('app:ScadTeamController')
const moment = require('moment')
const ScadTeam = require('../models/ScadTeam')

async function getAll() {
  debug('Getting all ScadTeams')
  return await ScadTeam.find()
}

async function getById(id) {
  debug('Getting ScadTeam by id: ')
  return await ScadTeam.findById(id)
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

module.exports = { getAll, getById, create, update, remove }
