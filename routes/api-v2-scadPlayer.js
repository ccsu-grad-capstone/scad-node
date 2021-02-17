const express = require('express')
const scadPlayer = require('../controllers/scadPlayer')
const debug = require('debug')('app:scadPlayerRouter')
const scadAuth = require('../utilities/scadAuth')

const scadPlayerRouter = express.Router()

scadPlayerRouter.get('/:id', scadAuth(), getById)
scadPlayerRouter.put('/:id', scadAuth(), update)
scadPlayerRouter.post('/', scadAuth(), create)
scadPlayerRouter.delete('/:id', scadAuth(), remove)
scadPlayerRouter.get('/all', scadAuth(), getAll)

module.exports = scadPlayerRouter

async function getById(req, res) {
  const { id } = req.params
  debug(id)
  try {
    const result = await scadPlayer.getById(id)
    res.json({
      scadPlayer: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Player')
  }
}

function create(req, res) {
  const player = req.body.data
  if (player) {
    try {
      scadPlayer.create(player)
      res.send('Scad Player Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad Player')
    }
  } else {
    res.status(500).send('No Scad Player supplied with request.')
  }
}

function update(req, res) {
  const { id } = req.params
  const player = req.body.data
  debug('update')
  try {
    scadPlayer.update(id, player)
    res.send('Scad Player updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Scad Player')
  }
}

function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    scadPlayer.remove(id)
    res.send('Scad Player removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Scad Player')
  }
}

async function getAll(req, res) {
  debug('getAll')
  try {
    const result = await scadPlayer.getAll()
    res.json({
      scadPlayers: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Player')
  }
}