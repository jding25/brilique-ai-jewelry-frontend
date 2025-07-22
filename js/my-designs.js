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
//          const img = document.createElement("img")
//          img.src = design.imageUrl;
//          img.alt = "Saved design";
//          img.className = "product-copy-copy";
//          img.loading = "lazy";
//          img.setAttribute("sizes", "(max-width: 640px) 100vw, 640px");
//          img.setAttribute("srcset", `${img.src} 500w, ${img.src} 640w`);
//          container.appendChild(img);
const wrapper = document.createElement('div');
wrapper.style.position = 'relative';
wrapper.style.display = 'inline-block';

const img = document.createElement('img');
img.src = imageUrl;
img.srcset = imageUrl;
img.style.maxWidth = '100%';
img.style.borderRadius = '10px';
img.style.cursor = 'pointer';
img.addEventListener('click', () => openModal(imageUrl));

const downloadBtn = document.createElement('a');
downloadBtn.href = imageUrl;
downloadBtn.download = 'downloaded-design.png';
downloadBtn.style.position = 'absolute';
downloadBtn.style.top = '10px';
downloadBtn.style.right = '10px';
downloadBtn.style.background = 'transparent';
downloadBtn.style.border = 'none';
downloadBtn.style.cursor = 'pointer';
downloadBtn.innerHTML = `
  <svg width="36px" height="36px" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#1C274C"/>
    <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#1C274C"/>
  </svg>
`;

wrapper.appendChild(img);
wrapper.appendChild(downloadBtn);
document.getElementById('my-designs-container').appendChild(wrapper);

        });

      } catch (err) {
        console.error("Failed to load saved designs:", err);
      }
    }
  });
});