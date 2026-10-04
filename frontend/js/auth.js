// Authentication - connected to backend

const API = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // ===== REGISTER =====
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const course = document.getElementById("course")?.value.trim() || "";

      if (!name || !email || !password) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, course })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Account created successfully! Please login.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        alert("Could not connect to server. Make sure the backend is running on port 5000.");
      }
    });
  }

  // ===== LOGIN =====
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          // Save token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          alert("Login successful!");
          
          // Redirect based on role
          if (data.user.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "dashboard.html";
          }
        } else {
          alert(data.message || "Invalid email or password");
        }
      } catch (err) {
        console.error(err);
        alert("Could not connect to server. Make sure the backend is running on port 5000.");
      }
    });
  }
});
