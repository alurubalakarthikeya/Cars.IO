const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: 'cario_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
  })
);

// Serve static files only from /public (except protected routes)
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'cario_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected!');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('DB error');
    if (results.length === 0) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, results[0].password);
    if (match) {
      req.session.user = { id: results[0].id, username: results[0].username };
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Could not logout');
    res.send('Logged out');
  });
});

// Protected route: serve home.html only if logged in
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  } else {
    res.redirect('/');
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.status(500).send('Username already exists');
    res.send('User registered!');
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
