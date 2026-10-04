// Apply form - submit application to backend

const API = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const applyForm = document.getElementById("apply-form");

  // Load opening details if ID is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const openingId = urlParams.get("id");

  if (openingId) {
    loadOpeningDetails(openingId);
  }

  if (applyForm) {
    applyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Check if user is logged in
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Please login first before applying.");
        window.location.href = "login.html";
        return;
      }

      const user = JSON.parse(userStr);
      const coverLetter = applyForm.querySelector("textarea")?.value || "";

      if (!openingId) {
        alert("No opening selected. Please go back and choose an opening.");
        return;
      }

      try {
        const res = await fetch(`${API}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: user.id,
            opening: openingId,
            coverLetter
          })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Application submitted successfully!");
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Failed to submit application");
        }
      } catch (err) {
        console.error(err);
        alert("Could not connect to server. Make sure the backend is running.");
      }
    });
  }
});

// Load single opening details
async function loadOpeningDetails(id) {
  try {
    const res = await fetch(`${API}/openings/${id}`);
    if (!res.ok) return;

    const opening = await res.json();

    // Update page content if elements exist
    const titleEl = document.querySelector("h1");
    const companyEl = document.querySelector(".text-green-600.font-medium");
    
    if (titleEl) titleEl.textContent = opening.title || titleEl.textContent;
    if (companyEl) companyEl.textContent = opening.company || companyEl.textContent;

  } catch (err) {
    console.error("Could not load opening details", err);
  }
}
