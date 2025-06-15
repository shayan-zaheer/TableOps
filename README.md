<div align="center">

# 🍗 MRBROAST-PANEL  
*Empowering Seamless Management, Elevating User Experience*

![last-commit](https://img.shields.io/github/last-commit/shayan-zaheer/mrbroast-panel?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/shayan-zaheer/mrbroast-panel?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/shayan-zaheer/mrbroast-panel?style=flat&color=0080ff)

</div>

---

## 🧠 Overview

**MRBROAST-PANEL** is a full-stack restaurant management system that integrates backend APIs, a modular React frontend, and admin controls to streamline day-to-day restaurant operations. This platform handles orders, products, staff, and promotions — making it a great candidate for evolving into a **restaurant SaaS (Software-as-a-Service)** solution.

---

## ✨ Key Features

- 🔧 Express.js API with MongoDB for robust CRUD functionality.
- 🖼️ Product image upload and media management.
- ⚡ Responsive UI powered by React and Vite.
- 📦 Organized Redux-based state management.
- 💬 Built-in modules for orders, deals, products, and staff control.
- 🔄 Seamless integration between frontend and backend.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Axios, PostCSS, Redux
- **Backend:** Node.js, Express.js, Mongoose
- **Others:** ESLint, dotenv, Nodemon

---

## 🗂️ Folder Structure

```
mrbroast-panel/
├── client/         # React frontend
├── server/         # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── .env
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
git clone https://github.com/shayan-zaheer/mrbroast-panel
cd mrbroast-panel
```

### Environment Setup

In the `/server` directory, create a `.env` file:

```
MONGO_URL=your_mongo_connection_string
```

### Running the App

```bash
# Start backend
cd server
npm install
npm start

# Start frontend
cd ../client
npm install
npm run dev
```

---

## 📌 Future Scope

> This project can be evolved into a **SaaS** product — an all-in-one restaurant operations panel.

Some potential SaaS-style names you could explore:
- **TableOps**

With multi-tenancy, RBAC, and cloud deployment, this can power multiple restaurants from a single dashboard.

---

## 🙌 Built By

**[Shayan Zaheer](https://github.com/shayan-zaheer)** — Happy to connect and collaborate.

---
