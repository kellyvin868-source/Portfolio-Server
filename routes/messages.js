const router = require('express').Router();
const { sendMessage, getMessages, getStats, markRead, replyMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', sendMessage);
router.get('/stats', protect, getStats);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markRead);
router.post('/:id/reply', protect, replyMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
