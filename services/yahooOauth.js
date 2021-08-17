const axios = require('axios')
const xml2js = require('xml2js')
const debug = require('debug')('app:yahooOauth')
const { YAHOO_REDIRECT, YAHOO_REFRESH, YAHOO_GET_TOKEN, YAHOO_BASIC_AUTH } = require('../config')
const https = require('https')


var parser = xml2js.Parser({ explicitArray: false })

function yahooOauth() {
  function getAccessTokens(code) {

    const agentOptions = {
      rejectUnauthorized: false
    };

    const agent = new https.Agent(agentOptions)

    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${YAHOO_BASIC_AUTH}`},
      data: `grant_type=authorization_code&redirect_uri=${YAHOO_REDIRECT}&code=${code}`,
      url: `${YAHOO_GET_TOKEN}`,
      agent: agent,
    }
    return new Promise((resolve, reject) => {
      axios(options)
        .then(response => {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            debug('*')
            debug(response.status)
            reject(response.status)
          }
        })
        .catch(error => {
          debug('**')
          debug(error)
          reject(error)
        })
      })
    }
    function refreshToken(refresh_token) {
      const options = {
        method: 'POST',
        headers: { 
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${YAHOO_BASIC_AUTH}`},
          data: `grant_type=refresh_token&redirect_uri=${YAHOO_REFRESH}&refresh_token=${refresh_token}`,
          url: `${YAHOO_GET_TOKEN}`
        }
        return new Promise((resolve, reject) => {
          axios(options)
          .then(response => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              debug('***')
              debug(response.status)
              reject(response.status)
            }
          })
          .catch(error => {
            debug('****')
            debug(error.response)
            reject(error)
          })
    })
  }
  return { getAccessTokens, refreshToken }
}

module.exports = yahooOauth()
