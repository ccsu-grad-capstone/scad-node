const debug = require('debug')('app:scadDashboardController')
const scadTeamController = require('./scadTeam')
const scadPlayerController = require('./scadPlayer')
const scadLeagueController = require('../controllers/scadLeague')
const userDefaultLeagueController = require('./userDefaultLeague')
const usersController = require('./users')
const yf = require('../services/yahooFantasy')

async function getDashboardDetails(accesstoken, idToken) {

  try {
    // Check if user had a default league
    // If exists, pass in default league..
    let udl = await userDefaultLeagueController.getByGuid(await usersController.getUserGuid(idToken))
    let cyg = await yf.getCurrentYahooGame(accesstoken)

    // If UDL exists and yahooGameKey is current, we're good to go. Gather info and return..
    if (udl && udl.yahooGame.game_key === cyg.game_key) {
      // if (false) {
      debug('UDL found and yahooGameKey matches.. retrieving current season league details.')
      return await getDashboardResponse(accesstoken, udl.scadLeagueId._id, false)

      // If UDL exists, but yahooGameKey isn't current, we need to..
      // Check if yahooLeague is renew, and renew if so,
      // Otherwise return previous years info..
    } else if (udl && udl.yahooGame.game_key !== cyg.game_key) {
      // } else if (true) {
      debug('UDL found BUT yahooGameKey doesnt match current season.. ')
      let pyl = await yf.getLeagueDetails(accesstoken, 'meta', udl.yahooLeagueId, udl.yahooGame.game_key)
      // let pyl = await yf.getLeagueDetails(accesstoken, 'meta', '22351', '390')
      if (pyl.renewed) {
        debug('Previous yahoo league has renew value, meaning we need to renewScadLeague..')
        let renewed = pyl.renewed.split('_')
        let renewedLeagueId = renewed[1]
        return await getDashboardResponse(accesstoken, udl.scadLeagueId._id, renewedLeagueId)
      } else {
        debug(
          'Previous yahoo league is MISSING league renew value, meaning yahoo league is not renewed yet, retrieving previousSeasonDetails'
        )
        return await getDashboardResponse(accesstoken, udl.scadLeagueId._id, false)
      }
    } else {
      debug('Scad default league not found.  Returning Register Dashboard Details..')
      return {
        key: 'Register',
        yahooCommishLeagues: await yf.getAllCommishLeagues(accesstoken),
      }
    }
  } catch (error) {
    throw error
  }
}

async function getDashboardResponse(accesstoken, scadLeagueId, renewed) {
  debug('getDashboardResponse')
  let sl = await scadLeagueController.getById(scadLeagueId)
  try {
    return {
      key: 'League',
      renewedAvailable: renewed,
      scadLeague: sl,
      scadMyTeam: await scadTeamController.getMyTeamByScadLeagueId(
        sl._id,
        accesstoken,
        sl.yahooGameKey
      ),
      scadMyPlayers: await scadPlayerController.getMyPlayersByScadId(sl._id, accesstoken),
      season: sl.seasonYear,
      yahooLeague: await yf.getLeagueDetails(accesstoken, 'meta', sl.yahooLeagueId, sl.yahooGameKey),
      yahooMyTeam: await yf.getMyTeam(accesstoken, sl.yahooLeagueId, sl.yahooGameKey),
    }
  } catch (error) {
    debug('ERR getDashboardResponse', error)
  }
}

module.exports = {
  getDashboardDetails,
}
