// Dashboard - load user's applications from backend

const API = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    // Not logged in
    alert("Please login to view your dashboard");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userStr);
  loadApplications(user.id);
});

async function loadApplications(studentId) {
  try {
    const res = await fetch(`${API}/applications/student/${studentId}`);
    const applications = await res.json();

    // Update summary numbers if needed
    // For now the table is static in HTML.
    // You can expand this later to dynamically build the table rows.

    console.log("User applications:", applications);
  } catch (err) {
    console.error("Could not load applications", err);
  }
}
