const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChallengeSchema = new Schema({
    app_code: { type: String, required: true},
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    description: { type: String, required: true},
    start_date: { type: Date, required: true},
    end_date: { type: Date, required: true},
    actions_required: [
        {
            _id: false,
            action: {type: Schema.Types.ObjectId, ref: 'Action', required: true},
            times_required: { type: Number, required: true},
        }
    ],
    challenges_required: [
        {
            _id: false,
            challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true}
        }
    ],
    badge: { type: Schema.Types.ObjectId, ref: 'Badge'},
    points_awards: [
        {
            _id: false,
            point: {type: Schema.Types.ObjectId, ref: 'Point', required: true},
            amount: {type: Number, required: true}
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ChallengeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
