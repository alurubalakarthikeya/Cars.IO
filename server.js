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

app.get("/admin/users-with-cars", (req, res) => {
    if (!req.session.loggedin || !req.session.isAdmin) {
        return res.status(403).json({ error: "Access denied" });
    }

    const query = `
    SELECT 
        u.username, u.email, 
        c.brand, c.model, c.year, c.mileage, c.color, c.price,
        t.salesperson_name, t.salesperson_id, t.transaction_number
    FROM users u
    LEFT JOIN user_cars uc ON u.id = uc.user_id
    LEFT JOIN cars c ON uc.car_id = c.car_id
    LEFT JOIN transactions t ON t.user_id = u.id AND t.car_id = c.car_id
    ORDER BY u.username;
`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Admin fetch error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Group cars by user
        const users = {};
        results.forEach((row) => {
            if (!users[row.username]) {
                users[row.username] = {
                    email: row.email,
                    cars: [],
                };
            }
            if (row.brand) {
                users[row.username].cars.push({
                    brand: row.brand,
                    model: row.model,
                    year: row.year,
                    mileage: row.mileage,
                    color: row.color,
                    price: row.price,
                    salesperson_name: row.salesperson_name,
                    salesperson_id: row.salesperson_id,
                    transaction_number: row.transaction_number,
                });
            }
        });

        res.json(users);
    });
});

app.post("/auth", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Please enter Username and Password");
    }

    // First check if user exists
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
            if (err) {
                console.error("DB error:", err);
                return res.status(500).send("Database error");
            }

            if (results.length === 0) {
                return res.status(401).send("User does not exist");
            }

            const user = results[0];

            // Check password
            if (user.password !== password) {
                return res.status(401).send("Incorrect password");
            }

            // Login successful
            req.session.loggedin = true;
            req.session.username = username;
            req.session.userId = user.id;
            req.session.isAdmin = user.is_admin;
            res.redirect("/home");
        }
    );
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

app.get("/allcars", (req, res) => {
    if (!req.session.loggedin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    db.query(
        "SELECT brand, model, year, mileage, color, price, stock FROM cars",
        (err, results) => {
            if (err) {
                console.error("Failed to fetch all cars:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({ cars: results });
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

    // Step 1: Check if the car already exists
    db.query(
        "SELECT car_id FROM cars WHERE brand = ? AND model = ? AND year = ?",
        [brand, model, year],
        (err, results) => {
            if (err) {
                console.error("DB lookup error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length > 0) {
                // Car exists, get car_id
                const existingCarId = results[0].car_id;

                // Step 2: Link this car to the user if not linked already
                db.query(
                    "SELECT * FROM user_cars WHERE user_id = ? AND car_id = ?",
                    [userId, existingCarId],
                    (linkErr, linkResults) => {
                        if (linkErr) {
                            console.error(
                                "User-car link check error:",
                                linkErr
                            );
                            return res
                                .status(500)
                                .json({ error: "Database error" });
                        }

                        if (linkResults.length > 0) {
                            // Already linked
                            return res
                                .status(400)
                                .json({ error: "Car already linked to user" });
                        } else {
                            // Insert link
                            db.query(
                                "INSERT INTO user_cars (user_id, car_id) VALUES (?, ?)",
                                [userId, existingCarId],
                                (insertLinkErr) => {
                                    if (insertLinkErr) {
                                        console.error(
                                            "Link insert error:",
                                            insertLinkErr
                                        );
                                        return res.status(500).json({
                                            error: "Failed to link car to user",
                                        });
                                    }
                                    return res.status(200).json({
                                        message:
                                            "Car linked to user successfully",
                                    });
                                }
                            );
                        }
                    }
                );
            } else {
                // Car doesn't exist, insert new car
                db.query(
                    "INSERT INTO cars (brand, model, year, mileage, color, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [brand, model, year, mileage, color, price, stock],
                    (insertErr, insertResult) => {
                        if (insertErr) {
                            console.error("DB insert error:", insertErr);
                            return res
                                .status(500)
                                .json({ error: "Database error" });
                        }

                        const newCarId = insertResult.insertId;

                        // Link new car to user
                        db.query(
                            "INSERT INTO user_cars (user_id, car_id) VALUES (?, ?)",
                            [userId, newCarId],
                            (linkErr) => {
                                if (linkErr) {
                                    console.error(
                                        "User-car link error:",
                                        linkErr
                                    );
                                    return res.status(500).json({
                                        error: "Failed to link car to user",
                                    });
                                }

                                res.status(200).json({
                                    message:
                                        "Car added and linked successfully",
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

app.post("/changepassword", (req, res) => {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err || results.length === 0) {
                return res
                    .status(500)
                    .json({ error: "Database error or user not found" });
            }

            const storedPassword = results[0].password;
            if (storedPassword !== currentPassword) {
                return res
                    .status(400)
                    .json({ error: "Incorrect current password" });
            }

            db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [newPassword, userId],
                (updateErr) => {
                    if (updateErr) {
                        console.error("Password update error:", updateErr);
                        return res
                            .status(500)
                            .json({ error: "Failed to update password" });
                    }

                    return res.json({
                        message: "Password updated successfully",
                    });
                }
            );
        }
    );
});

app.delete("/deleteaccount", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Optional: You may want to delete from user_cars or other related tables first if FK constraints exist
    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) {
            console.error("Delete account error:", err);
            return res.status(500).json({ error: "Failed to delete account" });
        }

        // Destroy session after deletion
        req.session.destroy(() => {
            res.json({ message: "Account deleted successfully" });
        });
    });
});

app.post("/signup", (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.send("Please enter Username, Email, and Password");
    }

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
            if (err) {
                console.error("Error checking username:", err);
                return res.status(500).send("Database error (username check)");
            }

            if (results.length > 0) {
                return res.send("Username already taken");
            }

            db.query(
                "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                [username, password, email],
                (insertErr) => {
                    if (insertErr) {
                        console.error("Error inserting user:", insertErr);
                        /* return res.status(500).send("Database error (insert)"); */
                    }

                    return res.send("User registered successfully!");
                }
            );
        }
    );
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
