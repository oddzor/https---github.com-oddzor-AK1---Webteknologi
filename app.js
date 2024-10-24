require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const playersRouter = require('./routes/players');
const teamsRouter = require("./routes/teams");
const matchesRouter = require('./routes/matches');
const db = require("./db");

app.use(express.json());

app.use('/api', playersRouter);
app.use('/api', matchesRouter);
app.use('/api', teamsRouter);

app.post("/api/auth/register", async (req, res) => {
  const { navn, e_post, passord } = req.body;

  if (!navn || !e_post || !passord) {
    return res.status(400).json({ error: "Ensure that all fields are filled" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passord, saltRounds);

    const sql = "INSERT INTO users (navn, e_post, passord) VALUES (?, ?, ?)";
    db.query(sql, [navn, e_post, hashedPassword], (err, result) => { 
      if (err) {
        console.error("Error inserting to DB:", err);
        return res.status(500).json({ error: "Failed to register user" });
      }
      res.status(201).json({ message: "User registered" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { e_post, passord } = req.body;

  if (!e_post || !passord) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password" });
  }

  try {
    const sql = "SELECT * FROM users WHERE e_post = ?";
    db.query(sql, [e_post], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(passord, user.passord);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign(
        { id: user.id, e_post: user.e_post },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res
        .status(200)
        .json({ message: "Login successful", token: token });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
