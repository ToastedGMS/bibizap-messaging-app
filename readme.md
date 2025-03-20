# Chat Application

## Overview

This is a work-in-progress real-time chat application built with modern web technologies. While it's functional and offers core features, it's not yet at 100% of where I want it to be. I'm constantly working to improve and enhance its functionality.

The app utilizes **React** for the frontend, **Node.js** with **Express** for the backend, **Prisma ORM** for database management, and **Socket.IO** for real-time communication.

## Features

- **Real-time messaging** powered by Socket.IO.
- **Basic frontend design** built with React.
- **Reliable backend server** using Node.js and Express.
- **Database handling** with Prisma ORM for efficient data management.
- **Room-based communication** for organized chats.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.

### Backend

- **Node.js**: A JavaScript runtime for the server.
- **Express**: A minimal and flexible web application framework.

### Database

- **Prisma ORM**: A modern Object-Relational Mapper for seamless database interactions.

### Real-Time Communication

- **Socket.IO**: A library for bi-directional, real-time communication.

## Live Demo

You can check out the current progress and try the live demo here: [Live Demo](#) _(Replace # with your deployment URL)_

## Prerequisites

Make sure you have the following installed:

- **Node.js** (>= 14.x)
- **npm** (or yarn)
- **PostgreSQL/MySQL** (or any supported database for Prisma)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**

   ```bash
    cd <project-directory>
   ```

3. **Install dependencies for both backend and frontend:**

   ```bash
   npm install
   ```

4. **Set up the database with Prisma:**

```bash
 npx prisma migrate dev --name init
```

## Running the Application

1. **Start the backend server:**

```bash
  npm run server
```

2. **Start the React development server:**

   ```bash
   npm run client
   ```

3. **Open your browser and navigate to:**

```bash
http://localhost:3000
```

## How It Works

- Backend: Handles user authentication, database operations, and serves API endpoints.

- Frontend: Provides the user interface and interacts with the backend APIs.

- Socket.IO: Establishes a WebSocket connection for real-time messaging.

- Prisma: Manages data models, migrations, and seamless database operations.

## Work in Progress

This application is still in development. Although functional, there are several features and enhancements planned for future updates:

- Improved UI/UX design.

- Advanced messaging features (like message read status, media sharing, etc.).

- Better error handling and performance optimizations.

Feel free to share feedback or contribute to its development!

## Contributing

We welcome contributions! Fork the repository, submit pull requests, or open issues for improvements and bug fixes.

## License

This project is licensed under the MIT License.
