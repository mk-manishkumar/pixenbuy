# Pixenbuy

An e-commerce web application with a modern tech stack, role-based access control, and a fully functional cart and order management system. Built with a scalable monorepo structure, separating the client application from the backend API services.

**🚀 Live Demo:** [https://pixenbuy.vercel.app](https://pixenbuy.vercel.app)

## 🌟 Key Features

- **Modern Authentication:** Secure user and admin authentication powered by [Clerk](https://clerk.dev/).
- **Role-Based Access Control (RBAC):** Distinct workflows for General Users and System Administrators.
- **Dynamic Cart & Checkout:** Persistent, database-backed shopping cart with dynamic total calculation and Zod validation.
- **Order Management:** Place orders and view paginated purchase histories in user profiles.
- **Admin Dashboard:** Stunning, protected analytics dashboard featuring real-time revenue stats, product performance data, and user metrics.
- **Product Catalog:** Integrated with [FakeStoreAPI](https://fakestoreapi.com/) for dynamic product browsing and search with debounced suggestions.
- **Payment Gateway:** Seamless and secure checkout experience integrated with [Razorpay](https://razorpay.com/).
- **AI Shopping Assistant:** Integrated **Pixenbot**, an intelligent context-aware chatbot to assist users in their shopping journey.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 with TypeScript
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
- **Payment Gateway:** Razorpay integration for secure order processing
- **AI Integration:** Powered by OpenRouter using the `nvidia/nemotron-3-super-120b-a12b:free` model
- **Architecture:** Controller-Service-Route layers with centralized error handling

## 📁 Project Structure

Our monorepo is architected for maximum scalability, separating concerns cleanly between the frontend interface and backend services.

```text
pixenbuy/
├── client/                 # React frontend application (Vite)
│   ├── src/
│   │   ├── api/            # Axios API configurations (FakeStore, Backend API)
│   │   ├── components/     # Modular UI components & Shadcn elements
│   │   ├── hooks/          # React Query custom hooks for data fetching & caching
│   │   ├── pages/          # Full page routing layouts (Home, Profile, Admin Dashboard)
│   │   └── utils/          # Helper functions, formatters, and Zod Schemas
├── server/                 # Express backend application (Node.js)
│   ├── vercel.json         # Serverless deployment configuration
│   ├── src/
│   │   ├── config/         # Environment variables & MongoDB connection config
│   │   ├── controllers/    # Request handlers & response formatting
│   │   ├── middleware/     # Clerk authentication & Role-based access guards
│   │   ├── models/         # Mongoose database schemas (User, Cart, Order)
│   │   ├── routes/         # REST API endpoint definitions
│   │   ├── services/       # Core business logic layer (Database operations)
│   │   └── utils/          # Global error handlers and async wrappers
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

## ☁️ Deployment Architecture

- **Frontend:** Deployed globally via **Vercel** with automatic CI/CD from GitHub.
- **Backend:** Deployed as highly-available Serverless Functions on **Vercel**. Express routing configuration is seamlessly mapped using a custom `vercel.json` file in the root of the server directory to adapt standard API routes to a serverless environment. 
- **Database:** Hosted securely on **MongoDB Atlas** with whitelisted IP access (`0.0.0.0/0`) to securely integrate with Vercel's dynamic serverless IP ranges.

> **Note:** The backend API URL endpoint is kept completely secret in the live production environment for strict security purposes.

## 🔮 Future Scope

- **Wishlist Functionality:** Allow users to save and track their favorite products.
- **Advanced Filtering & Sorting:** Introduce robust categories, price ranges, and ratings filters to the product catalog.
- **Reviews & Ratings:** Enable users to leave detailed feedback on purchased items.
- **Multi-language Support:** Localize the platform to cater to a global audience.

## 🤝 Contributing

Contributions are completely open and always welcome! Whether you're fixing a bug, proposing a new feature, or improving documentation, we'd love your help.
1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📄 License
This project is licensed under the MIT License.

## 📬 Contact

Have questions, feedback, or want to collaborate? Reach out!
- **X (Twitter):** [@_manishmk](https://x.com/_manishmk)

