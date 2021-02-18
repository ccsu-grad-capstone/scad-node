const express = require('express')
const transaction = require('../controllers/transaction')
const debug = require('debug')('app:transaction')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const transactionRouter = express.Router()

transactionRouter.get('/:yahooLeagueId', scadAuth(), getTransaction)
transactionRouter.get('/yahoo/:yahooLeagueId/:access_token', scadAuth(), getYahooTransactions)
transactionRouter.post('/create', scadAuth(), createTransaction)
transactionRouter.put('/update/:id', scadAuth(), updateTransaction)
transactionRouter.delete('/:id', scadAuth(), removeTransaction)

module.exports = transactionRouter

async function getYahooTransactions(req, res) {
  const { access_token, yahooLeagueId } = req.params
  // debug(access_token, yahooLeagueId)
  try {
    let result = await yf.getTransactions(access_token, yahooLeagueId)
    res.json({
      transactions: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transactions')
  }
}

async function getTransaction(req, res) {
  const { yahooLeagueId } = req.params
  debug(yahooLeagueId)
  try {
    const result = await transaction.get(yahooLeagueId)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transaction')
  }
}

function createTransaction(req, res) {
  const t = req.body.data
  debug('create')
  if (t) {
    try {
      transaction.create(t)
      res.send('Transaction Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating transaction')
    }
  } else {
    res.status(500).send('No Transaction supplied with request.')
  }
}

function updateTransaction(req, res) {
  const { id } = req.params
  const t = req.body.data
  debug('update')
  try {
    transaction.update(id, t)
    res.send('Transaction updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Transaction')
  }
}

function removeTransaction(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    transaction.remove(id)
    res.send('Transaction removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Transactions')
  }
}
