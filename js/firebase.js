//import { initializeAuthing, updateUserUI } from './authing.js';
//
//const auth = firebase.auth();
//const provider = new firebase.auth.GoogleAuthProvider();
//
//const menuToggle = document.getElementById("menuToggle");
//const userMenu = document.getElementById("userMenu");
//const logoutBtn = document.getElementById("logoutBtn");
//
//let authing;
//let currentUser = null;
//
//document.addEventListener("DOMContentLoaded", () => {
//  const userInfoRaw = sessionStorage.getItem("userInfo");
//  if (userInfoRaw) {
//    const userInfo = JSON.parse(userInfoRaw);
//    console.log("Logged in as:", userInfo);
//    updateUserUI(userInfo.email);
//  }
//
//  const loginWrapper = document.getElementById("login-wrapper");
//  const userInfoWrapper = document.getElementById("user-info-wrapper");
//  const modal = document.getElementById("auth-modal");
//  const googleButton = document.getElementById("google-signin");
//  const emailButton = document.getElementById("email-signin");
//
//  // Initialize Authing
//   try {
//      authing = initializeAuthing({redirectUri: window.location.href});
//      window.authing = authing; // Make it accessible for debugging
//      console.log('✅ Authing initialized successfully');
//   } catch (initError) {
//      console.error("❌ Failed to initialize Authing:", initError);
//      return;
//   }
//
//    try {
//    if (authing.isRedirectCallback()) {
//      // Handle redirect callback
//      console.log('✅ Handling Authing redirect callback...');
//      authing.handleRedirectCallback().then(async (loginState) => {
//        console.log('🔁 loginState:', loginState);
//
//        const user = await authing.getUserInfo();
//        console.log('👤 Logged in as:', user);
//
//        const userInfo = { email: user.email };
//        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
//        updateUserUI(user.email);
//
//        console.log('💾 User info saved to session storage');
//      }).catch((err) => {
//        console.error("❌ handleRedirectCallback error:", err);
//        console.error("❌ Error details:", {
//          message: err.message,
//          stack: err.stack,
//          name: err.name
//        });
//      });
//    } else {
//      // Check if user is already logged in (for page refreshes/new visits)
//      console.log('🔍 Checking existing Authing login state...');
//      authing.getLoginState({ ignoreCache: false }).then(async (loginState) => {
//        console.log('🔁 Existing loginState:', loginState);
//
//        if (loginState && loginState.user) {
//          const user = loginState.user;
//          console.log('👤 Found existing user:', user);
//
//          const userInfo = { email: user.email };
//          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
//          updateUserUI(user.email);
//
//          console.log('💾 Existing user session restored');
//        } else {
//          console.log('ℹ️ No existing Authing session found');
//        }
//      }).catch((err) => {
//        console.error("❌ Error checking login state:", err);
//      });
//    }
//  } catch (callbackError) {
//        console.error("❌ Error checking authentication state:", callbackError);
//    }
//
//  // ✅ Google Sign-in click handler
//  if (googleButton) {
//    googleButton.addEventListener("click", async () => {
//    console.log("Google Sign-In button clicked");
//      try {
//        const result = await auth.signInWithPopup(provider);
//        console.log("Login success:", result.user.email);
//        if (modal) modal.style.display = "none";
//      } catch (err) {
//        console.error("Google Sign-In error:", err);
//        alert("Login failed: " + err.message);
//      }
//    });
//  }
//
//  // Email (Authing) sign-in click handler
//    if (emailButton) {
//      emailButton.addEventListener("click", async () => {
//        console.log("Email button is clicked!");
//
//        if (!authing) {
//          console.error("❌ Authing not initialized!");
//          return;
//        }
//
//        try {
//          console.log("🚀 Starting Authing login redirect...");
//          authing.loginWithRedirect();
//        } catch (err) {
//          console.error("❌ Login redirect error:", err);
//          alert("Login redirect failed: " + err.message);
//        }
//      });
//    }
//
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
////  if (logoutBtn) {
////    logoutBtn.addEventListener("click", () => {
////      firebase.auth().signOut()
////        .then(() => {
////          console.log("User signed out");
////          userMenu.style.display = "none";
////        })
////        .catch((err) => {
////          console.error("Sign-out error:", err);
////        });
////    });
////  }
//
//     // Logout functionality
//     if (logoutBtn) {
//       logoutBtn.addEventListener("click", async () => {
//         console.log('🚪 Logging out...');
//
//         // Clear session storage
//         sessionStorage.removeItem("userInfo");
//
//         // Sign out from Firebase
//         firebase.auth().signOut()
//           .then(() => {
//             console.log("✅ User signed out from Firebase");
//           })
//           .catch((err) => {
//             console.error("❌ Firebase sign-out error:", err);
//           });
//
//         // Sign out from Authing
//         if (authing) {
//           try {
//             await authing.logout();
//             console.log("✅ User signed out from Authing");
//           } catch (err) {
//             console.error("❌ Authing sign-out error:", err);
//           }
//         }
//
//         // Reset UI
//         document.getElementById("login-wrapper").style.display = "flex";
//         document.getElementById("user-info-wrapper").style.display = "none";
//         userMenu.style.display = "none";
//
//         console.log('✅ Logout complete');
//       });
//     }
//  // ✅ Update UI on auth state change
//  auth.onAuthStateChanged((user) => {
//    const loginWrapper = document.getElementById("login-wrapper");
//    const userInfoWrapper = document.getElementById("user-info-wrapper");
//    const avatarImg = document.querySelector("#user-info-wrapper .avatar img");
//    const nameText = document.querySelector("#user-info-wrapper .username .text-block-20");
//
//    if (user) {
//      document.getElementById("login-wrapper").style.display = "none";
//      document.getElementById("user-info-wrapper").style.display = "flex";
//
//      const { displayName, photoURL } = user;
//
//
//      // Set name and photo
//      if (nameText) nameText.textContent = displayName || "User";
//      if (avatarImg && photoURL) {
//        avatarImg.src = photoURL;
//        avatarImg.srcset = photoURL;
//      }
//
//
//      document.querySelectorAll(".inline-avatar").forEach(img => {
//        img.src = photoURL;
//        img.removeAttribute("srcset")
//      });
//      document.querySelectorAll(".inline-username").forEach(span => {
//        span.textContent = displayName;
//      });
//
//
//    } else {
//      if (loginWrapper) loginWrapper.style.display = "flex";
//      if (userInfoWrapper) userInfoWrapper.style.display = "none";
//    }
//  });
//
//
//
//});

