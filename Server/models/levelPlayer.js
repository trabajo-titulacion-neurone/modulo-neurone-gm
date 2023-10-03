const mongoose = require('mongoose');
const { Schema } = mongoose;

const LevelPlayerSchema = new Schema({
    app_code: { type: String, required: true},
    player: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
    level: {type: Schema.Types.ObjectId, ref: 'Level', required: true},
    point: {type: Schema.Types.ObjectId, ref: 'Point', required: true},
    point_threshold: { type: Number, required: true},
    acquired: {type: Boolean, required: true},
    acquisition_date: {type: Date},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
LevelPlayerSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('LevelPlayer', LevelPlayerSchema);
