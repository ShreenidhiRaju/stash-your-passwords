# Password Stash

A full-stack MERN application to securely store and manage website credentials. Users can add, edit, delete, and copy passwords through a clean and responsive interface.

## Live Demo

**Frontend:** https://YOUR-VERCEL-URL.vercel.app

**Backend API:** https://stash-your-passwords-api.onrender.com

> Replace `YOUR-VERCEL-URL` with your Vercel deployment URL.

---

## Features

- Add new website credentials
- Edit existing passwords
- Delete stored passwords
- Copy website, username, and password to clipboard
- Show/Hide password functionality
- Responsive UI for desktop and mobile devices
- Toast notifications for user actions
- Cloud database using MongoDB Atlas
- Fully deployed frontend and backend

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Icons
- Lucide React
- React Toastify

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
Password Manager/
│
├── BACKEND/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── FRONTEND/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ShreenidhiRaju/stash-your-passwords.git
cd stash-your-passwords
```

### 2. Backend Setup

```bash
cd BACKEND
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

Run the backend:

```bash
node index.js
```

---

### 3. Frontend Setup

```bash
cd FRONTEND
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Run the frontend:

```bash
npm run dev
```

---

## Deployment

### Frontend

The frontend is deployed on **Vercel**.

### Backend

The Express backend is deployed on **Render**.

### Database

MongoDB Atlas is used as the cloud database.

---

## Screenshots

_Add screenshots of the application here._

---

## Future Enhancements

- User Authentication
- Password Encryption
- Password Strength Indicator
- Search & Filter Functionality
- Categories and Favorites
- Dark/Light Theme Toggle
- Export & Import Passwords

---

## Note

This project is built for educational and portfolio purposes.

Passwords are currently stored in plain text for demonstration. In a production application, sensitive information should be encrypted before storage.

---

## Author

**Shreenidhi Raju**

GitHub: https://github.com/ShreenidhiRaju