export function initializeAuthing({ redirectUri }) {
  // Use AuthingFactory.Authing as shown in the console output
  const authing = new AuthingFactory.Authing({
    domain: 'https://brilique-ai.authing.cn', // Keep the https:// prefix
    appId: '6883374de34869f620df2d9f',
    redirectUri: redirectUri || window.location.href,
    userPoolId: '68814af72ddc6630d1c92a51', // Keep this as it may be required
    setForceLogin: false,
    isSSO: true
  });

  return authing;
}

export function updateUserUI(email) {
  document.querySelector(".text-block-20").textContent = email;
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("user-info-wrapper").style.display = "flex";
  document.getElementById("auth-modal").style.display = "none";
}