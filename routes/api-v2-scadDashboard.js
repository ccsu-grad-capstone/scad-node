const express = require('express')
const scadDashboard = require('../controllers/scadDashboard')
const debug = require('debug')('app:scadDashboardRouter')
const scadAuth = require('../utilities/scadAuth')

const scadDashboardRouter = express.Router()

scadDashboardRouter.get('/details', scadAuth(), getDashboardDetails)

module.exports = scadDashboardRouter

async function getDashboardDetails(req, res) {
  const { accesstoken, idtoken } = req.headers
  debug('getDashboardDetails')
  debug('accesstoken', accesstoken)
  debug('idtoken', idtoken)

  try {
    const result = await scadDashboard.getDashboardDetails(accesstoken, idtoken)
    debug('Returning getDashboardDetails')
    res.json({ result })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Dashboard Details')
  }
}