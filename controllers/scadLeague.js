const debug = require('debug')('app:scadLeagueController')
const moment = require('moment')
const ScadLeague = require('../models/ScadLeague')

async function getAll() {
  debug('Getting all ScadLeagues')
  return await ScadLeague.find()
}

async function getById(id) {
  debug('Getting ScadLeague by id: ')
  return await ScadLeague.findById(id)
}

async function create(scadLeague) {
  debug('Creating new ScadLeague')
  const league = new ScadLeague(scadLeague)

  league.created = moment().format()
  league.updated = moment().format()

  await league.save()
}

async function update(id, scadLeague) {
  debug('Updating ScadLeague: ', id)
  const league = await getById(id)

  Object.assign(league, scadLeague)
  league.updated = moment().format()
  await league.save()

  return league
}

async function remove(id) {
  debug('Removing ScadLeague: ', id)
  return await ScadLeague.findByIdAndRemove(id).exec()
}

module.exports = { getAll, getById, create, update, remove }
