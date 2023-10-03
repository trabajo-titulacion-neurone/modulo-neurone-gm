const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActionChallengeSchema = new Schema({
    app_code: { type: String, required: true},
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
    challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
    action: {type: Schema.Types.ObjectId, ref: 'Action', required: true},
    action_counter: { type: Number, required: true},
    total_actions_required: { type: Number, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    active: {type: Boolean, required: true},
    completed: {type: Boolean, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ActionChallengeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('ActionChallenge', ActionChallengeSchema);
