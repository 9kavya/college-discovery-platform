# College Discover Platform MVP

A production-grade, high-performance College Discovery Platform MVP inspired by Careers360 and Collegedunia. Built with a modern, responsive glassmorphic UI, side-by-side comparison tables, interactive review forms, and JWT-authenticated favorite bookmarks.

---

## Technical Stack
* **Frontend**: Next.js (App Router) + Tailwind CSS + TypeScript + Lucide Icons
* **Backend**: Node.js + Express.js + TypeScript + Zod Validation
* **Database & ORM**: PostgreSQL + Prisma ORM
* **Local DB Containerization**: Docker Compose

---

## Project Structure
```
E:\AI_SIGNAL_TASK
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL Schema
│   │   └── seed.ts         # Mock Data Seed Script
│   ├── src/
│   │   ├── controllers/    # MVC Controller handlers
│   │   ├── middleware/     # JWT Protection & Global Error handler
│   │   ├── routes/         # Router declarations
│   │   ├── validation/     # Zod payload/query validator schemas
│   │   ├── index.ts        # Express main entrypoint
│   │   └── types.ts        # Request payload overrides
│   ├── docker-compose.yml  # Local Postgres container
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (Layouts & Pages)
│   │   ├── components/     # UI, Navbar, Footer, and Card components
│   │   ├── context/        # AuthContext wrapper
│   │   ├── hooks/          # Custom Compare hook
│   │   ├── services/       # API Fetch Client
│   │   └── types/          # Shared interfaces
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## Local Setup & Installation

### Prerequisite
Ensure you have [Node.js (v18+)](https://nodejs.org/) and [Docker Desktop](https://www.docker.com/) installed on your machine.

### Step 1: Start the PostgreSQL Database
1. Open a terminal in the `backend/` directory.
2. Spin up the containerized database:
   ```bash
   docker-compose up -d
   ```
   *This starts a PostgreSQL instance on port `5432` with username/password `postgres/postgres` and database name `college_discovery`.*

### Step 2: Configure and Seed the Backend
1. In the `backend/` directory, install all dependencies:
   ```bash
   npm install
   ```
2. Verify that the `.env` file exists with the following content:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/college_discovery?schema=public"
   JWT_SECRET="super-secret-dev-jwt-token-key-change-in-production"
   ```
3. Run the database migrations to set up the schemas:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Run the seed script to load mock data (IITs, BITS Pilani, NIT Trichy, DTU, VIT, manipal, Stephen's):
   ```bash
   npm run prisma:seed
   ```
5. Start the Express development server:
   ```bash
   npm run dev
   ```
   *The server will boot and run on `http://localhost:5000`.*

### Step 3: Configure and Start the Frontend
1. Open a new terminal in the `frontend/` directory.
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Verify that the `.env.local` file contains:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The Next.js application will boot on `http://localhost:3000`.*

---

## API Documentation

### 1. Authentication
* **`POST /api/auth/register`**
  * Description: Create a new account.
  * Payload: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`
* **`POST /api/auth/login`**
  * Description: Authenticate and retrieve a JWT token.
  * Payload: `{ "email": "john@example.com", "password": "securepassword" }`
* **`GET /api/auth/me`** (Protected)
  * Description: Retrieve profile details for the logged-in user.
  * Header: `Authorization: Bearer <token>`

### 2. Colleges exploration
* **`GET /api/colleges`**
  * Description: List colleges with optional search, location filter, maximum fees budget, and page index.
  * Query parameters: `search=bits`, `location=pilani`, `maxFees=500000`, `page=1`, `limit=6`
* **`GET /api/colleges/:id`**
  * Description: Fetch detailed profiles including courses and student reviews list.
* **`POST /api/colleges/:id/reviews`** (Protected)
  * Description: Submit a stars rating and comment. Automatically recalculates the college rating average score.
  * Payload: `{ "rating": 5, "comment": "Excellent campus life!", "userName": "Optional custom name" }`

### 3. Bookmarks (Saved Colleges)
* **`GET /api/saved`** (Protected)
  * Description: Fetch favorited colleges list.
* **`POST /api/saved/:id`** (Protected)
  * Description: Bookmark a college.
* **`DELETE /api/saved/:id`** (Protected)
  * Description: Un-bookmark a college.

---

## Deployment Guide

### Backend Deployment (Render or Railway)
1. **Prisma Setup**: Ensure the build command on Render includes generating the client:
   * Build Command: `npm install && npm run build && npx prisma generate`
   * Start Command: `node dist/index.js`
2. **Environment Variables**: Add your production PostgreSQL string to the `DATABASE_URL` field and generate a secure `JWT_SECRET` string in the dashboard configurations.

### Frontend Deployment (Vercel)
1. Import your repository into Vercel.
2. **Environment Variables**: Define `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL (e.g. `https://your-backend.onrender.com/api`).
3. Vercel automatically detects Next.js configurations and handles build bundling and deployment optimization.
