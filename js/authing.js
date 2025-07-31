//let currentAuthingUser = null;
//
//export function initializeAuthing({ redirectUri }) {
//  const authing = new AuthingFactory.Authing({
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
//      if (user && user.email) {
//          currentAuthingUser = user;
//          localStorage.setItem("authingUser", JSON.stringify(user));
//        document.querySelector(".text-block-20").textContent = user.email;
//        document.getElementById("login-wrapper").style.display = "none";
//        document.getElementById("user-info-wrapper").style.display = "flex";
//      }
//    });
//  } else {
//    authing.getLoginState({ ignoreCache: true }).then(loginState => {
//      const user = loginState?.user;
//      if (user && user.email) {
//        document.querySelector(".text-block-20").textContent = user.email;
//        document.getElementById("login-wrapper").style.display = "none";
//        document.getElementById("user-info-wrapper").style.display = "flex";
//      }
//    });
//  }
//
//  return authing;
//}
//function updateUserUI(email) {
//  document.querySelector(".text-block-20").textContent = email;
//  document.getElementById("login-wrapper").style.display = "none";
//  document.getElementById("user-info-wrapper").style.display = "flex";
//  document.getElementById("auth-modal").style.display = "none";
//}
//
//export function getAuthingUser() {
//  if (currentAuthingUser) return currentAuthingUser;
//  const stored = localStorage.getItem("authingUser");
//  return stored ? JSON.parse(stored) : null;
//}
//
//export function logoutAuthing() {
//    const authing = initializeAuthing({ redirectUri: window.location.href});
//    authing.logout({redirectUri: window.location.href});
//}

let currentAuthingUser = null;

export function initializeAuthing({ redirectUri }) {
  const authing = new AuthingFactory.Authing({
    domain: 'https://brilique-ai.authing.cn',
    appId: '6883374de34869f620df2d9f',
    redirectUri: redirectUri || window.location.href,
    userPoolId: '68814af72ddc6630d1c92a51',
  });

  // Handle Authing redirect callback
  if (authing.isRedirectCallback()) {
    console.log('Authing redirect callback detected');
    authing.handleRedirectCallback().then(async (loginState) => {
      console.log('Authing loginState: ', loginState);
      try {
        const user = await authing.getUserInfo();
        console.log('Authing user info: ', user);
        if (user && (user.email || user.username)) {
          currentAuthingUser = user;
          localStorage.setItem("authingUser", JSON.stringify(user));
          updateUserUI(user);
          // Trigger a custom event to notify other parts of the app
          window.dispatchEvent(new CustomEvent('authingLogin', { detail: user }));
        }
      } catch (error) {
        console.error('Error getting Authing user info:', error);
      }
    }).catch(error => {
      console.error('Error handling Authing redirect:', error);
    });
  } else {
    // Check for existing login state
    authing.getLoginState({ ignoreCache: true }).then(loginState => {
      console.log('Existing Authing login state:', loginState);
      const user = loginState?.user;
      if (user && (user.email || user.username)) {
        currentAuthingUser = user;
        localStorage.setItem("authingUser", JSON.stringify(user));
        updateUserUI(user);
      }
    }).catch(error => {
      console.error('Error checking Authing login state:', error);
    });
  }

  return authing;
}

function updateUserUI(user) {
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const nameText = document.querySelector(".text-block-20");
  const modal = document.getElementById("auth-modal");

  if (user && (user.email || user.username)) {
    if (nameText) nameText.textContent = user.email || user.username;
    if (loginWrapper) loginWrapper.style.display = "none";
    if (userInfoWrapper) userInfoWrapper.style.display = "flex";
    if (modal) modal.style.display = "none";
  }
}

export function getAuthingUser() {
  if (currentAuthingUser) return currentAuthingUser;
  const stored = localStorage.getItem("authingUser");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      currentAuthingUser = user;
      return user;
    } catch (error) {
      console.error('Error parsing stored Authing user:', error);
      localStorage.removeItem("authingUser");
    }
  }
  return null;
}

export function logoutAuthing() {
  try {
    // Clear current user and localStorage
    currentAuthingUser = null;
    localStorage.removeItem("authingUser");

    // Create new Authing instance and logout
    const authing = new AuthingFactory.Authing({
      domain: 'https://brilique-ai.authing.cn',
      appId: '6883374de34869f620df2d9f',
      redirectUri: window.location.href,
      userPoolId: '68814af72ddc6630d1c92a51',
    });

    authing.logout({ redirectUri: window.location.href });
  } catch (error) {
    console.error('Error during Authing logout:', error);
  }
}

// Helper function to check if user is authenticated via Authing
export function isAuthingAuthenticated() {
  const user = getAuthingUser();
  return user && (user.email || user.username);
}