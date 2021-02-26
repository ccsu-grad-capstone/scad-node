const scadLeagueController = require('../controllers/scadLeague')
const scadTeamController = require('../controllers/scadTeam')
const scadPlayerController = require('../controllers/scadPlayer')
const draftPicksController = require('../controllers/draftPicks')
const capExemptionsController = require('../controllers/capExemptions')
const diagnosticController = require('../controllers/diagnostic')
const transactionController = require('../controllers/transaction')
const userDefaultLeagueController = require('../controllers/userDefaultLeague')

const yf = require('../services/yahooFantasy')

export async function importLeague(access_token, leagueObj) {
  const sl = await scadLeagueController.create(prepLeague(leagueObj.league))

  for (const team of leagueObj.teams) {
    await scadTeamController.create(prepTeam(team, sl._id))
  }

  for (const player of leagueObj.players) {
    await scadPlayerController.create(prepPlayer(player, sl._id))
  }

  for (const dp of leagueObj.draftPicks) {
    await draftPicksController.create(prepDraftPick(dp))
  }

  for (const ce of leagueObj.capExemptions) {
    await capExemptionsController.create(prepCapExemptions(ce))
  }

  await diagnosticController.create(prepDiagnostic(leagueObj.diagnostic, sl._id))
  await transactionController.create(prepTransaction(leagueObj.transaction, sl._id))

  let yahooTeams = await yf.getLeagueDetails(access_token, 'teams', sl.yahooLeagueId, sl.yahooGameKey)
  let yahooGame = await yf.getCurrentYahooGame(access_token)

  for (const yt of yahooTeams) {
    for (const manager of yt.managers) {
      let udl = {
        yahooGame: yahooGame,
        yahooLeagueId: sl.yahooLeagueId,
        scadLeagueId: sl._id,
        guid: manager.guid
      }
      await userDefaultLeagueController.create(udl)
    }
  }
}

function prepLeague(league) {
  return {
    yahooLeagueId: league.yahooLeagueId,
    seasonYear: 2020,
    leagueManagers: league.leagueManagers,
    rookieDraftRds: league.rookieDraftStrategy,
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
    yahooGameKey: league.yahooGameKey,
  }
}

function prepTeam(team, slid) {
  return {
    yahooTeamId: team.yahooTeamId,
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
    yahooPlayerId: player.yahooPlayerId,
    yahooLeagueId: player.yahooLeagueId,
    scadLeagueId: slid,
    salary: player.salary,
    isFranchiseTag: player.isFranchiseTag,
    previousYearSalary: player.previousYearSalary,
  }
}

function prepDraftPick(dp) {
  return {
    prevLeagueIds: dp.prevLeagueIds,
    yahooLeagueId: dp.yahooLeagueYear,
    yahooLeagueYear: dp.yahooLeagueYear,
    year: dp.year,
    rd: dp.rd,
    team: dp.team,
    originalTeam: dp.originalTeam,
    comments: dp.comments,
    pick: dp.pick,
    log: dp.log ? dp.log : undefined,
  }
}

function prepCapExemptions(ce) {
  return {
    prevLeagueIds: ce.prevLeagueIds,
    yahooLeagueId: ce.yahooLeagueId,
    yahooLeagueYear: ce.yahooLeagueYear,
    year: ce.year,
    timestamp: ce.timestamp,
    addedBy: ce.addedBy,
    yahooTeamGive: ce.yahooTeamGive,
    yahooTeamRecieve: ce.yahooTeamRecieve,
    amount: ce.amount,
    appliedToTeams: ce.appliedToTeams,
    comments: '',
  }
}

function prepDiagnostic(d, slid) {
  return {
    lastChecked: d.lastChecked,
    yahooGameKey: d.yahooGameKey,
    yahooLeagueId: d.yahooLeagueId,
    scadLeagueId: slid,
  }
}

function prepTransaction(t, slid) {
  return {
    lastChecked: t.lastChecked,
    yahooGameKey: t.yahooGameKey,
    yahooLeagueId: t.yahooLeagueId,
    lastTimestamp: t.lastTimestamp,
    scadLeagueId: slid,
  }
}
