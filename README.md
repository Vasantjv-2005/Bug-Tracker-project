# Bug Tracker Application

A comprehensive bug tracking and project management system built with Next.js frontend and Node.js backend, featuring real-time issue tracking, team collaboration, and MongoDB persistence.

## Overview

This bug tracker application provides a complete solution for software development teams to manage projects, track issues, and collaborate efficiently. The system includes user authentication, project management, issue tracking with Kanban board visualization, and comment functionality.

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2.0 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: Radix UI components with custom implementations
- **State Management**: React hooks and context
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.4.1
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, CORS, bcryptjs
- **Environment**: dotenv for configuration management

## Project Structure

```
bug-tracker-project/
|
 Backend-bug tracker/                 # Backend API server
|   .env                            # Environment variables
|   config/
|   |   db.js                      # MongoDB connection configuration
|   controllers/
|   |   authController.js          # User authentication logic
|   |   commentController.js       # Comment management
|   |   issueController.js         # Issue CRUD operations
|   |   projectController.js       # Project management
|   middleware/
|   |   authMiddleware.js          # JWT authentication middleware
|   models/
|   |   Comment.js                 # Comment schema
|   |   Issue.js                   # Issue schema
|   |   Project.js                 # Project schema
|   |   User.js                    # User schema
|   routes/
|   |   authRoutes.js              # Authentication endpoints
|   |   commentRoutes.js            # Comment endpoints
|   |   issueRoutes.js             # Issue endpoints
|   |   projectRoutes.js           # Project endpoints
|   server.js                      # Main server entry point
|   package.json                   # Backend dependencies
|
 bug-tracker-frontend/              # Next.js frontend application
|   app/
|   |   dashboard/
|   |   |   page.tsx              # Dashboard overview
|   |   |   project/
|   |   |   |   [id]/page.tsx     # Project details with Kanban board
|   |   |   issues/page.tsx       # Issues listing
|   |   auth/
|   |   |   login/page.tsx        # Login page
|   |   |   register/page.tsx     # Registration page
|   |   layout.tsx                # Root layout
|   |   page.tsx                   # Home page
|   components/
|   |   dashboard/
|   |   |   kanban-board.tsx      # Kanban board component
|   |   |   issue-details-modal.tsx # Issue details and comments
|   |   |   create-issue-modal.tsx  # Issue creation modal
|   |   ui/                        # Reusable UI components
|   lib/
|   |   api.js                     # API client configuration
|   |   utils.ts                   # Utility functions
|   package.json                   # Frontend dependencies
|   tsconfig.json                  # TypeScript configuration
```

## Features

### User Management
- User registration and authentication
- JWT-based secure authentication
- User profile management
- Protected routes and middleware

### Project Management
- Create and manage projects
- Add team members to projects
- Project-based issue organization
- Project overview and statistics

### Issue Tracking
- Create, read, update, and delete issues
- Issue status management (To Do, In Progress, Done)
- Priority levels (Low, Medium, High)
- Issue assignment and tracking
- Real-time Kanban board visualization
- Drag-and-drop issue status updates

### Comment System
- Add comments to issues
- Thread-like comment display
- User attribution for comments
- Real-time comment updates

### User Interface
- Modern, responsive design
- Dark/light theme support
- Intuitive Kanban board interface
- Modal-based interactions
- Toast notifications for user feedback

## Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend-bug tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure the `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=5ceb302946ccd1c35142856e3c77ef43db54fabef492f729ddf9768d678cd4e156793325df97354edb077b166ce2e263ea5620c81e73474c5bac92f1415b8d2e
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../bug-tracker-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET /api/auth/me
Get current user profile (protected route).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Project Endpoints

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description"
}
```

#### GET /api/projects
Get all projects for the authenticated user.

#### GET /api/projects/:id
Get a specific project by ID.

### Issue Endpoints

#### POST /api/issues
Create a new issue.

**Request Body:**
```json
{
  "title": "Issue Title",
  "description": "Issue description",
  "projectId": "project_id",
  "status": "To Do",
  "priority": "medium"
}
```

#### GET /api/issues?projectId=:projectId
Get all issues for a specific project.

#### PUT /api/issues/:id
Update an existing issue.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "In Progress",
  "priority": "high"
}
```

### Comment Endpoints

#### POST /api/comments
Create a new comment.

**Request Body:**
```json
{
  "content": "Comment content",
  "issueId": "issue_id",
  "projectId": "project_id"
}
```

#### GET /api/comments/:issueId
Get all comments for a specific issue.

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  members: [{ type: ObjectId, ref: 'User' }],
  createdBy: { type: ObjectId, ref: 'User', required },
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  title: String (required),
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  project: { type: ObjectId, ref: 'Project', required },
  assignedTo: { type: ObjectId, ref: 'User' },
  createdBy: { type: ObjectId, ref: 'User', required },
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String (required),
  issue: { type: ObjectId, ref: 'Issue', required },
  user: { type: ObjectId, ref: 'User', required },
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Guide

### Getting Started

1. **Register an Account**: Visit the registration page and create a new user account
2. **Login**: Use your credentials to authenticate and access the dashboard
3. **Create a Project**: Click "New Project" to create your first project
4. **Add Issues**: Create issues within your project with titles, descriptions, and priorities
5. **Manage Issues**: Use the Kanban board to track issue progress and update statuses
6. **Collaborate**: Add comments to issues and collaborate with team members

### Kanban Board Usage

- **To Do Column**: New and unstarted issues
- **In Progress Column**: Currently active issues
- **Done Column**: Completed issues
- **Drag and Drop**: Move issues between columns to update status
- **Click Issues**: Open issue details to view and add comments

### Project Management

- **Project Overview**: View all projects from the dashboard
- **Project Details**: Click on any project to see its issues and Kanban board
- **Team Collaboration**: Add team members to projects (feature available in future versions)

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
```

### Important Notes

- Replace `username`, `password`, and `database_name` with your actual MongoDB credentials
- Generate a secure JWT secret key for production environments
- Keep the `.env` file secure and never commit it to version control

## Development

### Running in Development Mode

1. Start the backend server:
```bash
cd Backend-bug tracker
npm start
```

2. Start the frontend development server:
```bash
cd ../bug-tracker-frontend
npm run dev
```

3. Open `http://localhost:3000` in your browser

### Building for Production

1. Build the frontend:
```bash
cd bug-tracker-frontend
npm run build
npm start
```

2. Ensure the backend is running with production environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For any issues or questions, please refer to the project documentation or contact the development team.

---

## Version History

- **Version 1.0.0**: Initial release with core bug tracking functionality
  - User authentication and registration
  - Project management
  - Issue tracking with Kanban board
  - Comment system
  - Real-time updates
