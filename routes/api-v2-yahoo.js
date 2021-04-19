const express = require('express')
const debug = require('debug')('app:yahoo')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const yahooRouter = express.Router()

// Already in LAMBDAS
yahooRouter.get('/game/:yahooGameKey/myTeams', scadAuth(), getMyTeams)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/myTeam', scadAuth(), getMyTeam)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId', scadAuth(), getLeagueMeta)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/settings', scadAuth(), getLeagueSettings)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/standings', scadAuth(), getLeagueStandings)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/teams', scadAuth(), getLeagueTeams)
yahooRouter.get('/game/:yahooGameKey/league/get/all', scadAuth(), getAllUsersLeagues)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/transactions', scadAuth(), getLeagueTransactions)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/team/:yahooTeamId/roster', scadAuth(), getTeamWithRoster)

// Need to add to LAMBDAS
yahooRouter.get('/game', scadAuth(), getGames)
yahooRouter.get('/game/:yahooGameKey/league/commissioner/all', scadAuth(), getAllCommishLeagues)
yahooRouter.get('/game/:yahooGameKey/league/:yahooLeagueId/players', scadAuth(), getAllLeaguePlayers)

module.exports = yahooRouter

async function getMyTeams(req, res) {
  const { accesstoken, yahooGameKey } = req.headers
  try {
    let result = await yf.getMyTeams(accesstoken, yahooGameKey)
    res.json({
      myTeams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getMyTeam(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getMyTeam(accesstoken, yahooLeagueId, yahooGameKey)
    res.json({
      myTeam: result
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueMeta(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getLeagueMeta(accesstoken, yahooGameKey , yahooLeagueId, )
    res.json({
      league: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueSettings(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getLeagueSettings(accesstoken, yahooGameKey, yahooLeagueId)
    res.json({
      settings: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueStandings(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getLeagueStandings(accesstoken, yahooGameKey, yahooLeagueId)
    res.json({
      standings: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueTeams(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getLeagueTeams(accesstoken, yahooGameKey, yahooLeagueId)
    res.json({
      teams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getAllUsersLeagues(req, res) {
  const { accesstoken } = req.headers
  const { yahooGameKey } = req.params
  try {
    let result = await yf.getUserLeaguesBySeason(accesstoken, yahooGameKey)
    res.json({
      leagues: result,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

async function getLeagueTransactions(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getLeagueTransactions(accesstoken, yahooGameKey, yahooLeagueId)
    res.json({
      transactions: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getTeamWithRoster(req, res) {
  const { yahooLeagueId, yahooTeamId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getTeamWithRoster(accesstoken, yahooLeagueId, yahooTeamId, yahooGameKey)
    res.json({
      team: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

// Need to add to LAMBDAS
async function getGames(req, res) {
  const { accesstoken } = req.headers
  try {
    let result = await yf.getGameKey(accesstoken)
    res.json({
      games: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}
async function getAllCommishLeagues(req, res) {
  const { yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getAllCommishLeagues(accesstoken, yahooGameKey)
    res.json({
      commishLeagues: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}
async function getAllLeaguePlayers(req, res) {
  const { yahooLeagueId, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  try {
    let result = await yf.getAllLeaguePlayers(accesstoken, yahooLeagueId, yahooGameKey)
    res.json({
      players: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}