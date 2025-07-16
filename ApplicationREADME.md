# Notes Manager

A modern React application for managing notes that connects to the Notes API backend.

## Backend

The backend is a Node.js Express API that provides RESTful endpoints for managing notes and stores data in DynamoDB.

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start DynamoDB Local (required for local development):
```bash
# Run DynamoDB Local on port 8000
docker run -p 8000:8000 amazon/dynamodb-local
```

4. Start the backend server:
```bash
npm start
```

The backend API will start at `http://localhost:3000`

### API Endpoints

- `GET /` - Welcome message and endpoint documentation
- `GET /notes` - Fetch all notes
- `GET /notes/:id` - Fetch a specific note by ID
- `POST /notes` - Create a new note (requires title and content in body)

## Frontend

## Features

- 📝 **Create Notes**: Add new notes with title and content
- 📋 **View All Notes**: See all your notes in a beautiful grid layout
- 🔍 **View Note Details**: Click on any note to see full details
- 🔄 **Refresh Notes**: Manually refresh the notes list
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- ⚡ **Real-time Updates**: Instant feedback when creating notes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend Notes API running on `http://localhost:3000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3001` (since backend uses 3000).

## Usage

### Using the Notes Manager

1. **Add a New Note**:
   - Click the "Add New Note" button
   - Fill in the title and content
   - Click "Create Note"

2. **View Notes**:
   - All notes are displayed in a grid layout
   - Each card shows the title and a preview of the content
   - Creation and update dates are shown at the bottom

3. **View Note Details**:
   - Click on any note card to view full details
   - The detail panel shows the complete content and metadata
   - Click the "✕" button to close the details

4. **Refresh Notes**:
   - Click the "Refresh Notes" button to reload all notes from the server

## API Integration

The frontend communicates with the backend API using the following endpoints:

- `GET /notes` - Fetch all notes
- `GET /notes/:id` - Fetch a specific note by ID
- `POST /notes` - Create a new note

## Technologies Used

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework for Node.js
- **DynamoDB** - NoSQL database for storing notes
- **AWS SDK** - For DynamoDB integration
- **UUID** - For generating unique note IDs
- **CORS** - Cross-Origin Resource Sharing middleware

### Frontend
- **React 19.1.0** - Frontend framework
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with gradients and animations
- **Create React App** - Project setup and build tools