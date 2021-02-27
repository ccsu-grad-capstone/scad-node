const debug = require('debug')('app:scadLeagueController')
const moment = require('moment')
const ScadLeague = require('../models/ScadLeague')
const scadTeamController = require('./scadTeam')
const scadPlayerController = require('./scadPlayer')
const userDefaultLeagueController = require('./userDefaultLeague')
const transactionController = require('./transaction')
const diagnosticController = require('./diagnostic')
const draftPicksController = require('./draftPicks')
const capExemptionController = require('./capExemptions')
const yf = require('../services/yahooFantasy')

async function getById(id) {
  debug('Getting ScadLeague by id:', id)
  return await ScadLeague.findById(id)
}

async function getByYahooLeagueId(gameKey, yahooLeagueId) {
  debug('Getting ScadLeague by yahooLeagueId:', gameKey, yahooLeagueId)
  return await ScadLeague.findOne({ yahooGameKey: gameKey, yahooLeagueId: yahooLeagueId })
}

async function create(scadLeague, access_token) {
  try {
    debug('Creating new ScadLeague')

    // Check if SCAD league already exists for YahooLeagueId

    // if (await ScadLeague.findOne({ yahooLeagueId: scadLeague.yahooLeagueId })) {
    //   throw 'It appears a SCAD league already exists for this Yahoo League. '
    // }

    // Create and save SCAD league to db
    const newScadLeague = new ScadLeague(scadLeague)
    const currentYahooGame = await yf.getCurrentYahooGame(access_token)
    newScadLeague.yahooGameKey = currentYahooGame.game_key
    newScadLeague.created = moment().format()
    newScadLeague.updated = moment().format()
    await newScadLeague.save()

    const yahooTeams = await yf.getCurrentSeasonLeagueDetails(access_token, 'teams', scadLeague.yahooLeagueId)
    const yahooLeaguePlayers = await yf.getAllLeaguePlayers(access_token, scadLeague.yahooLeagueId)

    for (const yt of yahooTeams) {
      // For each Yahoo Team, create a SCAD team..
      let st = {
        yahooTeamId: yt.team_id,
        yahooLeagueId: scadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: 0,
        isFranchiseTag: false,
        exceptionIn: 0,
        exceptionOut: 0,
      }
      await scadTeamController.create(st)

      // For each Yahoo Team and Manager of team, create a User Default League
      let yahooGame = await yf.getCurrentYahooGame(access_token)
      for (const manager of yt.managers) {
        if (await userDefaultLeagueController.getByGuid(manager.guid)) {
          debug('User Default League already exists for user ', manager.nickname)
        } else {
          let udl = {
            yahooGame: yahooGame,
            yahooLeagueId: newScadLeague.yahooLeagueId,
            scadLeagueId: newScadLeague._id,
            guid: manager.guid,
          }
          await userDefaultLeagueController.create(udl)
        }
      }
    }
    debug('Finished creating SCAD teams and UDLs')

    // For each Yahoo Player, create a SCAD player..
    for (const yp of yahooLeaguePlayers) {
      let sp = {
        yahooPlayerId: yp.player_id,
        yahooLeagueId: scadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: 0,
        isFranchiseTag: false,
        previousYearSalary: 0,
      }
      await scadPlayerController.create(sp)
    }
    debug('Finished creating SCAD players')

    // Need to initiate a transaction resource for this league.

    let transaction = {
      lastChecked: new Date(),
      yahooGameKey: newScadLeague.yahooGameKey,
      yahooLeagueId: newScadLeague.yahooLeagueId,
      lastTimestamp: '',
    }
    await transactionController.create(transaction)

    let diagnostic = {
      lastChecked: new Date(),
      yahooGameKey: newScadLeague.yahooGameKey,
      yahooLeagueId: newScadLeague.yahooLeagueId,
    }
    await diagnosticController.create(diagnostic)

    debug('Creating Draft Picks for league..')
    for (let y = 0; y < 10; y++) {
      for (let r = 0; r < newScadLeague.rookieDraftRds; r++) {
        for (const team of yahooTeams) {
          let draftPick = {
            yahooLeagueId: newScadLeague.yahooLeagueId,
            yahooGameKey: newScadLeague.yahooGameKey,
            scadLeagueId: newScadLeague._id,
            year: newScadLeague.seasonYear + y,
            rd: r + 1,
            pick: undefined,
            salary: undefined,
            playerId: undefined,
            team: team,
            originalTeam: team,
            comments: '',
            prevScadLeagueIds: [],
            log: [],
          }
          await draftPicksController.create(draftPick)
        }
      }
    }
    debug('Finished creating Draft Picks for league..')

    debug('Finished creating SCAD league')
  } catch (error) {
    if (JSON.stringify(error).includes('already exists')) {
      throw error
    } else {
      debug(error)
      throw 'An Error Occured Creating Scad League'
    }
  }
}

