const loginForm = document.getElementById("loginForm");

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

    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const msg = await res.text();
    alert(msg);
  }
});

// CAR LOGO SCROLL EFFECT
window.addEventListener('scroll', () => {
  const car = document.getElementById('car');
  const logo = document.querySelector('.logo');
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
document.querySelectorAll(".openModalBtn").forEach(button => {
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

document.getElementById("addCarForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Car added!");
  document.getElementById("carModal").classList.add("hidden");
});

// 🧠 Dynamic PROFILE LOAD from backend
async function loadProfileHTML() {
  const res = await fetch('/profile');
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

// 🧠 Dummy Table Load
const carTableHTML = `
  <div class="table-container" id="carTable">
    <table>
      <thead>
        <tr>
          <th>Car Name</th>
          <th>Model</th>
          <th>Year</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Tesla</td><td>Model 3</td><td>2023</td><td>₹40,24,670</td><td>15</td></tr>
        <tr><td>BMW</td><td>X5</td><td>2021</td><td>₹49,80,000</td><td>7</td></tr>
        <tr><td>Audi</td><td>A4</td><td>2022</td><td>₹34,86,000</td><td>12</td></tr>
        <tr><td>Ford</td><td>Mustang</td><td>2023</td><td>₹45,89,900</td><td>5</td></tr>
        <tr><td>Toyota</td><td>Camry</td><td>2020</td><td>₹22,41,000</td><td>20</td></tr>
        <tr><td>Mercedes-Benz</td><td>C-Class</td><td>2022</td><td>₹37,22,550</td><td>8</td></tr>
        <tr><td>Hyundai</td><td>Ioniq 5</td><td>2023</td><td>₹34,40,350</td><td>10</td></tr>
        <tr><td>Kia</td><td>EV6</td><td>2023</td><td>₹40,41,100</td><td>6</td></tr>
        <tr><td>Chevrolet</td><td>Silverado</td><td>2021</td><td>₹32,45,300</td><td>11</td></tr>
        <tr><td>Nissan</td><td>Altima</td><td>2022</td><td>₹21,58,000</td><td>14</td></tr>
      </tbody>
    </table>
  </div>
`;

function setActive(navId) {
  document.querySelectorAll("#navMenu li").forEach(li => li.classList.remove("active"));
  document.getElementById(navId).classList.add("active");
}

document.getElementById("navProfile")?.addEventListener("click", () => {
  loadProfileHTML();
  setActive("navProfile");
});

document.getElementById("navMyCars")?.addEventListener("click", () => {
  document.getElementById("mainContentArea").innerHTML = carTableHTML;
  setActive("navMyCars");
});

window.onload = () => {
  const area = document.getElementById("mainContentArea");
  if (area) area.innerHTML = carTableHTML;
};

// MODAL CLOSING EVENTS
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
  if (e.target.id === "closeDeleteAccountModal" || e.target.id === "cancelDelete") {
    deleteAccountModal?.classList.add("hidden");
  }
  if (e.target.id === "confirmDelete") {
    alert("Account deleted. (You can add backend logic here)");
    deleteAccountModal?.classList.add("hidden");
  }
});

window.onload = () => {
  // Load car table by default
  document.getElementById("mainContentArea").innerHTML = carTableHTML;

  // Set username in the welcome text
  fetch('/profile')
    .then(res => res.json())
    .then(data => {
      const userSpan = document.querySelector(".username");
      if (userSpan) userSpan.innerText = data.username;
    })
    .catch(err => console.error("Failed to fetch username:", err));
};

