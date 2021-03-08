const scadLeagueController = require('../controllers/scadLeague')
const scadTeamController = require('../controllers/scadTeam')
const scadPlayerController = require('../controllers/scadPlayer')
const draftPicksController = require('../controllers/draftPicks')
const capExemptionsController = require('../controllers/capExemptions')
const diagnosticController = require('../controllers/diagnostic')
const transactionController = require('../controllers/transaction')
const userDefaultLeagueController = require('../controllers/userDefaultLeague')

const ScadLeague = require('../models/ScadLeague')
const moment = require('moment')
const debug = require('debug')('app:importScadLeague')

const { importLeague } = require('./importData/leagues')
const { importTeams } = require('./importData/teams')
const { importPlayers } = require('./importData/players')
const { importDraftPicks } = require('./importData/draftPicks')
const { importCapExemptions } = require('./importData/capExemptions')
const { importTransactions } = require('./importData/transactions')
const { importDiagnostics } = require('./importData/diagnostics')

const yf = require('../services/yahooFantasy')

async function importScadLeague(access_token) {
  const leagueObj = {
    league: importLeague,
    teams: importTeams,
    players: importPlayers,
    draftPicks: importDraftPicks,
    capExemptions: importCapExemptions,
    diagnostic: importTransactions,
    transaction: importDiagnostics,
  }

  // Create and save SCAD league to db
  const sl = await new ScadLeague(prepLeague(leagueObj.league))
  sl.created = moment().format()
  sl.updated = moment().format()
  await sl.save()
  debug('League Created')
  
  for (const team of leagueObj.teams) {
    await scadTeamController.create(prepTeam(team, sl._id))
  }
  debug('Teams Created')
  
  for (const player of leagueObj.players) {
    await scadPlayerController.create(prepPlayer(player, sl._id))
  }
  debug('Players Created')
  
  for (const dp of leagueObj.draftPicks) {
    await draftPicksController.create(prepDraftPick(dp, sl._id, sl.yahooGameKey))
  }
  debug('Draft Picks Created')
  
  for (const ce of leagueObj.capExemptions) {
    await capExemptionsController.create(prepCapExemptions(ce, sl._id, sl.yahooGameKey))
  }
  debug('Cap Exemptions Created')
  
  await diagnosticController.create(prepDiagnostic(leagueObj.diagnostic, sl._id, sl.yahooGameKey))
  debug('Diagnostics Created')
  await transactionController.create(prepTransaction(leagueObj.transaction, sl._id, sl.yahooGameKey))
  debug('Transactions Created')
  
  let yahooTeams = await yf.getLeagueDetails(access_token, 'teams', sl.yahooLeagueId, sl.yahooGameKey)
  let yahooGame = await yf.getCurrentYahooGame(access_token)
  
  for (const yt of yahooTeams) {
    for (const manager of yt.managers) {
      let udl = {
        yahooGame: yahooGame,
        yahooLeagueId: sl.yahooLeagueId,
        scadLeagueId: sl._id,
        guid: manager.guid,
      }
      await userDefaultLeagueController.create(udl)
    }
  }
  debug('User Default Leagues Created')
}

function prepLeague(league) {
  return {
    yahooLeagueId: league.yahooLeagueId,
    seasonYear: league.seasonYear,
    leagueManagers: league.leagueManagers,
    rookieDraftRds: league.rookieDraftRds,
    rookieDraftStrategy: league.rookieDraftStrategy,
    rookieWageScale: league.rookieWageScale,
    teamSalaryCap: league.teamSalaryCap,
    leagueSalaryCap: league.leagueSalaryCap,
    salaryCapExemptionLimit: league.salaryCapExemptionLimit,
    irReliefPerc: league.irReliefPerc,
    franchiseTagDiscount: league.franchiseTagDiscount,
    franchiseTagSpots: league.franchiseTagSpots,
    tradingDraftPickYears: league.tradingDraftPickYears,
    qbMin: league.qbMin,
    qbMax: league.qbMax,
    rbMin: league.rbMin,
    rbMax: league.rbMax,
    wrMin: league.wrMin,
    wrMax: league.wrMax,
    teMin: league.teMin,
    teMax: league.teMax,
    kMin: league.kMin,
    kMax: league.kMax,
    defMin: league.defMin,
    defMax: league.defMax,
    rosterSpotLimit: league.rosterSpotLimit,
    yahooGameKey: league.yahooGameId,
  }
}

function prepTeam(team, slid) {
  return {
    yahooTeamId: team.yahooLeagueTeamId,
    yahooLeagueId: team.yahooLeagueId,
    scadLeagueId: slid,
    salary: team.salary,
    isFranchiseTag: team.isFranchiseTag,
    exceptionIn: team.exceptionIn,
    exceptionOut: team.exceptionOut,
  }
}

function prepPlayer(player, slid) {
  return {
    yahooPlayerId: player.yahooLeaguePlayerId,
    yahooLeagueId: player.yahooLeagueId,
    scadLeagueId: slid,
    salary: player.salary,
    isFranchiseTag: player.isFranchiseTag,
    previousYearSalary: player.previousYearSalary,
  }
}

function prepDraftPick(dp, slid, yahooGameKey) {
  return {
    prevLeagueIds: dp.prevLeagueIds,
    yahooLeagueId: dp.yahooLeagueYear,
    yahooGameKey: yahooGameKey,
    scadLeagueId: slid,
    year: dp.year,
    rd: dp.rd,
    team: dp.team,
    originalTeam: dp.originalTeam,
    comments: dp.comments,
    pick: dp.pick,
    log: dp.log ? dp.log : undefined,
  }
}

function prepCapExemptions(ce, slid, yahooGameKey) {
  return {
    prevLeagueIds: ce.prevLeagueIds,
    yahooLeagueId: ce.yahooLeagueId,
    yahooGameKey: yahooGameKey,
    scadLeagueId: slid,
    year: ce.year,
    timestamp: ce.timestamp.$date,
    addedBy: ce.addedBy,
    yahooTeamGive: ce.yahooTeamGive,
    yahooTeamRecieve: ce.yahooTeamRecieve,
    amount: ce.amount,
    appliedToTeams: ce.appliedToTeams,
    comments: ce.comments,
  }
}

function prepDiagnostic(d, slid, yahooGameKey) {
  return {
    lastChecked: d.lastChecked.$date,
    yahooGameKey: yahooGameKey,
    yahooLeagueId: d.yahooLeagueId,
    scadLeagueId: slid,
  }
}

function prepTransaction(t, slid, yahooGameKey) {
  debug(t)
  return {
    lastChecked: t.lastChecked.$date,
    yahooGameKey: yahooGameKey,
    yahooLeagueId: t.yahooLeagueId,
    lastTimestamp: t.lastTimestamp,
    scadLeagueId: slid,
  }
}

module.exports = { importScadLeague }
