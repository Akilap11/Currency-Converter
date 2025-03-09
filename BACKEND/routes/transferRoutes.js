const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transfer = require('../models/transfer');

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const ALLOWED_CURRENCIES = { "USA": "USD", "Sri Lanka": "LKR", "Australia": "AUD", "India": "INR" };

router.post('/convert', async (req, res) => {
  try {
    const { fromCountry, toCountry, amount } = req.body;
    if (!ALLOWED_CURRENCIES[fromCountry] || !ALLOWED_CURRENCIES[toCountry]) {
      return res.status(400).json({ message: 'Invalid country selection' });
    }

    const fromCurrency = ALLOWED_CURRENCIES[fromCountry];
    const toCurrency = ALLOWED_CURRENCIES[toCountry];

    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
    const rate = response.data.conversion_rates[toCurrency];
    const convertedAmount = amount * rate;

    const transfer = new Transfer({ fromCountry, toCountry, amount, convertedAmount, exchangeRate: rate });
    await transfer.save();

    res.json({ convertedAmount, exchangeRate: rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transfers', async (req, res) => {
  const transfers = await Transfer.find().sort({ date: -1 });
  res.json(transfers);
});

router.delete('/transfer/:id', async (req, res) => {
  await Transfer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Transfer deleted' });
});

module.exports = router;
