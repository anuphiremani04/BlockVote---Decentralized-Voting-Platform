# BlockVote - Decentralized Voting Platform

BlockVote is a modern, secure, and fully functional decentralized voting web application built for transparency and administrative control. It features a stunning monochrome UI, real-time data syncing, and a comprehensive role-based access control system dividing regular voters from system administrators.

## 🚀 Features

### For Voters
*   **Secure Authentication**: JWT-based login and registration system.
*   **Live Dashboard**: View total active voters, ongoing elections, and a live timeline of recent system activity.
*   **On-Chain Voting (Simulation)**: Uses `ethers.js` to securely process votes using Web3 signatures via MetaMask.
*   **Real-Time Ledger Results**: A live, auto-updating bar chart visualizing current election standings, ranking candidates dynamically.

### For Administrators
*   **Secure Admin Gateway**: An entirely separate, protected admin dashboard isolated from standard users.
*   **Manage Elections**: Create new elections and toggle their statuses (`ACTIVE` or `ENDED`) in real time.
*   **Candidate Management**: Instantly register new candidates or remove them. The user UI immediately synchronizes with these changes.
*   **Live Integrity Sync**: Changes made in the admin panel are natively polled and updated across all user interfaces, maintaining strict data consistency.

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, TailwindCSS, Framer Motion (Animations), Recharts (Live Graphs), Ethers.js (Web3 integration).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ORM).
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt (Password Hashing).

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally (`mongodb://localhost:27017/blockvote`)
*   MetaMask Browser Extension (for voting simulation)

### Quick Start (Windows)
For Windows users, we provide convenient batch scripts to automate setup and operation:
*   **`start.bat`**: Double-click this file to automatically install dependencies for both the frontend and backend, and launch both servers simultaneously. It opens separate command prompt windows for the backend (`http://localhost:5000`) and frontend (`http://localhost:5173`).
*   **`fetch_voters.bat`**: A utility script to connect to the local database and fetch registered voter details via the command line.

### Manual Setup (All Platforms)

#### 1. Backend Setup
Navigate to the backend directory, install dependencies, and start the API server.

```bash
cd backend
npm install

# Start the development server
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server.

```bash
cd frontend
npm install

# Start the Vite React app
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

## 🔐 System Access

**Default Admin Credentials**:
*   **Email**: `anup04@gmail.com`
*   **Password**: `anup@1234`

*Note: The admin panel is strictly locked to this master account to prevent unauthorized control.*

## 📂 Project Structure

```
Blockchain_Assignment/
│
├── backend/
│   ├── models/        # Mongoose Schemas (User, Election, Candidate, Vote)
│   ├── routes/        # API Endpoints (Auth, Admin, Elections, Votes)
│   └── server.js      # Main Express Application
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI pieces (Sidebar, ProtectedRoutes)
    │   ├── pages/      # Views (Login, Vote, Results, AdminPages, etc.)
    │   └── App.jsx     # Main Router Setup
    ├── index.css       # Tailwind entry and global monochrome classes
    └── vite.config.js  # Vite config (proxies API requests to backend)
```

## 🌐 Data Flow Architecture
This application utilizes active internal polling and live DOM manipulation to ensure state integrity. When a user executes a vote:
1. `ethers.js` triggers a MetaMask signature verification.
2. The UI sends a `POST` request to the Express backend carrying the `userId` and `transactionHash`.
3. MongoDB stores the immutable vote.
4. The `/results` page polling engine automatically detects the new database entry and smoothly recalculates the Recharts visualization without a page reload.
