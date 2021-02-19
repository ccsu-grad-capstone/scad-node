const debug = require('debug')('app:scadLeagueController')
const moment = require('moment')
const ScadLeague = require('../models/ScadLeague')
const scadTeamController = require('./scadTeam')
const scadPlayerController = require('./scadPlayer')
const userDefaultLeagueController = require('./userDefaultLeague')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  debug('Getting ScadLeague by id: ')
  return await ScadLeague.findById(id)
}

async function getByYahooLeagueId(yahooLeagueId) {
  debug('Getting ScadLeague by yahooLeagueId: ')
  return await ScadLeague.findOne({ yahooLeagueId: yahooLeagueId })
}

async function create(scadLeague, access_token) {
  try {
    debug('Creating new ScadLeague')

    // Check if SCAD league already exists for YahooLeagueId

    if (await ScadLeague.findOne({ yahooLeagueId: scadLeague.yahooLeagueId })) {
      throw 'It appears a SCAD league already exists for this Yahoo League. '
    }

    // Create and save SCAD league to db
    const newScadLeague = new ScadLeague(scadLeague)
    const currentYahooGame = await yf.getCurrentYahooGame(access_token)
    newScadLeague.yahooGameId = currentYahooGame.game_id
    newScadLeague.created = moment().format()
    newScadLeague.updated = moment().format()
    await newScadLeague.save()

    const yahooTeams = await yf.getLeagueTeams(access_token, scadLeague.yahooLeagueId)
    const yahooLeaguePlayers = await yf.getAllLeaguePlayers(access_token, scadLeague.yahooLeagueId)

    for (const yt of yahooTeams) {
      // For each Yahoo Team, create a SCAD team..
      let st = {
        yahooTeamId: yt.team_id,
        yahooLeagueId: scadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: 0,
        isFranchiseTag: false,
        exceptionIn: 0,
        exceptionOut: 0,
      }
      await scadTeamController.create(st)

      // For each Yahoo Team and Manager of team, create a User Default League
      for (const manager of yt.managers) {
        if (await userDefaultLeagueController.getByGuid(manager.guid)) {
          debug('User Default League already exists for user ', manager.nickname)
        } else {
          let udl = {
            yahooGameId: newScadLeague.yahooGameId,
            yahooLeagueId: newScadLeague.yahooLeagueId,
            scadLeagueId: newScadLeague._id,
            guid: manager.guid,
            updated: moment().format(),
            created: moment().format(),
          }
          await userDefaultLeagueController.create(udl)
        }
      }
    }
    debug('Finished creating SCAD teams and UDLs')

    // For each Yahoo Player, create a SCAD player..
    for (const yp of yahooLeaguePlayers) {
      let sp = {
        yahooPlayerId: yp.player_id,
        yahooLeagueId: scadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: 0,
        isFranchiseTag: false,
        previousYearSalary: 0,
      }
      await scadPlayerController.create(sp)
    }

    debug('Finished creating SCAD players')
  } catch (error) {
    if (JSON.stringify(error).includes('already exists')) {
      throw error
    } else {
      throw 'An Error Occured Creating Scad League'
    }
  }
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

async function getAll() {
  debug('Getting all ScadLeagues')
  return await ScadLeague.find()
}

// INCOMPLETE
async function getDefault() {
  debug('Getting default Scad League')
  return await ScadLeague.find()
}

// INCOMPLETE
async function updateDefault() {
  debug('Update default Scad League')
  return await ScadLeague.find()
}

module.exports = { getAll, getById, getByYahooLeagueId, create, update, remove, getDefault, updateDefault }
