const express = require('express')
const diagnostic = require('../controllers/diagnostic')
const debug = require('debug')('app:diagnostic')
const scadAuth = require('../utilities/scadAuth')

const diagnosticRouter = express.Router()

diagnosticRouter.get('/:yahooLeagueId', scadAuth(), getDiagnostic)
diagnosticRouter.post('/create', scadAuth(), createDiagnostic)
diagnosticRouter.put('/update/:id', scadAuth(), updateDiagnostic)
diagnosticRouter.delete('/:id', scadAuth(), removeDiagnostic)

module.exports = diagnosticRouter

async function getDiagnostic(req, res) {
  const { yahooLeagueId } = req.params
  debug(yahooLeagueId)
  try {
    const result = await diagnostic.get(yahooLeagueId)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Diagnostic')
  }
}

async function createDiagnostic(req, res) {
  const d = req.body.data
  debug('create')
  if (d) {
    try {
      await diagnostic.create(d)
      res.send('Diagnostic Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating Diagnostic')
    }
  } else {
    res.status(500).send('No Diagnostic supplied with request.')
  }
}

async function updateDiagnostic(req, res) {
  const { id } = req.params
  const d = req.body.data
  debug('update')
  try {
    await diagnostic.update(id, d)
    res.send('Diagnostic updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Diagnostic')
  }
}

async function removeDiagnostic(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await diagnostic.remove(id)
    res.send('Diagnostic removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Diagnostics')
  }
}
