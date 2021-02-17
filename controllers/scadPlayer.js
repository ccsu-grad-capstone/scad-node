const debug = require('debug')('app:ScadPlayerController')
const moment = require('moment')
const ScadPlayer = require('../models/ScadPlayer')

async function getAll() {
  debug('Getting all ScadPlayers')
  return await ScadPlayer.find()
}

async function getById(id) {
  debug('Getting ScadPlayer by id: ')
  return await ScadPlayer.findById(id)
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

module.exports = { getAll, getById, create, update, remove }
