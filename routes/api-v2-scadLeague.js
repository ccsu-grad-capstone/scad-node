const express = require('express')
const scadLeague = require('../controllers/scadLeague')
const scadTeam = require('../controllers/scadTeam')
const scadPlayer = require('../controllers/scadPlayer')
const debug = require('debug')('app:scadLeagueRouter')
const scadAuth = require('../utilities/scadAuth')
const { importScadLeague } = require('../utilities/importScadLeague')

const scadLeagueRouter = express.Router()

// ----- Returning Scad Leagues -----
scadLeagueRouter.get('/:id', scadAuth(), getById)
scadLeagueRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId', scadAuth(), getByYahooLeagueId)
scadLeagueRouter.put('/:id', scadAuth(), update)
scadLeagueRouter.post('/', scadAuth(), create)
scadLeagueRouter.post('/import', scadAuth(), importLeague)
scadLeagueRouter.post('/:id/renew/:renewedLeagueId', scadAuth(), renewLeague)
scadLeagueRouter.delete('/:id', scadAuth(), remove)
scadLeagueRouter.get('/get/all', scadAuth(), getAll)
// INCOMPLETE - Default League
scadLeagueRouter.get('/default', scadAuth(), getDefaultLeague)
scadLeagueRouter.put('/default/update/:id', scadAuth(), updateDefaultLeague)

// ----- Returning Scad Teams -----
scadLeagueRouter.get('/:id/team/all', scadAuth(), getAllTeamsByScadLeagueId)
scadLeagueRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/team/all', scadAuth(), getAllTeamsByYahooLeagueId)
scadLeagueRouter.get('/:id/game/:yahooGameKey/team/myTeam', scadAuth(), getMyTeamByScadLeagueId)
scadLeagueRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/team/myTeam', scadAuth(), getMyTeamByYahooLeagueId)
scadLeagueRouter.get('/:id/yahooTeam/:yahooTeamId', scadAuth(), getTeamByScadLeagueIdYahooTeamId)

// ----- Returning Scad Players -----
scadLeagueRouter.get('/:id/player/all', scadAuth(), getAllPlayersByScadLeagueId)
scadLeagueRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/player/all', scadAuth(), getAllPlayersByYahooLeagueId)

scadLeagueRouter.get(
  '/yahoo/:yahooGameKey/:yahooLeagueId/team/:yahooTeamId/players',
  scadAuth(),
  getAllTeamPlayersByYahooIds
)

scadLeagueRouter.get('/:id/players/myPlayers', scadAuth(), getMyPlayersByScadId) //
scadLeagueRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/player/myPlayers', scadAuth(), getMyPlayersByYahooId) //

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
  const { yahooGameKey, yahooLeagueId } = req.params
  debug('getByYahooLeagueId', yahooGameKey, yahooLeagueId)
  try {
    const result = await scadLeague.getByYahooLeagueId(yahooGameKey, yahooLeagueId)
    if (result) {
      res.json({
        scadLeague: result,
      })
    } else {
      res.status(404).send('No Scad League Found')
    }
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad League')
  }
}

async function importLeague(req, res) {
  debug('importLeague')
  const { accesstoken } = req.headers
  try {
    await importScadLeague(accesstoken)
    res.send('Scad League Imported successfully')
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}

async function create(req, res) {
  debug('create')
  const league = req.body.data
  const { accesstoken } = req.headers
  if (league) {
    try {
      await scadLeague.create(league, accesstoken)
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
  const { accesstoken } = req.headers

  if (id && renewedLeagueId) {
    try {
      await scadLeague.renewLeague(id, renewedLeagueId, accesstoken)
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
  if (league) {
    try {
      let result = await scadLeague.update(id, league)
      res.send({
        message: 'Scad League Updated Successfully',
        league: result,
      })
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad League')
    }
  } else {
    res.status(500).send('Missing Scad League Parameters with request.')
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
  const { yahooGameKey, yahooLeagueId } = req.params
  debug('getAllTeamsByYahooLeagueId', yahooGameKey, yahooLeagueId)
  try {
    const result = await scadTeam.getAllByYahooLeagueId(yahooGameKey, yahooLeagueId)
    res.json({
      scadTeams: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getMyTeamByScadLeagueId(req, res) {
  const { id, yahooGameKey } = req.params
  const { accesstoken } = req.headers
  debug('getMyTeamByScadLeagueId', id)
  try {
    const result = await scadTeam.getMyTeamByScadLeagueId(id, accesstoken, yahooGameKey)
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
  const { yahooGameKey, yahooLeagueId } = req.params
  const { accesstoken } = req.headers
  debug('getMyTeamByYahooLeagueId', yahooGameKey, yahooLeagueId)
  try {
    const result = await scadTeam.getMyTeamByYahooLeagueId(yahooGameKey, yahooLeagueId, accesstoken)
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
  const { yahooGameKey, yahooLeagueId } = req.params
  debug('getAllPlayersByYahooLeagueId', yahooGameKey, yahooLeagueId)
  try {
    const result = await scadPlayer.getAllByYahooLeagueId(yahooGameKey, yahooLeagueId)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Teams')
  }
}

async function getAllTeamPlayersByYahooIds(req, res) {
  const { yahooGameKey, yahooLeagueId, yahooTeamId } = req.params
  const { accesstoken } = req.headers
  debug('getAllTeamPlayersByYahooIds', yahooGameKey, yahooLeagueId, yahooTeamId)
  try {
    const result = await scadPlayer.getAllForTeamByYahooIds(yahooGameKey, yahooLeagueId, yahooTeamId, accesstoken)
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
  const { accesstoken } = req.headers
  debug('getMyPlayersByScadId', id)
  try {
    const result = await scadPlayer.getMyPlayersByScadId(id, accesstoken)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}

async function getMyPlayersByYahooId(req, res) {
  const { yahooGameKey, yahooLeagueId } = req.params
  const { accesstoken } = req.headers
  debug('getMyPlayersByScadId', yahooGameKey, yahooLeagueId)
  try {
    const result = await scadPlayer.getMyPlayersByYahooId(yahooGameKey, yahooLeagueId, accesstoken)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}
