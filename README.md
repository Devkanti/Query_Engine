# Query Engine

A high-performance, approximate query processing engine designed for massive datasets. It provides lightning-fast analytics with an interactive and beautifully designed React frontend and a blazing-fast Rust backend.

## Architecture

- **Frontend**: Vite + React + Tailwind CSS + Framer Motion. Modern glassmorphism UI with real-time system metrics.
- **Backend**: Rust + Axum + Tokio. In-memory data ingestion and query execution engine capable of approximate query processing (AQP) via sampling techniques.
- **Database**: MongoDB Atlas for persistent storage of user credentials, datasets metadata, and query audit logs.

## Features

- **Query Engine Editor**: A full SQL-style query editor with syntax highlighting.
- **Approximate Querying**: Instantly execute queries on million-row datasets by sacrificing a tiny bit of accuracy for massive speed gains.
- **Data Ingestion**: High-throughput CSV uploading and parsing.
- **Audit Logging**: Full MongoDB-backed logging of all queries and datasets for administrators.
- **Role-Based Access**: Secure login system with distinct `company` and `admin` roles.

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) (v18+)
- A MongoDB Atlas account

### 1. Start the Backend (Rust)

```bash
cd backend
# Create a .env file with MONGODB_URI and ADMIN_PASSWORD
cargo run
```
The backend will launch on `http://0.0.0.0:8080`.

### 2. Start the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
The frontend will launch locally. Ensure that your Vercel deployment correctly sets the `VITE_API_URL` environment variable to point to your live Rust server.

## License
MIT
