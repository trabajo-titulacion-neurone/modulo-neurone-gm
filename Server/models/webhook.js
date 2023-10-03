const mongoose = require('mongoose');
const { Schema } = mongoose;

const WebhookSchema = new Schema({
    app_code: { type: String, required: true},
    givePointsUrl: { type: String},
    challengeCompletedUrl: { type: String},
    levelUpUrl: { type: String},
    badgeAcquiredUrl: { type: String},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
WebhookSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Webhook', WebhookSchema);