//let authingUser = null;
//let authingInstance = null;
//
//const menuToggle = document.getElementById("menuToggle");
//const userMenu = document.getElementById("userMenu");
//const logoutBtn = document.getElementById("logoutBtn");
//
//
//export function initializeAuthing({ redirectUri }) {
//  authing = new AuthingFactory.Authing({
//    domain: 'https://brilique-ai.authing.cn',
//    appId: '6883374de34869f620df2d9f',
//    redirectUri: redirectUri || window.location.href,
//    userPoolId: '68814af72ddc6630d1c92a51',
//  });
//
//  // Handle Authing redirect
//  if (authing.isRedirectCallback()) {
//    console.log('authing.isRedirectCallback()');
//    authing.handleRedirectCallback().then(async (loginState) => {
//      console.log('loginState: ', loginState);
//      const user = await authing.getUserInfo();
//      console.log('loginState user is: ', user.email)
//      if (user && (user.email|| user.username || user.phone)) {
//          currentAuthingUser = user;
//          localStorage.setItem("authingUser", JSON.stringify(user));
//          updateUserUI(user);
//          // Trigger a custom event to notify other parts of the app
//          window.dispatchEvent(new CustomEvent('authingLogin', { detail: user }));
////        document.querySelector(".text-block-20").textContent = user.email;
////        document.getElementById("login-wrapper").style.display = "none";
////        document.getElementById("user-info-wrapper").style.display = "flex";
//      }
//    });
//  } else {
//    authing.getLoginState({ ignoreCache: true }).then(loginState => {
//      const user = loginState?.user;
//      if (user && (user.email || user.username)) {
////        document.querySelector(".text-block-20").textContent = user.email;
////        document.getElementById("login-wrapper").style.display = "none";
////        document.getElementById("user-info-wrapper").style.display = "flex";
//
//        currentAuthingUser = user;
//        localStorage.setItem("authingUser", JSON.stringify(user));
//        updateUserUI(user);
//      }
//    });
//  }
//  window.authing = authing;
//
//  return authing;
//}
//function updateUserUI(email) {
//  console.log('updateUserUI called with:', email);
//
//  const loginWrapper = document.getElementById("login-wrapper");
//  const userInfoWrapper = document.getElementById("user-info-wrapper");
//  const nameText = document.querySelector(".text-block-20");
//  const modal = document.getElementById("auth-modal");
//
//  if (user && (user.email || user.username || user.phone)) {
//      const displayName = user.email || user.username || user.phone;
//      console.log('Updating UI for user:', displayName);
//
//      if (nameText) {
//        nameText.textContent = displayName;
//        console.log('Updated name text to:', displayName);
//      }
//      if (loginWrapper) {
//        loginWrapper.style.display = "none";
//        console.log('Hid login wrapper');
//      }
//      if (userInfoWrapper) {
//        userInfoWrapper.style.display = "flex";
//        console.log('Showed user info wrapper');
//      }
//      if (modal) {
//        modal.style.display = "none";
//        console.log('Hid modal');
//      }
//    } else {
//      console.log('No valid user data to display');
//    }
////  document.querySelector(".text-block-20").textContent = email;
////  document.getElementById("login-wrapper").style.display = "none";
////  document.getElementById("user-info-wrapper").style.display = "flex";
////  document.getElementById("auth-modal").style.display = "none";
//}
//
//export function getAuthingUser() {
//  if (currentAuthingUser) return currentAuthingUser;
//  const stored = localStorage.getItem("authingUser");
////  return stored ? JSON.parse(stored) : null;
//  if (stored) {
//    try {
//      const user = JSON.parse(stored);
//      currentAuthingUser = user;
//      return user;
//    } catch (error) {
//      console.error('Error parsing stored Authing user:', error);
//      localStorage.removeItem("authingUser");
//    }
//  }
//  return null;
//}
//
//export function logoutAuthing() {
//    try {
//        // Clear current user and localStorage
//        currentAuthingUser = null;
//        localStorage.removeItem("authingUser");
//
//        // Create new Authing instance and logout
//        const authing = new AuthingFactory.Authing({
//          domain: 'https://brilique-ai.authing.cn',
//          appId: '6883374de34869f620df2d9f',
//          redirectUri: window.location.href,
//          userPoolId: '68814af72ddc6630d1c92a51',
//        });
//
//        authing.logout({ redirectUri: window.location.href });
//      } catch (error) {
//        console.error('Error during Authing logout:', error);
//      }
//}
// authing.js
// authing.js
let authingUser = null;
let authingInstance = null;

export function initializeAuthing() {
  // Check if AuthingFactory is available
  if (typeof AuthingFactory === 'undefined') {
    console.error('AuthingFactory is not loaded. Make sure the Authing SDK is properly included.');
    return null;
  }

  try {
    authingInstance = new AuthingFactory.Authing({
      appId: '6883374de34869f620df2d9f',
      userPoolId: '68814af72ddc6630d1c92a51',
      domain: 'https://brilique-ai.authing.cn',
      redirectUri: window.location.href
    });

    // If this is a redirect from login
    if (authingInstance.isRedirectCallback()) {
      authingInstance.handleRedirectCallback().then(async () => {
        const user = await authingInstance.getUserInfo();
        authingUser = user;
        // Don't use localStorage in artifacts - store in memory only
        updateAuthingUI(user);
        window.dispatchEvent(new CustomEvent("authingLogin", { detail: user }));
      }).catch(error => {
        console.error('Error handling redirect callback:', error);
      });
    } else {
      // Check session without relying on localStorage
      authingInstance.getLoginState({ ignoreCache: true }).then(state => {
        const user = state?.user;
        if (user) {
          authingUser = user;
          updateAuthingUI(user);
          window.dispatchEvent(new CustomEvent("authingLogin", { detail: user }));
        }
      }).catch(error => {
        console.error('Error getting login state:', error);
      });
    }

    return authingInstance;
  } catch (error) {
    console.error('Error initializing Authing:', error);
    return null;
  }
}

export function loginWithEmail() {
  if (!authingInstance) {
    console.error("Authing not initialized");
    return;
  }

  try {
    authingInstance.loginWithRedirect({
      connection: "USERNAME_PASSWORD",
      redirectUri: window.location.href
    });
  } catch (error) {
    console.error('Error during login redirect:', error);
  }
}

export function getAuthingUser() {
  return authingUser;
}

export function logoutAuthing() {
  if (!authingInstance) {
    console.error("Authing not initialized");
    return;
  }

  try {
    authingUser = null;
    authingInstance.logout({ redirectUri: window.location.href });
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Update the UI
function updateAuthingUI(user) {
  const loginWrapper = document.getElementById("login-wrapper");
  const userWrapper = document.getElementById("user-info-wrapper");
  const nameBlock = document.querySelector(".text-block-20");
  const avatarImg = document.querySelector(".avatar img");
  const modal = document.getElementById("auth-modal");

  if (user) {
    const name = user.email || user.username || user.phone || "User";
    if (nameBlock) nameBlock.textContent = name;
    if (avatarImg) avatarImg.src = user.photo || "images/default-avatar.png";

    if (loginWrapper) loginWrapper.style.display = "none";
    if (userWrapper) userWrapper.style.display = "flex";
    if (modal) modal.style.display = "none";
  } else {
    if (loginWrapper) loginWrapper.style.display = "flex";
    if (userWrapper) userWrapper.style.display = "none";
  }
}