const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserTokenSchema = new Schema({
    username: {type: String, required: true, unique: true},
    token: {type: String, required: true},
    timestamp: {type: Date, required: true},
    expiration: {type: Number, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserTokenSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('UserToken', UserTokenSchema);