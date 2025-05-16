const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve public folder (for index.html, login.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Setup session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  console.log('Received:', username, password); // ✅ add this

  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).send('Database error');
      }

      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        return res.redirect('/home');
      } else {
        return res.send('Incorrect Username or Password');
      }
    });
  } else {
    res.send('Please enter Username and Password');
  }
});


// Protect this route
app.get('/home', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'private', 'home.html'));
  } else {
    res.redirect('/');
  }
});

// Optional: logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.use(bodyParser.json()); // to parse JSON bodies from fetch
app.use(bodyParser.urlencoded({ extended: true })); // for form submissions

app.post('/signup', (req, res) => {
  const { username, password } = req.body; // this works if bodyParser.json() middleware is set

  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).send('Database error');
      }
      if (results.length > 0) {
        return res.send('Username already taken');
      } else {
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
          if (err) {
            console.error('DB insert error:', err);
            return res.status(500).send('Database error');
          }
          return res.send('User registered successfully!');
        });
      }
    });
  } else {
    res.send('Please enter Username and Password');
  }
});

app.get('/profile', (req, res) => {
  if (req.session.loggedin) {
    res.json({
      username: req.session.username,
      email: `${req.session.username.toLowerCase()}@example.com`,
      memberSince: 'Jan 12, 2024' // You can make this dynamic if stored in DB
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
