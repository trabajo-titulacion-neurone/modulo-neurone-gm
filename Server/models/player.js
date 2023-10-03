const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = new Schema({
    app_code: { type: String, required: true},
    group: { type: Schema.Types.ObjectId, ref: 'Group'},
    name: { type: String, required: true},
    last_name: { type: String, required: true},
    code: { type: String, required: true, unique: true},
    sourceId: { type: String},
    image_url: { type: String},
    image_id: { type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
PlayerSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Player', PlayerSchema);
