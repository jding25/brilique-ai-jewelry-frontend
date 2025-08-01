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
      const userInfo = {
        email: user.email,
      };
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      if (user && user.email) {
        document.querySelector(".text-block-20").textContent = user.email;
        document.getElementById("login-wrapper").style.display = "none";
        document.getElementById("user-info-wrapper").style.display = "flex";
      }
    });
  } else {
    authing.getLoginState({ ignoreCache: true }).then(loginState => {
      const user = loginState?.user;
      if (user && user.email) {
        document.querySelector(".text-block-20").textContent = user.email;
        document.getElementById("login-wrapper").style.display = "none";
        document.getElementById("user-info-wrapper").style.display = "flex";
      }
    });
  }

  return authing;
}
function updateUserUI(email) {
  document.querySelector(".text-block-20").textContent = email;
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("user-info-wrapper").style.display = "flex";
  document.getElementById("auth-modal").style.display = "none";
}