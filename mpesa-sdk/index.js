const axios = require('axios');

class MpesaSDK {
  constructor({ consumerKey, consumerSecret, shortcode, passkey, callbackUrl, env = 'sandbox' }) {
    this.consumerKey = consumerKey; this.consumerSecret = consumerSecret;
    this.shortcode = shortcode; this.passkey = passkey; this.callbackUrl = callbackUrl;
    this.baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
  }
  async getToken() {
    const creds = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    const { data } = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${creds}` } });
    return data.access_token;
  }
  getTimestamp() { return new Date().toISOString().replace(/[-T:.Z]/g,'').slice(0,14); }
  generatePassword(ts) { return Buffer.from(`${this.shortcode}${this.passkey}${ts}`).toString('base64'); }
  async stkPush({ phone, amount, accountRef, description }) {
    const token = await this.getToken();
    const ts = this.getTimestamp();
    const normalizedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;
    const { data } = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      BusinessShortCode: this.shortcode, Password: this.generatePassword(ts), Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline', Amount: amount, PartyA: normalizedPhone,
      PartyB: this.shortcode, PhoneNumber: normalizedPhone, CallBackURL: this.callbackUrl,
      AccountReference: accountRef, TransactionDesc: description
    }, { headers: { Authorization: `Bearer ${token}` } });
    return data;
  }
}

module.exports = MpesaSDK;
