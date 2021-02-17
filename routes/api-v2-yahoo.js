const express = require('express')
const debug = require('debug')('app:yahoo')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const yahooRouter = express.Router()

// Already in LAMBDAS
yahooRouter.get('/myTeams/:accessToken', scadAuth(), getMyTeams)
yahooRouter.get('/league/:yahooLeagueId/myTeam/:accessToken', scadAuth(), getMyTeam)
yahooRouter.get('/league/:yahooLeagueId/:accessToken', scadAuth(), getLeagueMeta)
yahooRouter.get('/league/:yahooLeagueId/settings/:accessToken', scadAuth(), getLeagueSettings)
yahooRouter.get('/league/:yahooLeagueId/standings/:accessToken', scadAuth(), getLeagueStandings)
yahooRouter.get('/league/:yahooLeagueId/teams/:accessToken', scadAuth(), getLeagueTeams)
yahooRouter.get('/league/all/:accessToken', scadAuth(), getAllUsersLeagues)
yahooRouter.get('/league/:yahooLeagueId/transactions/:accessToken', scadAuth(), getLeagueTransactions)
yahooRouter.get('/league/:yahooLeagueId/team/:yahooTeamId/roster/:accessToken', scadAuth(), getRoster)

// Need to add to LAMBDAS
yahooRouter.get('/game/:accessToken', scadAuth(), getGames)

module.exports = yahooRouter

async function getMyTeams(req, res) {
  const { accessToken } = req.params
  try {
    let result = await yf.getMyTeams(accessToken)
    res.json({
      myTeams: result.teams[0].teams,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving MyTeams')
  }
}

async function getMyTeam(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getMyTeam(accessToken, yahooLeagueId)
    res.json({
      myTeam: result
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving MyTeam')
  }
}

async function getLeagueMeta(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getLeagueMeta(accessToken, yahooLeagueId)
    res.json({
      league: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving League Settings')
  }
}

async function getLeagueSettings(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getLeagueSettings(accessToken, yahooLeagueId)
    res.json({
      settings: result.settings,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving League Settings')
  }
}

async function getLeagueStandings(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getLeagueStandings(accessToken, yahooLeagueId)
    res.json({
      standings: result.standings,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving League Standings')
  }
}

async function getLeagueTeams(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getLeagueTeams(accessToken, yahooLeagueId)
    res.json({
      teams: result.teams,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving League Teams')
  }
}

async function getAllUsersLeagues(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getAllUsersLeagues(accessToken, yahooLeagueId)
    res.json({
      leagues: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving League Players')
  }
}

async function getLeagueTransactions(req, res) {
  const { accessToken, yahooLeagueId } = req.params
  try {
    let result = await yf.getLeagueTransactions(accessToken, yahooLeagueId)
    res.json({
      transactions: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transactions')
  }
}

async function getRoster(req, res) {
  const { accessToken, yahooLeagueId, yahooTeamId } = req.params
  try {
    let result = await yf.getRoster(accessToken, yahooLeagueId, yahooTeamId)
    res.json({
      roster: result.roster,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transactions')
  }
}

// Need to add to LAMBDAS

async function getGames(req, res) {
  const { accessToken } = req.params
  try {
    let result = await yf.getGameKey(accessToken)
    res.json({
      games: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Games')
  }
}