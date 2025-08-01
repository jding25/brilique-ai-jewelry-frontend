import { initializeAuthing, updateUserUI } from './authing.js';
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const menuToggle = document.getElementById("menuToggle");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");

let authing;

document.addEventListener("DOMContentLoaded", () => {
  const userInfoRaw = sessionStorage.getItem("userInfo");
  if (userInfoRaw) {
    const userInfo = JSON.parse(userInfoRaw);
    console.log("Logged in as:", userInfo);
    updateUserUI(userInfo.email);
  }

  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const modal = document.getElementById("auth-modal");
  const googleButton = document.getElementById("google-signin");
  const emailButton = document.getElementById("email-signin");

  // Initialize Authing
   try {
      authing = initializeAuthing({redirectUri: window.location.href});
      window.authing = authing; // Make it accessible for debugging
      console.log('✅ Authing initialized successfully');
   } catch (initError) {
      console.error("❌ Failed to initialize Authing:", initError);
      return;
   }

  // Check for Authing redirect callback
    try {
      if (authing.isRedirectCallback()) {
        console.log('✅ Handling Authing redirect callback...');
        authing.handleRedirectCallback().then(async (loginState) => {
          console.log('🔁 loginState:', loginState);

          const user = await authing.getUserInfo();
          console.log('👤 Logged in as:', user);

          const userInfo = { email: user.email };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          updateUserUI(user.email);

          console.log('💾 User info saved to session storage');
        }).catch((err) => {
          console.error("❌ handleRedirectCallback error:", err);
          console.error("❌ Error details:", {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
        });
      }
    } catch (callbackError) {
      console.error("❌ Error checking redirect callback:", callbackError);
    }

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

  // Email (Authing) sign-in click handler
    if (emailButton) {
      emailButton.addEventListener("click", async () => {
        console.log("Email button is clicked!");

        if (!authing) {
          console.error("❌ Authing not initialized!");
          return;
        }

        try {
          console.log("🚀 Starting Authing login redirect...");
          authing.loginWithRedirect();
        } catch (err) {
          console.error("❌ Login redirect error:", err);
          alert("Login redirect failed: " + err.message);
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