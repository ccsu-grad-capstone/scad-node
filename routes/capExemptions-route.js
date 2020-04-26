const express = require('express')
const capExemptions = require('../controllers/capExemptions')
const debug = require('debug')('app:capExemptionRouter')
const moment = require('moment')

const capExemptionRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  capExemptionRouter.use(scadAuth)
  async function getAllByLeague (req, res) {
    const { leagueId, year } = req.params
    debug(leagueId)
    try {
      const result = await capExemptions.getAllByLeague(leagueId, year)
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
      const result = await capExemptions.getAllByLeague(leagueId, year)
      let teamCE = result.filter(t => ((t.yahooTeamGive.team_id == teamId) || (t.yahooTeamRecieve.team_id == teamId)))
        
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
    debug(ce.timestamp)
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

  capExemptionRouter.get('/:leagueId/:year', getAllByLeague)
  capExemptionRouter.get('/:leagueId/:year/:teamId', getAllByTeam)
  capExemptionRouter.post('/create', create)
  capExemptionRouter.put('/:id', update)
  capExemptionRouter.delete('/remove/:id', remove)

  return capExemptionRouter
}

module.exports = router()
