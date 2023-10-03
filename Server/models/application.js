const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    description: { type: String, required: true},
    owner: { type: String, required: true},
    focus: { type: Boolean, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ApplicationSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Application', ApplicationSchema);

