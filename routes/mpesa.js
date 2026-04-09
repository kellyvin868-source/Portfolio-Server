const router = require('express').Router();
const MpesaSDK = require('../mpesa-sdk');

const mpesa = new MpesaSDK({
  consumerKey: process.env.MPESA_CONSUMER_KEY, consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE, passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL, env: process.env.MPESA_ENV || 'sandbox'
});

router.post('/stk', async (req, res) => {
  try { res.json(await mpesa.stkPush(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/callback', (req, res) => {
  console.log('M-Pesa callback:', JSON.stringify(req.body?.Body?.stkCallback, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;
