const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DraftPickSchema = new Schema({
  yahooLeagueId: { type: String, required: true },
  year: { type: Number, required: true },
  rd: { type: Number, required: true },
  pick: { type: Number },
  salary: { type: Number },
  team: {type: Object },
  originalTeam: {type: Object},
  player: { type: Number}, 
  comments: { type: String}
});

const DraftPick = mongoose.model("DraftPick", DraftPickSchema);

module.exports = DraftPick;