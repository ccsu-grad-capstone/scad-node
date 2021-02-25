const express = require('express')
const scadLeague = require('../controllers/scadLeague')
const scadTeam = require('../controllers/scadTeam')
const scadPlayer = require('../controllers/scadPlayer')
const debug = require('debug')('app:scadLeagueRouter')
const scadAuth = require('../utilities/scadAuth')

const scadLeagueRouter = express.Router()

// ----- Returning Scad Leagues -----
scadLeagueRouter.get('/:id', scadAuth(), getById)
scadLeagueRouter.get('/yahoo/:gameKey/:yahooLeagueId', scadAuth(), getByYahooLeagueId)
scadLeagueRouter.put('/:id', scadAuth(), update)
scadLeagueRouter.post('/', scadAuth(), create)
scadLeagueRouter.post('/:id/renew/:renewedLeagueId', scadAuth(), renewLeague)
scadLeagueRouter.delete('/:id', scadAuth(), remove)
scadLeagueRouter.get('/get/all', scadAuth(), getAll)
// INCOMPLETE - Default League
scadLeagueRouter.get('/default', scadAuth(), getDefaultLeague)
scadLeagueRouter.put('/default/update/:id', scadAuth(), updateDefaultLeague)

// ----- Returning Scad Teams -----
scadLeagueRouter.get('/:id/team/all', scadAuth(), getAllTeamsByScadLeagueId)
scadLeagueRouter.get('/yahoo/:gameKey/:yahooLeagueId/team/all', scadAuth(), getAllTeamsByYahooLeagueId)
scadLeagueRouter.get('/:id/team/myTeam', scadAuth(), getMyTeamByScadLeagueId)
scadLeagueRouter.get('/yahoo/:gameKey/:yahooLeagueId/team/myTeam', scadAuth(), getMyTeamByYahooLeagueId)
scadLeagueRouter.get('/:id/yahooTeam/:yahooTeamId', scadAuth(), getTeamByScadLeagueIdYahooTeamId)

// ----- Returning Scad Players -----
scadLeagueRouter.get('/:id/player/all', scadAuth(), getAllPlayersByScadLeagueId)
scadLeagueRouter.get('/yahoo/:gameKey/:yahooLeagueId/player/all', scadAuth(), getAllPlayersByYahooLeagueId)

scadLeagueRouter.get(
  '/yahoo/:gameKey/:yahooLeagueId/team/:yahooTeamId/players',
  scadAuth(),
  getAllTeamPlayersByYahooIds
)

scadLeagueRouter.get('/:id/players/myPlayers', scadAuth(), getMyPlayersByScadId) //
scadLeagueRouter.get('/yahoo/:gameKey/:yahooLeagueId/player/myPlayers', scadAuth(), getMyPlayersByYahooId) //

module.exports = scadLeagueRouter

