# Currency Transfer Manager

A simple currency converter that tracks and manages user transfers. The app allows users to select a "From" and "To" country, enter a transfer amount, and view the converted amount based on real-time exchange rates. Transfers are recorded in a history log, where they can be revoked if needed.

## Technologies Used

- **Frontend:** React.js, Next.js, Material UI
- **Backend:** Node.js, Express.js, MongoDB Atlas
- **API:** ExchangeRate-API

## Project Structure

```bash
currency-converter/
├── frontend/      # Next.js frontend
├── backend/       # Express.js backend
├── README.md      # Project documentation
```

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Akilap11/Currency-Converter.git
cd currency-converter
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Run frontend
```

### Backend Setup

**NOTE:** Ensure you have nodemon installed globally. If not, install it using:

```bash
npm install -g nodemon
```

```bash
cd backend
npm install
cp env.file .env  # Create the env file
npx nodemon  # Run backend
```

### Environment Variables

Create a `.env` file inside the `backend` directory and add the following environment variables:

```bash
EXCHANGE_RATE_API_KEY="API KEY from env.file in Backend folder"
MONGO_URI="MONGODB URI from env.file in Backend folder""
```

## Features

- Currency conversion between USA, Sri Lanka, Australia, and India
- Displays converted amount based on the selected countries and amount
- Transfer history tracking with an option to revoke a transfer
- Data stored in MongoDB Atlas
- User-friendly UI with Material UI components

## API Endpoints Documentation

### Exchange Rates

- **GET** `/api/rates` → Fetch exchange rates from ExchangeRate-API

### Transfers

- **POST** `/api/transfer` → Create a new transfer
- **GET** `/api/transfer` → Retrieve all transfer history
- **DELETE** `/api/transfer/:id` → Revoke a specific transfer by ID

---
