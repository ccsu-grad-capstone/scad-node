const express = require('express')
const capExemptions = require('../controllers/capExemptions')
const debug = require('debug')('app:capExemptionRouter')
const moment = require('moment')
const scadAuth = require('../utilities/scadAuth')

const capExemptionRouter = express.Router()

capExemptionRouter.get('/check/:scadLeagueId', scadAuth(), checkLeague)
capExemptionRouter.get('/:scadLeagueId', scadAuth(), getAllByLeague)
capExemptionRouter.get('/:scadLeagueId/:yahooTeamId', scadAuth(), getAllByTeam)
capExemptionRouter.post('/create', scadAuth(), create)
// capExemptionRouter.put('/updateLeague', scadAuth(), updateLeague)
capExemptionRouter.put('/:id', scadAuth(), update)
capExemptionRouter.delete('/remove/:id', scadAuth(), remove)

module.exports = capExemptionRouter

async function checkLeague(req, res) {
  const { scadLeagueId } = req.params
  debug('checkLeague')
  try {
    const result = await capExemptions.checkLeague(scadLeagueId)
    if (result.length > 0) {
      res.sendStatus(200)
    } else {
      res.sendStatus(204)
    }
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Cap Exemptions')
  }
}

async function getAllByLeague(req, res) {
  debug('getAllByLeague')
  const { scadLeagueId } = req.params
  try {
    const result = await capExemptions.getAllByLeague(scadLeagueId)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Cap Exemptions')
  }
}

async function getAllByTeam(req, res) {
  debug('getAllByTeam')
  const { scadLeagueId, yahooTeamId } = req.params
  try {
    const result = await capExemptions.getAllByLeague(scadLeagueId)
    let teamCE = result.filter((t) => t.yahooTeamGive.team_id == yahooTeamId || t.yahooTeamRecieve.team_id == yahooTeamId)
    res.json({
      data: teamCE,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Cap Exemptions')
  }
}

async function create(req, res) {
  debug('create')
  const ce = req.body.data
  ce.timestamp = moment()
  if (ce) {
    try {
      await capExemptions.create(ce)
      res.send('Cap Exemption Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Creating Cap Exemptions')
    }
  }
}

async function update(req, res) {
  const { id } = req.params
  const ce = req.body.data
  debug('update')
  try {
    await capExemptions.update(id, ce)
    res.send('Cap Exemption updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Cap Exemptions')
  }
}

// async function updateLeague(req, res) {
//   const update = req.body.data
//   debug('updateLeague')
//   try {
//     await capExemptions.updateLeagueCEforLeagueRenewal(update)
//     res.send('Retrieved and updated Cap Exemptions Successfully')
//   } catch (error) {
//     debug(error)
//     res.status(500).send('An Error Occured Retrieving Cap Exemptions')
//   }
// }

async function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await capExemptions.remove(id)
    res.send('Cap Exemption removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Cap Exemptions')
  }
}
