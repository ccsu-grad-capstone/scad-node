const express = require('express')
const scadTeam = require('../controllers/scadTeam')
const scadPlayer = require('../controllers/scadPlayer')
const debug = require('debug')('app:scadTeamRouter')
const scadAuth = require('../utilities/scadAuth')

const scadTeamRouter = express.Router()

scadTeamRouter.get('/:id', scadAuth(), getById)
scadTeamRouter.put('/:id', scadAuth(), update)
scadTeamRouter.post('/', scadAuth(), create)
scadTeamRouter.delete('/:id', scadAuth(), remove)

// ----- Returning Scad Players -----
scadTeamRouter.get('/:id/players', scadAuth(), getAllTeamPlayersByScadTeamId)

module.exports = scadTeamRouter

async function getById(req, res) {
  const { id } = req.params
  debug(id)
  try {
    const result = await scadTeam.getById(id)
    res.json({
      scadTeam: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Team')
  }
}

async function create(req, res) {
  const team = req.body.data
  if (team) {
    try {
      await scadTeam.create(team)
      res.send('Scad Team Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad Team')
    }
  } else {
    res.status(500).send('No Scad Team supplied with request.')
  }
}

async function update(req, res) {
  const { id } = req.params
  const team = req.body.data
  debug('update SCAD team')
  try {
    await scadTeam.update(id, team)
    res.send('Scad Team updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Scad Team')
  }
}

async function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await scadTeam.remove(id)
    res.send('Scad Team removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Scad Team')
  }
}

async function getAllTeamPlayersByScadTeamId(req, res) {
  const { id } = req.params
  const { access_token } = req.headers
  debug(id)
  try {
    const result = await scadPlayer.getAllTeamPlayersByScadTeamId(id, access_token)
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Players')
  }
}