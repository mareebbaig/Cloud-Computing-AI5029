# Notes Manager Frontend

A modern React application for managing notes that connects to the Notes API backend.

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

### Starting the Application

1. **Start the Backend**: Make sure the Notes API backend is running on port 3000
   ```bash
   cd ../backend
   npm start
   ```

2. **Start the Frontend**: In a new terminal, start the React application
   ```bash
   cd frontend
   npm start
   ```

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

- **React 19.1.0** - Frontend framework
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with gradients and animations
- **Create React App** - Project setup and build tools

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