async function renewLeague(id, renewedLeagueId, access_token) {
  debug('renewLeague', id, renewedLeagueId)

  const sl = await getById(id)
  const cyg = await yf.getCurrentYahooGame(access_token)

  try {
    // Check if SCAD league already exists for YahooLeagueId

    if (await ScadLeague.findOne({ yahooLeagueId: renewedLeagueId })) {
      throw 'It appears a SCAD league already exists for this renewed Yahoo League. '
    }

    // Create and save SCAD league to db

    let season = sl.seasonYear + 1

    let nsl = {
      yahooLeagueId: renewedLeagueId,
      seasonYear: season,
      leagueManagers: sl.leagueManagers,
      rookieDraftRds: sl.rookieDraftRds,
      rookieDraftStrategy: sl.rookieDraftStrategy,
      rookieWageScale: sl.rookieWageScale,
      teamSalaryCap: sl.teamSalaryCap,
      leagueSalaryCap: sl.leagueSalaryCap,
      salaryCapExemptionLimit: sl.salaryCapExemptionLimit,
      irReliefPerc: sl.irReliefPerc,
      franchiseTagDiscount: sl.franchiseTagDiscount,
      franchiseTagSpots: sl.franchiseTagSpots,
      tradingDraftPickYears: sl.tradingDraftPickYears,
      qbMin: sl.qbMin,
      qbMax: sl.qbMax,
      rbMin: sl.rbMin,
      rbMax: sl.rbMax,
      wrMin: sl.wrMin,
      wrMax: sl.wrMax,
      teMin: sl.teMin,
      teMax: sl.teMax,
      kMin: sl.kMin,
      kMax: sl.kMax,
      defMin: sl.defMin,
      defMax: sl.defMax,
      rosterSpotLimit: sl.rosterSpotLimit,
      yahooGameKey: cyg.game_key,
      previousScadLeagueId: sl._id,
      created: moment().format(),
      updated: moment().format(),
    }
    let newScadLeague = new ScadLeague(nsl)
    await newScadLeague.save()

    // Update previous season scad league renewScadLeagueId
    sl.renewScadLeagueId = newScadLeague._id
    await update(sl._id, sl)

    const prevScadTeams = await scadTeamController.getAllByScadLeagueId(sl._id)
    const udls = await userDefaultLeagueController.getByYahooLeagueId(newScadLeague.yahooLeagueId)
    const scadPlayers = await scadPlayerController.getAllByScadLeagueId(sl._id)

    debug('Renew each SCAD team')
    for (const st of prevScadTeams) {
      // Renew each scad team
      let nst = {
        yahooTeamId: st.yahooTeamId,
        yahooLeagueId: newScadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: 0,
        isFranchiseTag: false,
        exceptionIn: 0,
        exceptionOut: 0,
        previousScadTeamId: st._id,
      }
      nst = await scadTeamController.create(nst)

      st.renewScadTeamId = nst._id
      await scadTeamController.update(st._id, st)
    }
    debug('Finished renewing SCAD teams')

    debug('For each UDL that matches renewed league, update UDL.')
    for (const udl of udls) {
      udl.yahooGame = cyg
      udl.yahooLeagueId = newScadLeague.yahooLeagueId
      udl.scadLeagueId = newScadLeague._id

      await userDefaultLeagueController.update(udl.guid, udl)
    }
    debug('Finished updating User Default Leagues')

    debug('For each SCAD player in renewed league, renew SCAD player.')
    for (const sp of scadPlayers) {
      let nsp = {
        yahooPlayerId: sp.yahooPlayerId,
        yahooLeagueId: newScadLeague.yahooLeagueId,
        scadLeagueId: newScadLeague._id,
        salary: sp.salary,
        isFranchiseTag: false,
        previousYearSalary: sp.salary,
        previousScadPlayerId: sp._id,
      }
      nsp = await scadPlayerController.create(nsp)

      sp.renewScadPlayerId = nsp._id
      await scadPlayerController.update(sp._id, sp)
    }
    debug('Finished renewing SCAD players')

    let transaction = await transactionController.get(sl.yahooLeagueId)
    transaction.yahooLeagueId = newScadLeague.yahooLeagueId
    transaction.yahooGameKey = newScadLeague.yahooGameKey
    await transactionController.update(transaction._id, transaction)

    let diagnostic = await diagnosticController.get(sl.yahooLeagueId)
    diagnostic.yahooLeagueId = diagnostic.yahooLeagueId
    diagnostic.yahooGameKey = diagnostic.yahooGameKey
    await diagnosticController.update(diagnostic._id, diagnostic)

    let update = {
      oldScadLeagueId: newScadLeague.previousScadLeagueId,
      year: newScadLeague.seasonYear,
      yahooLeagueId: newScadLeague.yahooLeagueId,
      yahooGameKey: newScadLeague.yahooGameKey,
      scadLeagueId: newScadLeague._id,
    }
    await draftPicksController.updateLeagueDPforLeagueRenewal(update)
    await capExemptionController.updateLeagueCEforLeagueRenewal(update)

    debug('Finished renewing SCAD league')
  } catch (error) {
    if (JSON.stringify(error).includes('already exists')) {
      debug('ERR renewLeague', error)
      throw error
    } else {
      debug('ERR renewLeague', error)
      throw 'An Error Occured Creating Scad League'
    }
  }
}

async function update(id, scadLeague) {
  debug('Updating ScadLeague: ', id)
  const league = await getById(id)

  if (league) {
    Object.assign(league, scadLeague)
    league.updated = moment().format()
    await league.save()

    return league
  } else {
    throw 'League not found.'
  }
}

async function remove(id) {
  debug('Removing ScadLeague: ', id)
  return await ScadLeague.findByIdAndRemove(id).exec()
}

async function getAll() {
  debug('Getting all ScadLeagues')
  return await ScadLeague.find()
}

module.exports = {
  getAll,
  getById,
  getByYahooLeagueId,
  create,
  renewLeague,
  update,
  remove,
}
