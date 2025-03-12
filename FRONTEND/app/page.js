"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function Home() {
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [transfers, setTransfers] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversionTimer, setConversionTimer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState(null);

  const countries = [
    { name: "USA", currency: "USD" },
    { name: "Sri Lanka", currency: "LKR" },
    { name: "Australia", currency: "AUD" },
    { name: "India", currency: "INR" },
  ];

  // Fetch all Transfers
  const fetchTransfers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transfers");
      setTransfers(response.data.reverse());
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  // Auto fetch conversion when required fields have values
  const fetchConversion = useCallback(async () => {
    if (fromCountry && toCountry && amount && amount > 0) {
      //loading indicator
      setIsLoading(true);
      setError("");
      
      try {
        const response = await axios.post("http://localhost:5000/api/convert", {
          fromCountry,
          toCountry,
          amount,
        });
        setConvertedAmount(response.data.convertedAmount.toFixed(2));
      } catch (error) {
        setError("Failed to convert currency. Try again.");
        setConvertedAmount(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setConvertedAmount(null);
    }
  }, [fromCountry, toCountry, amount]);

  // loader for conversion
  useEffect(() => {
    if (conversionTimer) {
      clearTimeout(conversionTimer);
    }

    if (fromCountry && toCountry && amount) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        fetchConversion();
      }, 500);
      setConversionTimer(timer);
    } else {
      setIsLoading(false);
    }
    return () => {
      if (conversionTimer) {
        clearTimeout(conversionTimer);
      }
    };
  }, [fromCountry, toCountry, amount, fetchConversion]);

  // Handle Transfer POST request
  const handleTransfer = async () => {
    if (!amount) {
      setError("Amount is required");
      return;
    }
    setError("");

    try {
      await axios.post("http://localhost:5000/api/transfer", {
        fromCountry,
        toCountry,
        amount,
        convertedAmount,
      });

      fetchTransfers();
      setConvertedAmount(null);
      setAmount("");
    } catch (error) {
      setError("Failed to save transfer.");
    }
  };

  // Open revoke confirmation dialog
  const openConfirmDialog = (id) => {
    setTransferToDelete(id);
    setOpenDialog(true);
  };

  // Close revoke confirmation  dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransferToDelete(null);
  };

  // Handle Deleting Transfer
  const handleDelete = async () => {
    if (!transferToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/transfer/${transferToDelete}`);
      fetchTransfers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting transfer:", error);
    }
  };

  // get the currency symbol for a country
  const getCurrencySymbol = (countryName) => {
    const country = countries.find((c) => c.name === countryName);
    return country ? country.currency : "";
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        backgroundColor: "#f0f4f8"
      }}
    >
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          width: "100%", 
          maxWidth: 1200,
          mx: "auto"
        }}
      >
        <Grid item xs={12} sm={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              padding: 4, 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#2563eb', 
                textAlign: 'center', 
                mb: 4,
                fontWeight: 'bold'
              }}
            >
              Currency Transfer Manager
            </Typography>
  
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
              {/* Country Select Fields */}
              <Select
                fullWidth
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                displayEmpty
                sx={{ 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  From Country
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name} ({country.currency})
                  </MenuItem>
                ))}
              </Select>
  
              <Select
                fullWidth
                value={toCountry}
                onChange={(e) => setToCountry(e.target.value)}
                displayEmpty
                sx={{ 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  To Country
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name} ({country.currency})
                  </MenuItem>
                ))}
              </Select>
            </Box>
  
            {/* Amount Field */}
            <TextField
              fullWidth
              label={`Transfer Amount (${getCurrencySymbol(fromCountry)})`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ 
                mb: 3,
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db'
                }
              }}
            />
  
            {/* show converted amount */}
            {(isLoading || convertedAmount) && (
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: 1,
                  border: '1px solid #86efac',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={24} color="success" />
                    <Typography variant="body1" sx={{ color: '#166534' }}>
                      Converting...
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#166534' }}>
                    Converted Amount: <strong>{convertedAmount}</strong> {getCurrencySymbol(toCountry)}
                  </Typography>
                )}
              </Box>
            )}
  
            {/* Error Message */}
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: '#fef2f2', 
                  borderRadius: 1,
                  border: '1px solid #fecaca'
                }}
              >
                {error}
              </Typography>
            )}
  
            {/* Transfer Currency Button */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleTransfer}
                disabled={!convertedAmount || isLoading}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  '&:hover': {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                Transfer
              </Button>
            </Box>
          </Paper>
        </Grid>
  
        {/* Transfer History */}
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              padding: 3, 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              height: '100%',
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'center', 
                mb: 3,
                color: '#2563eb',
                fontWeight: 'bold'
              }}
            >
              Transfer History
            </Typography>
  
            <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
              {transfers.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: '#6b7280', py: 4 }}>
                  No transfers yet.
                </Typography>
              ) : (
                transfers.map((t) => (
                  <Card 
                    key={t._id} 
                    variant="outlined" 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 1,
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <CardContent sx={{ pb: '12px !important' }}>
                      <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                        {t.amount} {getCurrencySymbol(t.fromCountry)} → {t.convertedAmount} {getCurrencySymbol(t.toCountry)}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        onClick={() => openConfirmDialog(t._id)}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none',
                          mt: 1
                        }}
                      >
                        Revoke
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Revoke Confirm Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Revocation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to revoke this transfer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}