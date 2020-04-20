const express = require('express')
const capExemptions = require('../controllers/capExemptions')
const debug = require('debug')('app:capExemptionRouter')
const moment = require('moment')

const capExemptionRouter = express.Router()

function middleware(req, res, next) {
  next()
}

function router() {
  capExemptionRouter.use(middleware)

  async function getAllByLeague (req, res) {
    const { leagueId } = req.params
    debug(leagueId)
    try {
      const result = await capExemptions.getAllByLeague(leagueId)
      res.json({
        data: result
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllByTeam (req, res) {
    const { leagueId, teamId } = req.params
    debug(leagueId, teamId)
    try {
      const result = await capExemptions.getAllByLeague(leagueId)
      let teamCE = result.filter(t => t.team.team_id == teamId)
        
      res.json({
        data: teamCE
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  function create (req, res) {
    debug('create')
    const ce = req.body.data
    ce.timestamp = moment()
    if (ce) {
      try {
        capExemptions.create(ce)
        res.send('Cap Exemption Created successfully')
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
      capExemptions.update(id, dp)
      res.send('Cap Exemption updated successfully')
    } catch (error) {
      console.log(error)
    }
  }

  function remove (req, res) {
    const { id } = req.params
    debug('remove')
    try {
      capExemptions.remove(id)
      res.send('Cap Exemption removed successfully')

    } catch (error) {
      console.log(error)
    }
  }

  capExemptionRouter.get('/:leagueId', getAllByLeague)
  capExemptionRouter.get('/:leagueId/team/:teamId', getAllByTeam)
  capExemptionRouter.post('/create', create)
  capExemptionRouter.put('/:id', update)
  capExemptionRouter.delete('/remove/:id', remove)

  return capExemptionRouter
}

module.exports = router()
