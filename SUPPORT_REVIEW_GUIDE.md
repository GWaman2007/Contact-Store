# 🎓 Contact Store (MERN) — Viva & Project Review Defense Guide

This document is your **complete study guide and cheat sheet** for presenting and defending this project during your academic or technical review. It explains the core architecture, code decisions, security mechanisms, and includes the **Top 15 Viva Questions & Answers** with simple, confident explanations.

---

## 📑 Table of Contents
1. [30-Second Elevator Pitch](#1-30-second-elevator-pitch)
2. [MERN Architecture & Request Lifecycle](#2-mern-architecture--request-lifecycle)
3. [REST API Design & The HTTP QUERY Method](#3-rest-api-design--the-http-query-method)
4. [Authentication & Security Deep-Dive](#4-authentication--security-deep-dive)
5. [The "Secret Hidden Contacts" Business Logic](#5-the-secret-hidden-contacts-business-logic)
6. [Database Design & Mongoose Schema](#6-database-design--mongoose-schema)
7. [Frontend State & Component Design](#7-frontend-state--component-design)
8. [Top 15 Review & Viva Questions (With Model Answers)](#8-top-15-review--viva-questions-with-model-answers)
9. [Step-by-Step Run & Demo Guide](#9-step-by-step-run--demo-guide)

---

## 1. 30-Second Elevator Pitch
> *"I built a full-stack **Contact Management System using the MERN stack (MongoDB, Express.js, React, and Node.js)**. It follows pure RESTful design where HTTP methods define operations over clean resource endpoints—including the modern **HTTP `QUERY` method** for search requests. It features secure stateless JWT authentication, multi-tenant data isolation, alphabetical grouping, responsive cupcake-themed styling using Tailwind CSS and DaisyUI, and a unique **Secret Hidden Contacts Layer** that protects sensitive contacts behind individual secret passcodes."*

---

## 2. MERN Architecture & Request Lifecycle

```
[ User in Browser ]
        │
        ▼ (React + DaisyUI UI)
[ Axios API Client ] ─── Attaches `Authorization: Bearer <jwt_token>`
        │
        ▼ HTTP REST Request (JSON)
[ Express.js Server (Node.js) ]
        │
        ├─► CORS & JSON Body Parser
        ├─► Auth Middleware (`jwt.verify`) ──► Attaches `req.user = { userId }`
        ├─► Pure REST Routes (`/api/auth/*` & `/api/contacts`)
        │
        ▼ (Mongoose ODM Queries)
[ MongoDB Database ]
        ▲
        └─► Returns matching documents back up through the pipeline
```

---

## 3. REST API Design & The HTTP QUERY Method

A common beginner mistake is putting action verbs in URL paths (e.g., `/api/contacts/create`, `/api/contacts/search`, `/api/contacts/delete`).  
In this project, we follow **true RESTful best practices**:
- **URIs represent Resources (nouns)**: `/api/contacts` and `/api/contacts/:c_id`.
- **HTTP Methods define the Action (verbs)**:
  - `GET /api/contacts` → Fetch list of contacts.
  - `QUERY /api/contacts` → Safe, idempotent search query on the contacts collection carrying query criteria in request body (`{ q, code }`).
  - `POST /api/contacts` → Create a new contact.
  - `GET /api/contacts/:c_id` → Retrieve a specific contact.
  - `PUT /api/contacts/:c_id` → Update a specific contact.
  - `DELETE /api/contacts/:c_id` → Delete a specific contact.

### Why HTTP `QUERY`?
- **Safe & Idempotent**: Like `GET`, `QUERY` does not modify server state.
- **Request Body Support**: Unlike `GET`, where long query strings in URLs can exceed character limits or leak sensitive query data into web server access logs, `QUERY` passes structured search payloads cleanly in the request body.

---

## 4. Authentication & Security Deep-Dive

### 1. Password Security with Bcrypt (`bcryptjs`)
- **Never store plain text**: Passwords are never written to MongoDB as plain strings.
- **Salting & Hashing**: Before saving (`userSchema.pre('save')`), we generate a random 10-round salt and hash the password.
- **One-Way Function**: Hashing is irreversible. When logging in, we use `bcrypt.compare(candidatePassword, user.password)` to verify.

### 2. Stateless JWT Authentication
- **Token Structure**: A JSON Web Token consists of three parts separated by dots:
  1. `Header`: Algorithm & token type (e.g. `HS256`, `JWT`).
  2. `Payload`: Claims, here storing `{ userId: user._id }` and expiration (`7d`).
  3. `Signature`: Cryptographic proof (`HMAC-SHA256(header + payload, JWT_SECRET)`).
- **Statelessness**: The backend does NOT store active session tokens in memory or a database table. The token itself proves authenticity and identity on every request.

### 3. Tenant Isolation (Multi-Tenancy)
- Every contact in MongoDB contains a `userId` foreign key referencing the owner's `User._id`.
- In every database operation (`find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`), the query **always** includes `{ userId: req.user.userId }`.
- **Exam Answer**: *"A user can never view or modify someone else's contacts because the query strictly filters by the `userId` extracted directly from the verified JWT, never from user-supplied query params."*

---

## 5. The "Secret Hidden Contacts" Business Logic

A core highlight of this application is the **Secret Hidden Contacts Layer**:

| Scenario | Request | MongoDB Filter | Output |
|---|---|---|---|
| **Public List (Normal)** | `GET /api/contacts` | `{ userId, $or: [{ hide_code: null }, { hide_code: '' }] }` | Only public contacts. `hide_code` is hidden. |
| **Secret Mode Unlocked** | `GET /api/contacts?code=1234` | `{ userId, hide_code: '1234' }` | Only contacts matching passcode `1234`. |
| **Direct Single Get** | `GET /api/contacts/:id?code=1234` | Check `contact.hide_code === code` | Returns contact if code matches; otherwise rejects with `403 Forbidden`. |
| **Search / Query Filter** | `QUERY /api/contacts` | Regex on fields + hide code filter | Scoped search strictly within the unlocked layer. |

---

## 6. Database Design & Mongoose Schema

### 1. `User` Schema
- `name`: Required String, trimmed, max 100 chars.
- `email`: Required, lowercase, trimmed, **unique index**.
- `password`: Required hashed string.
- `createdAt`: Date timestamp.

### 2. `Contact` Schema
- `userId`: `ObjectId` referencing `'User'`, indexed for high-speed user queries.
- `name`: Required String.
- `ph_no`: Required String.
- `email`, `company_name`, `relation_profession`, `image_url`: Optional Strings.
- `hide_code`: String, default `null`, indexed.
- `createdAt`: Date timestamp.

### 3. Methods & Virtual Formatting
- `contact.toClientJSON(includeHideCode)`: Formats contact output for clean API responses and masks `hide_code` unless authorized.

---

## 7. Frontend State & Component Design

- **Vite & React 19**: Ultra-fast build tool and modern component structure.
- **Tailwind CSS 4 & DaisyUI 5**: Semantic utility classes and components using the **`cupcake`** pastel theme (`data-theme="cupcake"`).
- **Context API (`AuthContext`)**:
  - Holds `user`, `token`, `login()`, `register()`, `logout()`.
  - Persists token in `localStorage`.
- **Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to all HTTP requests.
- **Alphabetical Grouping (`useMemo`)**:
  - Automatically sorts and buckets contacts by initial letter (`A`, `B`, `C`, ... `#`).
  - Memoized with `useMemo` so grouping only recomputes when contacts array changes, keeping UI smooth.

---

## 8. Top 15 Review & Viva Questions (With Model Answers)

#### Q1: What makes an API truly "RESTful"?
> **Answer**: In REST, URIs represent **resources** (nouns, like `/api/contacts`), and the HTTP methods define the **operation** (verbs: `GET` to read, `POST` to create, `PUT` to update, and `DELETE` to remove). You don't put action names like `/create` or `/delete` inside the URL.

#### Q2: What is the HTTP `QUERY` method and why did you use it?
> **Answer**: `QUERY` is the modern IETF HTTP method designed for safe, read-only search operations that accept a request body. Unlike `GET` where query parameters in the URL can be leaked in server access logs or hit URL length limits, `QUERY` allows clean, structured search payloads (`{ q, code }`) directly on `/api/contacts`.

#### Q3: What is the MERN stack and why did you choose it?
> **Answer**: MERN stands for MongoDB, Express.js, React, and Node.js. It allows building full-stack applications entirely in JavaScript/JSON, providing high development speed, component reusability on the frontend, and schema flexibility on the backend.

#### Q4: What is the difference between SQL and NoSQL? Why MongoDB here?
> **Answer**: SQL databases use structured tables with fixed schemas and foreign keys. MongoDB is a document-oriented NoSQL database that stores data as JSON-like documents (BSON). It was chosen because contacts can have variable optional attributes (avatars, secret codes, job titles) which map naturally to JSON documents.

#### Q5: How are passwords secured in this project?
> **Answer**: Passwords are never stored in plain text. We use `bcryptjs` in a Mongoose `pre('save')` hook to salt and hash the password with 10 salt rounds before it ever touches MongoDB.

#### Q6: What is JWT and how does it work?
> **Answer**: JWT stands for JSON Web Token. Upon login or registration, the backend signs a token containing the user's `_id` using a secret key. The frontend sends this token in the `Authorization: Bearer <token>` header for subsequent requests. The backend verifies the cryptographic signature to authenticate the user without storing server-side sessions.

#### Q7: What is middleware in Express.js?
> **Answer**: Middleware is a function that has access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. In our project, `authMiddleware` checks for a valid JWT before letting the request proceed to protected contact routes.

#### Q8: How do you guarantee that User A cannot see User B's contacts?
> **Answer**: Through strict tenant isolation. In our database queries, we always include `userId: req.user.userId`. Because `req.user.userId` comes from the cryptographically verified JWT token and not from client-editable query parameters, it is impossible for one user to access another's data.

#### Q9: How does the "Secret Hidden Contacts" feature work?
> **Answer**: Contacts can optionally store a `hide_code`. In default queries, we filter for contacts where `hide_code` is `null` or empty. When the user enters their secret passcode, the API strictly queries for contacts where `hide_code == code`. If a user attempts to view a secret contact without the code, the API returns a `403 Forbidden`.

#### Q10: What does CORS mean and why do we need it?
> **Answer**: CORS stands for Cross-Origin Resource Sharing. Browsers block web applications on one origin (e.g. `http://localhost:5173`) from making requests to another origin (e.g. `http://localhost:5000`) unless the server allows it. We use the `cors()` middleware in Express to permit client requests.

#### Q11: What is the purpose of `useMemo` in the frontend?
> **Answer**: `useMemo` is a React hook that caches the result of a calculation between renders. We use it to group contacts alphabetically (`A-Z`) so that the grouping logic only re-executes when the contact list changes, rather than on every minor re-render.

#### Q12: How does the frontend handle token expiration?
> **Answer**: We configured an Axios response interceptor. If any API call returns a `401 Unauthorized` status, the interceptor clears the invalid token from `localStorage` and resets the auth state, returning the user to the login view.

#### Q13: What is an index in MongoDB and where did you use it?
> **Answer**: An index is a data structure (typically a B-tree) that allows MongoDB to find matching documents efficiently without scanning every document in a collection. We added indexes on `email` in User for fast uniqueness checks, and on `userId` and `hide_code` in Contact for fast query filtering.

#### Q14: What happens if an avatar image URL fails to load?
> **Answer**: The frontend `ContactCard` component includes an `onError` fallback handler as well as an initial check: if the image URL is empty or broken, it displays a dynamic fallback avatar generated via `ui-avatars.com` using the contact's name initials.

#### Q15: What HTTP status codes are used in your REST API?
> **Answer**:
> - `200 OK`: Successful read, query, update, or delete.
> - `201 Created`: Successful creation of user or contact.
> - `400 Bad Request`: Missing required fields (e.g. name or phone).
> - `401 Unauthorized`: Missing, invalid, or expired JWT token.
> - `403 Forbidden`: Attempting to access a secret contact without the correct code.
> - `404 Not Found`: Contact or route does not exist.
> - `409 Conflict`: Registering with an email that is already taken.
> - `500 Internal Server Error`: Unexpected server exception.

---

## 9. Step-by-Step Run & Demo Guide

### 1. Environment Configuration
`server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://amantalikoti2007_db_user:rBRMWlvVkBVUFxnH@cluster0.quoeglj.mongodb.net/contact_store?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

### 2. Running Both Backend & Frontend Simultaneously
From the project root:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

### 3. Demo Flow for Your Presentation
1. **Register**: Sign up with name, email, and password. Show that JWT is received and stored in `localStorage`.
2. **Add Public Contacts**: Add 2-3 contacts (e.g. Alice Smith, Bob Dylan, Charlie Brown). Show alphabetical grouping (`A`, `B`, `C`).
3. **Search with HTTP QUERY**: Type in the search bar. Show that search requests use the modern `QUERY` method on `/api/contacts`.
4. **Add Secret Contact**: Click **Add Contact**, enter details, and put `9876` in **Secret Hide Code**.
5. **Notice Absence**: Show the examiner that the secret contact does **not** appear on the main screen.
6. **Unlock Secret Mode**: Click **Secret Mode** button on top navbar, enter `9876`, click **Unlock**.
7. **Show Secret Banner**: Notice the yellow warning badge displaying unlocked code and the secret contact with a lock badge.
8. **Lock Back**: Click **Lock** to return immediately to public contacts view.
9. **Edit / Delete**: Demonstrate editing a phone number and deleting a contact using the confirmation modal.
