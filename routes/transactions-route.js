const express = require('express')
const transaction = require('../controllers/transaction')
const debug = require('debug')('app:transaction')

const transactionRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  transactionRouter.use(scadAuth)

  async function getTransaction (req, res) {
    const { yahooLeagueId } = req.params
    debug(yahooLeagueId)
    try {
      const result = await transaction.get(yahooLeagueId)
      res.json({
        data: result
      })
      
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Retrieving Transaction')
    }
  }

  function createTransaction (req, res) {
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

  function updateTransaction (req, res) {
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

  function removeTransaction (req, res) {
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

  transactionRouter.get('/:yahooLeagueId', getTransaction)
  transactionRouter.post('/create', createTransaction)
  transactionRouter.put('/update/:id', updateTransaction)
  transactionRouter.delete('/:id', removeTransaction)

  return transactionRouter
}

module.exports = router()
