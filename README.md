# 📈 Stock Trading Platform

A full-stack web application replicating the core features of a stock trading dashboard (like Zerodha Kite). This project is built using the MERN stack (MongoDB, Express, React, Node.js) and features a beautiful, responsive user interface.

## ✨ Features

- **📊 Dashboard**: Get an overview of your trading account.
- **💼 Holdings & Positions**: Track your current holdings and active positions.
- **📜 Orders**: View your order history (buy/sell).
- **💰 Funds**: Manage and view your account balance and margins.
- **🔐 Authentication**: Secure user authentication using Passport.js, JWT, and bcrypt.
- **⚡ Unified Monorepo**: Frontend and backend are managed together with a single `package.json` for easy local development.

## 🛠️ Technology Stack

**Frontend:**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/) (Routing)
- [Tailwind CSS](https://tailwindcss.com/) & [Material UI](https://mui.com/) (Styling & Icons)
- [Axios](https://axios-http.com/) (API Client)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) (Database & ODM)
- [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/) (Authentication)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/AdityaChavade/Stock-trading-platform.git
cd Stock-trading-platform
```

### 2. Install Dependencies
Because this project uses a unified package setup, you only need to run this command once in the root folder:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
# Add any JWT secrets or other env variables required by your auth controller
```

### 4. Start the Application
You can run both the frontend and the backend from the root directory using the scripts provided.

**Start the Backend (Development mode with Nodemon):**
```bash
npm run dev:backend
```

**Start the Frontend (Vite):**
```bash
npm run dev
```

The frontend will usually be accessible at `http://localhost:5173` and the backend API runs on `http://localhost:3000`.

## 📂 Project Structure

```text
├── backend/            # Express backend controllers, models, and routes
│   ├── Controller/     # Logic for authentication and trading
│   ├── model/          # Mongoose schemas (Orders, Holdings, Positions, Users)
│   ├── Routes/         # API endpoints
│   └── index.js        # Backend entry point
├── kite/               # React frontend source files
│   ├── src/            # React components and pages
│   └── index.html      # Vite entry HTML
├── .env                # Environment variables
└── package.json        # Unified dependencies and scripts
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AdityaChavade/Stock-trading-platform/issues).
