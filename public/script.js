const loginForm = document.getElementById("loginForm");

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "showRegister") {
    e.preventDefault();
    loginForm.innerHTML = `
      <form action="/signup" method="POST" class="register-form">
        <h2>Register for Car.IO</h2>
        <label>Username:</label>
        <input name="username" type="text" id="reg-username" required />
        <label>Email:</label>
        <input type="email" required />
        <label>Password:</label>
        <input name="password" type="password" id="reg-password" required />
        <label>Confirm Password:</label>
        <input type="password" required />
        <button type="submit">Register</button>
        <p class="yes-sir">Already have an account? <a href="#" id="showLogin">Login here</a></p>
      </form>
    `;
  }

  if (e.target && e.target.id === "showLogin") {
    e.preventDefault();
    loginForm.innerHTML = `
      <h2>Login Car.IO</h2>
  <label>Username:</label>
  <input type="text" id="username" required />
  <label>Password:</label>
  <input type="password" id="password" required />
  <p class="yes-sir"><a href="reset-password.html">Forgot password?</a></p>
  <button type="submit">Login</button>
  <p class="yes-sir">Don't have an account? <a href="#" id="showRegister">Register here</a></p>
    `;
  }
});

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

  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  
document.getElementById("openModalBtn").addEventListener("click", () => {
  document.getElementById("carModal").classList.remove("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("carModal").classList.add("hidden");
});

document.getElementById("addCarForm").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Car added!");
  document.getElementById("carModal").classList.add("hidden");
});

document.querySelectorAll(".openModalBtn").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("carModal").classList.remove("hidden");
  });
});

const profileHTML = `
      <div class="profile-container info-box">
        <h2>Your Profile</h2>
        <div class="profile-section">
          <p><strong>Username:</strong> Carty</p>
          <p><strong>Email:</strong> carty@example.com</p>
          <p><strong>Member Since:</strong> Jan 12, 2024</p>
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
          <button class="add-car-btn">Change Password</button>
          <button class="profile-btn danger">Delete Account</button>
        </div>
      </div>

    `;

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
            <tr><td>Tesla</td><td>Model 3</td><td>2023</td><td>$48,490</td><td>15</td></tr>
            <tr><td>BMW</td><td>X5</td><td>2021</td><td>$60,000</td><td>7</td></tr>
            <tr><td>Audi</td><td>A4</td><td>2022</td><td>$42,000</td><td>12</td></tr>
            <tr><td>Ford</td><td>Mustang</td><td>2023</td><td>$55,300</td><td>5</td></tr>
            <tr><td>Toyota</td><td>Camry</td><td>2020</td><td>$27,000</td><td>20</td></tr>
            <tr><td>Mercedes-Benz</td><td>C-Class</td><td>2022</td><td>$44,850</td><td>8</td></tr>
            <tr><td>Hyundai</td><td>Ioniq 5</td><td>2023</td><td>$41,450</td><td>10</td></tr>
            <tr><td>Kia</td><td>EV6</td><td>2023</td><td>$48,700</td><td>6</td></tr>
            <tr><td>Chevrolet</td><td>Silverado</td><td>2021</td><td>$39,100</td><td>11</td></tr>
            <tr><td>Nissan</td><td>Altima</td><td>2022</td><td>$26,000</td><td>14</td></tr>
          </tbody>
        </table>
      </div>
    `;

    function setActive(navId) {
      document.querySelectorAll("#navMenu li").forEach(li => li.classList.remove("active"));
      document.getElementById(navId).classList.add("active");
    }

    document.getElementById("navProfile").addEventListener("click", () => {
      document.getElementById("mainContentArea").innerHTML = profileHTML;
      setActive("navProfile");
    });

    document.getElementById("navMyCars").addEventListener("click", () => {
      document.getElementById("mainContentArea").innerHTML = carTableHTML;
      setActive("navMyCars");
    });

    window.onload = () => {
      document.getElementById("mainContentArea").innerHTML = carTableHTML;
    };

    // Modal references
const changePasswordModal = document.getElementById("changePasswordModal");
const deleteAccountModal = document.getElementById("deleteAccountModal");

document.addEventListener("click", function (e) {
  // Change Password
  if (e.target.textContent.includes("Change Password")) {
    changePasswordModal.classList.remove("hidden");
  }

  // Delete Account
  if (e.target.textContent.includes("Delete Account")) {
    deleteAccountModal.classList.remove("hidden");
  }

  // Close buttons
  if (e.target.id === "closeChangePasswordModal") {
    changePasswordModal.classList.add("hidden");
  }

  if (e.target.id === "closeDeleteAccountModal" || e.target.id === "cancelDelete") {
    deleteAccountModal.classList.add("hidden");
  }

  // Confirm delete
  if (e.target.id === "confirmDelete") {
    alert("Account deleted. (You can add backend logic here)");
    deleteAccountModal.classList.add("hidden");
  }
});

// Inside your dynamic form submit handler in script.js
const formData = {
  username: document.querySelector('#reg-username').value,
  password: document.querySelector('#reg-password').value
};

fetch('/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(response => response.text())
.then(data => {
  alert(data); 
})
.catch(error => console.error('Error:', error));

