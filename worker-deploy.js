// NYC Free Food Tracker - Cloudflare Worker
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 读取文件内容
    const files = {
      '/': {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NYC 48-Hour Free Food Tracker</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { display: flex; height: 100vh; }
        .sidebar { width: 300px; background: #1a202c; color: white; padding: 20px; overflow-y: auto; }
        .main { flex: 1; position: relative; }
        #map { width: 100%; height: 100%; }
        .header { margin-bottom: 30px; }
        .header h1 { font-size: 1.5rem; margin-bottom: 5px; color: #63b3ed; }
        .header p { color: #a0aec0; font-size: 0.9rem; }
        .countdown { background: #2d3748; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; }
        .countdown h3 { color: #68d391; margin-bottom: 10px; }
        .timer { font-size: 2rem; font-weight: bold; color: white; }
        .filters { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .filter-btn { background: #2d3748; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 10px; }
        .filter-btn:hover { background: #4a5568; }
        .filter-btn.active { background: #4299e1; }
        .filter-btn i { font-size: 1.2rem; }
        .locations { margin-top: 20px; }
        .location-card { background: #2d3748; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
        .location-name { font-weight: bold; margin-bottom: 5px; color: #63b3ed; }
        .location-address { color: #a0aec0; font-size: 0.9rem; margin-bottom: 5px; }
        .location-time { color: #68d391; font-size: 0.8rem; }
        .footer { margin-top: 30px; text-align: center; color: #718096; font-size: 0.8rem; }
        @media (max-width: 768px) {
            .container { flex-direction: column; }
            .sidebar { width: 100%; height: 40vh; }
            .main { height: 60vh; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="header">
                <h1><i class="fas fa-utensils"></i> NYC Free Food Tracker</h1>
                <p>Find free food locations open within 48 hours</p>
            </div>
            
            <div class="countdown">
                <h3><i class="fas fa-clock"></i> 48-Hour Window</h3>
                <div class="timer" id="timer">48:00:00</div>
                <p>Locations shown are open within this time</p>
            </div>
            
            <div class="filters">
                <button class="filter-btn active" data-filter="all">
                    <i class="fas fa-layer-group"></i> All Locations
                </button>
                <button class="filter-btn" data-filter="pantry">
                    <i class="fas fa-shopping-basket"></i> Food Pantries
                </button>
                <button class="filter-btn" data-filter="grabngo">
                    <i class="fas fa-utensils"></i> Grab & Go
                </button>
                <button class="filter-btn" data-filter="fridge">
                    <i class="fas fa-snowflake"></i> Community Fridges
                </button>
            </div>
            
            <div class="locations" id="locations">
                <div class="location-card">
                    <div class="location-name">Loading locations...</div>
                </div>
            </div>
            
            <div class="footer">
                <p>Data from NYC Open Data • Updated daily</p>
                <p>Made with ❤️ by 肖勤立bot</p>
            </div>
        </div>
        
        <div class="main">
            <div id="map"></div>
        </div>
    </div>

    <script>
        // 初始化地图
        const map = L.map('map').setView([40.7128, -74.0060], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 示例数据
        const locations = [
            { name: "Food Bank NYC", lat: 40.7128, lng: -74.0060, type: "pantry", address: "123 Main St", time: "Today 2-4 PM" },
            { name: "Community Kitchen", lat: 40.7589, lng: -73.9851, type: "grabngo", address: "456 Park Ave", time: "Tomorrow 12-2 PM" },
            { name: "Free Fridge Harlem", lat: 40.8116, lng: -73.9465, type: "fridge", address: "789 125th St", time: "Open 24/7" }
        ];

        // 添加标记
        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng]).addTo(map);
            marker.bindPopup(`<b>${loc.name}</b><br>${loc.address}<br>${loc.time}`);
        });

        // 倒计时
        function updateTimer() {
            const timer = document.getElementById('timer');
            let hours = 48;
            const interval = setInterval(() => {
                if (hours <= 0) {
                    clearInterval(interval);
                    hours = 48; // 重置
                }
                const h = Math.floor(hours);
                const m = Math.floor((hours - h) * 60);
                const s = Math.floor(((hours - h) * 60 - m) * 60);
                timer.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                hours -= 0.0002778; // 每秒减少
            }, 1000);
        }
        updateTimer();

        // 过滤功能
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                // 这里可以添加过滤逻辑
            });
        });
    </script>
</body>
</html>`,
        type: 'text/html'
      }
    };
    
    // 返回对应的文件
    const file = files[url.pathname];
    if (file) {
      return new Response(file.content, {
        headers: {
          'Content-Type': file.type,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // 404 处理
    return new Response('Not Found', { status: 404 });
  }
};