import { initializeAuthing, updateUserUI } from './authing.js';

// Use compat version consistently across all pages
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Global authing instance
let authing;

// Global authentication state
let currentUser = null;

// Initialize authentication system
async function initializeAuth() {
  const menuToggle = document.getElementById("menuToggle");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const modal = document.getElementById("auth-modal");
  const googleButton = document.getElementById("google-signin");
  const emailButton = document.getElementById("email-signin");
  const loginBtn = document.getElementById("loginBtn");

  // Initialize Authing
  try {
    authing = initializeAuthing({redirectUri: window.location.href});
    window.authing = authing; // Make it accessible for debugging
    console.log('✅ Authing initialized successfully');
  } catch (initError) {
    console.error("❌ Failed to initialize Authing:", initError);
    return;
  }

  // Check authentication state on page load
  await checkAuthenticationState();

  // Set up event listeners
  setupEventListeners({
    menuToggle, userMenu, logoutBtn, loginWrapper, userInfoWrapper,
    modal, googleButton, emailButton, loginBtn
  });

  // Firebase auth state listener
  auth.onAuthStateChanged(handleFirebaseAuthChange);
}

// Check both Firebase and Authing authentication state
async function checkAuthenticationState() {
  // First check session storage
  const userInfoRaw = sessionStorage.getItem("userInfo");
  if (userInfoRaw) {
    const userInfo = JSON.parse(userInfoRaw);
    console.log("Found session storage user:", userInfo);
    updateUserUI(userInfo.email);
    currentUser = userInfo;
    return;
  }

  // Check Authing authentication state
  try {
    if (authing.isRedirectCallback()) {
      // Handle redirect callback
      console.log('✅ Handling Authing redirect callback...');
      authing.handleRedirectCallback().then(async (loginState) => {
        console.log('🔁 loginState:', loginState);

        const user = await authing.getUserInfo();
        console.log('👤 Logged in as:', user);

        const userInfo = { email: user.email };
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        updateUserUI(user.email);
        currentUser = userInfo;

        console.log('💾 User info saved to session storage');

        // Clean the URL by removing hash parameters
        if (window.location.hash) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          console.log('🧹 URL cleaned after successful authentication');
        }
      }).catch((err) => {
        console.error("❌ handleRedirectCallback error:", err);
      });
    } else {
      // Check if user is already logged in (for page refreshes/new visits)
      console.log('🔍 Checking existing Authing login state...');
      authing.getLoginState({ ignoreCache: false }).then(async (loginState) => {
        console.log('🔁 Existing loginState:', loginState);

        if (loginState && loginState.user) {
          const user = loginState.user;
          console.log('👤 Found existing user:', user);

          const userInfo = { email: user.email };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          updateUserUI(user.email);
          currentUser = userInfo;

          console.log('💾 Existing user session restored');
        } else {
          console.log('ℹ️ No existing Authing session found');
        }
      }).catch((err) => {
        console.error("❌ Error checking login state:", err);
      });
    }
  } catch (callbackError) {
    console.error("❌ Error checking authentication state:", callbackError);
  }
}

