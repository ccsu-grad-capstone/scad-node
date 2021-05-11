const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')
const scadAuth = require('../utilities/scadAuth')

const draftPicksRouter = express.Router()

draftPicksRouter.get('/check/:scadLeagueId', scadAuth(), checkLeague)
draftPicksRouter.get('/:scadLeagueId/:year', scadAuth(), getAllByLeague)
draftPicksRouter.get('/:scadLeagueId/:year/:guid', scadAuth(), getAllByTeam)
draftPicksRouter.post('/create', scadAuth(), create)
// draftPicksRouter.put('/updateLeague', scadAuth(), updateLeague)
draftPicksRouter.put('/:id', scadAuth(), update)
draftPicksRouter.delete('/remove:id', scadAuth(), remove)

module.exports = draftPicksRouter

async function checkLeague(req, res) {
  const { scadLeagueId } = req.params
  debug(scadLeagueId)
  try {
    const result = await draftPicks.checkLeague(scadLeagueId)
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
  const { scadLeagueId, year } = req.params
  debug(scadLeagueId)
  try {
    const result = await draftPicks.getAllByLeague(scadLeagueId, year, 180)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Draft Picks')
  }
}

async function getAllByTeam(req, res) {
  const { scadLeagueId, year, guid } = req.params
  debug(scadLeagueId, year, guid)
  try {
    const result = await draftPicks.getAllByLeague(scadLeagueId, year, 180)
    let teamPicks = []
    for (const dp of result) {
      if (dp.team.managers[0].manager) {
        if (dp.team.managers[0].manager.guid == guid) teamPicks.push(dp)
      } else if (dp.team.managers[0].guid == guid) teamPicks.push(dp) 
    }
    res.json({
      data: teamPicks,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Draft Picks')
  }
}

async function create(req, res) {
  const dp = req.body.data
  if (dp) {
    try {
      await draftPicks.create(dp)
      res.send('Draft Pick Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Draft Pick')
    }
  } else {
    res.status(500).send('No Draft Pick supplied with request.')
  }
}

async function update(req, res) {
  const { id } = req.params
  const dp = req.body.data
  debug('update')
  try {
    await draftPicks.update(id, dp)
    res.send('Draft Pick updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Draft Pick')
  }
}

// async function updateLeague(req, res) {
//   const update = req.body.data
//   debug('updateLeague', update)
//   try {
//     await draftPicks.updateLeagueDPforLeagueRenewal(update)
//     res.send('Retrieved and Updated Draft Picks Successfully')
//   } catch (error) {
//     debug(error)
//     res.status(500).send('An Error Occured Updating Draft Picks')
//   }
// }

async function remove(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await draftPicks.remove(id)
    res.send('Draft Pick removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Draft Picks')
  }
}
