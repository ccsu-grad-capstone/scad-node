var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasyController')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')
const GAMEKEYS = {
  current: 'nfl',
  2020: '399',
  2019: '390',
}

function yahooFantasy() {
  async function getGames(accesstoken) {
    debug('getGames')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.user.games()
      return result
    } catch (error) {
      debug('ERR getGames', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getGameKey(accesstoken, yahooLeagueId) {
    debug('getGameKey')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.user.game_leagues('nfl')
      // // debug(result)
      // if (result && checkIfLeagueExists(result.games[0].leagues, yahooLeagueId)) {
      //   // debug('passed')
      //   return 'nfl'
      // } else {
      //   // debug('failed')
      //   return '390'
      // }

      return result
    } catch (error) {
      debug('ERR getGameKey', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  function checkIfLeagueExists(leagues, id) {
    debug('checkIfLeagueExists')
    return leagues.find((l) => l[0].league_id == id)
  }

  async function getMyCurrentSeasonTeams(accesstoken) {
    debug('getMyCurrentSeasonTeams')
    try {
      let cs = await getCurrentYahooGame(accesstoken)
      return await getMyTeams(accesstoken, cs.game_key)
    } catch (error) {
      debug('ERR getMyCurrentSeasonTeams', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getMyTeams(accesstoken, yahooGameKey) {
    debug('getMyTeams')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.user.game_teams(`${yahooGameKey}`)
      return result.teams[0].teams
    } catch (error) {
      debug('ERR getMyTeams', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getMyTeam(accesstoken, yahooLeagueId, yahooGameKey) {
    debug('getMyTeam')
    try {
      let myTeams
      if (!yahooGameKey) {
        let yg = await getCurrentYahooGame(accesstoken)
        yahooGameKey = yg.game_key
      }
      myTeams = await getMyTeams(accesstoken, yahooGameKey)
      let myTeam = myTeams.find((t) => t.team_key.includes(yahooLeagueId))
      return await getTeamWithRoster(accesstoken, yahooLeagueId, myTeam.team_id, yahooGameKey)
    } catch (error) {
      debug('ERR getMyTeam', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getCurrentSeasonTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId) {
    debug('getCurrentSeasonTeamWithRoster')
    try {
      let cs = await getCurrentYahooGame(accesstoken)
      return await getTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId, cs.game_key)
    } catch (error) {
      debug('ERR getCurrentSeasonTeamWithRoster', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId, yahooGameKey) {
    debug('getTeamWithRoster')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let teamWithRoster = await yf.roster.players(`${yahooGameKey}.l.${yahooLeagueId}.t.${yahooTeamId}`)
      if (teamWithRoster.roster.length > 0) {
        return teamWithRoster
      } else {
        let currentSeasonWithTeams = await yf.league.standings(`${yahooGameKey}.l.${yahooLeagueId}`)
        // debug(currentSeasonWithTeams)
        let previousSeasonWithTeams = await yf.league.standings(`${currentSeasonWithTeams.renew.split('_')[0]}.l.${currentSeasonWithTeams.renew.split('_')[1]}`)
        // debug(previousSeasonWithTeams)
        let currentSeasonTeam = currentSeasonWithTeams.standings.find(t => t.team_id == yahooTeamId)
        let previousSeasonTeam = previousSeasonWithTeams.standings.find(t => t.managers[0].guid === currentSeasonTeam.managers[0].guid)
        let prevTeamWithRoster = await yf.roster.players(`${previousSeasonWithTeams.league_key}.t.${previousSeasonTeam.team_id}`)
        // debug(prevTeamWithRoster)
        return prevTeamWithRoster
      }
    } catch (error) {
      debug('ERR getTeamWithRoster', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getCurrentSeasonLeagueDetails(accesstoken, details, yahooLeagueId) {
    debug('getCurrentSeasonLeagueDetails')
    let cs = await getCurrentYahooGame(accesstoken)
    try {
      return await getLeagueDetails(accesstoken, details, yahooLeagueId, cs.game_key)
    } catch (error) {
      debug('ERR getCurrentSeasonLeagueDetails', error)
      return await getPreviousSeasonLeagueDetails(accesstoken, details, yahooLeagueId, cs.season)
    }
  }

  async function getPreviousSeasonLeagueDetails(accesstoken, details, yahooLeagueId, year) {
    debug('getPreviousSeasonLeagueDetails')
    try {
      let ps = await getPreviousYahooGame(accesstoken, year)
      return await getLeagueDetails(accesstoken, details, yahooLeagueId, ps.game_key)
    } catch (error) {
      debug('ERR getLeagueMeta', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getLeagueDetails(accesstoken, details, yahooLeagueId, yahooGameKey) {
    debug('getLeagueDetails')
    if (details === 'meta') return await getLeagueMeta(accesstoken, yahooGameKey, yahooLeagueId)
    else if (details === 'settings') return await getLeagueSettings(accesstoken, yahooGameKey, yahooLeagueId)
    else if (details === 'standings') return await getLeagueStandings(accesstoken, yahooGameKey, yahooLeagueId)
    else if (details === 'teams') return await getLeagueTeams(accesstoken, yahooGameKey, yahooLeagueId)
    else if (details === 'transactions') return await getLeagueTransactions(accesstoken, yahooGameKey, yahooLeagueId)
    else return
  }

  async function getLeagueMeta(accesstoken, yahooGameKey, yahooLeagueId) {
    debug('getLeagueMeta')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.league.meta(`${yahooGameKey}.l.${yahooLeagueId}`)

      return result
    } catch (error) {
      debug('ERR getLeagueMeta', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getLeagueSettings(accesstoken, yahooGameKey, yahooLeagueId) {
    debug('getLeagueSettings')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.league.settings(`${yahooGameKey}.l.${yahooLeagueId}`)
      return result.settings
    } catch (error) {
      debug('ERR getLeagueSettings', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getLeagueStandings(accesstoken, yahooGameKey, yahooLeagueId) {
    debug('getLeagueStandings')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.league.standings(`${yahooGameKey}.l.${yahooLeagueId}`)
      return result.standings
    } catch (error) {
      debug('ERR getLeagueStandings', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getLeagueTeams(accesstoken, yahooGameKey, yahooLeagueId) {
    debug('getLeagueTeams')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.league.teams(`${yahooGameKey}.l.${yahooLeagueId}`)
      return result.teams
    } catch (error) {
      debug('ERR getLeagueTeams', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getLeagueTransactions(accesstoken, yahooGameKey, yahooLeagueId) {
    debug('getLeagueTransactions')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.league.transactions(`${yahooGameKey}.l.${yahooLeagueId}`)
      result.transactions = result.transactions.slice(0, 50)
      return result.transactions
    } catch (error) {
      debug('ERR getLeagueTransactions', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getCurrentYahooGame(accesstoken) {
    debug('getCurrentYahooGame')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)
      let result = await yf.game.meta('nfl')
      return result
    } catch (error) {
      debug('ERR getCurrentYahooGame', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getPreviousYahooGame(accesstoken, year) {
    debug('getPreviousYahooGame')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let previousYear = parseInt(year) - 1
      if (GAMEKEYS[previousYear]) {
        let result = await yf.game.meta(GAMEKEYS[previousYear])
        return result
      } else {
        throw 'Error Retrieving Previous Leagues'
      }
    } catch (error) {
      debug('ERR getPreviousYahooGame', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getUserLeaguesByCurrentSeason(accesstoken) {
    debug('getUserLeaguesByCurrentSeason')
    try {
      let cs = await getCurrentYahooGame(accesstoken)
      return await getUserLeaguesBySeason(accesstoken, cs.game_key, cs.season)
    } catch (error) {
      debug(error)
    }
  }

  async function getUserLeaguesBySeason(accesstoken, yahooGameKey) {
    debug('getUserLeaguesBySeason')
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accesstoken)

      let result = await yf.user.game_leagues(yahooGameKey)
      let leagues = []
      for (const league of result.games[0].leagues) {
        leagues.push(league[0])
      }
      return leagues
    } catch (error) {
      debug('ERR getLeagueMeta', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getAllCommishLeagues(accesstoken, yahooGameKey) {
    debug('getAllCommishLeagues')
    try {
      // Find leagues from users teams they're a commish for.
      let commishLeaguesKeys = []
      let myTeams = await getMyTeams(accesstoken, yahooGameKey)
      for (const team of myTeams) {
        let manager = team.managers[0]
        if (
          'is_commissioner' in manager &&
          manager.is_commissioner === '1' &&
          'is_current_login' in manager &&
          manager.is_current_login === '1'
        ) {
          commishLeaguesKeys.push(getLeagueKeyFromTeamKey(team.team_key))
        }
      }

      // Get League Meta for each commished league
      let commishLeagues = []
      if (commishLeaguesKeys.length > 0) {
        for (const key of commishLeaguesKeys) {
          let league = await getLeagueMeta(accesstoken, yahooGameKey, key)
          commishLeagues.push(league)
        }
      }

      return commishLeagues
    } catch (error) {
      debug('ERR getAllCommishLeagues', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  async function getAllLeaguePlayers(accesstoken, yahooLeagueId, yahooGameKey) {
    debug('getAllLeaguePlayers')
    try {
      let teams = await getLeagueTeams(accesstoken, yahooGameKey, yahooLeagueId)
      let players = []

      // For each team, get their roster and push each player
      if (teams) {
        for (const team of teams) {
          let roster = await getTeamWithRoster(accesstoken, yahooLeagueId, team.team_id, yahooGameKey)
          for (const p of roster.roster) {
            p.yahooTeamId = team.team_id
            players.push(p)
          }
        }
      }

      return players
    } catch (error) {
      debug('ERR getAllLeaguePlayers', error)
      throw `Error connecting to Yahoo Fantasy`
    }
  }

  function getLeagueKeyFromTeamKey(team_key) {
    let split = team_key.split('.')
    return split[2]
  }

  return {
    getGames,
    getGameKey,
    getMyCurrentSeasonTeams,
    getMyTeams,
    getMyTeam,
    getCurrentSeasonTeamWithRoster,
    getTeamWithRoster,
    getCurrentSeasonLeagueDetails,
    getPreviousSeasonLeagueDetails,
    getLeagueDetails,
    getLeagueMeta,
    getLeagueSettings,
    getLeagueStandings,
    getLeagueTeams,
    getLeagueTransactions,
    getCurrentYahooGame,
    getPreviousYahooGame,
    getUserLeaguesByCurrentSeason,
    getUserLeaguesBySeason,
    getAllCommishLeagues,
    getAllLeaguePlayers,
  }
}

module.exports = yahooFantasy()
