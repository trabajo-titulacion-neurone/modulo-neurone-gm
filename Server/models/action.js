const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActionSchema = new Schema({
   app_code: { type: String, required: true},
   name: { type: String, required: true},
   description: { type: String, required: true},
   repeatable: { type: Boolean, required: true},
   image_url: { type: String},
   image_id: { type: Schema.Types.ObjectId},
   code: { type: String, required: true, unique: true},
   createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ActionSchema.pre('save', next => {
   now = new Date();
   if(!this.createdAt) {
     this.createdAt = now;
   }
   next();
 });
 

module.exports = mongoose.model('Action', ActionSchema);

