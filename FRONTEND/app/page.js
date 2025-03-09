"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Select, MenuItem, TextField, Button, Card, CardContent } from "@mui/material";

export default function Home() {
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [transfers, setTransfers] = useState([]);

  const countries = ["USA", "Sri Lanka", "Australia", "India"];

  const fetchTransfers = async () => {
    const response = await axios.get("http://localhost:5000/api/transfers");
    setTransfers(response.data);
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleConvert = async () => {
    const response = await axios.post("http://localhost:5000/api/convert", {
      fromCountry,
      toCountry,
      amount,
    });
    setConvertedAmount(response.data.convertedAmount);
    fetchTransfers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/transfer/${id}`);
    fetchTransfers();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Currency Converter
      </Typography>

      <Select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} displayEmpty>
        <MenuItem value="" disabled>Select From Country</MenuItem>
        {countries.map((country) => (
          <MenuItem key={country} value={country}>{country}</MenuItem>
        ))}
      </Select>

      <Select value={toCountry} onChange={(e) => setToCountry(e.target.value)} displayEmpty>
        <MenuItem value="" disabled>Select To Country</MenuItem>
        {countries.map((country) => (
          <MenuItem key={country} value={country}>{country}</MenuItem>
        ))}
      </Select>

      <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

      <Button variant="contained" onClick={handleConvert}>Convert</Button>

      {convertedAmount && <Typography>Converted Amount: {convertedAmount}</Typography>}

      <Typography variant="h5" gutterBottom>
        Transfer History
      </Typography>
      {transfers.map((t) => (
        <Card key={t._id} variant="outlined" style={{ marginBottom: "10px" }}>
          <CardContent>
            <Typography>{t.amount} {t.fromCountry} → {t.convertedAmount} {t.toCountry}</Typography>
            <Button variant="outlined" color="secondary" onClick={() => handleDelete(t._id)}>
              Revoke
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
