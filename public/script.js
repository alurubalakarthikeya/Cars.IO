const loginForm = document.getElementById("loginForm");

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");

            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            try {
                const response = await fetch("/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    window.location.href = response.redirected
                        ? response.url
                        : "/home";
                } else {
                    const errorMsg = await response.text();
                    alert(errorMsg || "Login failed.");
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("Network error. Try again.");
            }
        });
    }
});

// Toggle between login and register forms
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "showRegister") {
        e.preventDefault();

        const rightHalf = document.querySelector(".right-half");
        if (!rightHalf) return;

        rightHalf.innerHTML = `
            <form id="registerForm" method="POST" class="register-form">
                <h2>Register for Car.IO</h2>
                <label>Username:</label>
                <input name="username" type="text" id="reg-username" required />
                <label>Email:</label>
                <input name="email" type="email" id="reg-email" required />
                <label>Password:</label>
                <input name="password" type="password" id="reg-password" required />
                <label>Confirm Password:</label>
                <input type="password" id="reg-confirm" required />
                <div id="registerMessage" style="margin: 10px 0; color: red;"></div>
                <button type="submit">Register</button>
                <p class="yes-sir">Already have an account? <a href="#" id="showLogin">Login here</a></p>
            </form>
        `;

        setTimeout(attachRegisterHandler, 0); // Attach safely
    }
});

document
    .getElementById("changePasswordForm")
    ?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const currentPassword =
            document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const msgBox = document.getElementById("changePasswordMsg");

        if (newPassword !== confirmPassword) {
            msgBox.textContent = "Passwords do not match.";
            msgBox.style.color = "red";
            return;
        }

        try {
            const res = await fetch("/changepassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            msgBox.textContent = data.message || data.error;
            msgBox.style.color = res.ok ? "green" : "red";

            if (res.ok) {
                setTimeout(() => {
                    document
                        .getElementById("changePasswordModal")
                        .classList.add("hidden");
                    e.target.reset();
                    msgBox.textContent = "";
                }, 1500);
            }
        } catch (err) {
            msgBox.textContent = "Something went wrong. Please try again.";
            msgBox.style.color = "red";
        }
    });

document
    .getElementById("confirmDelete")
    ?.addEventListener("click", async () => {
        try {
            const res = await fetch("/deleteaccount", {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                window.location.href = "/";
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Delete failed. Try again.");
        }
    });

document
    .getElementById("closeChangePasswordModal")
    ?.addEventListener("click", () => {
        document.getElementById("changePasswordModal").classList.add("hidden");
    });

document
    .getElementById("closeDeleteAccountModal")
    ?.addEventListener("click", () => {
        document.getElementById("deleteAccountModal").classList.add("hidden");
    });

document.getElementById("cancelDelete")?.addEventListener("click", () => {
    document.getElementById("deleteAccountModal").classList.add("hidden");
});

function attachRegisterHandler() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) {
        console.warn("registerForm not found when trying to attach handler.");
        return;
    }

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("reg-username").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm").value;
        const messageBox = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            messageBox.textContent = "Passwords do not match.";
            messageBox.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const message = await response.text();
            messageBox.textContent = message;
            messageBox.style.color = message.includes("success")
                ? "green"
                : "red";

            if (message.includes("success")) {
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        } catch (err) {
            messageBox.textContent = "An error occurred. Please try again.";
            messageBox.style.color = "red";
        }
    });
}

