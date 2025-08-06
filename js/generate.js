import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
  authDomain: "brilique-3ae3b.firebaseapp.com",
  projectId: "brilique-3ae3b",
  storageBucket: "brilique-3ae3b.appspot.com",
  messagingSenderId: "622180990908",
  appId: "1:622180990908:web:65204b3249eedf13b475b9",
  measurementId: "G-QMS5PFKFWG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, function(user) {
    const prevPrompt = localStorage.getItem("customPrompt");
    const prevStyle = localStorage.getItem("selectedStyle");
    const prevJewelry = localStorage.getItem("selectedJewelryType");
    const redirected = localStorage.getItem("redirectedFromGenerate") === "true";

    if (redirected && user) {
         window.location.href = "generate-results.html";
         localStorage.setItem("redirectedFromGenerate", "false");
         return;
    }
    if (redirected && (!user)) {
        alert("You must be signed in to use the generator.");
        return;
    }
    localStorage.clear();

    let selectedJewelryType = "";
    let selectedStyle = "";

    document.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", () => {
        selectedJewelryType = card.querySelector(".title")?.textContent?.toLowerCase().trim();
        console.log("Jewelry type selected:", selectedJewelryType);
        // Reset all thumbnails
        document.querySelectorAll(".image-thumbnail").forEach(img => {
          img.style.border = "none";
        });

        // Style the clicked card's image
        const image = card.querySelector(".image-thumbnail");
        if (image) {
          image.style.border = "2px solid white";
        }
      });
    });

    document.querySelectorAll(".tag-button").forEach(tag => {
      tag.addEventListener("click", () => {
        const selectedColor = "#d000ff";
        selectedStyle = tag.textContent?.toLowerCase().trim();
        console.log("Style selected:", selectedStyle);

        document.querySelectorAll(".tag-button").forEach(t => {
          t.style.backgroundColor = "transparent";
          t.style.color = "white";
        });

        // Style the selected one
        tag.style.backgroundColor = "white";
        tag.style.color = selectedColor;
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

      localStorage.setItem("selectedJewelryType", selectedJewelryType);
      localStorage.setItem("selectedStyle", selectedStyle);
      localStorage.setItem("customPrompt", customPrompt);
      localStorage.setItem("redirectedFromGenerate", "true");

      window.location.href = "generate-results.html";
    });
  });
});
