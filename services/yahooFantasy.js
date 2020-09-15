var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasy')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')

const GAMEKEY = '399.l.'


function yahooFantasy() {

  function init(accessToken) {
    var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
    yf.setUserToken(accessToken)
    return yf
  }

  async function getTransactions(accessToken, yahooLeagueId) {
    
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)
      
      let result = await yf.league.transactions(`399.l.13088`)
      return result
      
    } catch (error) {
      debug('ERR', error)

    }
  }
  return { getTransactions }
}

module.exports = yahooFantasy()


  
