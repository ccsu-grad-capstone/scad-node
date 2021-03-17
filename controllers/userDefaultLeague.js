const debug = require('debug')('app:userDefaultLeagueController')
const moment = require('moment')
const UserDefaultLeague = require('../models/UserDefaultLeague')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  debug('Getting UserDefaultLeague by id: ')
  return await UserDefaultLeague.findById(id).populate('scadLeagueId')
}

async function getByGuid(guid) {
  debug('Getting UserDefaultLeague by guid: ')    
  return await UserDefaultLeague.findOne({ guid: guid }).populate('scadLeagueId')
}

async function getByYahooLeagueId (yahooLeagueId) {
  debug('Getting UserDefaultLeague by getByYahooLeagueId: ')    
  return await UserDefaultLeague.find({ yahooLeagueId: yahooLeagueId })
}

async function create(userDefaultLeague) {
  debug('Creating new UserDefaultLeague')

  // Check if UDL already exists for YahooLeagueId
  if (await UserDefaultLeague.findOne({ guid: userDefaultLeague.guid })) {
    throw 'Default League for user already exists'
  }
  const udl = new UserDefaultLeague(userDefaultLeague)

  udl.created = moment().format()
  udl.updated = moment().format()

  await udl.save()
}

async function update(guid, userDefaultLeague) {
  debug('Updating UserDefaultLeague: ', guid)
  const udl = await getByGuid(guid)

  Object.assign(udl, userDefaultLeague)
  udl.updated = moment().format()
  await udl.save()

  return udl
}

async function remove(guid) {
  debug('Removing UserDefaultLeague: ', guid)
  return await UserDefaultLeague.findByIdAndRemove(guid).exec()
}

module.exports = { getById, getByGuid, getByYahooLeagueId, create, update, remove }
