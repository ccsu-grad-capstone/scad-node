const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')

const draftPicksRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  draftPicksRouter.use(scadAuth)

  async function getAllByLeague (req, res) {
    const { leagueId, year } = req.params
    debug(leagueId)
    try {
      const result = await draftPicks.getAllByLeague(leagueId, year)
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
      const result = await draftPicks.getAllByLeague(leagueId, year)
      let teamPicks = result.filter(t => t.team.team_id == teamId)
        
      res.json({
        data: teamPicks
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  function create (req, res) {
    debug('create')
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

  draftPicksRouter.get('/:leagueId/:year', getAllByLeague)
  draftPicksRouter.get('/:leagueId/:year/:teamId', getAllByTeam)
  draftPicksRouter.post('/create', create)
  draftPicksRouter.put('/:id', update)
  draftPicksRouter.delete('/remove:id', remove)

  return draftPicksRouter
}

module.exports = router()
