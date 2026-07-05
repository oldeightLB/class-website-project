// 获取当前页面名称
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isLoginPage = currentPage === 'login.html';

// 检查是否是验证/邀请/恢复流程（hash fragment）
const hash = window.location.hash;
const isVerificationFlow = hash.includes('confirmation_token') || 
                          hash.includes('invite_token') || 
                          hash.includes('recovery_token');

// 初始化 Netlify Identity
netlifyIdentity.init();

// 如果是验证流程，手动处理验证 token
if (isVerificationFlow) {
  // 从hash中提取token
  const tokenMatch = hash.match(/(confirmation_token|invite_token|recovery_token)=([^&]+)/);
  if (tokenMatch) {
    const tokenType = tokenMatch[1];
    const token = tokenMatch[2];
    
    console.log('Processing verification token:', tokenType, token);
    
    // 使用底层的 GoTrue 客户端处理验证
    const gotrue = netlifyIdentity.gotrue;
    if (gotrue) {
      // 根据token类型处理
      let verificationPromise;
      
      if (tokenType === 'confirmation_token') {
        verificationPromise = gotrue.confirm(token);
      } else if (tokenType === 'invite_token') {
        verificationPromise = gotrue.acceptInvite(token);
      } else if (tokenType === 'recovery_token') {
        // 密码恢复需要特殊处理
        verificationPromise = Promise.resolve();
      }
      
      if (verificationPromise) {
        verificationPromise
          .then(user => {
            console.log('Verification successful:', user);
            // 清除URL中的hash
            history.replaceState(null, '', window.location.pathname);
            // 跳转到主页
            window.location.href = '/';
          })
          .catch(err => {
            console.error('Verification failed:', err);
            // 清除URL中的hash
            history.replaceState(null, '', window.location.pathname);
            // 跳转到登录页
            window.location.href = '/login.html';
          });
      }
    }
  }
} else {
  // 非验证流程时检查登录状态
  netlifyIdentity.on('init', user => {
    if (!user && !isLoginPage) {
      window.location.href = '/login.html';
    } else if (user && isLoginPage) {
      window.location.href = '/';
    }
  });
}

// 登录成功事件
netlifyIdentity.on('login', user => {
  if (!isVerificationFlow) {
    window.location.href = '/';
  }
});

// 退出登录
function logout() {
  // 清除 nf_jwt cookie
  document.cookie = 'nf_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'nf_jwt=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  netlifyIdentity.logout();
  window.location.href = '/login.html';
}

// 导出到全局
window.logout = logout;
