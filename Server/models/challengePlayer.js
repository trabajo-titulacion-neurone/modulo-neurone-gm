const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChallengePlayerSchema = new Schema({
    app_code: { type: String, required: true},
    player: { type: Schema.Types.ObjectId, ref: 'Player'},
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge'},
    completed: {type: Boolean, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    active: {type: Boolean, required: true},
    badge: { type: Schema.Types.ObjectId, ref: 'Badge'},
    completion_date: { type: Date},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ChallengePlayerSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('ChallengePlayer', ChallengePlayerSchema);
