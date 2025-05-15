const loginForm = document.getElementById("loginForm");

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "showRegister") {
    e.preventDefault();
    loginForm.innerHTML = `
      <form class="register-form">
        <h2>Register for Car.IO</h2>
        <label>Username:</label>
        <input type="text" required />
        <label>Email:</label>
        <input type="email" required />
        <label>Password:</label>
        <input type="password" required />
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
  document.addEventListener("submit", function (e) {
  if (e.target && e.target.classList.contains("login-form")) {
    e.preventDefault();
    const username = document.querySelector(".login-form input[type='text']").value;
    const password = document.querySelector(".login-form input[type='password']").value;

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error("Invalid credentials");
    })
    .then(data => {
      if (data.success) {
        window.location.href = "/home";
      }
    })
    .catch(err => {
      alert(err.message);
    });
  }
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

// Save original car table HTML (on load)
const carTableHTML = document.getElementById("carTable").outerHTML;

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
        <li>May 13, 2025 - New York, NY</li>
        <li>May 11, 2025 - Mobile App</li>
        <li>May 10, 2025 - Los Angeles, CA</li>
      </ul>
    </div>

    <div class="profile-section">
      <h3>Account</h3>
      <button class="profile-btn">Change Password</button>
      <button class="profile-btn danger">Delete Account</button>
    </div>
  </div>
`;


document.getElementById("navProfile").addEventListener("click", () => {
  document.getElementById("mainView").innerHTML = profileHTML;
});

document.getElementById("navMyCars").addEventListener("click", () => {
  document.getElementById("mainView").innerHTML = carTableHTML;
});

function setActive(navId) {
  document.querySelectorAll("#navMenu li").forEach(li => li.classList.remove("active"));
  document.getElementById(navId).classList.add("active");
}

document.getElementById("navProfile").addEventListener("click", () => {
  document.getElementById("mainView").innerHTML = profileHTML;
  setActive("navProfile");
});

document.getElementById("navMyCars").addEventListener("click", () => {
  document.getElementById("mainView").innerHTML = carTableHTML;
  setActive("navMyCars");
});


