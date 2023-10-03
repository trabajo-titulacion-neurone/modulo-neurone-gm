const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    app_code: { type: String, required: true},
    name: { type: String, required: true},
    code: { type: String, required: true, unique: true},
    sourceId: { type: String},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
GroupSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Group', GroupSchema);
