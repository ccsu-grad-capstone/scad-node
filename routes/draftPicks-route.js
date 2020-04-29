const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')

const draftPicksRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  draftPicksRouter.use(scadAuth)

  async function checkLeague (req, res) {
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
      console.log(error)
    }
  }

  async function getAllByLeague (req, res) {
    const { leagueId, year } = req.params
    debug(leagueId)
    try {
      const result = await draftPicks.getAllByLeague(leagueId, year, 180)
      res.json({
        data: result
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllByTeam (req, res) {
    const { leagueId, year, teamId } = req.params
    debug(leagueId, year, teamId)
    try {
      const result = await draftPicks.getAllByLeague(leagueId, year, 180)
      let teamPicks = result.filter(t => t.team.team_id == teamId)
        
      res.json({
        data: teamPicks
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  function create (req, res) {
    const dp = req.body.data
    if (dp) {
      try {
        draftPicks.create(dp)
        res.send('Draft Pick Created successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  function update (req, res) {
    const { id } = req.params
    const dp = req.body.data
    debug('update')
    try {
      draftPicks.update(id, dp)
      res.send('Draft Pick updated successfully')
    } catch (error) {
      console.log(error)
    }
  }

  async function updateLeague (req, res) {
    const update = req.body.data
    debug('updateLeague', update)
    try {
      const picks = await draftPicks.getAllByLeague(update.oldId, update.year - 1)

      for (p of picks) {
        p.yahooLeagueId = update.newId
        p.yahooLeagueYear = update.year
        let prev = {
          year: update.year - 1,
          yahooLeagueId: update.oldId
        }
        p.prevLeagueIds.push(prev)
        await draftPicks.update(p._id, p)
      };
      res.send('Retrieved and updated Draft Picks Successfully')
      console.log('DONE')
    } catch (error) {
      console.log(error)
    }
  }

  function remove (req, res) {
    const { id } = req.params
    debug('remove')
    try {
      draftPicks.remove(id)
      res.send('Draft Pick removed successfully')

    } catch (error) {
      console.log(error)
    }
  }

  draftPicksRouter.get('/check/:leagueId/:year', checkLeague)
  draftPicksRouter.get('/:leagueId/:year', getAllByLeague)
  draftPicksRouter.get('/:leagueId/:year/:teamId', getAllByTeam)
  draftPicksRouter.post('/create', create)
  draftPicksRouter.put('/updateLeague', updateLeague)
  draftPicksRouter.put('/:id', update)
  draftPicksRouter.delete('/remove:id', remove)

  return draftPicksRouter
}

module.exports = router()
