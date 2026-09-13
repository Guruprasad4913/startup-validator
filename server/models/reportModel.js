const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  owner: { type: String, default: null },
  input: { type: Object, required: true },
  generatedAt: { type: Date, required: true },
  ideas: { type: Array, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
