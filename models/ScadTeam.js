const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
	yahooTeamId: { type: String, required: true },
	yahooGuid: { type: String },
	yahooLeagueId: { type: String, required: true },
	scadLeagueId: { type: Schema.Types.ObjectId, ref: 'ScadLeague', required: true},
	salary: { type: Number, required: true },
	isFranchiseTag: { type: Boolean, required: true },
	exceptionIn: { type: Number, required: true },
	exceptionOut: { type: Number, required: true },
	renewScadTeamId: { type: Schema.Types.ObjectId, ref: 'ScadTeam'},
	previousScadTeamId: { type: Schema.Types.ObjectId, ref: 'ScadTeam'},
  updated: { type: String },
  created: { type: String }
})

module.exports = mongoose.model("ScadTeam", schema)