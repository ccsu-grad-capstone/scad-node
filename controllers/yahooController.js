const debug = require('debug')('app:yahooController')
const { YAHOO_REQUEST_AUTH, YAHOO_REDIRECT} = require('../config')

function yahooController(service) {
  
  function redirectToYahoo(req, res) {
    var nonce = Math.floor(Math.random() * 1000000 + 1)
    debug(`redirectToYahoo()`)
    res.redirect(
      `${YAHOO_REQUEST_AUTH}?client_id=dj0yJmk9a1pBOHVpblRxME9PJmQ9WVdrOVpFaDZWVmxyTkcwbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWE3&redirect_uri=${YAHOO_REDIRECT}&response_type=code&language=en-us&scope=openid,fspt-w,sdpp-r&nonce=${nonce}`
    )
  }

  async function getAccessTokens(req, res) {
    const { code } = req.query
    try {
      const tokens = await service.getAccessTokens(code)
      // debug(`access_token: ${tokens.access_token}`)
      // debug(`refresh_token: ${tokens.refresh_token}`)
      // debug(`id_token: ${tokens.id_token}`)
      // res.send(tokens)
      res.redirect(`${VUE_APP_UI}/dashboard?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&id_token=${tokens.id_token}`)
    } catch (err) {
      debug(err.stack)
    }
  }

  async function refreshToken(req, res) {
    debug('refreshToken')
    const { refresh_token } = req.query
    try {
      const tokens = await service.refreshToken(refresh_token)
      // debug(`access_token: ${tokens.access_token}`)
      // debug(`refresh_token: ${tokens.refresh_token}`)
      res.send(tokens)
    } catch (err) {
      debug(err.stack)
    }
  }

  function middleware(req, res, next) {
    //if (req.user) {
    next()
    // } else {
    //   res.redirect('/')
    // }
  }
  return { redirectToYahoo, getAccessTokens, refreshToken, middleware }
}

module.exports = yahooController
