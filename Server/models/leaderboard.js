const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeaderboardSchema = new Schema({
    app_code: { type: String, required: true},
    name: { type: String, required: true},
    parameter: { type: String, required: true},
    element_code: { type: String, required: true},
    code: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
LeaderboardSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);

