const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  yahooGameId: { type: String, required: true },
	yahooLeagueId: { type: String, required: true },
	seasonYear: { type: Number, required: true },
	leagueManagers: { type: Number, required: true },
	rookieDraftRds: { type: Number, required: true },
	rookieDraftStrategy: { type: String, required: true },
	rookieWageScale: { type: String, required: true },
	teamSalaryCap: { type: Number, required: true },
	leagueSalaryCap: { type: Number, required: true },
	salaryCapExemptionLimit: { type: Number, required: true },
	irReliefPerc: { type: Number, required: true },
	franchiseTagDiscount: { type: Number, required: true },
	franchiseTagSpots: { type: Number, required: true },
	tradingDraftPickYears: { type: Number, required: true },
	qbMin: { type: Number, required: true },
	qbMax: { type: Number, required: true },
	rbMin: { type: Number, required: true },
	rbMax: { type: Number, required: true },
	wrMin: { type: Number, required: true },
	wrMax: { type: Number, required: true },
	teMin: { type: Number, required: true },
	teMax: { type: Number, required: true },
	kMin: { type: Number, required: true },
	kMax: { type: Number, required: true },
	defMin: { type: Number, required: true },
	defMax: { type: Number, required: true },
	isDefault: { type: Boolean, required: true },
	ownerGuid: { type: String },
	renewSCADLeagueId: { type: String },
	rosterSpotLimit: { type: Number, required: true },
})

module.exports = mongoose.model("ScadLeague", schema)