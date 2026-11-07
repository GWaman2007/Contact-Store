# 📇 Contact Store — Fullstack MERN Application

A complete, clean **Contact Management System** built on the **MERN Stack** (MongoDB, Express.js, React, Node.js) with Tailwind CSS and DaisyUI (Cupcake Theme).

> 🎓 **Preparing for a viva, college review, or technical evaluation?**  
> Check out the complete [SUPPORT_REVIEW_GUIDE.md](./SUPPORT_REVIEW_GUIDE.md) containing the **Top 15 Viva Questions & Model Answers**, architecture flowcharts, and HTTP QUERY explanations!

---

## 🌟 Key Features

- 🔐 **Stateless JWT Authentication**: Secure register, login, and profile verification with `bcryptjs` password hashing (10 salt rounds).
- 🛡️ **Tenant Data Isolation**: Every contact belongs to a specific user (`userId`). One user can never see or modify another user's contacts.
- 🕵️‍♂️ **Secret Hidden Contacts Layer**: Contacts can be assigned an optional secret pass-code (`hide_code`). They remain completely hidden from general views until unlocked with the exact code.
- 🔤 **Alphabetical Grouping**: Contacts are automatically organized into alphabetical sections (`A-Z`, `#`) for effortless browsing.
- 🔍 **Modern HTTP `QUERY` Method**: Uses the official, safe and idempotent HTTP `QUERY` method for querying contacts with complex criteria and search payloads.
- 🧁 **DaisyUI Cupcake Theme**: Soft, pastel aesthetic with accessible responsive cards, modal dialogues, and notifications.
- 🎯 **Pure Resource-Oriented REST**: Single clean resource endpoint (`/api/contacts`) where HTTP methods define all operations.

---

## 📂 Project Structure

```text
Contact-Store-MERN/
├── server/
│   ├── config/db.js              # MongoDB connection
│   ├── models/User.js            # User model & bcrypt hooks
│   ├── models/Contact.js         # Contact model & serialization
│   ├── middleware/auth.js        # JWT verification middleware
│   ├── routes/authRoutes.js      # Register, login, and me routes
│   ├── routes/contactRoutes.js   # Pure REST CRUD & HTTP QUERY routes
│   ├── .env                      # Server configuration
│   ├── .env.example
│   ├── server.js                 # Express server initialization
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/client.js         # Axios instance & token interceptors
│   │   ├── context/AuthContext.jsx # Auth state management
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation & secret mode toggle
│   │   │   ├── ContactCard.jsx   # Contact card with avatars & badges
│   │   │   ├── ContactModal.jsx  # Add/Edit contact modal
│   │   │   ├── SecretCodeModal.jsx # Secret code unlock modal
│   │   │   ├── DeleteConfirmModal.jsx # Deletion confirmation
│   │   │   └── SearchBar.jsx     # Search input & count badge
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Sign-in page
│   │   │   ├── Register.jsx      # Sign-up page
│   │   │   └── Dashboard.jsx     # Contact list & alphabetical grouping
│   │   ├── App.jsx               # Auth state switch
│   │   ├── index.css             # Tailwind 4 & DaisyUI cupcake theme
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Vite configuration & dev proxy
│   └── package.json
│
├── SUPPORT_REVIEW_GUIDE.md       # Complete Viva & Presentation Cheat Sheet
├── package.json                  # Root runner script (concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://amantalikoti2007_db_user:rBRMWlvVkBVUFxnH@cluster0.quoeglj.mongodb.net/contact_store?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

### 2. Install All Dependencies
From the root folder:
```bash
npm run install:all
```

### 3. Run Both Backend and Frontend
```bash
npm run dev
```
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 📡 Pure REST API Reference

The API follows strict REST conventions: **URIs represent resources (nouns)** and **HTTP methods represent operations (verbs)**.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & return JWT token | No |
| `POST` | `/api/auth/login` | Login with email/password & return JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged in user | Yes (`Bearer`) |

### Contacts Resource (`/api/contacts`)
| Method | Endpoint | Description | Payload / Params |
|---|---|---|---|
| `GET` | `/api/contacts` | List public contacts (or with `?code=xxxx`) | None or `?code=xxxx` |
| `QUERY` | `/api/contacts` | Safe, idempotent search query | Body: `{ q, code }` |
| `POST` | `/api/contacts` | Create a new contact | Body: `{ name, ph_no, email, company_name, relation_profession, image_url, hide_code }` |
| `GET` | `/api/contacts/:c_id` | Get single contact by ID | None (or `?code=xxxx` if secret) |
| `PUT` | `/api/contacts/:c_id` | Update contact by ID | Body: Updated fields |
| `DELETE`| `/api/contacts/:c_id` | Delete contact by ID | None |
