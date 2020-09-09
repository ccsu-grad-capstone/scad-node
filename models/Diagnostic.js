const mongoose = require(mongoose);
const Schema = mongoose.Schema;

const DiagnosticSchema = new Schema({
  lastChecked: { type: Date },
  yahooLeagueId: { type: String }
});

const Diagnostic = mongoose.model(Diagnostic, DiagnosticSchema);

module.exports = Diagnostic;