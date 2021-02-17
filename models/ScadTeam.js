const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
	yahooLeagueTeamId: { type: String, required: true },
	yahooLeagueId: { type: String, required: true },
	scadLeagueId: { type: Schema.Types.ObjectId, ref: 'ScadLeague', required: true},
	salary: { type: Number, required: true },
	isFranchiseTag: { type: Boolean, required: true },
	exceptionIn: { type: Number, required: true },
	exceptionOut: { type: Number, required: true },
	renewSCADLeagueTeamId: { type: Schema.Types.ObjectId, ref: 'ScadTeam'}
})

module.exports = mongoose.model("ScadTeam", schema)