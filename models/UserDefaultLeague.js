const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  yahooGame: { type: Object },
	yahooLeagueId: { type: String, required: true },
	scadLeagueId: { type: Schema.Types.ObjectId, ref: 'ScadLeague', required: true},
	guid: { type: String, required: true, unique: true },
  updated: { type: String },
  created: { type: String }
})

module.exports = mongoose.model("UserDefaultLeague", schema)