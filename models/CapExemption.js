const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CapExemptionSchema = new Schema({
  yahooLeagueId: { type: String, required: true },
  yahooGameKey: { type: Number, required: true },
	scadLeagueId: { type: Schema.Types.ObjectId, ref: 'ScadLeague', required: true},
  year: { type: String, required: true},  
  timestamp: { type: Date, required: true},
  addedBy: { type: String },
  yahooTeamGive: { type: Object, required: true },
  yahooTeamRecieve: { type: Object, required: true },
  amount: { type: Number },
  comments: { type: String},
  appliedToTeams: { type: Boolean },
  prevScadLeagueIds: { type: Array}
});

const CapExemption = mongoose.model("CapExemption", CapExemptionSchema);

module.exports = CapExemption;