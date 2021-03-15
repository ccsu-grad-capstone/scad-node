const debug = require('debug')('app:UserController')
const moment = require('moment')
const yf = require('../services/yahooFantasy')
const { Base64 } = require('js-base64')
const axios = require('axios')

function getUserDetails(idToken) {
  debug('getUserDetails')
  if (idToken) {
    let splitIdToken = idToken.split('.')
    let user = JSON.parse(Base64.decode(splitIdToken[1]))
    user.guid = user.sub
    delete user.sub
    return user
  }
}

async function getUserGuid (idToken) {
  debug('getUserGuid')
  const user = await getUserDetails(idToken)
  console.log('user', user)
  return user.guid
}

// async function verifyIdToken(idToken) {
//   debug('verifyIdToken')
//   let splitIdToken = idToken.split('.')
//   let part1 = JSON.parse(Base64.decode(splitIdToken[0]))
//   let kid = part1.kid
//   let alg = part1.alg
//   debug(kid)
//   debug(alg)

//   const options = {
//     method: 'GET',
//     headers: { },
//     data: '',
//     url: `https://api.login.yahoo.com/openid/v1/certs`
//   }
//   try {
//     let response = await axios(options)  
//     return response
//     debug(response)
//   } catch (error) {
//     debug('*****', error)    
//   }
// }

module.exports = {
  getUserDetails,
  getUserGuid
}
