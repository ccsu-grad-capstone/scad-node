const express = require('express')
const diagnostic = require('../controllers/diagnostic')
const debug = require('debug')('app:diagnostic')

const diagnosticRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  diagnosticRouter.use(scadAuth)

  async function getDiagnostic (req, res) {
    const { yahooLeagueId } = req.params
    debug(yahooLeagueId)
    try {
      const result = await diagnostic.get(yahooLeagueId)
      res.json({
        data: result
      })
      
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Retrieving Diagnostic')
    }
  }

  function createDiagnostic (req, res) {
    const d = req.body.data
    debug('create')
    if (d) {
      try {
        diagnostic.create(d)
        res.send('dDagnostic Created successfully')
      } catch (error) {
        debug(error)
        res.status(500).send('An Error Occured Updating Diagnostic')
      }
    } else {
      res.status(500).send('No Diagnostic supplied with request.')
    }
  }

  function updateDiagnostic (req, res) {
    const { id } = req.params
    const p = req.body.data
    debug('update')
    try {
      diagnostic.update(id, p)
      res.send('Diagnostic updated successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Diagnostic')
    }
  }

  function removeDiagnostic (req, res) {
    const { id } = req.params
    debug('remove')
    try {
      diagnostic.remove(id)
      res.send('Diagnostic removed successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Removing Diagnostics')
    }
  }

  diagnosticRouter.get('/:yahooLeagueId', getDiagnostic)
  diagnosticRouter.post('/create', createDiagnostic)
  diagnosticRouter.put('/update/:id', updateDiagnostic)
  diagnosticRouter.delete('/:id', removeDiagnostic)

  return diagnosticRouter
}

module.exports = router()
