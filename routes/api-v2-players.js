const express = require('express')
const debug = require('debug')('app:players')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const playerRouter = express.Router()

playerRouter.get('/yahoo/:yahooLeagueId/:access_token', getYahooPlayers)

module.exports = playerRouter

playerRouter.use(scadAuth)

async function getYahooPlayers(req, res) {
  const { access_token, yahooLeagueId } = req.params
  // debug(access_token, yahooLeagueId)
  try {
    let result = await yf.getPlayers(access_token, yahooLeagueId)
    res.json({
      players: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transactions')
  }
}
