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
  let cyg = await yf.getCurrentYahooGame(access_token)

  debug(udl.yahooGame.game_key, typeof udl.yahooGame.game_key)
  debug(cyg.game_key, typeof cyg.game_key)
  // If UDL exists and yahooGameKey is current, we're good to go. Gather info and return..
  if (udl && udl.yahooGame.game_key === cyg.game_key) {
    debug('UDL found and yahooGameKey matches.. retrieving current season league details.')
    return await gatherCurrentSeasonDetails(access_token, udl.scadLeagueId)
    
    // If UDL exists, but yahooGameKey isn't current, we need to..
    // Check if yahooLeague is renew, and renew if so, 
    // Otherwise return previous years info..
  } else if (udl && udl.yahooGame.game_key !== cyg.game_key) {
    debug('UDL found BUT yahooGameKey doesnt match current season.. ')
    let pyl = await yf.getPreviousSeasonLeagueDetails(access_token, 'meta', udl.yahooLeagueId, cyg.season)
    if (pyl.renew) {
      debug('Previous yahoo league has renew value, meaning we need to renewScadLeague..')
      // renewScadLeagueForCurrentSeason (check scadservices..)
      // Need to make updates to UDL
      return gatherCurrentSeasonDetails(access_token, udl.scadLeagueId) // udl.scadLeagueId need to update here with the renewed league
    } else {
      debug('Previous yahoo league is MISSING league renew value, meaning yahoo league is not renewed yet, retrieving previousSeasonDetails')
      return gatherPreviousSeasonDetails(access_token, udl.scadLeagueId)
    }
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
      scadMyTeam: await scadTeamController.getMyTeamByScadLeagueId(scadLeague._id, access_token, scadLeague,yahooGameKey),
      scadMyPlayers: await scadPlayerController.getMyPlayersByScadId(scadLeague._id, access_token),
      season: scadLeague.seasonYear,
      yahooLeague: await yf.getCurrentSeasonLeagueDetails(access_token, 'meta', scadLeague.yahooLeagueId),
      yahooMyTeam: await yf.getMyTeam(access_token, scadLeague.yahooLeagueId, scadLeague,yahooGameKey),
    }
  } catch (error) {
    debug('ERR gatherCurrentSeasonDetails', error)
  }
}

async function gatherPreviousSeasonDetails(access_token, scadLeague) {
  debug('gatherPreviousSeasonDetails')
  try {
    return {
      key: 'League',
      scadLeague: scadLeague,
      scadMyTeam: await scadTeamController.getMyTeamByScadLeagueId(scadLeague._id, access_token, scadLeague,yahooGameKey),
      scadMyPlayers: await scadPlayerController.getMyPlayersByScadId(scadLeague._id, access_token),
      season: scadLeague.seasonYear,
      yahooLeague: await yf.getLeagueDetails(access_token, 'meta', scadLeague.yahooLeagueId, scadLeague.yahooGame.game_key),
      yahooMyTeam: await yf.getMyTeam(access_token, scadLeague.yahooLeagueId, scadLeague,yahooGameKey),
    }
  } catch (error) {
    debug('ERR gatherPreviousSeasonDetails', error)
  }
}

module.exports = {
  getDashboardDetails,
}
