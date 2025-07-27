const authing = new AuthingFactory.Authing({
  // 控制台 -> 应用 -> 单点登录 SSO -> 配置 -> 应用面板地址，如：https://my-awesome-sso.authing.cn
  domain: 'https://brilique-ai.authing.cn',

  // 控制台 -> 自建应用 -> 点击进入相应的应用 -> 端点信息 -> APP ID
  appId: '6883374de34869f620df2d9f',

  // 控制台 -> 自建应用 -> 点击进入相应的应用 -> 认证配置 -> 登录回调 URL
  redirectUri: 'https://jding25.github.io/brilique-ai-jewelry-frontend/authing.html',
//  redirectUri:window.location.href,

  userPoolId: '68814af72ddc6630d1c92a51',
});

console.log('Configured redirectUri:', authing.redirectUri);
console.log('Current page URL:', window.location.href);
console.log('Is redirect callback:', authing.isRedirectCallback());

if (authing.isRedirectCallback()) {
  console.log('authing.isRedirectCallback()')
  authing.handleRedirectCallback().then(loginState => {
    console.log('loginState: ', loginState)
    const user = loginState.user;
    console.log('loginState user is: ', user)
    if (user) {
      console.log('Logged in as:', user.email);
//      document.getElementById('user-email').textContent = user.email;
//
//      document.getElementById('login-with-authing').style.display = 'none';
//      document.getElementById('user-info').style.display = 'block';
    }

  })
} else {
  authing.getLoginState({
    ignoreCache: true // 是否忽略本地缓存，忽略后从远端实时校验用户登录状态
  }).then(loginState => {
    console.log('loginState: ', loginState)
  })
}

document.querySelector('#loginWithRedirect').onclick = function () {
  authing.loginWithRedirect()
}

//window.onload = () => {
//    const guard = new GuardFactory.Guard({
//        host: 'brilique-ai.authing.cn',
//        appId: '6883374de34869f620df2d9f',
//        baseUrl: 'https://brilique-ai.authing.cn',
//        // No redirectUri needed for embedded mode
//    });
//
//    console.log("guard instance: ", guard);
//
//    // Check if user is already logged in
//    guard.getLoginState().then(loginState => {
//        if (loginState) {
//            console.log('User already logged in:', loginState);
//            showUserInfo(loginState.user);
//        }
//    }).catch(error => {
//        console.log('No existing login state');
//    });
//
//    // Handle login button click - embed the guard
//    document.querySelector('#loginWithRedirect').onclick = function () {
//        console.log("Showing embedded login form");
//
//        // Clear the current content and show Guard
//        const container = document.querySelector('.container');
//        container.innerHTML = '<div id="guard-container"></div>';
//
//        // Start Guard in the container
//        guard.start('#guard-container').then(loginState => {
//            console.log('Login successful:', loginState);
//
//            // Restore the original UI and show user info
//            location.reload(); // Simple way to reset the UI
//
//        }).catch(error => {
//            console.error('Login error:', error);
//        });
//    }
//}
//
//function showUserInfo(user) {
//    const loginDiv = document.getElementById('login-with-authing');
//    const userInfoDiv = document.getElementById('user-info');
//    const userEmail = document.getElementById('user-email');
//
//    if (loginDiv) loginDiv.style.display = 'none';
//    if (userInfoDiv) userInfoDiv.style.display = 'block';
//    if (userEmail && user.email) userEmail.textContent = 'Email: ' + user.email;
//}
//
//function logout() {
//    const guard = new GuardFactory.Guard({
//        host: 'brilique-ai.authing.cn',
//        appId: '6883374de34869f620df2d9f',
//        baseUrl: 'https://brilique-ai.authing.cn',
//    });
//
//    guard.logout().then(() => {
//        location.reload(); // Reset the page
//    });
//}