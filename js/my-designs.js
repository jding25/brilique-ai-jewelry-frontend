//import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
//import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
//
//const firebaseConfig = {
//  apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
//  authDomain: "brilique-3ae3b.firebaseapp.com",
//  projectId: "brilique-3ae3b",
//  storageBucket: "brilique-3ae3b.appspot.com",
//  messagingSenderId: "622180990908",
//  appId: "1:622180990908:web:65204b3249eedf13b475b9",
//  measurementId: "G-QMS5PFKFWG"
//};
//
//const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);
//
//document.addEventListener("DOMContentLoaded", () => {
//  const container = document.getElementById("my-designs-container");
//
//  onAuthStateChanged(auth, async (user) => {
//    if (user) {
//      const userId = user.email;
//      try {
//        const url = `https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/user?userId=${encodeURIComponent(userId)}`;
//        console.log("this is url: ", url);
//        const res = await fetch(url);
//        if (!res.ok) {
//          const errText = await res.text();
//          throw new Error(`Backend ${res.status}: ${errText}`);
//        }
//        console.log("this is userId: ", userId);
//        const designs = await res.json();
//
//designs.forEach(design => {
//  const img = document.createElement("img");
//  img.src = design.imageUrl;
//  img.alt = "Saved design";
//  img.className = "product-copy-copy";
//  img.loading = "lazy";
//  img.setAttribute("sizes", "(max-width: 640px) 100vw, 640px");
//  img.setAttribute("srcset", `${design.imageUrl} 500w, ${design.imageUrl} 640w`);
//  img.style.cursor = "pointer";
//  img.style.borderRadius = "10px";
//  img.style.maxWidth = "100%";
//
//  // When the image is clicked, open the modal
//  img.addEventListener("click", () => openModal(design.imageUrl));
//
//  // Add image to container
//  document.getElementById("my-designs-container").appendChild(img);
//});
//
//      } catch (err) {
//        console.error("Failed to load saved designs:", err);
//      }
//    }
//  });
//});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { initializeAuthing } from './authing.js';

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
        const url = `https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/user?userId=${encodeURIComponent(userId)}`;
        console.log("this is url: ", url);
        const res = await fetch(url);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Backend ${res.status}: ${errText}`);
        }
        console.log("this is userId: ", userId);
        const designs = await res.json();

designs.forEach(design => {
  const img = document.createElement("img");
  img.src = design.imageUrl;
  img.alt = "Saved design";
  img.className = "product-copy-copy";
  img.loading = "lazy";
  img.setAttribute("sizes", "(max-width: 640px) 100vw, 640px");
  img.setAttribute("srcset", `${design.imageUrl} 500w, ${design.imageUrl} 640w`);
  img.style.cursor = "pointer";
  img.style.borderRadius = "10px";
  img.style.maxWidth = "100%";

  // When the image is clicked, open the modal
  img.addEventListener("click", () => openModal(design.imageUrl));

  // Add image to container
  document.getElementById("my-designs-container").appendChild(img);
});

      } catch (err) {
        console.error("Failed to load saved designs:", err);
      }
    }
  });
});