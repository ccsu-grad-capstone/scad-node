const debug = require('debug')('app:scadDashboardController')
const scadTeamController = require('./scadTeam')
const scadPlayerController = require('./scadPlayer')
const userDefaultLeagueController = require('./userDefaultLeague')
const yf = require('../services/yahooFantasy')

async function getDashboardDetails(access_token) {
  let guid = '2OMLCT3C2A42Z3FCGWJZCIDYLU'

  // Check if user had a default league
  // If exists, pass in default league..
  let udl = await userDefaultLeagueController.getByGuid(guid)
  let yg = await yf.getCurrentYahooGame(access_token)

  // If UDL exists and yahooGameId is current, we're good to go. Gather info and return..
  if (udl && udl.yahooGameId === yg.game_id) {
    return await gatherCurrentSeasonDetails(access_token, udl.scadLeagueId)
    
    // If UDL exists, but yahooGameId isn't current, we need to..
    // Check if yahooLeague is renew, and renew if so, 
    // Otherwise return previous years info..
  } else if (udl) {
    // let prevSeason = await yf.getPreviousYearYahooLeague(access_token)
    // if (prevSeason.renew) {
    //   // renewScadLeagueForCurrentSeason (check scadservices..)
    //   // Need to make updates to UDL
    //   return gatherCurrentSeasonDetails(access_token, udl.scadLeagueId)
    // } else {
    //   return gatherPreviousSeasonDetails(access_token)
    // }
  } else {
    debug('Scad default league not found.  Returning Register Dashboard Details..')
    return {
      key: 'Register',
      yahooCommishLeagues: await yf.getAllCommishLeagues(access_token),
    }
  }
}

async function gatherCurrentSeasonDetails(access_token, scadLeague) {
  debug('gatherCurrentSeasonDetails')
  try {
    return {
      key: 'League',
      scadLeague: scadLeague,
      scadMyTeam: await scadTeamController.getMyTeamByScadLeagueId(scadLeague._id, access_token),
      scadMyPlayers: await scadPlayerController.getMyPlayersByScadId(scadLeague._id, access_token),
      season: scadLeague.seasonYear,
      yahooLeague: await yf.getLeagueMeta(access_token, scadLeague.yahooLeagueId),
      yahooMyTeam: await yf.getMyTeam(access_token, scadLeague.yahooLeagueId),
    }
  } catch (error) {
    debug(error)
  }
}

module.exports = {
  getDashboardDetails,
}
