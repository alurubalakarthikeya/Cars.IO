const loginForm = document.getElementById("loginForm");

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

document.getElementById("addCarForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Changed from 'name' to 'brand' to match backend
    const brand = document.getElementById("carBrand").value;
    const model = document.getElementById("carModel").value;
    const year = document.getElementById("carYear").value;

    const res = await fetch("/addcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year }),
    });

    if (res.ok) {
        alert("Car added successfully!");
        document.getElementById("carModal").classList.add("hidden");
        loadUserCars(); // Refresh car list after add
    } else {
        alert("Failed to add car.");
    }
});

// 🧠 Dynamic PROFILE LOAD from backend
async function loadProfileHTML() {
    const res = await fetch("/profile");
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

    // Update the counters from the stats returned by backend
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