// ----- Returning Scad Leagues -----
async function getById(req, res) {
  const { id } = req.params
  debug('getById', id)
  try {
    const result = await scadLeague.getById(id)
    res.json({
      scadLeague: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad League')
  }
}

async function getByYahooLeagueId(req, res) {
  const { gameKey, yahooLeagueId } = req.params
  debug('getByYahooLeagueId', gameKey, yahooLeagueId)
  try {
    const result = await scadLeague.getByYahooLeagueId(gameKey, yahooLeagueId)
    res.json({
      scadLeague: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad League')
  }
}

async function create(req, res) {
  debug('create')
  const league = req.body.data
  const { access_token } = req.headers
  if (league) {
    try {
      await scadLeague.create(league, access_token)
      res.send('Scad League Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send(error)
    }
  } else {
    res.status(500).send('No Scad League supplied with request.')
  }
}

async function renewLeague(req, res) {
  debug('renewLeague')
  const { id, renewedLeagueId } = req.params
  const { access_token } = req.headers

  if (id && renewedLeagueId) {
    try {
      await scadLeague.renewLeague(id, renewedLeagueId, access_token)
      res.send('Scad League Renewed Successfully')
    } catch (error) {
      debug(error)
      res.status(500).send(error)
    }
  } else {
    res.status(500).send('Missing Scad League Parameters with request.')
  }
}

async function update(req, res) {
  const { id } = req.params
  const league = req.body.data
  debug('update SCAD league')
  try {
    await scadLeague.update(id, league)
    res.send('Scad League updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Scad League')
  }
}

async function remove(req, res) {
  debug('remove')
  const { id } = req.params
  debug('remove')
  try {
    scadLeague.remove(id)
    res.send('Scad League removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Scad League')
  }
}

async function getAll(req, res) {
  debug('getAll')
  try {
    const result = await scadLeague.getAll()
    res.json({
      scadLeagues: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad League')
  }
}

// INCOMPLETE
async function getDefaultLeague(req, res) {
  debug('getDefaultLeague')
  try {
    const result = await scadLeague.getDefault()
    res.json({
      scadLeague: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad League')
  }
}

// INCOMPLETE
async function updateDefaultLeague(req, res) {
  debug('updateDefaultLeague')
  const { id } = req.params
  try {
    const result = await scadLeague.updateDefault(id)
    res.send('Default SCAD league updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Default Scad League')
  }
}

// ----- Returning Scad Teams -----
async function getAllTeamsByScadLeagueId(req, res) {
  const { id } = req.params
  debug('getAllTeamsByScadLeagueId', id)
  try {
    const result = await scadTeam.getAllByScadLeagueId(id)
    res.json({
      scadTeams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getAllTeamsByYahooLeagueId(req, res) {
  const { gameKey, yahooLeagueId } = req.params
  debug('getAllTeamsByYahooLeagueId', gameKey, yahooLeagueId)
  try {
    const result = await scadTeam.getAllByYahooLeagueId(gameKey, yahooLeagueId)
    res.json({
      scadTeams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getMyTeamByScadLeagueId(req, res) {
  const { id } = req.params
  const { access_token } = req.headers
  debug('getMyTeamByScadLeagueId', id)
  try {
    const result = await scadTeam.getMyTeamByScadLeagueId(id, access_token)
    res.json({
      myTeam: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getTeamByScadLeagueIdYahooTeamId(req, res) {
  const { id, yahooTeamId } = req.params
  debug('getMyTeamByYahooLeagueId', id, yahooTeamId)
  try {
    const result = await scadTeam.getTeamByScadLeagueIdYahooTeamId(id, yahooTeamId)
    res.json({
      team: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getMyTeamByYahooLeagueId(req, res) {
  const { gameKey, yahooLeagueId } = req.params
  const { access_token } = req.headers
  debug('getMyTeamByYahooLeagueId', gameKey, yahooLeagueId)
  try {
    const result = await scadTeam.getMyTeamByYahooLeagueId(gameKey, yahooLeagueId, access_token)
    res.json({
      myTeam: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

// ----- Returning Scad Players -----
async function getAllPlayersByScadLeagueId(req, res) {
  const { id } = req.params
  debug('getAllPlayersByScadLeagueId', id)
  try {
    const result = await scadPlayer.getAllByScadLeagueId(id)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getAllPlayersByYahooLeagueId(req, res) {
  const { gameKey, yahooLeagueId } = req.params
  debug('getAllPlayersByYahooLeagueId', gameKey, yahooLeagueId)
  try {
    const result = await scadPlayer.getAllByYahooLeagueId(gameKey, yahooLeagueId)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getAllTeamPlayersByYahooIds(req, res) {
  const { gameKey, yahooLeagueId, yahooTeamId } = req.params
  const { access_token } = req.headers
  debug('getAllTeamPlayersByYahooIds', gameKey, yahooLeagueId, yahooTeamId)
  try {
    const result = await scadPlayer.getAllForTeamByYahooIds(gameKey, yahooLeagueId, yahooTeamId, access_token)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}

async function getMyPlayersByScadId(req, res) {
  const { id } = req.params
  const { access_token } = req.headers
  debug('getMyPlayersByScadId', id)
  try {
    const result = await scadPlayer.getMyPlayersByScadId(id, access_token)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}

async function getMyPlayersByYahooId(req, res) {
  const { gameKey, yahooLeagueId } = req.params
  const { access_token } = req.headers
  debug('getMyPlayersByScadId', gameKey, yahooLeagueId)
  try {
    const result = await scadPlayer.getMyPlayersByYahooId(gameKey, yahooLeagueId, access_token)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}
