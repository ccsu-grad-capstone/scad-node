const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const memoryStorage = multer({ storage: storage })
const csv = require('csvtojson')

const scadPlayer = require('../controllers/scadPlayer')
const debug = require('debug')('app:scadPlayerRouter')
const scadAuth = require('../utilities/scadAuth')
const { result } = require('lodash')
const yf = require('../services/yahooFantasy')

const scadPlayerRouter = express.Router()

scadPlayerRouter.get('/:id', scadAuth(), getById)
scadPlayerRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/franchiseTagged', scadAuth(), getFranchiseTaggedPlayers)
scadPlayerRouter.get('/yahoo/:yahooGameKey/:yahooLeagueId/player/:yahooPlayerId', scadAuth(), getByYahooIds)
scadPlayerRouter.put('/:id', scadAuth(), update)
scadPlayerRouter.post('/', scadAuth(), create)
scadPlayerRouter.delete('/:id', scadAuth(), remove)
scadPlayerRouter.post('/importUpdates', scadAuth(), memoryStorage.any(), importUpdates)

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

async function getFranchiseTaggedPlayers(req, res) {
  const { yahooGameKey, yahooLeagueId } = req.params
  const { accesstoken } = req.headers
  try {
    const result = await scadPlayer.getFranchiseTaggedPlayers(yahooLeagueId)
    let players = []
    for (const sp of result) {
      let yp = await yf.getPlayer(accesstoken, yahooGameKey, sp.yahooPlayerId)
      let player = {
        scadPlayer: sp,
        yahooPlayer: yp
      }
      players.push(player)
    }
    res.json({
      scadPlayerFranchiseTagged: players
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Player')
  }
}

async function getByYahooIds(req, res) {
  const { yahooGameKey, yahooLeagueId, yahooPlayerId } = req.params
  // debug(id)
  try {
    const result = await scadPlayer.getByYahooIds(yahooGameKey, yahooLeagueId, yahooPlayerId)
    if (result) {
      res.json({
        scadPlayer: result,
      })
    } else {
      res.status(404).send('Scad Player Not Found')
    }
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Player')
  }
}

async function create(req, res) {
  const player = req.body.data
  if (player) {
    try {
      await scadPlayer.create(player)
      res.send('Scad Player Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad Player')
    }
  } else {
    res.status(500).send('No Scad Player supplied with request.')
  }
}

async function update(req, res) {
  const { id } = req.params
  const player = req.body.data
  if (player) {
    try {
      await scadPlayer.update(id, player)
      res.send('Scad Player updated successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Scad Player')
    }
  } else {
    res.status(500).send('No Scad Player supplied with request.')
  }
}

async function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await scadPlayer.remove(id)
    res.send('Scad Player removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Scad Player')
  }
}

async function importUpdates(req, res) {
  // const { id } = req.params
  debug('importUpdates')
  try {
    if (req.files && req.files.length > 0) {
      // debug('Files', req.files[0].buffer.toString())
      let list = await csv().fromString(req.files[0].buffer.toString())
      let result
      if (list && list.length > 0){
        result = await scadPlayer.updatePlayersSalaries(list)
        debug('Finished Updating Salaries')
      }
      res.send(result)
    } else {
      debug('No Files')
      res.send('No Files Uploaded')
    }
    // await scadPlayer.importUpdates()
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Importing Player Salary Updates')
  }
}

