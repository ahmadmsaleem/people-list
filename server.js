const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();

// Middleware to handle JSON data
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Connect to SQLite database (it will create the database file if it doesn't exist)
const db = new sqlite3.Database("./people.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    
    // Create the people table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    });
  }
});

// Endpoint to get the list of people
app.get("/people", (req, res) => {
  db.all("SELECT * FROM people", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving people:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows); // Send the list of people as JSON
  });
});

// Endpoint to add a person
app.post("/add", (req, res) => {
  const { name } = req.body;
  if (name) {
    db.run("INSERT INTO people (name) VALUES (?)", [name], function (err) {
      if (err) {
        console.error("Error inserting person:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id: this.lastID }); // Respond with the last inserted ID
    });
  } else {
    res.status(400).json({ success: false, message: "Name is required." });
  }
});

// Close the database connection on server shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database connection:", err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
