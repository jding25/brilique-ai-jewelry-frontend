(async function loadMarket() {
  const WRAPPER_SELECTOR = ".product-wrapper";

  const wrapper = document.querySelector(WRAPPER_SELECTOR);
  if (!wrapper) return;

  wrapper.innerHTML = '<div style="padding:24px;color:#888;">Loading market…</div>';

  try {
    const res = await fetch(`https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/market`);
    const text = await res.text();
    if (!res.ok) throw new Error(text || (`HTTP ${res.status}`));

    let designs;
    try { designs = JSON.parse(text); } catch { designs = []; }

    wrapper.innerHTML = "";
    if (!Array.isArray(designs) || designs.length === 0) {
      wrapper.innerHTML = '<div style="padding:24px;color:#888;">No market items yet.</div>';
      return;
    }

    designs.forEach(d => {
      const imageUrl = d.imageUrl || "";
      const userId = d.userId || "Unknown";
      const price = 800; // change/remove if you have real pricing

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
          <img src="images/微信图片_20211105222712.png"
               loading="lazy"
               sizes="(max-width: 939px) 100vw, 939px"
               alt=""
               class="image-7">
          <div class="div-block-6">
            <div class="div-block-4">
              <div class="designer-info">Designer<br></div>
              <div class="designer-name">${userId}</div>
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
