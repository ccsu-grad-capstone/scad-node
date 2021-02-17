const express = require('express')
const scadTeam = require('../controllers/scadTeam')
const debug = require('debug')('app:scadTeamRouter')
const scadAuth = require('../utilities/scadAuth')

const scadTeamRouter = express.Router()

scadTeamRouter.get('/:id', scadAuth(), getById)
scadTeamRouter.put('/:id', scadAuth(), update)
scadTeamRouter.post('/', scadAuth(), create)
scadTeamRouter.delete('/:id', scadAuth(), remove)

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

function create(req, res) {
  const team = req.body.data
  if (team) {
    try {
      scadTeam.create(team)
      res.send('Scad Team Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad Team')
    }
  } else {
    res.status(500).send('No Scad Team supplied with request.')
  }
}

function update(req, res) {
  const { id } = req.params
  const team = req.body.data
  debug('update')
  try {
    scadTeam.update(id, team)
    res.send('Scad Team updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Scad Team')
  }
}

function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    scadTeam.remove(id)
    res.send('Scad Team removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Scad Team')
  }
}