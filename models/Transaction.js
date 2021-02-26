const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  lastChecked: { type: Date },
  yahooGameKey: { type: String, required: true },
  yahooLeagueId: { type: String, required: true },
  lastTimestamp: { type: String }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;