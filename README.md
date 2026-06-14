# Pixenbuy

An e-commerce web application with a modern tech stack, role-based access control, and a fully functional cart and order management system. Built with a scalable monorepo structure, separating the client application from the backend API services.

## 🌟 Key Features

- **Modern Authentication:** Secure user and admin authentication powered by [Clerk](https://clerk.dev/).
- **Role-Based Access Control (RBAC):** Distinct workflows for General Users and System Administrators.
- **Dynamic Cart & Checkout:** Persistent, database-backed shopping cart with dynamic total calculation and Zod validation.
- **Order Management:** Place orders and view paginated purchase histories in user profiles.
- **Admin Dashboard:** Stunning, protected analytics dashboard featuring real-time revenue stats, product performance data, and user metrics.
- **Product Catalog:** Integrated with [FakeStoreAPI](https://fakestoreapi.com/) for dynamic product browsing and search with debounced suggestions.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **State & Data Fetching:** TanStack Query (React Query)
- **Validation:** Zod
- **Authentication:** `@clerk/clerk-react`
- **Routing:** React Router DOM v6

### Backend (Server)
- **Framework:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** `@clerk/express` for token verification
- **Architecture:** Controller-Service-Route layers with centralized error handling

## 📁 Project Structure

```text
pixenbuy/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/            # API clients (FakeStore, Backend)
│   │   ├── components/     # Reusable UI components & Shadcn
│   │   ├── hooks/          # React Query custom hooks
│   │   ├── pages/          # Full page layouts (Home, Profile, Dashboard)
│   │   └── utils/          # Helpers & Zod Schemas
├── server/                 # Express backend application
│   ├── src/
│   │   ├── config/         # MongoDB connection config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Role guards
│   │   ├── models/         # Mongoose schemas (User, Cart, Order)
│   │   ├── routes/         # API Route definitions
│   │   └── services/       # Business logic layer
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Clerk account for authentication keys

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pixenbuy.git
cd pixenbuy
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory using the provided `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/pixenbuy
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CORS_ORIGIN=http://localhost:5173
ADMIN_SECRET_KEY=your-super-secret-admin-key
ADMIN_EMAIL=your.admin.email@example.com
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

## 🛡️ Admin Access Configuration

By default, any user signing up via Clerk is assigned a standard `"user"` role. 

To create an Admin account:
1. Ensure your `ADMIN_EMAIL` and `ADMIN_SECRET_KEY` are configured in `server/.env`.
2. Navigate to the hidden route: `http://localhost:5173/admin/sign-up`.
3. Sign up using the exact email specified in `ADMIN_EMAIL`.
4. Enter the `ADMIN_SECRET_KEY` to verify and elevate your role to `"admin"`.

Regular users cannot access the admin dashboard or elevate their own privileges. Admins are restricted from performing checkout flows to maintain analytics purity.

## 📄 License
This project is licensed under the MIT License.
