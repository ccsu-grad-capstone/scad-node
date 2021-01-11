const express = require('express')
const capExemptions = require('../controllers/capExemptions')
const debug = require('debug')('app:capExemptionRouter')
const moment = require('moment')
const scadAuth = require('../utilities/scadAuth')

const capExemptionRouter = express.Router()

capExemptionRouter.get('/check/:leagueId/:year', scadAuth(), checkLeague)
capExemptionRouter.get('/:leagueId/:year', scadAuth(), getAllByLeague)
capExemptionRouter.get('/:leagueId/:year/:teamId', scadAuth(), getAllByTeam)
capExemptionRouter.post('/create', scadAuth(), create)
capExemptionRouter.put('/updateLeague', scadAuth(), updateLeague)
capExemptionRouter.put('/:id', scadAuth(), update)
capExemptionRouter.delete('/remove/:id', scadAuth(), remove)

module.exports = capExemptionRouter

async function checkLeague(req, res) {
  const { leagueId, year } = req.params
  debug('checkLeague')
  try {
    const result = await capExemptions.checkLeague(leagueId, year)
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
  const { leagueId, year } = req.params
  try {
    const result = await capExemptions.getAllByLeague(leagueId, year)
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
  const { leagueId, year, teamId } = req.params
  try {
    const result = await capExemptions.getAllByLeague(leagueId, year)
    let teamCE = result.filter((t) => t.yahooTeamGive.team_id == teamId || t.yahooTeamRecieve.team_id == teamId)
    res.json({
      data: teamCE,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Cap Exemptions')
  }
}

function create(req, res) {
  debug('create')
  const ce = req.body.data
  ce.timestamp = moment()
  if (ce) {
    try {
      capExemptions.create(ce)
      res.send('Cap Exemption Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Creating Cap Exemptions')
    }
  }
}

function update(req, res) {
  const { id } = req.params
  const ce = req.body.data
  debug('update')
  try {
    capExemptions.update(id, ce)
    res.send('Cap Exemption updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Cap Exemptions')
  }
}

async function updateLeague(req, res) {
  const update = req.body.data
  debug('updateLeague')
  try {
    const capExceptions = await capExemptions.getAllByLeague(update.oldId, update.year - 1)

    for (ce of capExceptions) {
      ce.yahooLeagueId = update.newId
      ce.yahooLeagueYear = update.year
      let prev = {
        year: update.year - 1,
        yahooLeagueId: update.oldId,
      }
      ce.prevLeagueIds.push(prev)
      await capExemptions.update(ce._id, ce)
    }
    res.send('Retrieved and updated Cap Exemptions Successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Cap Exemptions')
  }
}

function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    capExemptions.remove(id)
    res.send('Cap Exemption removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Cap Exemptions')
  }
}
