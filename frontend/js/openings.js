// Openings page - load from backend + filters

const API = "https://siwes-finder-api.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("openings-list");
  const stateFilter = document.getElementById("filter-state");
  const fieldFilter = document.getElementById("filter-field");
  const durationFilter = document.getElementById("filter-duration");
  const clearBtn = document.getElementById("clear-filters");

  // Load openings from backend
  async function loadOpenings() {
    if (!container) return;

    // Build query string from filters
    const params = new URLSearchParams();
    if (stateFilter?.value) params.append("state", stateFilter.value);
    if (fieldFilter?.value) params.append("field", fieldFilter.value);
    if (durationFilter?.value) params.append("duration", durationFilter.value);

    const query = params.toString() ? `?${params.toString()}` : "";

    try {
      container.innerHTML = `<p class="text-gray-500 text-sm">Loading openings...</p>`;

      const res = await fetch(`${API}/openings${query}`);
      const openings = await res.json();

      if (!Array.isArray(openings) || openings.length === 0) {
        container.innerHTML = `
          <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p class="text-gray-500">No openings found.</p>
            <p class="text-sm text-gray-400 mt-1">Try clearing the filters or check back later.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = "";

      openings.forEach((opening) => {
        const card = document.createElement("div");
        card.className = "card bg-white rounded-lg border border-gray-200 p-5";
        card.innerHTML = `
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">${opening.title}</h3>
              <p class="text-green-600 text-sm font-medium mt-0.5">${opening.company}</p>
            </div>
            <span class="self-start text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">
              ${opening.status === "open" ? "Open" : "Closed"}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>${opening.location || ""}</span>
            <span>•</span>
            <span>${opening.duration || ""}</span>
            <span>•</span>
            <span>${opening.field || ""}</span>
          </div>
          <p class="mt-3 text-sm text-gray-600 line-clamp-2">
            ${opening.description || "No description provided."}
          </p>
          <a href="opening-details.html?id=${opening._id}" 
             class="inline-block mt-4 text-sm font-medium text-green-600 hover:text-green-700">
            View details →
          </a>
        `;
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to load openings:", err);
      container.innerHTML = `
        <div class="bg-white border border-red-100 rounded-lg p-6 text-center">
          <p class="text-red-600 text-sm">Could not load openings.</p>
          <p class="text-xs text-gray-500 mt-1">Make sure the backend is running on port 5000.</p>
        </div>
      `;
    }
  }

  // Filter change events
  if (stateFilter) stateFilter.addEventListener("change", loadOpenings);
  if (fieldFilter) fieldFilter.addEventListener("change", loadOpenings);
  if (durationFilter) durationFilter.addEventListener("change", loadOpenings);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (stateFilter) stateFilter.value = "";
      if (fieldFilter) fieldFilter.value = "";
      if (durationFilter) durationFilter.value = "";
      loadOpenings();
    });
  }

  // Initial load
  loadOpenings();
});
