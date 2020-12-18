const express = require('express')
const transaction = require('../controllers/transaction')
const debug = require('debug')('app:players')
const yf = require('../services/yahooFantasy')

const playerRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  playerRouter.use(scadAuth)

  async function getYahooPlayers (req, res) {
    const { accessToken, yahooLeagueId } = req.params
    // debug(accessToken, yahooLeagueId)
    try {
      let result = await yf.getPlayers(accessToken, yahooLeagueId)
      res.json({
        players: result
      })
      
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Retrieving Transactions')
    }
  }

  playerRouter.get('/yahoo/:yahooLeagueId/:accessToken', getYahooPlayers)

  return playerRouter
}

module.exports = router()
