const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  lastChecked: { type: Date, required: true },
  yahooLeagueId: { type: String, required: true }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;