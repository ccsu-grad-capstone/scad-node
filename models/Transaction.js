const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  timestamp: { type: Date, required: true },
  yahooLeagueId: { type: String, required: true },
  yahooLeagueYear: { type: Number, required: true },
  prevLeagueIds: { type: Array } 
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;