# Password Stash

A full-stack password manager built with React, Node.js, Express.js, and MongoDB. The application allows authenticated users to securely store and manage website credentials, with support for adding, editing, deleting, searching, and copying passwords.

The application implements JWT-based authentication using HttpOnly cookies, bcrypt password hashing for user accounts, AES-256-GCM encryption for stored credentials, and user-specific authorization to prevent unauthorized access to stored data.

## Live Demo

**Application:** https://stash-your-passwords.onrender.com/

**Database:** MongoDB Atlas

---

## Features

- User registration and login
- JWT-based authentication using HttpOnly cookies
- User-specific authorization for stored credentials
- Bcrypt hashing for user account passwords
- AES-256-GCM encryption for stored website passwords
- Add new website credentials
- Edit existing credentials
- Delete stored credentials
- Search saved credentials
- Copy website, username, and password to clipboard
- Show/Hide password functionality
- Secure password generation using the Web Crypto API
- Responsive UI for desktop and mobile devices
- Toast notifications for user actions
- Cloud database using MongoDB Atlas
- Full-stack deployment with React and Express served from a single application

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
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- Node.js Crypto

### Database
- MongoDB Atlas

### Security
- JWT Authentication
- HttpOnly Cookies
- bcrypt Password Hashing
- AES-256-GCM Encryption
- Per-user Authorization

### Deployment
- Render
- MongoDB Atlas

---

## Project Structure
