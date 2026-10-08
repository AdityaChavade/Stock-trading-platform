# 📈 Kite Stock Trading Platform

A full-stack, real-time stock trading application inspired by Zerodha Kite. Built with **React 19**, **Express**, **PostgreSQL (Sequelize)**, and **Socket.io**.

---

## ⚙️ System Logic & Business Workflow

### 1. 🔐 Authentication & Session Security
- User credentials are encrypted using `bcrypt` during registration.
- Upon successful login, the server issues a signed **JSON Web Token (JWT)** stored in an **HTTP-only cookie**.
- The `userVerification` middleware intercepts protected requests (`/order`, `/position`, `/allHoldings`, `/getFunds`), decodes the token, and attaches the `userId` to `req.user`.

---

### 2. ⚡ Real-Time Price Streaming (Socket.io)
- Price changes are processed and persisted in the `Stock` PostgreSQL table.
- The server broadcasts a `stockPriceUpdate` event containing `stockId`, `symbol`, and `newPrice` to all connected clients over WebSockets via `Socket.io`.
- React frontend components hook into `socket.io-client` to update watchlists, live P&L, and portfolio totals without page reloads.

---

### 3. 📜 Order Execution & Portfolio Synchronization

#### **Market Orders**
- **Fund Validation**: Checks if `user.Funds >= (Price * Quantity)` before placing `BUY` orders.
- **Fund Balance Update**: Adjusts `user.Funds` immediately (`-totalCost` for BUY, `+totalCost` for SELL).
- **Position Tracking**:
  - If a position for the instrument exists: updates `Qty` (`+Qty` on BUY, `-Qty` on SELL) and recalculates current position value (`Curr_val = Qty * LTP`).
  - If `Qty` falls to `0` or below, the position record is automatically destroyed/closed.
  - If no position exists: creates a new `Position` entry linked to the authenticated user.

#### **Limit Orders**
- Saved as `PENDING` orders in the `Order` database table awaiting price trigger matching.

---

### 4. 💼 Holdings vs. Positions Accounting
- **Positions**: Tracks active intra-day or open trades with real-time mark-to-market P&L updates.
- **Holdings**: Tracks settled long-term stock assets with calculated average buy prices, current market valuations, and overall net return percentages.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Material UI (MUI), React Router DOM, Socket.io-client, Axios, React-Draggable.
- **Backend**: Node.js, Express.js, Socket.io, Sequelize ORM.
- **Database**: PostgreSQL.
- **Authentication**: JWT & Cookie-Parser, Bcrypt.

---

## 📁 Project Structure

```text
├── backend/
│   ├── config/          # Sequelize database connection setup
│   ├── Controller/      # Auth & Position business logic
│   ├── Middlewares/     # JWT authentication middleware
│   ├── models/          # SQL Schemas (User, Stock, Order, Holding, Position)
│   ├── Routes/          # Express API endpoints
│   ├── index.js         # Server entry point & Socket.io handlers
│   └── seed.js          # Database initial stock seeder
├── src/
│   ├── Auth/            # Login & Signup pages
│   ├── MainContent/     # Dashboard, Orders, Holdings, Positions, Funds
│   ├── WatchlistSidebar/# Watchlist UI & Draggable Order Modals
│   └── App.jsx          # Application routing & layout
└── package.json         # Shared dependencies & scripts
```

---

## 🚀 Quick Start

### 1. Configure Environment Variables (`.env`)
Create a `.env` file in the root folder:

```env
PORT=3000
TOKEN_KEY=your_jwt_secret
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_NAME=Kite
DB_PORT=5432
```

### 2. Install & Seed
```bash
npm install
node backend/seed.js
```

### 3. Run Application
Run backend and frontend in separate terminals:

```bash
# Terminal 1 (Backend API & Socket server)
npm run dev:backend

# Terminal 2 (Vite Frontend)
npm run dev
```

Visit `http://localhost:5173` in your browser.
