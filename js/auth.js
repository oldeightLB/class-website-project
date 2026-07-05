// 初始化 Netlify Identity
netlifyIdentity.init();

// 获取当前页面名称
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isLoginPage = currentPage === 'login.html';

// 认证状态检查
// Netlify Identity 会自动处理 hash fragment 中的验证 token（#confirmation_token=xxx）
// 我们只需要关注用户的登录状态，不需要手动检测验证流程
netlifyIdentity.on('init', user => {
  if (!user && !isLoginPage) {
    // 未登录且不在登录页，跳转到登录页
    window.location.href = '/login.html';
  } else if (user && isLoginPage) {
    // 已登录且在登录页，跳转到主页
    window.location.href = '/';
  }
});

// 登录成功事件
netlifyIdentity.on('login', user => {
  window.location.href = '/';
});

// 退出登录
function logout() {
  netlifyIdentity.logout();
  window.location.href = '/login.html';
}

// 导出到全局
window.logout = logout;
