export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 可以在这里添加 API 端点
    if (url.pathname === '/api/locations') {
      return new Response(JSON.stringify({
        message: "NYC Food Locations API",
        status: "ok",
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 默认返回静态文件
    return env.ASSETS.fetch(request);
  }
};
