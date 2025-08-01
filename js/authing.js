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

  try {
    const authing = new AuthingFactory.Authing({
      domain: 'https://brilique-ai.authing.cn',
      appId: '6883374de34869f620df2d9f',
      redirectUri: redirectUri || window.location.href,
      userPoolId: '68814af72ddc6630d1c92a51',
    });

    console.log('Current URL:', window.location.href);
    console.log('URL search params:', window.location.search);

    // Check if we have callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasCallbackParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');

    console.log('Has callback params:', hasCallbackParams);
    console.log('URL params:', Object.fromEntries(urlParams));

    // Handle Authing redirect callback
    if (hasCallbackParams && authing.isRedirectCallback()) {
      console.log('✅ Processing Authing callback...');

      // Add timeout to prevent hanging
      const callbackPromise = authing.handleRedirectCallback();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Callback timeout')), 10000)
      );

      Promise.race([callbackPromise, timeoutPromise])
        .then(async (loginState) => {
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
              const cleanUrl = window.location.origin + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
              console.log('🔄 URL cleaned up to:', cleanUrl);
            } else {
              console.log('❌ No valid user data found');
              handleCallbackError('No valid user data received');
            }
          } catch (userInfoError) {
            console.error('❌ Error getting user info:', userInfoError);
            handleCallbackError('Failed to get user information');
          }
        })
        .catch(error => {
          console.error('❌ Error handling redirect callback:', error);
          handleCallbackError('Authentication callback failed');
        });

    } else {
      console.log('📋 Not a redirect callback, checking existing login state...');

      // Check existing login state with timeout
      const loginStatePromise = authing.getLoginState({ ignoreCache: true });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login state check timeout')), 5000)
      );

      Promise.race([loginStatePromise, timeoutPromise])
        .then(loginState => {
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
            } else {
              console.log('❌ No user found anywhere');
            }
          }
        })
        .catch(error => {
          console.error('❌ Error checking login state:', error);
          // Fallback to localStorage
          console.log('🔄 Falling back to localStorage...');
          const storedUser = getAuthingUser();
          if (storedUser) {
            console.log('💾 Found user in localStorage: ', storedUser);
            updateUserUI(storedUser);
          }
        });
    }

    return authing;

  } catch (initError) {
    console.error('❌ Error initializing Authing:', initError);

    // Fallback to localStorage if initialization fails
    console.log('🔄 Falling back to localStorage due to init error...');
    const storedUser = getAuthingUser();
    if (storedUser) {
      console.log('💾 Found user in localStorage: ', storedUser);
      updateUserUI(storedUser);
    }

    return null;
  }
}

function handleCallbackError(message) {
  console.error('🚨 Callback error:', message);

  // Clean up URL parameters
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  // Check if we have a stored user as fallback
  const storedUser = getAuthingUser();
  if (storedUser) {
    console.log('🔄 Using stored user as fallback');
    updateUserUI(storedUser);
  } else {
    // Show error to user and reset to login state
    console.log('❌ No fallback user, showing login');
    resetToLoginState();
  }
}

function resetToLoginState() {
  const loginWrapper = document.getElementById("login-wrapper");
  const userInfoWrapper = document.getElementById("user-info-wrapper");

  if (loginWrapper) loginWrapper.style.display = "flex";
  if (userInfoWrapper) userInfoWrapper.style.display = "none";
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

    // Reset UI immediately
    resetToLoginState();

    // Create new Authing instance and logout (optional, can be disruptive)
    try {
      const authing = new AuthingFactory.Authing({
        domain: 'https://brilique-ai.authing.cn',
        appId: '6883374de34869f620df2d9f',
        redirectUri: window.location.href,
        userPoolId: '68814af72ddc6630d1c92a51',
      });

      // Only call logout if you want to redirect to Authing logout page
      // authing.logout({ redirectUri: window.location.href });
      console.log('✅ Local logout completed');

    } catch (logoutError) {
      console.error('❌ Error creating logout instance:', logoutError);
      // Local logout still succeeded
    }

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

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  console.log('URL parameters:', Object.fromEntries(urlParams));

  // Check if Authing SDK is available
  console.log('AuthingFactory available:', typeof window.AuthingFactory !== 'undefined');
}