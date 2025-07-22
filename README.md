# Thuesday

Simple Monday-like clone built with Next.js and MariaDB via Drizzle ORM.

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your MariaDB connection string

```bash
cp .env.example .env
```

3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Features

- User registration and login
- Create boards
- Add items to boards
- Click item to cycle status between `todo`, `in-progress`, and `done`
- Double-click item to delete it
- Uses MariaDB database defined by `DATABASE_URL`

This project is for demonstration only and not production ready.
