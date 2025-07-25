//const authing = new AuthingFactory.Authing({
//  // 控制台 -> 应用 -> 单点登录 SSO -> 配置 -> 应用面板地址，如：https://my-awesome-sso.authing.cn
//  domain: 'https://brilique-ai.authing.cn',
//
//  // 控制台 -> 自建应用 -> 点击进入相应的应用 -> 端点信息 -> APP ID
//  appId: '6883374de34869f620df2d9f',
//
//  // 控制台 -> 自建应用 -> 点击进入相应的应用 -> 认证配置 -> 登录回调 URL
//  redirectUri: 'https://jding25.github.io/brilique-ai-jewelry-frontend/generate.html',
////  redirectUri:window.location.href,
//});
//
//console.log('Configured redirectUri:', authing.redirectUri);
//console.log('Current page URL:', window.location.href);
//console.log('Is redirect callback:', authing.isRedirectCallback());
//
//if (authing.isRedirectCallback()) {
//  console.log('redirect')
//  authing.handleRedirectCallback().then(loginState => {
//    console.log('loginState: ', loginState)
//    // 因 code 只能使用一次，所以这里需要将页面重定向到其他地址，这里以刷新当前页面为例：
//    window.location.replace('/')
//  })
//} else {
//  authing.getLoginState({
//    ignoreCache: true // 是否忽略本地缓存，忽略后从远端实时校验用户登录状态
//  }).then(loginState => {
//    console.log('loginState: ', loginState)
//  })
//}
//
//document.querySelector('#loginWithRedirect').onclick = function () {
//  authing.loginWithRedirect()
//}

const guard = new GuardFactory.Guard({
// 你可以前往 Authing 控制台的本应用详情页查看你的 APP ID
appId: '6883374de34869f620df2d9f',
});
console.log("guard instance: ", guard);
// 挂载 Authing Guard


document.querySelector('#loginWithRedirect').onclick = function () {
guard.startWithRedirect();
}
