const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActionPlayerSchema = new Schema({
    app_code: { type: String, required: true},
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
    action: { type: Schema.Types.ObjectId, ref: 'Action', required: true},
    date: { type: Date, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ActionPlayerSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});
module.exports = mongoose.model('ActionPlayer', ActionPlayerSchema);
