const express = require('express')
const transaction = require('../controllers/transaction')
const debug = require('debug')('app:transaction')
const yf = require('../services/yahooFantasy')
const scadAuth = require('../utilities/scadAuth')

const transactionRouter = express.Router()

transactionRouter.get('/:yahooGameKey/:yahooLeagueId', scadAuth(), getTransaction)
transactionRouter.post('/create', scadAuth(), createTransaction)
transactionRouter.put('/update/:id', scadAuth(), updateTransaction)
transactionRouter.delete('/:id', scadAuth(), removeTransaction)

module.exports = transactionRouter

async function getTransaction(req, res) {
  const { yahooGameKey, yahooLeagueId } = req.params
  debug(yahooGameKey, yahooLeagueId)
  try {
    const result = await transaction.get(yahooGameKey, yahooLeagueId)
    res.json({
      data: result,
    })
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Retrieving Transaction')
  }
}

async function createTransaction(req, res) {
  const t = req.body.data
  debug('create')
  if (t) {
    try {
      await transaction.create(t)
      res.send('Transaction Created successfully')
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Updating transaction')
    }
  } else {
    res.status(500).send('No Transaction supplied with request.')
  }
}

async function updateTransaction(req, res) {
  const { id } = req.params
  const t = req.body.data
  debug('update')
  try {
    await transaction.update(id, t)
    res.send('Transaction updated successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Updating Transaction')
  }
}

async function removeTransaction(req, res) {
  const { id } = req.params
  debug('remove')
  try {
    await transaction.remove(id)
    res.send('Transaction removed successfully')
  } catch (error) {
    debug(error)
    res.status(500).send('An Error Occured Removing Transactions')
  }
}
