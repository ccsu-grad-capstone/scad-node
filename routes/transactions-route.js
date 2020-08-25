const express = require('express')
const transactions = require('../controllers/transactions')
const debug = require('debug')('app:transactionsRouter')

const transactionsRouter = express.Router()
const scadAuth = require('../utilities/scadAuth')

function router() {
  transactionsRouter.use(scadAuth)

  async function get (req, res) {
    const { leagueId, year } = req.params
    debug('get()', leagueId)
    try {
      const result = await transactions.get(leagueId, year)
      if (result) {
        res.json({
          data: result
        })
      } else {
        res.status(400).send('Transaction doesn\'t exists')
      }
      
    } catch (error) {
      debug(error)
      res.status(500).send('An Error Occured Retrieving Draft Picks')

    }
  }

  async function create (req, res) {
    debug('create()')
    const trans = req.body.data
    if (trans) {
      try {
        let result = await transactions.create(trans)
        if (result) {
          res.send('Transaction Created Successfully')
        } else {
          res.status(400).send('Transaction already exists')
        }
      } catch (error) {
        debug(error)
        res.status(500).send('An Error Occured Creating Transaction')
      }
    } else {
      res.status(500).send('No Transaction Supplied with Request')
    }
  }

  async function update (req, res) {
    debug('update()', leagueId)
  }

  async function remove (req, res) {
    debug('remove()', leagueId)
  }

  transactionsRouter.get('/lastTimestamp', get)
  transactionsRouter.post('/create', create)
  transactionsRouter.put('/:id', update)
  transactionsRouter.delete('/remove:id', remove)

  return transactionsRouter
}

module.exports = router()
