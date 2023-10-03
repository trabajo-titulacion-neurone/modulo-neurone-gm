const mongoose = require('mongoose');
const { Schema } = mongoose;

const BadgeSchema = new Schema({
    app_code: { type: String, required: true},
    title: { type: String, required: true},
    code: { type: String, required: true, unique: true},
    times_earned: { type: Number, required: true},
    image_url: { type: String, required: true},
    image_id: { type: Schema.Types.ObjectId, required: true},
    description: { type: String, required: true},
    last_time_earned: { type: Date, required: false},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
BadgeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Badge', BadgeSchema);
