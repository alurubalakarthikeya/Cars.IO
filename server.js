const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/auth", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
            (err, results) => {
                if (err) {
                    console.error("DB error:", err);
                    return res.status(500).send("Database error");
                }

                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userId = results[0].id;
                    return res.redirect("/home");
                } else {
                    return res.send("Incorrect Username or Password");
                }
            }
        );
    } else {
        res.send("Please enter Username and Password");
    }
});

app.get("/home", (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, "private", "home.html"));
    } else {
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});

// Updated /mycars route with 'brand' instead of 'name'
app.get("/mycars", (req, res) => {
    if (!req.session.loggedin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.session.userId;

    // First, fetch user info (e.g., username)
    db.query(
        "SELECT username FROM users WHERE id = ?",
        [userId],
        (userErr, userResults) => {
            if (userErr || userResults.length === 0) {
                console.error("User lookup failed:", userErr);
                return res
                    .status(500)
                    .json({ error: "Failed to fetch user info" });
            }

            const username = userResults[0].username;

            // Now, fetch car stats and car list
            db.query(
                `SELECT 
                    COUNT(DISTINCT model) AS modelCount,
                    COUNT(*) AS totalInStock
                 FROM cars 
                 WHERE user_id = ?`,
                [userId],
                (countErr, countResults) => {
                    if (countErr) {
                        console.error("Stats query failed:", countErr);
                        return res
                            .status(500)
                            .json({ error: "Failed to fetch car stats" });
                    }

                    const stats = countResults[0];

                    db.query(
                        "SELECT brand, model, year, mileage, color, price FROM cars WHERE user_id = ?",
                        [userId],
                        (carErr, carResults) => {
                            if (carErr) {
                                console.error("Car fetch failed:", carErr);
                                return res
                                    .status(500)
                                    .json({ error: "Failed to fetch cars" });
                            }

                            // Send response
                            res.json({
                                username,
                                modelCount: stats.modelCount,
                                totalInStock: stats.totalInStock,
                                cars: carResults,
                            });
                        }
                    );
                }
            );
        }
    );
});

// Optional: Add car route to support adding cars (brand, model, year)
app.post("/addcar", (req, res) => {
    if (!req.session.loggedin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.session.userId;
    const { brand, model, year } = req.body;

    if (!brand || !model || !year) {
        return res.status(400).json({ error: "Missing car data" });
    }

    db.query(
        "INSERT INTO cars (brand, model, year, user_id) VALUES (?, ?, ?, ?)",
        [brand, model, year, userId],
        (err) => {
            if (err) {
                console.error("DB insert error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "Car added successfully" });
        }
    );
});

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, results) => {
                if (err) {
                    console.error("DB error:", err);
                    return res.status(500).send("Database error");
                }
                if (results.length > 0) {
                    return res.send("Username already taken");
                } else {
                    db.query(
                        "INSERT INTO users (username, password) VALUES (?, ?)",
                        [username, password],
                        (err) => {
                            if (err) {
                                console.error("DB insert error:", err);
                                return res.status(500).send("Database error");
                            }
                            return res.send("User registered successfully!");
                        }
                    );
                }
            }
        );
    } else {
        res.send("Please enter Username and Password");
    }
});

app.get("/profile", (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.json({
        username: user.username,
        email: user.email,
        memberSince: user.createdAt.toDateString(),
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
