const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiagnosticSchema = new Schema({
  lastChecked: { type: Date },
  yahooGameKey: { type: String, required: true },
  yahooLeagueId: { type: String },
  scadLeagueId: { type: String}
});

const Diagnostic = mongoose.model("Diagnostic", DiagnosticSchema);

module.exports = Diagnostic;