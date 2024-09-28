# Messenger App

This is a full-stack web application designed to enable seamless communication between users in a real-time chat interface. The project consists of a `client` (frontend) and `server` (backend), both of which are developed using modern web technologies such as React, NestJS, GraphQL, and Supabase for database management and authentication. The application supports both HTTP and WebSocket connections for a robust real-time experience.

## Project Structure

- **Client:** A React-based frontend application built using TypeScript. It handles user interactions, real-time messaging, and communicates with the backend using Apollo Client for GraphQL queries, mutations and subscriptions.
- **Server:** A NestJS-based backend that manages authentication (JWT), chat and user management, file uploads, and real-time message handling. Supabase is integrated for database management and user authentication.

## Key Features

- **JWT Authentication**: Secure authentication using JSON Web Tokens for both HTTP and WebSocket connections.
- **Real-time Communication**: Chats and messages are updated in real-time using WebSockets.
- **User and Chat Management**: Create, update, and delete users and chats seamlessly.
- **File Uploads**: Handle file uploads via GraphQL using `graphql-upload`.
- **Database Management**: Supabase is used for managing user data and chat storage.
- **Custom Scalars in GraphQL**: Implemented custom GraphQL scalars for handling dates and file uploads efficiently.
- **Test-Driven Development (TDD)**: The server code is thoroughly tested using Jest and Testing Library.

## Technologies

### Backend
- **NestJS**
- **TypeScript**
- **GraphQL**
- **Supabase**
- **PostgreSQL**
- **JWT**
- **Docker**
-  **Testing Library & Jest** for unit testing

### Frontend
- **React**
- **TypeScript**
- **Apollo Client**
- **Formik & Yup** for form validation
- **Framer Motion** for animations

## Getting Started

### Prerequisites

- Docker installed on your machine.
- Node.js and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gladyshewm/chat.git
   cd chat
   ```
2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

### Running the App in Development Mode

To run the app in development mode using Docker:
```bash
  docker compose --profile dev up --build
```

This will start both the client (on port 3000) and the server (on port 5000) in development mode.

### Manual Run (Without Docker)

Alternatively, you can run the client and server locally without Docker:

1. Start the client:
```bash
  cd client
  npm run start:dev
```
2. Start the server:
```bash
  cd server
  npm run start:dev
```

### Running the App in Production Mode

To run the app in production mode using Docker:

```bash
  docker compose --profile prod up --build
```

This will build and start the client (on port 3000) and server (on port 5000) with production optimizations.

## Testing

Uses Jest to test services, resolvers, and other backend components.

### Running Tests

To run unit tests for the server:
```bash
  cd server
  npm test
```

For end-to-end tests on the server:
```bash
  npm run test:e2e
```
