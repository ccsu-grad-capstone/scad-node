const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const basicAuth = require('express-basic-auth')

const authRouter = require('./routes/authRouter')
const draftPicks = require('./routes/draftPicks-route')

const app = express()
const port = process.env.PORT || 4000

// MongoDB config
const uri = "mongodb+srv://admin:scad1234@cluster0-ugtb0.mongodb.net/scad?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => debug('Successfully connected to database..'))
mongoose.connection.on('disconnected', () => debug('Database disconnected..'))
mongoose.connection.on('error', () => debug('Could not connect to database'))


app.use(cors())
// app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Basic Auth
app.use(basicAuth({
    users: { 'user': 'node-api-readwrite'}
}))

app.use(express.static(path.join(__dirname, '/public/')))
//views to use if we're displaying anything in the brower from this url (localhost:4000)
app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/auth', authRouter)
app.use('/draftPicks', draftPicks)

app.get('/', (req, res) => {
  res.redirect('http://localhost:8081/about')
})

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`)
})
module.exports = app;