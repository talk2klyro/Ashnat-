let storesData = [];
let profilesData = [];

async function loadData() {
  try {
    const storesRes = await fetch('stores.json');
    storesData = await storesRes.json();

    const profilesRes = await fetch('profiles.json');
    profilesData = await profilesRes.json();

    renderStores(storesData);
  } catch (err) {
    console.error("Error loading JSON:", err);
  }
}

function renderStores(stores) {
  const container = document.getElementById("stores-container");
  container.innerHTML = "";

  stores.forEach(store => {
    const card = document.createElement("div");
    card.classList.add("store-card");
    card.innerHTML = `
      <div class="emoji">${store.emoji}</div>
      <h3>${store.name}</h3>
      <p>${store.tagline}</p>
      <button class="open-profile" data-id="${store.id}">View</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".open-profile").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const storeId = parseInt(e.target.dataset.id);
      openProfile(storeId);
    });
  });
}

function openProfile(storeId) {
  const store = storesData.find(s => s.id === storeId);
  const profile = profilesData.find(p => p.store_id === storeId);
  if (!profile) return;

  if (store.view_type === "page") {
    openPageView(store, profile);
  } else {
    openModal(store, profile);
  }
}

function openModal(store, profile) {
  const modal = document.getElementById("storeModal");
  const container = document.getElementById("profile-container");

  container.innerHTML = `
    <div class="profile-header">
      <img src="${profile.profile_pic}" alt="${store.name}" class="profile-pic">
      <h2>${store.emoji} ${store.name}</h2>
      <p class="tagline">${store.tagline}</p>
    </div>
    <p class="description">${profile.description}</p>
    <div class="bubble-links">
      ${profile.socials.whatsapp ? `<a href="${profile.socials.whatsapp}" target="_blank" class="bubble whatsapp">WhatsApp</a>` : ""}
      ${profile.socials.facebook ? `<a href="${profile.socials.facebook}" target="_blank" class="bubble facebook">Facebook</a>` : ""}
      ${profile.socials.instagram ? `<a href="${profile.socials.instagram}" target="_blank" class="bubble instagram">Instagram</a>` : ""}
    </div>
    <div class="extra-links">
      ${profile.extra_links.map(l => `<a href="${l.url}" target="_blank">${l.title}</a>`).join("")}
    </div>
  `;

  modal.classList.remove("hidden");
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("storeModal").classList.add("hidden");
});

function openPageView(store, profile) {
  const page = document.getElementById("pageView");
  const content = document.getElementById("pageContent");

  content.innerHTML = `
    <div class="profile-header">
      <img src="${profile.profile_pic}" alt="${store.name}" class="profile-pic">
      <h2>${store.emoji} ${store.name}</h2>
      <p class="tagline">${store.tagline}</p>
    </div>
    <p class="description">${profile.description}</p>
    <div class="bubble-links">
      ${profile.socials.whatsapp ? `<a href="${profile.socials.whatsapp}" target="_blank" class="bubble whatsapp">WhatsApp</a>` : ""}
      ${profile.socials.facebook ? `<a href="${profile.socials.facebook}" target="_blank" class="bubble facebook">Facebook</a>` : ""}
      ${profile.socials.instagram ? `<a href="${profile.socials.instagram}" target="_blank" class="bubble instagram">Instagram</a>` : ""}
    </div>
    <div class="extra-links">
      ${profile.extra_links.map(l => `<a href="${l.url}" target="_blank">${l.title}</a>`).join("")}
    </div>
  `;

  page.classList.remove("hidden");
  setTimeout(() => page.classList.add("active"), 10);
}

document.getElementById("backButton").addEventListener("click", () => {
  const page = document.getElementById("pageView");
  page.classList.remove("active");
  setTimeout(() => page.classList.add("hidden"), 400);
});

loadData();
