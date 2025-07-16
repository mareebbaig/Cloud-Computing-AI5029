const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const AWS = require("aws-sdk");
require("dotenv").config();

const dynamoConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
};

const TABLE_NAME = "Notes";

AWS.config.update(dynamoConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();
const PORT = 3000; // Force port 3000

// CORS middleware - Allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all notes
app.get("/notes", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await docClient.scan(params).promise();

    res.status(200).json({
      success: true,
      count: result.Items.length,
      data: result.Items,
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving notes",
      error: error.message,
    });
  }
});

// GET endpoint to retrieve a specific note by ID
app.get("/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: noteId,
      },
    };

    const result = await docClient.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.Item,
    });
  } catch (error) {
    console.error("Error retrieving note:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving note",
      error: error.message,
    });
  }
});

// POST endpoint to create a new note
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Create new note
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: newNote,
    };

    await docClient.put(params).promise();

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating note",
      error: error.message,
    });
  }
});

// Root endpoint for loadbalancer health check
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Notes API",
    endpoints: {
      "GET /notes": "Get all notes",
      "GET /notes/:id": "Get a specific note by ID",
      "POST /notes": "Create a new note (requires title and content in body)",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Handle 404 errors
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server
async function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Notes API server is running on port ${PORT}`);
    console.log(`�️  Connected to DynamoDB Local on port 8000`);
    console.log(`�📝 API Documentation:`);
    console.log(`   GET    http://localhost:${PORT}/notes     - Get all notes`);
    console.log(
      `   GET    http://localhost:${PORT}/notes/:id - Get note by ID`
    );
    console.log(
      `   POST   http://localhost:${PORT}/notes     - Create new note`
    );
  });
}

// Start the application
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
