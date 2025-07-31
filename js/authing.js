let currentAuthingUser = null;

export function initializeAuthing({ redirectUri }) {
  const authing = new AuthingFactory.Authing({
    domain: 'https://brilique-ai.authing.cn',
    appId: '6883374de34869f620df2d9f',
    redirectUri: redirectUri || window.location.href,
    userPoolId: '68814af72ddc6630d1c92a51',
  });

  // Handle Authing redirect
  if (authing.isRedirectCallback()) {
    console.log('authing.isRedirectCallback()');
    authing.handleRedirectCallback().then(async (loginState) => {
      console.log('loginState: ', loginState);
      const user = await authing.getUserInfo();
      console.log('loginState user is: ', user.email)
      if (user && (user.email|| user.username)) {
          currentAuthingUser = user;
          localStorage.setItem("authingUser", JSON.stringify(user));
          updateUserUI(user);
          // Trigger a custom event to notify other parts of the app
          window.dispatchEvent(new CustomEvent('authingLogin', { detail: user }));
//        document.querySelector(".text-block-20").textContent = user.email;
//        document.getElementById("login-wrapper").style.display = "none";
//        document.getElementById("user-info-wrapper").style.display = "flex";
      }
    });
  } else {
    authing.getLoginState({ ignoreCache: true }).then(loginState => {
      const user = loginState?.user;
      if (user && (user.email || user.username)) {
//        document.querySelector(".text-block-20").textContent = user.email;
//        document.getElementById("login-wrapper").style.display = "none";
//        document.getElementById("user-info-wrapper").style.display = "flex";

        currentAuthingUser = user;
        localStorage.setItem("authingUser", JSON.stringify(user));
        updateUserUI(user);
      }
    });
  }

  return authing;
}
function updateUserUI(email) {
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
//  document.querySelector(".text-block-20").textContent = email;
//  document.getElementById("login-wrapper").style.display = "none";
//  document.getElementById("user-info-wrapper").style.display = "flex";
//  document.getElementById("auth-modal").style.display = "none";
}

export function getAuthingUser() {
  if (currentAuthingUser) return currentAuthingUser;
  const stored = localStorage.getItem("authingUser");
//  return stored ? JSON.parse(stored) : null;
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