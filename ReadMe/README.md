# Smart Portfolio

A full-stack personal portfolio web application built to showcase projects, technical skills, and professional information, with an admin dashboard for managing portfolio content.

## Features

- Responsive portfolio website
- Project and technical skills management
- Contact form for visitor inquiries
- Public comments and feedback
- Admin login and dashboard
- Resume upload and management
- MongoDB database integration

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API

## Project Structure

```text
Smart-Portfolio/
├── Port_Frontend/
│   ├── src/
│   └── package.json
└── Port_Backend/
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB connection
- Git

### Run the Backend

```bash
cd Port_Backend
npm install
npm start
```

Configure the required environment variables in your local `.env` file before starting the backend.

### Run the Frontend

Open a separate terminal:

```bash
cd Port_Frontend
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Security

- Keep environment variables and API secrets private.
- Never commit `.env` files or database credentials.
- Protect admin routes and operations with backend authentication.

## Author

Developed as a full-stack portfolio project.