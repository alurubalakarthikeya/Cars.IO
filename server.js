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

    // Step 1: Get the username
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

            // Step 2: Get model count for this user
            const modelCountQuery = `
                SELECT COUNT(DISTINCT c.model) AS modelCount
                FROM cars c
                JOIN user_cars uc ON c.car_id = uc.car_id
                WHERE uc.user_id = ?
            `;

            db.query(modelCountQuery, [userId], (modelErr, modelResults) => {
                if (modelErr) {
                    console.error("Model count failed:", modelErr);
                    return res
                        .status(500)
                        .json({ error: "Failed to fetch model count" });
                }

                const modelCount = modelResults[0].modelCount;

                // Step 3: Get total cars in the whole inventory
                db.query(
                    "SELECT COUNT(*) AS totalInStock FROM cars",
                    (totalErr, totalResults) => {
                        if (totalErr) {
                            console.error("Total count failed:", totalErr);
                            return res
                                .status(500)
                                .json({ error: "Failed to fetch total stock" });
                        }

                        const totalInStock = totalResults[0].totalInStock;

                        // Step 4: Get user's car details
                        db.query(
                            `SELECT c.brand, c.model, c.year, c.mileage, c.color, c.price 
                         FROM cars c
                         JOIN user_cars uc ON c.car_id = uc.car_id
                         WHERE uc.user_id = ?`,
                            [userId],
                            (carErr, carResults) => {
                                if (carErr) {
                                    console.error("Car fetch failed:", carErr);
                                    return res.status(500).json({
                                        error: "Failed to fetch cars",
                                    });
                                }

                                // Final response
                                res.json({
                                    username,
                                    modelCount,
                                    totalInStock,
                                    cars: carResults,
                                });
                            }
                        );
                    }
                );
            });
        }
    );
});

// Optional: Add car route to support adding cars (brand, model, year)
app.post("/addcar", (req, res) => {
    if (!req.session.loggedin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.session.userId;
    const {
        brand,
        model,
        year,
        mileage = 0,
        color = "",
        price = 0,
        stock = 10,
    } = req.body;

    if (!brand || !model || !year) {
        return res.status(400).json({ error: "Missing car data" });
    }

    // Insert into cars first
    db.query(
        "INSERT INTO cars (brand, model, year, mileage, color, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [brand, model, year, mileage, color, price, stock],
        (err, result) => {
            if (err) {
                console.error("DB insert error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const newCarId = result.insertId;

            // Now link the car to the user in user_cars table
            db.query(
                "INSERT INTO user_cars (user_id, car_id) VALUES (?, ?)",
                [userId, newCarId],
                (linkErr) => {
                    if (linkErr) {
                        console.error("User-car link error:", linkErr);
                        return res
                            .status(500)
                            .json({ error: "Failed to link car to user" });
                    }

                    res.status(200).json({ message: "Car added successfully" });
                }
            );
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
    console.log("Session data in /profile:", req.session);
    const userId = req.session.userId; // Correct variable here
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    db.query(
        "SELECT username, email, created_at FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err || results.length === 0) {
                return res
                    .status(500)
                    .json({ error: "Failed to fetch profile" });
            }

            const user = results[0];
            res.json({
                username: user.username,
                email: user.email,
                memberSince: new Date(user.created_at).toDateString(),
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
