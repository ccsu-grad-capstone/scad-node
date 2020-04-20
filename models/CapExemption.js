const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CapExemptionSchema = new Schema({
  yahooLeagueId: { type: String, required: true },
  year: { type: String, required: true},  
  timestamp: { type: String, required: true},
  yahooTeamGive: { type: Object, required: true },
  yahooTeamRecieve: { type: Object, required: true },
  amount: { type: Number },
  comments: { type: String}
});

const CapExemption = mongoose.model("CapExemption", CapExemptionSchema);

module.exports = CapExemption;