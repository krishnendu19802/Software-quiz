const express = require('express');
const cors = require('cors');
const pool=require('./config/database')
const allRoutes=require('./allRoutes')
// Load environment variables


const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Set up CORS
app.use(cors({
   origin: '*',  // Adjust this to the specific origin as per your requirements
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Create a MySQL connection pool


// Basic route
app.use('/api',allRoutes)

// Start the server
const server=app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

module.exports={app,server}
