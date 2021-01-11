const basicAuth = require('express-basic-auth')
const debug = require('debug')('app:scadAuth')


function scadAuth () {
  // debug('*****')
  // Basic Auth
  return basicAuth({
    users: { 'user': 'node-api-readwrite'},
    unauthorizedResponse: getUnauthorizedResponse
  })
 
  function getUnauthorizedResponse(req) {
      return req.auth
          ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
          : 'No credentials provided'
  }
}

module.exports = scadAuth