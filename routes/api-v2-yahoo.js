const express = require('express')
const debug = require('debug')('app:yahoo')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const yahooRouter = express.Router()

// Already in LAMBDAS
yahooRouter.get('/myTeams', scadAuth(), getMyTeams)
yahooRouter.get('/league/:yahooLeagueId/myTeam', scadAuth(), getMyTeam)
yahooRouter.get('/league/:yahooLeagueId', scadAuth(), getLeagueMeta)
yahooRouter.get('/league/:yahooLeagueId/settings', scadAuth(), getLeagueSettings)
yahooRouter.get('/league/:yahooLeagueId/standings', scadAuth(), getLeagueStandings)
yahooRouter.get('/league/:yahooLeagueId/teams', scadAuth(), getLeagueTeams)
yahooRouter.get('/league/team/all', scadAuth(), getAllUsersLeagues)
yahooRouter.get('/league/:yahooLeagueId/transactions', scadAuth(), getLeagueTransactions)
yahooRouter.get('/league/:yahooLeagueId/team/:yahooTeamId/roster', scadAuth(), getTeamWithRoster)

// Need to add to LAMBDAS
yahooRouter.get('/game', scadAuth(), getGames)
yahooRouter.get('/league/commissioner/all', scadAuth(), getAllCommishLeagues)
yahooRouter.get('/league/:yahooLeagueId/players', scadAuth(), getAllLeaguePlayers)

module.exports = yahooRouter

async function getMyTeams(req, res) {
  const { access_token } = req.headers
  try {
    let result = await yf.getMyTeams(access_token)
    res.json({
      myTeams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getMyTeam(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getMyTeam(access_token, yahooLeagueId)
    res.json({
      myTeam: result
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueMeta(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getLeagueMeta(access_token, yahooLeagueId)
    res.json({
      league: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueSettings(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getLeagueSettings(access_token, yahooLeagueId)
    res.json({
      settings: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueStandings(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getLeagueStandings(access_token, yahooLeagueId)
    res.json({
      standings: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getLeagueTeams(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getLeagueTeams(access_token, yahooLeagueId)
    res.json({
      teams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getAllUsersLeagues(req, res) {
  const { access_token } = req.headers
  try {
    let result = await yf.getUserLeaguesByCurrentSeason(access_token)
    res.json({
      leagues: result,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

async function getLeagueTransactions(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getLeagueTransactions(access_token, yahooLeagueId)
    res.json({
      transactions: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function getTeamWithRoster(req, res) {
  const { yahooLeagueId, yahooTeamId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getTeamWithRoster(access_token, yahooLeagueId, yahooTeamId)
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
  const { access_token } = req.headers
  try {
    let result = await yf.getGameKey(access_token)
    res.json({
      games: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}
async function getAllCommishLeagues(req, res) {
  const { access_token } = req.headers
  try {
    let result = await yf.getAllCommishLeagues(access_token)
    res.json({
      commishLeagues: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}
async function getAllLeaguePlayers(req, res) {
  const { yahooLeagueId } = req.params
  const { access_token } = req.headers
  try {
    let result = await yf.getAllLeaguePlayers(access_token, yahooLeagueId)
    res.json({
      players: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}