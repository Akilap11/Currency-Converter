// backend/models/Transfer.js
const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromCountry: String,
  toCountry: String,
  amount: Number,
  convertedAmount: Number,
});

const Transfer = mongoose.model('Transfer', transferSchema);
module.exports = Transfer;
