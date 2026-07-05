// 初始化 Netlify Identity
netlifyIdentity.init();

// 获取当前页面名称
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isLoginPage = currentPage === 'login.html';

// 检查是否是验证/邀请/恢复流程（hash fragment）
const hash = window.location.hash;
const isVerificationFlow = hash.includes('confirmation_token') || 
                          hash.includes('invite_token') || 
                          hash.includes('recovery_token');

// 认证状态检查
netlifyIdentity.on('init', user => {
  // 如果是验证流程，让 Netlify Identity 处理，不跳转
  if (isVerificationFlow) {
    return;
  }

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
  // 清除 nf_jwt cookie（Netlify Identity 的已知问题：logout() 不会清除 cookie）
  document.cookie = 'nf_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'nf_jwt=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // 调用 Netlify Identity 的 logout
  netlifyIdentity.logout();
  
  // 跳转到登录页
  window.location.href = '/login.html';
}

// 导出到全局
window.logout = logout;
