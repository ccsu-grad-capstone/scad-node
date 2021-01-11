var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasy')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')
const fs = require('fs')
const GAMEKEY = '399'


function yahooFantasy() {

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

  return { 
    getMyTeams,
    getLeagueSettings,
    getLeagueStandings,
    getLeagueTeams,
    getLeagueTransactions
   }
}

module.exports = yahooFantasy()


  