// Register Handler (delegated)
document.addEventListener("submit", async function (e) {
    if (e.target && e.target.id === "registerForm") {
        e.preventDefault();

        const username = document.getElementById("reg-username").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;

        const messageBox = document.getElementById("registerMessage");

        if (password !== confirm) {
            messageBox.textContent = "Passwords do not match.";
            messageBox.style.color = "red";
            return;
        }

        try {
            const res = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const msg = await res.text();
            messageBox.textContent = msg;
            messageBox.style.color = msg.includes("success") ? "green" : "red";

            if (msg.includes("success")) {
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        } catch (err) {
            messageBox.textContent = "Error during registration.";
            messageBox.style.color = "red";
        }
    }
});

// CAR LOGO SCROLL EFFECT
window.addEventListener("scroll", () => {
    const car = document.getElementById("car");
    const logo = document.querySelector(".logo");
    if (!car || !logo) return;
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolledPercent = (scrollTop / docHeight) * 100;
    const logoWidth = logo.clientWidth;
    const carWidth = car.clientWidth;
    const initialLeft = 85;
    const maxLeft = logoWidth - carWidth - 20;
    const travelDistance = maxLeft - initialLeft;
    const carLeft = initialLeft + (scrolledPercent / 100) * travelDistance;
    car.style.left = `${carLeft}px`;
});

// NAVBAR TOGGLE
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}

// MODAL HANDLERS
document.querySelectorAll(".openModalBtn").forEach((button) => {
    button.addEventListener("click", () => {
        document.getElementById("carModal").classList.remove("hidden");
    });
});

document.getElementById("openModalBtn")?.addEventListener("click", () => {
    document.getElementById("carModal").classList.remove("hidden");
});

document.getElementById("closeModalBtn")?.addEventListener("click", () => {
    document.getElementById("carModal").classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "/logout";
        });
    }
});

const addCarForm = document.getElementById("addCarForm");
if (addCarForm) {
    addCarForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get values from form inputs, trim strings
        const brand = document.getElementById("carName").value.trim();
        const model = document.getElementById("carModel").value.trim();
        const year = parseInt(document.getElementById("carYear").value);
        const price = parseFloat(document.getElementById("carPrice").value);
        const stock = 10;
        const mileage = parseInt(
            document.getElementById("carMileage")?.value || "0"
        );
        const color = document.getElementById("carColor")?.value.trim() || "";

        // Basic validation
        if (!brand || !model) {
            alert("Please enter both brand and model.");
            return;
        }
        if (isNaN(year) || year < 1886) {
            // First car invented ~1886
            alert("Please enter a valid year.");
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid positive price.");
            return;
        }
        if (isNaN(stock) || stock < 0) {
            alert("Please enter a valid stock number (0 or more).");
            return;
        }
        if (isNaN(mileage) || mileage < 0) {
            alert("Please enter a valid mileage (0 or more).");
            return;
        }

        // Prepare data payload
        const carData = { brand, model, year, price, stock, mileage, color };

        try {
            const res = await fetch("/addcar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(carData),
            });

            if (res.ok) {
                alert("Car added successfully!");
                document.getElementById("carModal").classList.add("hidden");
                e.target.reset();
                loadUserCars(); // Reload cars after adding
            } else {
                const errText = await res.text();
                alert("Failed to add car: " + errText);
            }
        } catch (err) {
            alert("Error while adding car: " + err.message);
        }
    });
}

// 🧠 Dynamic PROFILE LOAD from backend
async function loadProfileHTML() {
    const res = await fetch("/profile", {
        credentials: "include", // ✅ This ensures the session cookie is sent
    });
    if (!res.ok) {
        document.getElementById("mainContentArea").innerHTML =
            "<p>Please login to see profile.</p>";
        return;
    }
    const data = await res.json();
    document.getElementsByClassName("username")[0].innerText = data.username;

    const profileHTML = `
        <div class="profile-container info-box">
            <h2>Your Profile</h2>
            <div class="profile-section">
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Member Since:</strong> ${data.memberSince}</p>
            </div>
            <div class="profile-section">
            <h3>Recent Activity</h3>
            <ul class="profile-list">
                <li>Added Ford Mustang - May 11, 2025</li>
                <li>Deleted Honda Civic - May 9, 2025</li>
                <li>Updated BMW X5 - May 6, 2025</li>
            </ul>
            </div>
            <div class="profile-section">
            <h3>Login History</h3>
            <ul class="profile-list">
                <li>May 13, 2025 - Bangalore, KA, IND</li>
                <li>May 11, 2025 - Chennai, TN, IND</li>
                <li>May 10, 2025 - Hyderabad, TG, IND</li>
            </ul>
            </div>
            <div class="profile-section">
            <h3>Account</h3>
            <button class="add-car-btn" id="changePasswordBtn">Change Password</button>
            <button class="profile-btn danger" id="deleteAccountBtn">Delete Account</button>
            </div>
        </div>
        `;

    document.getElementById("mainContentArea").innerHTML = profileHTML;
}

