document.addEventListener("DOMContentLoaded", function () {
  let selectedJewelryType = "";
  let selectedStyle = "";

  // Jewelry type selection
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedJewelryType = card.querySelector(".title")?.textContent?.toLowerCase().trim();
      console.log("Jewelry type selected:", selectedJewelryType);

      document.querySelectorAll(".category-card").forEach(c => {
        c.style.border = "";
      });

      card.style.border = "2px solid #6a0dad";
    });
  });

  // Style tag selection
  document.querySelectorAll(".tag-button").forEach(tag => {
    tag.addEventListener("click", () => {
      selectedStyle = tag.textContent?.toLowerCase().trim();
      console.log("Style selected:", selectedStyle);

      document.querySelectorAll(".tag-button").forEach(t => {
        t.style.border = "";
      });

      tag.style.border = "2px solid #6a0dad";
    });
  });

  const form = document.getElementById("email-form");
  const textarea = document.getElementById("field");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const customPrompt = textarea.value.trim();
    if (!selectedJewelryType && !selectedStyle && !customPrompt) {
      alert("Please select a jewelry type or style or enter a prompt.");
      return;
    }

    // Save selections to sessionStorage (lightweight)
    sessionStorage.setItem("selectedJewelryType", selectedJewelryType);
    sessionStorage.setItem("selectedStyle", selectedStyle);
    sessionStorage.setItem("customPrompt", customPrompt);

    window.location.href = "generate-results.html";
  });
});
