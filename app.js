const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http');
const https = require('https')

const authRouter = require('./routes/authRouter')
const draftPicks = require('./routes/draftPicks-route')
const capExemptions = require('./routes/capExemptions-route')
const dotenv = require('dotenv')
const { getENV } = require('./utilities/enviornment')

dotenv.config()
const app = express()
const port = process.env.PORT || 4000
const httpsPort = 3001

// MongoDB config
// const uri = process.env.MONGO_DB
// const uri = 'mongodb+srv://admin:scad1234@cluster0-ugtb0.mongodb.net/scad?retryWrites=true&w=majority'
const uri = 'mongodb://heroku_ckq8kkbx:s3f2c16bmpcu7p5vhdl3egq6s4@ds143201.mlab.com:43201/heroku_ckq8kkbx'
mongoose.connect(`${uri}`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => debug(`Successfully connected to database from ${uri}`))
mongoose.connection.on('disconnected', () => debug('Database disconnected..'))
mongoose.connection.on('error', () => debug('Could not connect to database'))

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public/')))
//views to use if we're displaying anything in the brower from this url (localhost:4000)
app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/auth', authRouter)
app.use('/draftPicks', draftPicks)
app.use('/capExemptions', capExemptions)

app.get('/', (req, res) => {
  res.redirect(`${getENV('VUE_APP_UI')}/about`)
})

var key = fs.readFileSync('./certificates/selfsigned.key');
var cert = fs.readFileSync('./certificates/selfsigned.crt');

var credentials = {key: key, cert: cert}

// var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

// httpServer.listen(port, () => { debug(`HTTP listening on port ${chalk.green(port)}`) })
httpsServer.listen(port, () => { debug(`HTTPS listening on port ${chalk.green(port)}`) })

// app.listen(port, () => {
//   debug(`listening on port ${chalk.green(port)}`)
//   // debug('process.env: ', process.env)
// })
module.exports = app;