//<script type="module">
//  // Import the functions you need from the SDKs you need
//  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
//  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
//  // TODO: Add SDKs for Firebase products that you want to use
//  // https://firebase.google.com/docs/web/setup#available-libraries
//
//  // Your web app's Firebase configuration
//  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//  const firebaseConfig = {
//    apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
//    authDomain: "brilique-3ae3b.firebaseapp.com",
//    projectId: "brilique-3ae3b",
//    storageBucket: "brilique-3ae3b.firebasestorage.app",
//    messagingSenderId: "622180990908",
//    appId: "1:622180990908:web:65204b3249eedf13b475b9",
//    measurementId: "G-QMS5PFKFWG"
//  };
//
//  // Initialize Firebase
//  const app = initializeApp(firebaseConfig);
//  const analytics = getAnalytics(app);
//</script>
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
    authDomain: "brilique-3ae3b.firebaseapp.com",
    projectId: "brilique-3ae3b",
    storageBucket: "brilique-3ae3b.appspot.com",  // 🔧 Fix typo from "firebasestorage.app"
    messagingSenderId: "622180990908",
    appId: "1:622180990908:web:65204b3249eedf13b475b9",
    measurementId: "G-QMS5PFKFWG"
  };

  // Init
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // DOM elements
  const loginBtn = document.getElementById("loginBtn");
  const modal = document.getElementById("auth-modal");
  const googleButton = document.getElementById("google-signin");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (googleButton) {
    googleButton.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Login success:", result.user.email);
        modal.style.display = "none";
      } catch (err) {
        console.error("❌ Google Sign-In error:", err);
        alert("Login failed: " + err.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        console.log("🚪 Signed out");
        userMenu.style.display = "none";
      });
    });
  }

  // Auth state change
  onAuthStateChanged(auth, (user) => {
    const loginWrapper = document.getElementById("login-wrapper");
    const userInfoWrapper = document.getElementById("user-info-wrapper");
    const avatarImg = document.querySelector("#user-info-wrapper .avatar img");
    const nameText = document.querySelector("#user-info-wrapper .username .text-block-20");

    if (user) {
      loginWrapper.style.display = "none";
      userInfoWrapper.style.display = "flex";

      const { displayName, photoURL } = user;
      if (nameText) nameText.textContent = displayName || "User";
      if (avatarImg) avatarImg.src = photoURL;

      document.querySelectorAll(".inline-avatar").forEach(img => img.src = photoURL);
      document.querySelectorAll(".inline-username").forEach(span => span.textContent = displayName);
    } else {
      loginWrapper.style.display = "flex";
      userInfoWrapper.style.display = "none";
    }
  });
</script>
