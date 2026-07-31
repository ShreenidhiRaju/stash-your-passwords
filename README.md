# Password Stash

Password Stash is a full-stack password manager built using React, Express, and MongoDB. It allows users to securely store, update, and manage website credentials through a simple and responsive interface.

---

## Features

- Add new website credentials
- Edit existing passwords
- Delete saved passwords
- Copy website URL, username, and password to clipboard
- Show/Hide password while entering
- Store data persistently using MongoDB
- Toast notifications for user actions
- Responsive UI built with Tailwind CSS

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Icons
- React Toastify
- UUID

### Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Node Driver
- CORS
- dotenv

---

## Project Structure

```
PASSWORD-MANAGER/
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
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/password-manager.git
```

### Install dependencies

#### Backend

```bash
cd BACKEND
npm install
```

#### Frontend

```bash
cd FRONTEND
npm install
```

---

## Environment Variables

Create a `.env` file inside the `BACKEND` folder.

Example:

```env
MONGODB_URI=mongodb://localhost:27017
```

Ensure MongoDB is running locally before starting the backend.

---

## Running the Project

### Start the backend

```bash
cd BACKEND
node index.js
```

The backend runs on:

```
http://localhost:3000
```

### Start the frontend

```bash
cd FRONTEND
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve all saved passwords |
| POST | `/` | Add a new password |
| PUT | `/` | Update an existing password |
| DELETE | `/` | Delete a password |

---

## Screenshots

You can add screenshots of the application here.

```md
![Home Page](screenshots/home.png)
```

---

## Future Improvements

- Encrypt stored passwords
- User authentication
- Password strength indicator
- Search and filter passwords
- Categorize saved passwords
- Deploy the application

---

## Author

**Shreenidhi**

GitHub: https://github.com/your-username
