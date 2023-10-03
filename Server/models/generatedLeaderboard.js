const mongoose = require('mongoose');
const { Schema } = mongoose;

const GeneratedLeaderboardSchema = new Schema({
    app_code: { type: String, required: true},
    leaderboard: { type: Schema.Types.ObjectId, ref: 'Leaderboard', required: true},
    leaderboard_code: { type: String, required: true},
    group_code: { type: String},
    allPlayers: { type: Boolean, default: true},
    last_update: { type: Date, required: true},
    table: [
        {
            _id: false,
            name:  {type: String},
            last_name: { type: String},
            amount: { type: Number},
            rank: { type: Number}
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
GeneratedLeaderboardSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('GeneratedLeaderboard', GeneratedLeaderboardSchema);