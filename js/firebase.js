import { initializeAuthing } from './authing.js';

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
  const emailButton = document.getElementById("email-signin");

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

  emailButton.addEventListener("click", async () => {
    console.log("Email button is clicked!");
    const authing = initializeAuthing({
      redirectUri: window.location.href // stay on this page
    });
//    authing.loginWithRedirect();
    console.log('authing email sign in successful!! from firebase.js')
    authing.handleRedirectCallback().then(async (loginState) => {
      console.log('loginState: ', loginState);
      const user = await authing.getUserInfo();
      console.log('loginState user is: ', user.email)
      const userInfo = {
        email: user.email,
      };
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
     }
//    const userAuthing = await authing.getUserInfo();
//    console.log('loginState user is: ', userAuthing.email)
  });

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