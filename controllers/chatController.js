const OpenAI = require('openai');

const SYSTEM_PROMPT = `You are Kelvin's portfolio assistant. Answer questions about:
- Kelvin Kiprop Kemboi: Computer Scientist at Kisii University, Full-Stack Developer
- Skills: React.js, Node.js, Express, MongoDB, JavaScript, HTML, CSS, Tailwind CSS, JWT, Git
- Projects: Church CMS, Student Record System, Library Management System, M-Pesa Easy SDK
- Contact: visitors can use the contact form on the website
Keep answers short, friendly, and professional.`;

exports.chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message required' });

  if (process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
        max_tokens: 300
      });
      return res.json({ reply: completion.choices[0].message.content });
    } catch (err) { console.error('OpenAI error:', err.message); }
  }

  res.json({ reply: getFallback(message) });
};

function getFallback(msg) {
  const m = msg.toLowerCase();
  if (m.includes('skill') || m.includes('tech') || m.includes('stack'))
    return 'Kelvin works with React.js, Node.js, Express, MongoDB, Tailwind CSS, and JavaScript.';
  if (m.includes('project') || m.includes('built'))
    return 'Kelvin built a Church CMS, Student Record System, Library Management System, and M-Pesa Easy SDK.';
  if (m.includes('contact') || m.includes('email'))
    return 'Use the contact form on this page or email kellyvin868@gmail.com.';
  if (m.includes('react')) return 'Yes! Kelvin builds modern UIs with React.js — hooks, context, SPAs.';
  if (m.includes('tailwind')) return 'Kelvin uses Tailwind CSS for rapid, responsive UI development.';
  if (m.includes('mpesa') || m.includes('payment'))
    return 'Kelvin built an M-Pesa Easy SDK — a simplified Node.js wrapper for the Safaricom Daraja API.';
  if (m.includes('hello') || m.includes('hi') || m.includes('hey'))
    return "Hey! 👋 I'm Kelvin's assistant. Ask me about his skills, projects, or how to reach him.";
  return "I'm Kelvin's assistant. Ask me about his skills (React, Node.js, Tailwind), projects, or contact info!";
}
