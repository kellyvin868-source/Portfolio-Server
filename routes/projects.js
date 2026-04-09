const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, `project-${Date.now()}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, upload.single('image'), createProject);
router.put('/:id', protect, upload.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