// 🧠 Dynamic Car Table Load from backend API `/mycars`
async function loadUserCars() {
    try {
        const res = await fetch("/mycars");
        if (!res.ok) {
            document.getElementById("mainContentArea").innerHTML =
                "<p>Please login to see your cars.</p>";
            document.getElementById("totalModels").innerText = "0";
            document.getElementById("totalStock").innerText = "0";
            return;
        }

        const data = await res.json();

        if (!data.cars || data.cars.length === 0) {
            document.getElementById("mainContentArea").innerHTML =
                "<p>No cars found for your account.</p>";
            document.getElementById("totalModels").innerText = "0";
            document.getElementById("totalStock").innerText = "0";
            return;
        }

        // Update username display (optional)
        const userSpan = document.querySelector(".username");
        if (userSpan && data.username) {
            userSpan.innerText = data.username;
        }

        // Update stats counters
        document.getElementById("totalModels").innerText = data.modelCount;
        document.getElementById("totalStock").innerText = data.totalInStock;

        // Build table of cars
        let carsHTML = `
          <table>
              <thead>
                  <tr>
                      <th>Brand</th><th>Model</th><th>Year</th><th>Mileage</th><th>Color</th><th>Price</th>
                  </tr>
              </thead>
              <tbody>
      `;

        data.cars.forEach((car) => {
            carsHTML += `
              <tr>
                  <td>${car.brand}</td>
                  <td>${car.model}</td>
                  <td>${car.year}</td>
                  <td>${car.mileage}</td>
                  <td>${car.color}</td>
                  <td>$${car.price}</td>
              </tr>
          `;
        });

        carsHTML += "</tbody></table>";

        // Calculate Quick Stats dynamically
        const totalStock = data.cars.reduce(
            (acc, car) => acc + (car.stock || 1),
            0
        );
        const totalWorth = data.cars.reduce(
            (acc, car) => acc + (car.price || 0) * (car.stock || 1),
            0
        );

        let topModelCar = data.cars.reduce(
            (prev, curr) => (curr.price > prev.price ? curr : prev),
            data.cars[0]
        );
        const mostExpensive = topModelCar.price;
        const mostAffordable = data.cars.reduce(
            (min, car) => (car.price < min ? car.price : min),
            data.cars[0].price
        );
        const topModel =
            topModelCar.model +
            (topModelCar.brand ? ` ${topModelCar.brand}` : "");

        // Update Quick Stats in sidebar
        document.getElementById("quickTotalStock").textContent =
            totalStock.toLocaleString();
        document.getElementById("quickTotalWorth").textContent =
            totalWorth.toLocaleString();
        document.getElementById("quickTopModel").textContent = topModel;
        document.getElementById("quickMostExpensive").textContent =
            mostExpensive.toLocaleString();
        document.getElementById("quickMostAffordable").textContent =
            mostAffordable.toLocaleString();

        // LOW STOCK ALERTS
        const lowStockList = document.getElementById("low-stock-list");
        const lowStockCars = data.cars.filter(
            (car) => car.stock !== undefined && car.stock <= 5
        );

        if (lowStockCars.length > 0) {
            lowStockList.innerHTML = lowStockCars
                .map(
                    (car) =>
                        `<li><strong>${car.brand} ${car.model}</strong> — only ${car.stock} left</li>`
                )
                .join("");
        } else {
            lowStockList.innerHTML = `<li>All stocks are healthy 🚗✅</li>`;
        }

        // RECOMMENDATIONS
        const allCarsRes = await fetch("/allcars");
        if (!allCarsRes.ok) {
            console.error("Failed to load all cars for recommendations");
            document.getElementById(
                "recommendations-list"
            ).innerHTML = `<li>No recommendations available</li>`;
        } else {
            const allCarsData = await allCarsRes.json();
            const userCars = data.cars;

            // Normalize key helper
            const normalizeKey = (car) =>
                `${car.brand?.trim().toLowerCase()}-${car.model
                    ?.trim()
                    .toLowerCase()}`;

            const userCarSet = new Set(userCars.map(normalizeKey));

            console.log("User car keys:", [...userCarSet]);

            // Filter recommendations:
            // - Car not in user's list
            // - Price < 15000 OR year < 2015 OR mileage < 50000
            let recommendedCars = allCarsData.cars.filter((car) => {
                const key = normalizeKey(car);
                return (
                    !userCarSet.has(key) &&
                    (car.price < 15000 ||
                        car.year < 2015 ||
                        car.mileage < 50000)
                );
            });

            console.log("Recommended cars filtered:", recommendedCars);

            // Fallback #1: Recommend cars user doesn't have (ignore price/year/mileage filters)
            if (recommendedCars.length === 0) {
                recommendedCars = allCarsData.cars.filter((car) => {
                    const key = normalizeKey(car);
                    return !userCarSet.has(key);
                });
                console.log(
                    "Recommended cars fallback #1 (any not owned):",
                    recommendedCars
                );
            }

            // Fallback #2: Random 3 cars if none found
            if (recommendedCars.length === 0) {
                const shuffled = allCarsData.cars
                    .slice()
                    .sort(() => 0.5 - Math.random());
                recommendedCars = shuffled.slice(0, 3);
                console.log(
                    "Recommended cars fallback #2 (random):",
                    recommendedCars
                );
            }

            recommendedCars = recommendedCars.slice(0, 2);

            const recommendationsList = document.getElementById(
                "recommendations-list"
            );
            if (recommendedCars.length > 0) {
                recommendationsList.innerHTML = ""; // clear previous

                recommendedCars.forEach((car) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
              <strong>${car.brand} ${car.model}</strong> — $${car.price}, ${car.year}, ${car.mileage} miles
              <i class="fa-solid fa-plus blue add-recommendation-btn" title="Add to my cars" style="cursor:pointer; margin-left:10px;"></i>
            `;

                    li.querySelector(
                        ".add-recommendation-btn"
                    ).addEventListener("click", async () => {
                        try {
                            const carData = {
                                brand: car.brand,
                                model: car.model,
                                year: car.year,
                                price: car.price,
                                stock: car.stock !== undefined ? car.stock : 10,
                                mileage: car.mileage,
                                color: car.color || "Unknown",
                            };

                            const res = await fetch("/addcar", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(carData),
                                credentials: "include",
                            });

                            if (res.ok) {
                                alert(
                                    `${car.brand} ${car.model} added successfully!`
                                );
                                loadUserCars();
                            } else {
                                const errText = await res.text();
                                alert("Failed to add car: " + errText);
                            }
                        } catch (err) {
                            alert("Error adding car: " + err.message);
                        }
                    });

                    recommendationsList.appendChild(li);
                });
            } else {
                recommendationsList.innerHTML = `<li>No recommendations for now 🔍</li>`;
            }
        }

        // Render main user cars table
        document.getElementById("mainContentArea").innerHTML = carsHTML;
    } catch (error) {
        console.error("Error loading user cars:", error);
        document.getElementById(
            "mainContentArea"
        ).innerHTML = `<p>Error loading cars data.</p>`;
    }
}

// Admin view
async function loadAdminView() {
    try {
        const res = await fetch("/admin/users-with-cars", {
            credentials: "include",
        });
        if (!res.ok) throw new Error("Access denied");

        const data = await res.json();
        let html = `<div class="admin-dashboard">
                      <h2 class="admin-header">All Users & Their Cars</h2>`;

        for (const [username, info] of Object.entries(data)) {
            html += `
                <div class="admin-user-card">
                    <h3>${username} <span class="admin-user-email">&lt;${
                info.email
            }&gt;</span></h3>
                    ${
                        info.cars.length === 0
                            ? "<p class='no-cars'>No cars linked.</p>"
                            : `<table class="admin-car-table">
    <thead>
        <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Mileage</th>
            <th>Color</th>
            <th>Price</th>
            <th>Salesperson</th>
            <th>Salesperson ID</th>
            <th>Transaction #</th>
        </tr>
    </thead>
    <tbody>
        ${info.cars
            .map(
                (car) => `
            <tr>
                <td>${car.brand}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.mileage}</td>
                <td>${car.color}</td>
                <td>$${car.price}</td>
                <td>${car.salesperson_name || "-"}</td>
                <td>${car.salesperson_id || "-"}</td>
                <td>${car.transaction_number || "-"}</td>
            </tr>
        `
            )
            .join("")}
    </tbody>
</table>
`
                    }
                </div>
            `;
        }

        html += "</div>";
        document.getElementById("mainContentArea").innerHTML = html;
    } catch (err) {
        console.error("Failed to load admin view:", err.message);
        document.getElementById("mainContentArea").innerHTML =
            "<p>Access denied or error fetching data.</p>";
    }
}

// Helper to set active nav class
function setActive(navId) {
    document
        .querySelectorAll("#navMenu li")
        .forEach((li) => li.classList.remove("active"));
    document.getElementById(navId).classList.add("active");
}

// Nav event handlers
document.getElementById("navProfile")?.addEventListener("click", () => {
    loadProfileHTML();
    setActive("navProfile");
});

document.getElementById("navMyCars")?.addEventListener("click", () => {
    loadUserCars();
    setActive("navMyCars");
});

// Modal closing and other modal button handlers
const changePasswordModal = document.getElementById("changePasswordModal");
const deleteAccountModal = document.getElementById("deleteAccountModal");

document.addEventListener("click", function (e) {
    if (e.target.id === "changePasswordBtn") {
        changePasswordModal?.classList.remove("hidden");
    }
    if (e.target.id === "deleteAccountBtn") {
        deleteAccountModal?.classList.remove("hidden");
    }
    if (e.target.id === "closeChangePasswordModal") {
        changePasswordModal?.classList.add("hidden");
    }
    if (
        e.target.id === "closeDeleteAccountModal" ||
        e.target.id === "cancelDelete"
    ) {
        deleteAccountModal?.classList.add("hidden");
    }
    if (e.target.id === "confirmDelete") {
        deleteAccountModal?.classList.add("hidden");
    }
});

// navAdmin view event handler
document.getElementById("navAdminView")?.addEventListener("click", () => {
    loadAdminView();
    setActive("navAdminView");
});

// Initial page load
window.onload = () => {
    // Check if we are on the home page by checking for a known element
    const mainContent = document.getElementById("mainContentArea");
    if (mainContent) {
        loadUserCars();

        fetch("/profile", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                const userSpan = document.querySelector(".username");
                if (userSpan) userSpan.innerText = data.username;
            })
            .catch((err) => {
                console.warn(
                    "Not logged in or failed to fetch profile:",
                    err.message
                );
            });
    }

    fetch("/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
            if (data.username && document.getElementById("navAdminView")) {
                // Try fetch admin data to check if user is admin
                fetch("/admin/users-with-cars", {
                    credentials: "include",
                }).then((r) => {
                    if (r.ok) {
                        document.getElementById("navAdminView").style.display =
                            "block";
                    }
                });
            }
        });

    fetch("/admin/users-with-cars", { credentials: "include" }).then((r) => {
        if (r.ok) {
            document.getElementById("navAdminView").classList.remove("hidden");
        }
    });
};
