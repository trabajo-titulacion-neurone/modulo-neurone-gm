const mongoose = require('mongoose');
const { Schema } = mongoose;

const PointPlayerSchema = new Schema({
    app_code: { type: String, required: true},
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
    point: {type: Schema.Types.ObjectId, ref: 'Point', required: true},
    amount: {type: Number, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
PointPlayerSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('PointPlayer', PointPlayerSchema);
