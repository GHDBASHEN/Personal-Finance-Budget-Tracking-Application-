
# Personal Finance Budget Tracking Application

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)

A comprehensive, full-stack web application designed to help users manage their personal finances. Track your income, monitor your expenses, set budget limits, and gain clear visual insights into your spending habits through an interactive dashboard.

## 🚀 Features

* **Secure Authentication:** JWT-based user login and registration with encrypted passwords.
* **Transaction Management:** Granular income and expense tracking with categorical tagging.
* **Budget Tracking:** Set dynamic budgets for different categories and track remaining balances.
* **Interactive Dashboard:** Real-time analytics, visual distribution charts, and budget-vs-actual spending alerts.
* **Responsive UI:** A modern, mobile-first design built with React and Tailwind CSS.

---

## 🛠️ Technology Stack

* **Frontend:** React.js, Tailwind CSS, Context API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/download/) (v14.x or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (Running locally, or a MongoDB Atlas cloud URI)
* Git

---

## 💻 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the Repository


```

git clone https://github.com/GHDBASHEN/Personal-Finance-Budget-Tracking-Application-.git
cd Personal-Finance-Budget-Tracking-Application

```

### 2. Installing Dependencies

The project is split into a `frontend` and a `backend`. You need to install the npm dependencies for both directories.

**Install Backend Dependencies:**

```bash
cd backend
npm install

```

**Install Frontend Dependencies:**

```bash
cd ../frontend
npm install

```

### 3. Setting Up the Environment Variables & Database

You need to configure your environment variables for the backend to connect to the database and manage authentication.

1. Navigate to the `backend` folder.
2. Create a file named `.env`.
3. Add the following variables to your `.env` file:

```env
.env is attached to the mail.

```

**Running the Database:**

Database is MongoDB and I have already setuped it 

### 4. Running the Backend

With the dependencies installed and the `.env` file configured, start the backend server.

```bash
cd backend
# Run in development mode (using nodemon)
npm run dev

# OR run standard start script
npm start

```

*The backend server should now be running on `http://localhost:5000` (or the port specified in your .env).*

### 5. Running the Frontend

Open a **new terminal window/tab**, navigate to the frontend directory, and start the React application.

```bash
cd frontend
npm start

```

*The frontend application will automatically open in your default browser at `http://localhost:3000`.*

---

## 📂 Project Structure

```text
Personal-Finance-Budget-Tracking-Application/
├── backend/
│   ├── controllers/      # Route logic and database operations
│   ├── middlewares/      # Custom middleware (e.g., Auth verification)
│   ├── models/           # Mongoose schemas (User, Transaction, Budget, Category)
│   ├── routes/           # API endpoints routing
│   ├── server.js         # Entry point for the backend
│   └── package.json
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── components/   # Reusable UI components (Navbar, Modals, etc.)
    │   ├── context/      # Global state management (AuthContext)
    │   ├── pages/        # Application views (Dashboard, Login, Transactions)
    │   ├── services/     # Axios API call logic
    │   ├── App.js        # Main React component
    │   └── index.js      # React DOM rendering
    └── package.json

```
