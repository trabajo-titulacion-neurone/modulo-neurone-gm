const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String},
    password: {type: String},
    neuroneauth: {type: Boolean, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
