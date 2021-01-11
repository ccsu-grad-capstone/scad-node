const express = require('express')
const yahooController = require('../controllers/yahooController')
const debug = require('debug')('app:authRouter')
const scadAuth = require('../utilities/scadAuth')

const yahooOauth = require('../services/yahooOauth')
const { redirectToYahoo, getAccessTokens, refreshToken, middleware } = yahooController(yahooOauth)

const authRouter = express.Router()
authRouter.use(middleware)

authRouter.get('/yahoo', redirectToYahoo)
authRouter.get('/yahoo/redirect',  getAccessTokens)
authRouter.get('/yahoo/refresh', scadAuth(), refreshToken)

module.exports = authRouter
