// 退出登录
function logout() {
  // 清除 nf_jwt cookie
  document.cookie = 'nf_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'nf_jwt=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // 清除 localStorage
  localStorage.removeItem('gotrue.user');
  
  // 调用 Netlify Identity 的 logout
  if (typeof netlifyIdentity !== 'undefined') {
    netlifyIdentity.logout();
  }
  
  // 跳转到登录页
  window.location.href = '/login.html';
}

// 导出到全局
window.logout = logout;
