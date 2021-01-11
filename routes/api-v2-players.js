const express = require('express')
const debug = require('debug')('app:players')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const playerRouter = express.Router()

playerRouter.get('/yahoo/:yahooLeagueId/:accessToken', getYahooPlayers)

module.exports = playerRouter

playerRouter.use(scadAuth)

async function getYahooPlayers(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  // debug(accessToken, yahooLeagueId)
  try {
    let result = await yf.getPlayers(accessToken, yahooLeagueId)
    res.json({
      players: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transactions')
  }
}
