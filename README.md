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
├── .gitignore     # Ignore environment variables and node_modules
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
cd ../frontend
npm install
npm run dev  # Run frontend
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Create the env file
npm start  # Run backend
```

## Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example` and add the required values:

```properties
MONGO_URI=mongodb+srv://akilatharinda05:Akilap1@cluster0.vwsjg.mongodb.net/currencyConverter?retryWrites=true&w=majority
EXCHANGE_RATE_API_KEY=bc25b5f9abfc0d87516b7189
```

## Features

- Currency conversion between USA, Sri Lanka, Australia, and India
- Displays converted amount based on the selected countries and amount
- Transfer history tracking with an option to revoke a transfer
- Data stored in MongoDB Atlas
- User-friendly UI with Material UI components.
