const express = require('express')
const yahooController = require('../controllers/yahooController')
const debug = require('debug')('app:authRouter')

const authRouter = express.Router()
const yahooOauth = require('../services/yahooOauth')

function router() {
  const { redirectToYahoo, getAccessTokens, refreshToken, middleware } = yahooController(yahooOauth)
  authRouter.use(middleware)

  authRouter.get('/yahoo', redirectToYahoo)
  authRouter.get('/yahoo/redirect', getAccessTokens)
  authRouter.get('/yahoo/refresh', refreshToken)

  return authRouter
}

module.exports = router()
