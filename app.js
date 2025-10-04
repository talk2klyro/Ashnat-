// Load stores and profiles
let storesData = [];
let profilesData = [];

async function loadData() {
  try {
    // Fetch both JSON files
    const [storesRes, profilesRes] = await Promise.all([
      fetch('stores.json'),
      fetch('profiles.json')
    ]);

    storesData = await storesRes.json();
    profilesData = await profilesRes.json();

    renderStores(storesData);
  } catch (err) {
    console.error("Error loading JSON:", err);
    showError("⚠️ Failed to load store data. Please refresh.");
  }
}

// Render store cards
function renderStores(stores) {
  const container = document.getElementById("stores-container");
  container.innerHTML = "";

  if (!stores || stores.length === 0) {
    container.innerHTML = "<p class='empty-msg'>No stores available.</p>";
    return;
  }

  stores.forEach(store => {
    const card = document.createElement("div");
    card.classList.add("store-card");

    // If profiles.json contains matching image or description
    const profile = profilesData.find(p => p.store_id === store.id);

    card.innerHTML = `
      <div class="store-image">
        <img src="${profile?.profile_pic || 'images/placeholder.jpg'}" alt="${store.name}">
      </div>
      <div class="store-info">
        <h3>${store.emoji} ${store.name}</h3>
        <p>${store.tagline}</p>
      </div>
      <button class="open-profile" data-id="${store.id}">View Profile</button>
    `;

    container.appendChild(card);
  });

  // Attach click events
  document.querySelectorAll(".open-profile").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const storeId = parseInt(e.target.dataset.id);
      openProfile(storeId);
    });
  });
}

// Open profile modal
function openProfile(storeId) {
  const profile = profilesData.find(p => p.store_id === storeId);
  const store = storesData.find(s => s.id === storeId);

  if (!profile) return console.error("Profile not found for store:", storeId);

  const modal = document.getElementById("storeModal");
  const container = document.getElementById("profile-container");

  container.innerHTML = `
    <div class="profile-header">
      <img src="${profile.profile_pic}" alt="${store.name}" class="profile-pic">
      <h2>${store.emoji} ${store.name}</h2>
      <p class="tagline">${store.tagline || ""}</p>
    </div>

    <p class="description">${profile.description}</p>

    <div class="social-bubbles">
      ${profile.socials.whatsapp ? `<a href="${profile.socials.whatsapp}" target="_blank" class="bubble whatsapp">💬 WhatsApp</a>` : ""}
      ${profile.socials.facebook ? `<a href="${profile.socials.facebook}" target="_blank" class="bubble facebook">📘 Facebook</a>` : ""}
      ${profile.socials.instagram ? `<a href="${profile.socials.instagram}" target="_blank" class="bubble instagram">📸 Instagram</a>` : ""}
    </div>

    ${
      profile.extra_links?.length
        ? `<div class="extra-links">${profile.extra_links
            .map(link => `<a href="${link.url}" target="_blank">${link.title}</a>`)
            .join("")}</div>`
        : ""
    }
  `;

  modal.classList.remove("hidden");
  modal.classList.add("fade-in");
}

// Close modal
document.getElementById("closeModal").addEventListener("click", closeModal);

function closeModal() {
  const modal = document.getElementById("storeModal");
  modal.classList.add("fade-out");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("fade-in", "fade-out");
  }, 300);
}

// Optional: show user-friendly error
function showError(message) {
  const container = document.getElementById("stores-container");
  container.innerHTML = `<p class="error-msg">${message}</p>`;
}

// Load data on page load
loadData();
