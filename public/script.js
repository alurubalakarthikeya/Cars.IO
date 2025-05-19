const loginForm = document.getElementById("loginForm");

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ⬅️ Crucial to send cookies/session
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // Check if backend redirected
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    // If no redirect, you can manually change page
                    window.location.href = "/home";
                }
            } else {
                const errorMsg = await response.text();
                alert(errorMsg || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Network error. Try again.");
        }
    });
});

// Toggle between login and register forms
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "showRegister") {
        e.preventDefault();
        loginForm.innerHTML = `
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
            <button type="submit">Register</button>
            <p class="yes-sir">Already have an account? <a href="#" id="showLogin">Login here</a></p>
            </form>
        `;
    }

    if (e.target && e.target.id === "showLogin") {
        e.preventDefault();
        loginForm.innerHTML = `
            <form id="loginForm">
            <h2>Login Car.IO</h2>
            <label>Username:</label>
            <input type="text" id="username" required />
            <label>Password:</label>
            <input type="password" id="password" required />
            <p class="yes-sir"><a href="reset-password.html">Forgot password?</a></p>
            <button type="submit">Login</button>
            <p class="yes-sir">Don't have an account? <a href="#" id="showRegister">Register here</a></p>
            </form>
        `;
    }
});

// Register Handler (delegated)
document.addEventListener("submit", async function (e) {
    if (e.target && e.target.id === "registerForm") {
        e.preventDefault();
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;

        if (password !== confirm) {
            return alert("Passwords do not match.");
        }

        // <-- Updated to POST to /signup, matching backend
        const res = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const msg = await res.text();
        alert(msg);
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

document.getElementById("addCarForm").addEventListener("submit", async (e) => {
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

    // Update username display (optional, if you want to show here)
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
    ); // sum stock or count as 1 if no stock field
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
        topModelCar.model + (topModelCar.brand ? ` ${topModelCar.brand}` : "");

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

    document.getElementById("mainContentArea").innerHTML = carsHTML;
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
        alert("Account deleted. (You can add backend logic here)");
        deleteAccountModal?.classList.add("hidden");
    }
});

// Initial page load
window.onload = () => {
    // Load user's cars by default on home
    loadUserCars();

    // Set username in the welcome text
    fetch("/profile")
        .then((res) => res.json())
        .then((data) => {
            const userSpan = document.querySelector(".username");
            if (userSpan) userSpan.innerText = data.username;
        })
        .catch((err) => console.error("Failed to fetch username:", err));
};
