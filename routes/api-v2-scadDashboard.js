const express = require('express')
const scadDashboard = require('../controllers/scadDashboard')
const debug = require('debug')('app:scadDashboardRouter')
const scadAuth = require('../utilities/scadAuth')

const scadDashboardRouter = express.Router()

scadDashboardRouter.get('/details', scadAuth(), getDashboardDetails)

module.exports = scadDashboardRouter

async function getDashboardDetails(req, res) {
  const { access_token } = req.headers
  debug('getDashboardDetails')
  try {
    const result = await scadDashboard.getDashboardDetails(access_token)
    res.json({ result })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Scad Team')
  }
}