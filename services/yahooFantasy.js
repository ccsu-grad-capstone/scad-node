var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasy')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')
const fs = require('fs')
const GAMEKEY = 'nfl'
const GAMEKEYS = {
  2020: '399',
  2019: '390',
  2018: '380'
}

function yahooFantasy() {
  async function getGames(accessToken) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.user.games()
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getGameKey (accessToken, yahooLeagueId) {
    console.log('getGameKey')
       try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.user.game_leagues('nfl')
      debug(result)
      if (result && checkIfLeagueExists(result.games[0].leagues, yahooLeagueId)) {
        debug('passed')
        return 'nfl'
      } else {
        debug('failed')
        return '390'
      }

      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  function checkIfLeagueExists (leagues, id) {
    debug('checkIfLeagueExists')
    return leagues.find(l => l[0].league_id == '1302')
  }

  async function getMyTeams(accessToken) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.user.game_teams(`${GAMEKEY}`)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getMyTeam(accessToken, yahooLeagueId) {
    try {
      let myTeams = await getMyTeams(accessToken)
      let myTeam = myTeams.teams[0].teams.find((t) => t.team_key.includes(yahooLeagueId))
      return await getRoster(accessToken, yahooLeagueId, myTeam.team_id)
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getLeagueMeta(accessToken, yahooLeagueId) {
    console.log('getLeagueMeta')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)
      
      let result = await yf.league.meta(`${GAMEKEY}.l.${yahooLeagueId}`)

      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getLeagueSettings(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.league.settings(`${GAMEKEY}.l.${yahooLeagueId}`)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getLeagueStandings(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.league.standings(`${GAMEKEY}.l.${yahooLeagueId}`)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getLeagueTeams(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.league.teams(`${GAMEKEY}.l.${yahooLeagueId}`)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getAllUsersLeagues(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.user.game_leagues(`${GAMEKEY}`)
      let leagues = []
      result.games[0].leagues.forEach((l) => {
        leagues.push(l[0])
      })
      return leagues
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getLeagueTransactions(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.league.transactions(`${GAMEKEY}.l.${yahooLeagueId}`)
      result.transactions = result.transactions.slice(0, 50)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  async function getRoster(accessToken, yahooLeagueId, yahooTeamId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)

      let result = await yf.roster.players(`${GAMEKEY}.l.${yahooLeagueId}.t.${yahooTeamId}`)
      return result
    } catch (error) {
      debug('ERR', error)
    }
  }

  return {
    getGames,
    getGameKey,
    getMyTeams,
    getMyTeam,
    getLeagueMeta,
    getLeagueSettings,
    getLeagueStandings,
    getLeagueTeams,
    getAllUsersLeagues,
    getLeagueTransactions,
    getRoster,
  }
}

module.exports = yahooFantasy()
