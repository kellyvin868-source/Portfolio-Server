const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  techStack:   [{ type: String }],
  githubLink:  { type: String, default: '' },
  liveDemo:    { type: String, default: '' },
  image:       { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
