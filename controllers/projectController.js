const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProject = async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim() || !description?.trim())
      return res.status(400).json({ message: 'Title and description are required' });
    const data = { ...req.body };
    if (typeof data.techStack === 'string')
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    res.status(201).json(await Project.create(data));
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === 'string')
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const p = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
