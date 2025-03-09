const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  fromCountry: String,
  toCountry: String,
  amount: Number,
  convertedAmount: Number,
  exchangeRate: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transfer', TransferSchema);
