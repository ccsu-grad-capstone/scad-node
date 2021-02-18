const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
	yahooPlayerId: { type: String, required: true },
	yahooLeagueId: { type: String, required: true },
	scadLeagueId: { type: Schema.Types.ObjectId, ref: 'ScadLeague', required: true},
	salary: { type: Number, required: true },
	isFranchiseTag: { type: Boolean, required: true },
	renewSCADLeaguePlayerId: { type: Schema.Types.ObjectId, ref: 'ScadPlayer'},
	previousYearSalary: { type: Number, required: true },
  updated: { type: String },
  created: { type: String }
})

module.exports = mongoose.model("ScadPlayer", schema)