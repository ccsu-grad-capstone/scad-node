const debug = require('debug')('app:scadDashboardController')
const scadTeamController = require('./scadTeam')
const scadPlayerController = require('./scadPlayer')
const userDefaultLeagueController = require('./userDefaultLeague')
const usersController = require('./users')
const yf = require('../services/yahooFantasy')

async function getDashboardDetails(access_token, idToken) {

  try {
    // Check if user had a default league
    // If exists, pass in default league..
    let udl = await userDefaultLeagueController.getByGuid(await usersController.getUserGuid(idToken))
    let cyg = await yf.getCurrentYahooGame(access_token)

    // If UDL exists and yahooGameKey is current, we're good to go. Gather info and return..
    if (udl && udl.yahooGame.game_key === cyg.game_key) {
      // if (false) {
      debug('UDL found and yahooGameKey matches.. retrieving current season league details.')
      return await getDashboardResponse(access_token, udl.scadLeagueId, false)

      // If UDL exists, but yahooGameKey isn't current, we need to..
      // Check if yahooLeague is renew, and renew if so,
      // Otherwise return previous years info..
    } else if (udl && udl.yahooGame.game_key !== cyg.game_key) {
      // } else if (true) {
      debug('UDL found BUT yahooGameKey doesnt match current season.. ')
      let pyl = await yf.getLeagueDetails(access_token, 'meta', udl.yahooLeagueId, udl.yahooGame.game_key)
      // let pyl = await yf.getLeagueDetails(access_token, 'meta', '22351', '390')
      if (pyl.renewed) {
        debug('Previous yahoo league has renew value, meaning we need to renewScadLeague..')
        let renewed = pyl.renewed.split('_')
        let renewedLeagueId = renewed[1]
        return await getDashboardResponse(access_token, udl.scadLeagueId, renewedLeagueId)
      } else {
        debug(
          'Previous yahoo league is MISSING league renew value, meaning yahoo league is not renewed yet, retrieving previousSeasonDetails'
        )
        return await getDashboardResponse(access_token, udl.scadLeagueId, false)
      }
    } else {
      debug('Scad default league not found.  Returning Register Dashboard Details..')
      return {
        key: 'Register',
        yahooCommishLeagues: await yf.getAllCommishLeagues(access_token),
      }
    }
  } catch (error) {
    throw error
  }
}

async function getDashboardResponse(access_token, scadLeague, renewed) {
  debug('getDashboardResponse')
  try {
    return {
      key: 'League',
      renewedAvailable: renewed,
      scadLeague: scadLeague,
      scadMyTeam: await scadTeamController.getMyTeamByScadLeagueId(
        scadLeague._id,
        access_token,
        scadLeague.yahooGameKey
      ),
      scadMyPlayers: await scadPlayerController.getMyPlayersByScadId(scadLeague._id, access_token),
      season: scadLeague.seasonYear,
      yahooLeague: await yf.getLeagueDetails(access_token, 'meta', scadLeague.yahooLeagueId, scadLeague.yahooGameKey),
      yahooMyTeam: await yf.getMyTeam(access_token, scadLeague.yahooLeagueId, scadLeague.yahooGameKey),
    }
  } catch (error) {
    debug('ERR getDashboardResponse', error)
  }
}

module.exports = {
  getDashboardDetails,
}
