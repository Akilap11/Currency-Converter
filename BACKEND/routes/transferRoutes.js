const express = require("express");
const router = express.Router();
const axios = require("axios");
const Transfer = require("../models/transfer");

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const ALLOWED_CURRENCIES = {
  "USA": "USD",
  "Sri Lanka": "LKR",
  "Australia": "AUD",
  "India": "INR"
};

// Convert Currency Route
router.post("/convert", async (req, res) => {
  try {
    const { fromCountry, toCountry, amount } = req.body;

    if (!fromCountry || !toCountry || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ALLOWED_CURRENCIES[fromCountry] || !ALLOWED_CURRENCIES[toCountry]) {
      return res.status(400).json({ message: "Invalid country selection" });
    }

    const fromCurrency = ALLOWED_CURRENCIES[fromCountry];
    const toCurrency = ALLOWED_CURRENCIES[toCountry];

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
    );

    const rate = response.data.conversion_rates[toCurrency];
    const convertedAmount = amount * rate;

    res.json({ convertedAmount, exchangeRate: rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Transfer Route
router.post("/transfer", async (req, res) => {
  try {
    const { fromCountry, toCountry, amount, convertedAmount } = req.body;

    if (!fromCountry || !toCountry || !amount || !convertedAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transfer = new Transfer({
      fromCountry,
      toCountry,
      amount,
      convertedAmount,
      date: new Date(),
    });

    await transfer.save();
    res.status(201).json({ message: "Transfer saved", transfer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Transfers Route
router.get("/transfers", async (req, res) => {
  try {
    const transfers = await Transfer.find().sort({ date: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Transfer Route
router.delete("/transfer/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }
    res.json({ message: "Transfer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transfer", error: error.message });
  }
});

module.exports = router;