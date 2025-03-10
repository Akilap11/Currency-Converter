const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const transferRoutes = require('./routes/transferRoutes');
app.use('/api', transferRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
