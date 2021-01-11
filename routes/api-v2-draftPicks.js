const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')
const scadAuth = require('../utilities/scadAuth')

const draftPicksRouter = express.Router()

draftPicksRouter.get('/check/:leagueId/:year', scadAuth(), checkLeague)
draftPicksRouter.get('/:leagueId/:year', scadAuth(), getAllByLeague)
draftPicksRouter.get('/:leagueId/:year/:teamId', scadAuth(), getAllByTeam)
draftPicksRouter.post('/create', scadAuth(), create)
draftPicksRouter.put('/updateLeague', scadAuth(), updateLeague)
draftPicksRouter.put('/:id', scadAuth(), update)
draftPicksRouter.delete('/remove:id', scadAuth(), remove)

module.exports = draftPicksRouter

async function checkLeague(req, res) {
  const { leagueId, year } = req.params
  debug(leagueId)
  try {
    const result = await draftPicks.checkLeague(leagueId, year)
    if (result.length > 0) {
      res.sendStatus(200)
    } else {
      res.sendStatus(204)
    }
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Draft Picks')
  }
}

async function getAllByLeague(req, res) {
  const { leagueId, year } = req.params
  debug(leagueId)
  try {
    const result = await draftPicks.getAllByLeague(leagueId, year, 180)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Draft Picks')
  }
}

async function getAllByTeam(req, res) {
  const { leagueId, year, teamId } = req.params
  debug(leagueId, year, teamId)
  try {
    const result = await draftPicks.getAllByLeague(leagueId, year, 180)
    let teamPicks = result.filter((t) => t.team.team_id == teamId)

    res.json({
      data: teamPicks,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Draft Picks')
  }
}

function create(req, res) {
  const dp = req.body.data
  if (dp) {
    try {
      draftPicks.create(dp)
      res.send('Draft Pick Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Draft Pick')
    }
  } else {
    res.status(500).send('No Draft Pick supplied with request.')
  }
}

function update(req, res) {
  const { id } = req.params
  const dp = req.body.data
  debug('update')
  try {
    draftPicks.update(id, dp)
    res.send('Draft Pick updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Draft Pick')
  }
}

async function updateLeague(req, res) {
  const update = req.body.data
  debug('updateLeague', update)
  try {
    const picks = await draftPicks.getAllByLeague(update.oldId, update.year - 1)

    for (p of picks) {
      p.yahooLeagueId = update.newId
      p.yahooLeagueYear = update.year
      let prev = {
        year: update.year - 1,
        yahooLeagueId: update.oldId,
      }
      p.prevLeagueIds.push(prev)
      await draftPicks.update(p._id, p)
    }
    res.send('Retrieved and Updated Draft Picks Successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Draft Picks')
  }
}

function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    draftPicks.remove(id)
    res.send('Draft Pick removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Draft Picks')
  }
}
