var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasy')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')

const GAMEKEY = '399'


function yahooFantasy() {

  async function getTransactions(accessToken, yahooLeagueId) {
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
  return { getTransactions }
}

module.exports = yahooFantasy()


  
