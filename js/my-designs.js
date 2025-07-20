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

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("my-designs-container");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.email;
      try {
        const res = await fetch(`https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/user/${encodeURIComponent(userId)}`);
        const designs = await res.json();

        designs.forEach(design => {
          const img = document.createElement("img");
          img.src = design.imageUrl;
          img.alt = "Saved design";
          img.className = "product-copy-copy";
          img.loading = "lazy";
          img.setAttribute("sizes", "(max-width: 640px) 100vw, 640px");
          img.setAttribute("srcset", `${img.src} 500w, ${img.src} 640w`);
          container.appendChild(img);
        });

      } catch (err) {
        console.error("Failed to load saved designs:", err);
      }
    }
  });
});