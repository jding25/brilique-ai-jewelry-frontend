(async function loadMarket() {
  const WRAPPER_SELECTOR = ".product-wrapper";

  const wrapper = document.querySelector(WRAPPER_SELECTOR);
  if (!wrapper) return;

  wrapper.innerHTML = '<div style="padding:24px;color:#888;">Loading market…</div>';

  try {
    const res = await fetch(`https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/market`);
    const resUsers = await fetch(`https://brilique-ai-jewelry-backend-4.onrender.com/api/user/all`);
    const text = await res.text();
    const textUsers = await resUsers.text();
    if (!res.ok) throw new Error(text || (`HTTP ${res.status}`));

    let designs;
    try { designs = JSON.parse(text); } catch { designs = []; }

    let users;
    try {users = JSON.parse(textUsers);} catch { users = []; }
    console.log("these are users: ", users);

    // Build a quick lookup: email -> user object
    const userByEmail = new Map(
      (Array.isArray(users) ? users : []).map(u => [String(u.email || "").toLowerCase(), u])
    );
    console.log("these are user by email: ",userByEmail)

    wrapper.innerHTML = "";
    if (!Array.isArray(designs) || designs.length === 0) {
      wrapper.innerHTML = '<div style="padding:24px;color:#888;">No market items yet.</div>';
      return;
    }

    designs.forEach(d => {
      const imageUrl = d.imageUrl;
      const userId = d.userId;
      const match = userByEmail.get(userId);
      const price = 800; // change/remove if you have real pricing

      const displayName = match?.name || d.userId || "Unknown";
      const avatarUrl   = match?.profilePicUrl || "images/微信图片_20211105222712.png";

      const card = document.createElement("div");
      card.className = "single-product";

      card.innerHTML = `
        <img src="${imageUrl}"
             loading="lazy"
             sizes="(max-width: 640px) 100vw, 640px"
             srcset="${imageUrl} 500w, ${imageUrl} 640w"
             alt=""
             class="product">

        <div class="div-block-3">
          <img src= "${avatarUrl}"
               loading="lazy"
               sizes="(max-width: 939px) 100vw, 939px"
               srcset= "${avatarUrl}"
               alt=""
               class="image-7">
          <div class="div-block-6">
            <div class="div-block-4">
              <div class="designer-info">Designer<br></div>
              <div class="designer-name" style="color: black;">${displayName}</div>
            </div>
            <div class="price-wrapper">
              <div class="price-tag">$${price}</div>
            </div>
          </div>
        </div>
      `;

      const img = card.querySelector("img.product");
      if (img) {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          localStorage.setItem("selectedImage", imageUrl);
          window.location.href = "generate-details.html";
        });
      }

      wrapper.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load market designs:", err);
    wrapper.innerHTML = '<div style="padding:24px;color:#c00;">Failed to load market designs.</div>';
  }
})();
