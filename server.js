const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET = 'cario_super_secret_token';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: 'cario_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
  })
);

// Serve static assets except private HTML
app.use(express.static(path.join(__dirname, 'public'), {
  index: false // disables default index.html being exposed
}));

// MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123', // change if needed
  database: 'cario_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected!');
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(401).send('Invalid credentials');

    const user = results[0];

    if (password === user.password) {
      // Token creation
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
      req.session.user = { id: user.id, username: user.username };
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.redirect('/');
}

// Home Page (protected)
app.get('/home', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'home.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.send('Logged out');
  });
});

app.listen(PORT, () => console.log(`🚗 Car.IO running at http://localhost:${PORT}`));
