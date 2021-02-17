const express = require('express')
const scadLeague = require('../controllers/scadLeague')
const debug = require('debug')('app:scadLeagueRouter')
const scadAuth = require('../utilities/scadAuth')

const scadLeagueRouter = express.Router()

scadLeagueRouter.get('/:id', scadAuth(), getById)
scadLeagueRouter.put('/:id', scadAuth(), update)
scadLeagueRouter.post('/', scadAuth(), create)
scadLeagueRouter.delete('/:id', scadAuth(), remove)
scadLeagueRouter.get('/all', scadAuth(), getAll)

module.exports = scadLeagueRouter

async function getById(req, res) {
  const { id } = req.params
  debug(id)
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

function create(req, res) {
  const league = req.body.data
  if (league) {
    try {
      scadLeague.create(league)
      res.send('Scad League Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad League')
    }
  } else {
    res.status(500).send('No Scad League supplied with request.')
  }
}

function update(req, res) {
  const { id } = req.params
  const league = req.body.data
  debug('update')
  try {
    scadLeague.update(id, league)
    res.send('Scad League updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Scad League')
  }
}

function remove(req, res) {
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