# Leave Management System

## About

This is a MERN stack project I built to manage employee leave requests. Employees can apply for leave, check their leave history, and view their leave balance. Admins can view leave requests and approve or reject them.

## Features

- Employee registration and login
- Admin login
- Apply for leave
- View leave history
- Track leave balance
- Approve or reject leave requests
- Admin dashboard

## Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- Material UI
- JWT
- Axios

## Project Setup

**1. Clone the repository**

```bash
git clone https://github.com/Sanjanakulal/Leave_Management_System.git
cd Leave_Management_System
```

**2. Install frontend dependencies**

```bash
cd client
npm install
npm run dev
```

**3. Install backend dependencies**

Open another terminal:

```bash
cd server
npm install
npm run dev
```

Make sure MongoDB is running and the required environment variables are configured before starting the backend.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/employee/register` | Register employee |
| POST | `/employee/login` | Employee login |
| GET | `/employee/me` | Get employee details |
| POST | `/leave/apply` | Apply for leave |
| GET | `/leave/my-leaves` | View leave history |
| GET | `/leave/all` | View all leave requests |
| PATCH | `/leave/:id/status` | Update leave status |

## Deployment

The project will be hosted using the following services:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Source code: GitHub

The deployment links will be added after hosting the application.

## Project Links

- GitHub Repository: git clone https://github.com/Sanjanakulal/Leave_Management_System.git
- Live Application: To be added
- Backend API: To be added
