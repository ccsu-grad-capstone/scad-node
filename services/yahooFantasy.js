var YahooFantasy = require('yahoo-fantasy')
const debug = require('debug')('app:yahooFantasy')
const { YAHOO_CLIENT_SECRET, YAHOO_CLIENT_ID } = require('../config')
const fs = require('fs')
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

  // Used to get play photos for PFF. 
  async function getPlayers(accessToken, yahooLeagueId) {
    try {
      var yf = new YahooFantasy(YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET)
      yf.setUserToken(accessToken)
      
      const start = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000]
      let players = []
      for (let i = 0; i < 1200; i += 25) {
        let result = await yf.players.leagues(`${GAMEKEY}.l.65939`, { start: i, sort: 'PTS', count: 25})
        debug(result[0].players.length)
        for (const p of result[0].players) {
          players.push(p)
        }
        // debug(result[0].players[0])
        debug('PLAYERS COUNT: ', players.length)
      }
      debug('FINAL PLAYERS COUNT: ', players.length)
      // console.log(players)

      fs.writeFileSync('players', JSON.stringify(players))

      return players
      

    } catch (error) {
      debug('ERR', error)

    }
  }
  return { getTransactions, getPlayers }
}

module.exports = yahooFantasy()


  
