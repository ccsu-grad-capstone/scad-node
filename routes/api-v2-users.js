const express = require('express')
const debug = require('debug')('app:user')
const scadAuth = require('../utilities/scadAuth')
const userController = require('../controllers/users')

const userRouter = express.Router()

// Already in LAMBDAS
userRouter.get('/details', scadAuth(), getUser)

module.exports = userRouter

async function getUser(req, res) {
  debug('getUser')
  const { idtoken } = req.headers
  try {
    let result = await userController.getUserDetails(idtoken)
    res.json({
      user: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send(error)
  }
}
