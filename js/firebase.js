const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const menuToggle = document.getElementById("menuToggle");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", () => {
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const modal = document.getElementById("auth-modal");
  const googleButton = document.getElementById("google-signin");
//  const emailButton = document.getElementById("email-signin");

  // ✅ Google Sign-in click handler
  if (googleButton) {
    googleButton.addEventListener("click", async () => {
      console.log("Google Sign-In button clicked");
      try {
        const result = await auth.signInWithPopup(provider);
        console.log("Login success:", result.user.email);
        if (modal) modal.style.display = "none";
      } catch (err) {
        console.error("Google Sign-In error:", err);
        alert("Login failed: " + err.message);
      }
    });
  }


  if (menuToggle && userMenu) {
    menuToggle.addEventListener("click", () => {
      const visible = userMenu.style.display === "block";
      userMenu.style.display = visible ? "none" : "block";
    });

    // Optional: click outside to close
    window.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target) && e.target !== menuToggle) {
        userMenu.style.display = "none";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebase.auth().signOut()
        .then(() => {
          console.log("User signed out");
          userMenu.style.display = "none";
        })
        .catch((err) => {
          console.error("Sign-out error:", err);
        });
    });
  }

  // ✅ Update UI on auth state change
  auth.onAuthStateChanged((user) => {
    const loginWrapper = document.getElementById("login-wrapper");
    const userInfoWrapper = document.getElementById("user-info-wrapper");
    const avatarImg = document.querySelector("#user-info-wrapper .avatar img");
    const nameText = document.querySelector("#user-info-wrapper .username .text-block-20");

    if (user) {
      document.getElementById("login-wrapper").style.display = "none";
      document.getElementById("user-info-wrapper").style.display = "flex";

      const { displayName, photoURL } = user;


      // Set name and photo
      if (nameText) nameText.textContent = displayName || "User";
      if (avatarImg && photoURL) {
        avatarImg.src = photoURL;
        avatarImg.srcset = photoURL;
      }


      document.querySelectorAll(".inline-avatar").forEach(img => {
        img.src = photoURL;
        img.removeAttribute("srcset")
      });
      document.querySelectorAll(".inline-username").forEach(span => {
        span.textContent = displayName;
      });


    } else {
      if (loginWrapper) loginWrapper.style.display = "flex";
      if (userInfoWrapper) userInfoWrapper.style.display = "none";
    }
  });

});
//import { initializeAuthing, getAuthingUser, isAuthingAuthenticated, debugAuthingState } from './authing.js';
//
//const auth = firebase.auth();
//const provider = new firebase.auth.GoogleAuthProvider();
//const menuToggle = document.getElementById("menuToggle");
//const userMenu = document.getElementById("userMenu");
//const logoutBtn = document.getElementById("logoutBtn");
//
//document.addEventListener("DOMContentLoaded", () => {
//  console.log('🚀 Firebase.js loaded, initializing...');
//
//  const loginWrapper = document.getElementById("login-wrapper");
//  const userInfoWrapper = document.getElementById("user-info-wrapper");
//  const modal = document.getElementById("auth-modal");
//  const googleButton = document.getElementById("google-signin");
//  const emailButton = document.getElementById("email-signin");
//
//  // ✅ Initialize Authing when page loads
//  console.log('🔧 Initializing Authing...');
//  const authingInstance = initializeAuthing({
//    redirectUri: window.location.href
//  });
//
//  // Add a debug button (you can remove this later)
//  const debugBtn = document.createElement('button');
//  debugBtn.textContent = 'Debug Authing';
//  debugBtn.style.position = 'fixed';
//  debugBtn.style.top = '10px';
//  debugBtn.style.right = '10px';
//  debugBtn.style.zIndex = '10000';
//  debugBtn.onclick = debugAuthingState;
//  document.body.appendChild(debugBtn);
//
//  // ✅ Google Sign-in click handler
//  if (googleButton) {
//    googleButton.addEventListener("click", async () => {
//      console.log("🔵 Google Sign-In button clicked");
//      try {
//        const result = await auth.signInWithPopup(provider);
//        console.log("✅ Google login success:", result.user.email);
//        if (modal) modal.style.display = "none";
//      } catch (err) {
//        console.error("❌ Google Sign-In error:", err);
//        alert("Login failed: " + err.message);
//      }
//    });
//  }
//
//  // ✅ Email (Authing) Sign-in click handler
//  if (emailButton) {
//    emailButton.addEventListener("click", async () => {
//      console.log("📧 Email button clicked!");
//      if (authingInstance) {
//        console.log('🔄 Redirecting to Authing login...');
//        authingInstance.loginWithRedirect();
//      } else {
//        console.error('❌ Authing instance not available');
//      }
//    });
//  }
//
//  // ✅ Menu toggle
//  if (menuToggle && userMenu) {
//    menuToggle.addEventListener("click", () => {
//      const visible = userMenu.style.display === "block";
//      userMenu.style.display = visible ? "none" : "block";
//    });
//
//    // Optional: click outside to close
//    window.addEventListener("click", (e) => {
//      if (!userMenu.contains(e.target) && e.target !== menuToggle) {
//        userMenu.style.display = "none";
//      }
//    });
//  }
//
//  // ✅ Logout handler - handles both Firebase and Authing
//  if (logoutBtn) {
//    logoutBtn.addEventListener("click", async () => {
//      console.log('🚪 Logout button clicked');
//      try {
//        // Check if user is logged in via Firebase
//        const firebaseUser = firebase.auth().currentUser;
//        if (firebaseUser) {
//          await firebase.auth().signOut();
//          console.log("✅ Firebase user signed out");
//        }
//
//        // Check if user is logged in via Authing
//        const authingUser = getAuthingUser();
//        if (authingUser) {
//          // For now, just clear localStorage - full logout redirect can be disruptive
//          localStorage.removeItem("authingUser");
//          console.log("✅ Authing user data cleared");
//
//          // Reset UI
//          if (loginWrapper) loginWrapper.style.display = "flex";
//          if (userInfoWrapper) userInfoWrapper.style.display = "none";
//        }
//
//        userMenu.style.display = "none";
//
//      } catch (err) {
//        console.error("❌ Sign-out error:", err);
//      }
//    });
//  }
//
//  // ✅ Update UI on Firebase auth state change
//  auth.onAuthStateChanged((user) => {
//    console.log('🔥 Firebase auth state changed:', user ? user.email : 'No user');
//
//    // Only update UI for Firebase if there's no Authing user
//    const authingUser = getAuthingUser();
//    if (authingUser && (authingUser.email || authingUser.username || authingUser.phone)) {
//      console.log('📧 Authing user present, skipping Firebase UI update');
//      return;
//    }
//
//    const loginWrapper = document.getElementById("login-wrapper");
//    const userInfoWrapper = document.getElementById("user-info-wrapper");
//    const avatarImg = document.querySelector("#user-info-wrapper .avatar img");
//    const nameText = document.querySelector("#user-info-wrapper .username .text-block-20");
//
//    if (user) {
//      console.log('✅ Updating UI for Firebase user');
//      if (loginWrapper) loginWrapper.style.display = "none";
//      if (userInfoWrapper) userInfoWrapper.style.display = "flex";
//
//      const { displayName, photoURL, email } = user;
//
//      // Set name and photo
//      if (nameText) nameText.textContent = displayName || email || "User";
//      if (avatarImg && photoURL) {
//        avatarImg.src = photoURL;
//        avatarImg.srcset = photoURL;
//      }
//
//      document.querySelectorAll(".inline-avatar").forEach(img => {
//        if (photoURL) {
//          img.src = photoURL;
//          img.removeAttribute("srcset");
//        }
//      });
//      document.querySelectorAll(".inline-username").forEach(span => {
//        span.textContent = displayName || email;
//      });
//
//    } else {
//      console.log('❌ No Firebase user, showing login');
//      if (loginWrapper) loginWrapper.style.display = "flex";
//      if (userInfoWrapper) userInfoWrapper.style.display = "none";
//    }
//  });
//});