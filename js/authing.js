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

let currentAuthingUser = null;

export function initializeAuthing({ redirectUri }) {
  console.log('Initializing Authing with redirectUri:', redirectUri);

  const authing = new AuthingFactory.Authing({
    domain: 'https://brilique-ai.authing.cn',
    appId: '6883374de34869f620df2d9f',
    redirectUri: redirectUri || window.location.href,
    userPoolId: '68814af72ddc6630d1c92a51',
  });

  console.log('Current URL:', window.location.href);
  console.log('URL search params:', window.location.search);

  // Handle Authing redirect
  if (authing.isRedirectCallback()) {
    console.log('✅ authing.isRedirectCallback() - Processing callback');
    authing.handleRedirectCallback().then(async (loginState) => {
      console.log('📝 loginState from callback: ', loginState);
      try {
        const user = await authing.getUserInfo();
        console.log('👤 User info retrieved: ', user);

        if (user && (user.email || user.username || user.phone)) {
          currentAuthingUser = user;
          localStorage.setItem("authingUser", JSON.stringify(user));
          console.log('💾 User saved to localStorage');

          updateUserUI(user);

          // Trigger a custom event to notify other parts of the app
          window.dispatchEvent(new CustomEvent('authingLogin', { detail: user }));

          // Clean up the URL to remove callback parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('🔄 URL cleaned up');
        } else {
          console.log('❌ No valid user data found');
        }
      } catch (error) {
        console.error('❌ Error getting user info:', error);
      }
    }).catch(error => {
      console.error('❌ Error handling redirect callback:', error);
    });
  } else {
    console.log('📋 Not a redirect callback, checking existing login state...');
    authing.getLoginState({ ignoreCache: true }).then(loginState => {
      console.log('📝 Existing login state: ', loginState);
      const user = loginState?.user;
      if (user && (user.email || user.username || user.phone)) {
        console.log('👤 Found existing user: ', user);
        currentAuthingUser = user;
        localStorage.setItem("authingUser", JSON.stringify(user));
        updateUserUI(user);
      } else {
        console.log('🔍 No existing user found, checking localStorage...');
        // Check localStorage as backup
        const storedUser = getAuthingUser();
        if (storedUser) {
          console.log('💾 Found user in localStorage: ', storedUser);
          updateUserUI(storedUser);
        }
      }
    }).catch(error => {
      console.error('❌ Error checking login state:', error);
    });
  }

  return authing;
}

function updateUserUI(user) {
  console.log('🎨 updateUserUI called with:', user);

  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");
  const nameText = document.querySelector(".text-block-20");
  const modal = document.getElementById("auth-modal");

  if (user && (user.email || user.username || user.phone)) {
    const displayName = user.email || user.username || user.phone || user.nickname || 'User';
    console.log('🏷️ Display name will be:', displayName);

    if (nameText) {
      nameText.textContent = displayName;
      console.log('✅ Updated name text to:', displayName);
    } else {
      console.log('❌ Could not find .text-block-20 element');
    }

    if (loginWrapper) {
      loginWrapper.style.display = "none";
      console.log('✅ Hid login wrapper');
    } else {
      console.log('❌ Could not find login-wrapper element');
    }

    if (userInfoWrapper) {
      userInfoWrapper.style.display = "flex";
      console.log('✅ Showed user info wrapper');
    } else {
      console.log('❌ Could not find user-info-wrapper element');
    }

    if (modal) {
      modal.style.display = "none";
      console.log('✅ Hid modal');
    }
  } else {
    console.log('❌ No valid user data to display');
  }
}

export function getAuthingUser() {
  if (currentAuthingUser) {
    console.log('👤 Returning current user from memory');
    return currentAuthingUser;
  }

  const stored = localStorage.getItem("authingUser");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      currentAuthingUser = user;
      console.log('💾 Retrieved user from localStorage:', user);
      return user;
    } catch (error) {
      console.error('❌ Error parsing stored Authing user:', error);
      localStorage.removeItem("authingUser");
    }
  }
  console.log('❌ No Authing user found');
  return null;
}

export function logoutAuthing() {
  try {
    console.log('🚪 Logging out Authing user');
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
    console.error('❌ Error during Authing logout:', error);
  }
}

export function isAuthingAuthenticated() {
  const user = getAuthingUser();
  const isAuth = user && (user.email || user.username || user.phone);
  console.log('🔍 Is Authing authenticated:', isAuth);
  return isAuth;
}

// Debug function to check current state
export function debugAuthingState() {
  console.log('🔍 === Authing Debug State ===');
  console.log('Current user in memory:', currentAuthingUser);
  console.log('User in localStorage:', localStorage.getItem("authingUser"));
  console.log('Is authenticated:', isAuthingAuthenticated());
  console.log('Login wrapper display:', document.getElementById("login-wrapper")?.style.display);
  console.log('User info wrapper display:', document.getElementById("user-info-wrapper")?.style.display);
  console.log('Name text content:', document.querySelector(".text-block-20")?.textContent);
}