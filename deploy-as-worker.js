// Cloudflare Worker 部署脚本
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 路由处理
    if (url.pathname === '/') {
      return new Response(env.HTML_CONTENT, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (url.pathname === '/css/styles.css') {
      return new Response(env.CSS_CONTENT, {
        headers: { 'Content-Type': 'text/css' }
      });
    } else if (url.pathname === '/js/app.js') {
      return new Response(env.JS_CONTENT, {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};