// Set up all event listeners
function setupEventListeners({
  menuToggle, userMenu, logoutBtn, loginWrapper, userInfoWrapper,
  modal, googleButton, emailButton, loginBtn
}) {
  // Login button to show modal
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "block";
    });
  }

  // Google Sign-in
  if (googleButton) {
    googleButton.addEventListener("click", async () => {
      console.log("Google Sign-In button clicked");
      try {
        const result = await auth.signInWithPopup(provider);
        console.log("Google login success:", result.user.email);
        if (modal) modal.style.display = "none";
      } catch (err) {
        console.error("Google Sign-In error:", err);
        alert("Login failed: " + err.message);
      }
    });
  }

  // Email (Authing) sign-in
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

  // Menu toggle
  if (menuToggle && userMenu) {
    menuToggle.addEventListener("click", () => {
      const visible = userMenu.style.display === "block";
      userMenu.style.display = visible ? "none" : "block";
    });

    // Click outside to close
    window.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target) && e.target !== menuToggle) {
        userMenu.style.display = "none";
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await handleLogout();
      if (userMenu) userMenu.style.display = "none";
    });
  }
}

// Handle Firebase auth state changes
function handleFirebaseAuthChange(user) {
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const avatarImg = document.querySelector("#user-info-wrapper .avatar img");
  const nameText = document.querySelector("#user-info-wrapper .username .text-block-20");

  if (user) {
    console.log("Firebase auth state changed - user logged in:", user.email);

    if (loginWrapper) loginWrapper.style.display = "none";
    if (userInfoWrapper) userInfoWrapper.style.display = "flex";

    const { displayName, photoURL, email } = user;

    // Set name and photo
    if (nameText) nameText.textContent = displayName || email || "User";
    if (avatarImg && photoURL) {
      avatarImg.src = photoURL;
      avatarImg.srcset = photoURL;
    }

    // Update inline avatars and usernames
    document.querySelectorAll(".inline-avatar").forEach(img => {
      if (photoURL) {
        img.src = photoURL;
        img.removeAttribute("srcset");
      }
    });
    document.querySelectorAll(".inline-username").forEach(span => {
      span.textContent = displayName || email;
    });

    // Store user info for consistency
    currentUser = { email, displayName, photoURL };

  } else {
    console.log("Firebase auth state changed - user logged out");
    if (loginWrapper) loginWrapper.style.display = "flex";
    if (userInfoWrapper) userInfoWrapper.style.display = "none";
  }
}

// Handle logout from both systems
async function handleLogout() {
  console.log('🚪 Logging out...');

  // Clear session storage
  sessionStorage.removeItem("userInfo");
  currentUser = null;

  // Sign out from Firebase
  try {
    await firebase.auth().signOut();
    console.log("✅ User signed out from Firebase");
  } catch (err) {
    console.error("❌ Firebase sign-out error:", err);
  }

  // Sign out from Authing
  if (authing) {
    try {
      await authing.logout();
      console.log("✅ User signed out from Authing");
    } catch (err) {
      console.error("❌ Authing sign-out error:", err);
    }
  }

  // Reset UI
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");

  if (loginWrapper) loginWrapper.style.display = "flex";
  if (userInfoWrapper) userInfoWrapper.style.display = "none";

  console.log('✅ Logout complete');
}

// Export functions for use in other scripts
window.getCurrentUser = () => currentUser;
window.getAuthingInstance = () => authing;
window.handleLogout = handleLogout;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeAuth);