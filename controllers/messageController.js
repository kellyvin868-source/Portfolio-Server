const Message = require('../models/Message');
const Project = require('../models/Project');
const nodemailer = require('nodemailer');
const {sendBotMessage} = require('../config/bot');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim())
      return res.status(400).json({ message: 'All fields are required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email address' });
    if (message.trim().length < 10)
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    const msg = await Message.create({ name: name.trim(), email: email.trim(), message: message.trim() });

    // Notify admin of new message
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:   process.env.EMAIL_USER,
      subject: `New message from ${name.trim()} — Portfolio`,
      html: `<p><strong>From:</strong> ${name.trim()} &lt;${email.trim()}&gt;</p><p><strong>Message:</strong></p><p>${message.trim()}</p>`
    }).catch(err => console.error('Notification email failed:', err.message));

    await sendBotMessage("Hey kelly");


    res.status(201).json({ message: 'Message sent successfully', id: msg._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMessages = async (req, res) => {
  try { res.json(await Message.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [totalProjects, totalMessages, unread] = await Promise.all([
      Project.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false })
    ]);
    res.json({ totalProjects, totalMessages, unread });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markRead = async (req, res) => {
  try { res.json(await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.replyMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText?.trim() || replyText.trim().length < 2)
      return res.status(400).json({ message: 'Reply text is required' });
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to: msg.email,
      subject: 'Re: Your message to Kelvin Kiprop Kemboi',
      html: `<p>Hi ${msg.name},</p><p>${replyText.trim()}</p><br/><p>— Kelvin Kiprop Kemboi</p>`
    });
    await Message.findByIdAndUpdate(req.params.id, { replied: true, read: true });
    res.json({ message: 'Reply sent successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
