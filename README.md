# 🗞️ Janawaj News Agency

A **full-stack news agency platform** with real-time reader engagement — featuring an interactive homepage with image sliders, live polls, community discussions, and a complete admin dashboard. Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and deployed on **Render**.

> **Janawaj** — Your trusted source for breaking news, in-depth analysis by our team, and comprehensive coverage of events that matter.

---

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Overview](#-api-overview)
- [👨‍💻 Admin Panel](#-admin-panel)
- [🔒 Security Features](#-security-features)
- [📦 Deployment](#-deployment)
- [🖼️ Screenshots](#️-screenshots)
- [🧭 Roadmap](#-roadmap)
- [📄 License](#-license)

---

## ✨ Key Features

### 📰 News Management

- Paginated news listing with **search**, **category filters**, and **featured/top stories**
- Rich article detail pages with **views tracking**, **related news** recommendations
- Reader engagement: **like**, **save/unsave**, and **share** articles
- 12 news categories (National, International, Technology, Sports, Business, Health, Science, Education, Environment, and more)
- Image uploads via `multer` with multi-file support

### 🗳️ Interactive Polls

- Live opinion polls with **real-time vote counts**
- **One-vote-per-user** enforcement and **expiry-based status** (active / ending-soon / closed)
- Time-left indicators (days/hours remaining)
- Detailed admin results with per-user vote breakdown

### 💬 Community Discussions

- Authenticated users can post messages categorized by _General, Suggestion, Slider Idea, Topic Suggestion_
- **Like** posts and **delete** own posts (admins can moderate all)
- **XSS protection** — HTML tags stripped automatically before saving
- Paginated feed with category filtering

### 🔐 Authentication & Authorization

- Full **JWT-based authentication** (7-day expiry) with role-based access control
- **Google OAuth** (Google Identity Services) social login
- Strong password policy validation (uppercase, lowercase, number, special character)
- **Login history tracking** — records IP address, user agent, success/failure with reason
- Profile management: update profile, change password, manage saved news

### 🎛️ Complete Admin Dashboard

- **Analytics dashboard** — total users, news, polls, messages + recent activity & news-by-category breakdown
- Full **CRUD** for news articles, polls, and homepage sliders (with drag-reorder support)
- **User management** — change roles, activate/deactivate, delete accounts
- **Contact inbox** — read/unread message management
- **Login history viewer** — monitor successful and failed login attempts

### 🎨 Modern UI/UX

- **Tailwind CSS** design system with custom primary/accent palette
- Responsive layout — mobile-first with collapsible navigation
- **Swiper.js** image carousel for featured news
- Playfair Display + modern typography for editorial feel
- Smooth animations, hover states, and loading spinners

---

## 🛠️ Tech Stack

### Frontend

| Technology         | Purpose                                |
| ------------------ | -------------------------------------- |
| **React 18**       | UI library with hooks & context API    |
| **Vite 5**         | Lightning-fast build tool & dev server |
| **React Router 6** | Client-side routing & protected routes |
| **Tailwind CSS 3** | Utility-first styling                  |
| **Axios**          | HTTP client with JWT interceptors      |
| **Swiper 11**      | Touch-enabled image sliders            |
| **React Icons**    | Iconography                            |

### Backend

| Technology               | Purpose                             |
| ------------------------ | ----------------------------------- |
| **Node.js 18+**          | JavaScript runtime                  |
| **Express 4**            | REST API framework                  |
| **MongoDB / Mongoose 8** | NoSQL database with schema modeling |
| **JSON Web Token**       | Stateless authentication            |
| **bcryptjs**             | Password hashing (12 salt rounds)   |
| **Multer**               | File/image uploads                  |
| **Helmet**               | Security HTTP headers               |
| **express-validator**    | Server-side input validation        |
| **CORS**                 | Cross-origin resource sharing       |
| **Morgan**               | HTTP request logging                |

### DevOps & Deployment

- **Render** — free-tier cloud deployment (Singapore region)
- **render.yaml** — Infrastructure-as-code deployment config
- **Vercel/Render SPA fallback** — production serving of client build

---

## 🏗️ Architecture

The application follows a **monorepo structure** with a clear separation between frontend and backend:

```
┌────────────────────────────────────────────────────┐
│                   CLIENT (React SPA)                │
│  React Router  ──  Pages/Components  ──  Axios API  │
└────────────────────────┬───────────────────────────┘
                         │ HTTP (REST /api/*)
                         ▼
┌────────────────────────────────────────────────────┐
│              SERVER (Express.js API)                │
│  Routes ── Controllers ── Models ── MongoDB (Mongoose)│
│  Middleware: auth (JWT), validation, upload, errors  │
└────────────────────────────────────────────────────┘
```

- **Frontend** runs on port `3000` (Vite dev server) and proxies `/api` & `/uploads` to the backend.
- **Backend** runs on port `5000` and, in production, serves the compiled client build with SPA fallback.
- **REST API** follows resource-based routing with consistent response envelopes:
  ```json
  { "success": true, "count": 12, "total": 120, "totalPages": 10, "currentPage": 1, "data": [...] }
  ```

---

## 📂 Project Structure

```
janawaj/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   └── src/
│       ├── components/              # Navbar, Footer, NewsCard, PollCard, ImageSlider...
│       ├── context/                 # AuthContext (global auth state)
│       ├── hooks/                   # useSocialAuth (Google OAuth)
│       ├── pages/                   # Home, News, Polls, Community, Contact...
│       │   └── admin/               # AdminDashboard, AdminNews, AdminPolls, AdminUsers...
│       ├── App.jsx                  # Route definitions & protected admin routes
│       ├── main.jsx                 # React entry point
│       ├── index.css                # Tailwind directives
│       ├── tailwind.config.js       # Design tokens & theme
│       └── vite.config.js           # Dev server & proxy config
│
├── server/                          # Node.js backend
│   ├── config/                      # Database connection
│   ├── controllers/                 # Business logic (auth, news, polls, sliders...)
│   ├── middleware/                  # Auth, validation, upload, error handler
│   ├── models/                      # Mongoose schemas (User, News, Poll, Slider...)
│   ├── routes/                      # REST API routes
│   ├── uploads/                     # Uploaded media storage
│   ├── index.js                     # Express app entry point
│   └── seed-production.js           # Production data seeder
│
├── render.yaml                      # Render deployment config
├── package.json                     # Root scripts (install/start/build/dev)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **MongoDB** (local instance or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/janawaj.git
cd janawaj
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/janawaj
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the `client/` directory _(optional — for social login)_:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Run the Application

#### Development (two terminals)

**Backend** (port 5000):

```bash
cd server
npm run dev
```

**Frontend** (port 3000):

```bash
cd client
npm run dev
```

Visit **http://localhost:3000** 🎉

#### Seed Database (optional)

```bash
cd server
npm run seed
# or
node seed-production.js
```

> Creates an admin account: `admin@janawaj.com` / `Admin@123` along with sample news, sliders, and polls.

### 5. Build for Production

```bash
npm run build   # Installs client deps and builds the Vite bundle
```

---

## 🔐 Environment Variables

| Variable                | Location    | Description                                      |
| ----------------------- | ----------- | ------------------------------------------------ |
| `PORT`                  | server/.env | Backend port (default: 5000)                     |
| `NODE_ENV`              | server/.env | `development` or `production`                    |
| `MONGODB_URI`           | server/.env | MongoDB connection string                        |
| `JWT_SECRET`            | server/.env | Secret key for signing JWTs                      |
| `JWT_EXPIRE`            | server/.env | Token expiry (default: 7d)                       |
| `CLIENT_URL`            | server/.env | Allowed CORS origin                              |
| `VITE_GOOGLE_CLIENT_ID` | client/.env | Google OAuth client ID                           |
| `CLOUDINARY_CLOUD_NAME` | server/.env | Cloudinary cloud name (production image storage) |
| `CLOUDINARY_API_KEY`    | server/.env | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET` | server/.env | Cloudinary API secret                            |

---

## 📡 API Overview

### Authentication

| Method | Endpoint                       | Access  | Description              |
| ------ | ------------------------------ | ------- | ------------------------ |
| POST   | `/api/auth/register`           | Public  | Register a new user      |
| POST   | `/api/auth/login`              | Public  | Login & receive JWT      |
| GET    | `/api/auth/me`                 | Private | Get current user profile |
| PUT    | `/api/auth/profile`            | Private | Update profile           |
| PUT    | `/api/auth/change-password`    | Private | Change password          |
| GET    | `/api/auth/saved-news`         | Private | Get saved news           |
| POST   | `/api/auth/saved-news/:newsId` | Private | Save/unsave news         |
| POST   | `/api/auth/google`             | Public  | Google OAuth login       |

### News

| Method | Endpoint              | Access  | Description                                         |
| ------ | --------------------- | ------- | --------------------------------------------------- |
| GET    | `/api/news`           | Public  | List news (page, limit, category, search, featured) |
| GET    | `/api/news/:id`       | Public  | Get single news (+1 view, related news)             |
| POST   | `/api/news`           | Admin   | Create news                                         |
| PUT    | `/api/news/:id`       | Admin   | Update news                                         |
| DELETE | `/api/news/:id`       | Admin   | Delete news                                         |
| PUT    | `/api/news/:id/like`  | Private | Like/unlike news                                    |
| PUT    | `/api/news/:id/save`  | Private | Save/unsave news                                    |
| PUT    | `/api/news/:id/share` | Public  | Increment share count                               |

### Polls

| Method | Endpoint                 | Access  | Description           |
| ------ | ------------------------ | ------- | --------------------- |
| GET    | `/api/polls`             | Public  | List active polls     |
| GET    | `/api/polls/:id`         | Public  | Get single poll       |
| POST   | `/api/polls/:id/vote`    | Private | Vote on a poll        |
| POST   | `/api/polls`             | Admin   | Create poll           |
| PUT    | `/api/polls/:id`         | Admin   | Update poll           |
| DELETE | `/api/polls/:id`         | Admin   | Delete poll           |
| GET    | `/api/polls/:id/results` | Admin   | Detailed vote results |

### Sliders

| Method | Endpoint               | Access | Description         |
| ------ | ---------------------- | ------ | ------------------- |
| GET    | `/api/sliders`         | Public | List active sliders |
| GET    | `/api/sliders/all`     | Admin  | List all sliders    |
| POST   | `/api/sliders`         | Admin  | Create slider       |
| PUT    | `/api/sliders/:id`     | Admin  | Update slider       |
| PUT    | `/api/sliders/reorder` | Admin  | Reorder sliders     |
| DELETE | `/api/sliders/:id`     | Admin  | Delete slider       |

### Community Discussions

| Method | Endpoint                    | Access  | Description                      |
| ------ | --------------------------- | ------- | -------------------------------- |
| GET    | `/api/discussions`          | Public  | List posts (paginated, filtered) |
| POST   | `/api/discussions`          | Private | Create a post                    |
| PUT    | `/api/discussions/:id/like` | Private | Like/unlike post                 |
| DELETE | `/api/discussions/:id`      | Private | Delete post (owner/admin)        |

### Contact

| Method | Endpoint                       | Access | Description              |
| ------ | ------------------------------ | ------ | ------------------------ |
| POST   | `/api/contact`                 | Public | Submit a contact message |
| GET    | `/api/contact`                 | Admin  | List messages            |
| GET    | `/api/contact/:id`             | Admin  | Get single message       |
| PUT    | `/api/contact/:id/toggle-read` | Admin  | Mark read/unread         |
| DELETE | `/api/contact/:id`             | Admin  | Delete message           |

### Admin & System

| Method | Endpoint                    | Access | Description                      |
| ------ | --------------------------- | ------ | -------------------------------- |
| GET    | `/api/admin/dashboard`      | Admin  | Dashboard statistics & analytics |
| GET    | `/api/admin/users`          | Admin  | List all users (paginated)       |
| PUT    | `/api/admin/users/:id/role` | Admin  | Change user role                 |
| DELETE | `/api/admin/users/:id`      | Admin  | Delete user                      |
| GET    | `/api/login-history`        | Admin  | Login attempts log               |
| GET    | `/api/login-history/stats`  | Admin  | Login analytics                  |
| DELETE | `/api/login-history`        | Admin  | Clear login history              |
| POST   | `/api/upload`               | Admin  | Upload single file               |
| POST   | `/api/upload/multiple`      | Admin  | Upload multiple files            |
| GET    | `/api/health`               | Public | Health check endpoint            |

---

## 👨‍💻 Admin Panel

Protected by JWT + role-based authorization (`authorize("admin")`). Accessible at **`/admin`** after logging in as an admin.

| Page              | Purpose                                                            |
| ----------------- | ------------------------------------------------------------------ |
| **Dashboard**     | Overview stats, recent news, recent users, news-by-category charts |
| **News**          | Create, edit, publish/unpublish, delete articles                   |
| **Polls**         | Create polls, manage options & expiry, view results                |
| **Sliders**       | Manage homepage banner sliders & ordering                          |
| **Users**         | View users, change roles, delete accounts                          |
| **Contacts**      | Manage reader messages (read/unread, delete)                       |
| **Login History** | Audit successful/failed login attempts (IP, device, reason)        |

> ⚠️ Frontend admin routes are protected with a `<AdminRoute>` wrapper that redirects non-admin users to `/login`.

---

## 🔒 Security Features

| Feature                  | Implementation                                                                |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Password Hashing**     | bcryptjs with 12 salt rounds                                                  |
| **JWT Authentication**   | Stateless tokens with 7-day expiry, Bearer header scheme                      |
| **Role-Based Access**    | `authorize("admin")` middleware protects all admin routes                     |
| **Input Validation**     | `express-validator` on all POST/PUT endpoints                                 |
| **XSS Prevention**       | HTML tags stripped from discussion posts before saving                        |
| **HTTP Security**        | Helmet middleware sets secure headers (CSP, X-Frame-Options, etc.)            |
| **CORS**                 | Whitelist-based origin validation with credentials support                    |
| **Login Auditing**       | Every login attempt (success/failure) logged with IP, user agent, and reason  |
| **Password Policy**      | Minimum 8 chars, requires uppercase, lowercase, number, and special character |
| **Account Deactivation** | Admin can deactivate accounts to prevent access without deleting data         |

---

## 📦 Deployment

### Deploy to Render (Recommended)

1. Push your repository to GitHub.

2. In **Render Dashboard**, create a new **Web Service** and connect your repository.

3. Render will automatically detect the `render.yaml` configuration:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check:** `/api/health`

4. Set the following environment variables in Render:

   | Variable                | Value                                                      |
   | ----------------------- | ---------------------------------------------------------- |
   | `NODE_ENV`              | `production`                                               |
   | `MONGODB_URI`           | Your MongoDB Atlas connection string                       |
   | `JWT_SECRET`            | A strong random secret                                     |
   | `JWT_EXPIRE`            | `7d`                                                       |
   | `CLIENT_URL`            | Your Render app URL (e.g., `https://janawaj.onrender.com`) |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name (from Cloudinary dashboard)     |
   | `CLOUDINARY_API_KEY`    | Your Cloudinary API key                                    |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret                                 |

5. Deploy! 🚀

### Environment Modes

| Mode            | Frontend              | Backend                     | API Proxy          |
| --------------- | --------------------- | --------------------------- | ------------------ |
| **Development** | Vite dev server :3000 | Express + Nodemon :5000     | Vite proxy → :5000 |
| **Production**  | Compiled static files | Express serves client build | Same origin        |

---

## 🖼️ Screenshots

> _(Add screenshots of your application here to showcase the UI)_

| Section             | Preview                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| **Homepage**        | ![Homepage](https://via.placeholder.com/400x250?text=Homepage)               |
| **News Details**    | ![News Details](https://via.placeholder.com/400x250?text=News+Details)       |
| **Community**       | ![Community](https://via.placeholder.com/400x250?text=Community)             |
| **Admin Dashboard** | ![Admin Dashboard](https://via.placeholder.com/400x250?text=Admin+Dashboard) |
| **Polls**           | ![Polls](https://via.placeholder.com/400x250?text=Polls)                     |

---

## 🧭 Roadmap

- [x] Core news CRUD with categories, search, and pagination
- [x] Interactive polls with voting and expiry management
- [x] Community discussions with likes and moderation
- [x] Google OAuth social login
- [x] Admin dashboard with analytics and user management
- [x] Login history auditing
- [x] Image slider management for homepage
- [x] Contact form with admin inbox
- [ ] Email notifications for contact replies
- [ ] Push notifications for breaking news
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] News bookmarking with categories
- [ ] Real-time comments on news articles

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Express](https://expressjs.com/)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Images from [Unsplash](https://unsplash.com/)
- Deployed on [Render](https://render.com/)

---

<p align="center">Made with ❤️ by <strong>Janawaj Team</strong></p>
