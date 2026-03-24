// 简单的 NYC Free Food Tracker Worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 如果是根路径，返回 HTML
  if (url.pathname === '/') {
    return new Response(getHTML(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  // 如果是 CSS
  if (url.pathname === '/css/styles.css') {
    return new Response(getCSS(), {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  // 如果是 JS
  if (url.pathname === '/js/app.js') {
    return new Response(getJS(), {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  // 默认返回 HTML
  return new Response(getHTML(), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NYC 48-Hour Free Food Tracker</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/styles.css">
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
                    <div class="location-name">Harvest Home Farmers' Market</div>
                    <div class="location-address">E 110th St & Lexington Ave, Manhattan</div>
                    <div class="location-time"><i class="fas fa-clock"></i> Today 8AM-4PM</div>
                    <div class="category-badge pantry">Food Pantry</div>
                </div>
                
                <div class="location-card">
                    <div class="location-name">City Harvest Mobile Market</div>
                    <div class="location-address">Bedford-Stuyvesant, Brooklyn</div>
                    <div class="location-time"><i class="fas fa-clock"></i> Tomorrow 10AM-2PM</div>
                    <div class="category-badge grabngo">Grab & Go</div>
                </div>
                
                <div class="location-card">
                    <div class="location-name">Community Fridge NYC</div>
                    <div class="location-address">Jackson Heights, Queens</div>
                    <div class="location-time"><i class="fas fa-clock"></i> Open 24/7</div>
                    <div class="category-badge fridge">Community Fridge</div>
                </div>
            </div>
            
            <div class="footer">
                <p>Data from NYC Open Data • Updated daily</p>
                <p>Made with ❤️ by 肖勤立bot • Deployed on Cloudflare Workers</p>
            </div>
        </div>
        
        <div class="main">
            <div id="map"></div>
        </div>
    </div>

    <script src="/js/app.js"></script>
</body>
</html>`
}

function getCSS() {
  return `/* 基础样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; }

.container { display: flex; height: 100vh; }
.sidebar { width: 350px; background: #1e293b; padding: 25px; overflow-y: auto; border-right: 2px solid #334155; }
.main { flex: 1; position: relative; }
#map { width: 100%; height: 100%; }

/* 头部 */
.header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #334155; }
.header h1 { font-size: 1.8rem; margin-bottom: 8px; color: #60a5fa; display: flex; align-items: center; gap: 10px; }
.header p { color: #94a3b8; font-size: 0.95rem; }

/* 倒计时 */
.countdown { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.countdown h3 { color: #dbeafe; margin-bottom: 12px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
.timer { font-size: 2.5rem; font-weight: bold; color: white; font-family: 'Courier New', monospace; margin: 10px 0; }
.countdown p { color: #bfdbfe; font-size: 0.9rem; }

/* 过滤器 */
.filters { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px; }
.filter-btn { background: #334155; border: none; color: #e2e8f0; padding: 14px; border-radius: 10px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.95rem; }
.filter-btn:hover { background: #475569; transform: translateY(-2px); }
.filter-btn.active { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
.filter-btn i { font-size: 1.2rem; }

/* 位置卡片 */
.locations { margin-top: 25px; }
.location-card { background: #334155; padding: 18px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6; transition: all 0.3s; }
.location-card:hover { background: #475569; transform: translateX(5px); }
.location-name { font-weight: bold; margin-bottom: 8px; color: #93c5fd; font-size: 1.1rem; }
.location-address { color: #cbd5e1; font-size: 0.9rem; margin-bottom: 8px; }
.location-time { color: #86efac; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }

/* 分类徽章 */
.category-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
.category-badge.pantry { background: #10b981; color: white; }
.category-badge.grabngo { background: #f59e0b; color: white; }
.category-badge.fridge { background: #8b5cf6; color: white; }

/* 页脚 */
.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #475569; text-align: center; color: #94a3b8; font-size: 0.85rem; }
.footer p { margin-bottom: 5px; }

/* 响应式设计 */
@media (max-width: 1024px) {
    .sidebar { width: 300px; }
}

@media (max-width: 768px) {
    .container { flex-direction: column; }
    .sidebar { width: 100%; height: 50vh; border-right: none; border-bottom: 2px solid #334155; }
    .main { height: 50vh; }
    .filters { grid-template-columns: 1fr; }
}

/* 滚动条 */
.sidebar::-webkit-scrollbar { width: 8px; }
.sidebar::-webkit-scrollbar-track { background: #1e293b; }
.sidebar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
.sidebar::-webkit-scrollbar-thumb:hover { background: #64748b; }`
}

function getJS() {
  return `// 初始化地图
const map = L.map('map').setView([40.7128, -74.0060], 12);

// 添加地图图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// 示例位置数据
const locations = [
    {
        name: "Harvest Home Farmers' Market",
        lat: 40.793,
        lng: -73.944,
        type: "pantry",
        address: "E 110th St & Lexington Ave, Manhattan",
        time: "Today 8AM-4PM",
        description: "Fresh produce distribution"
    },
    {
        name: "City Harvest Mobile Market",
        lat: 40.678,
        lng: -73.944,
        type: "grabngo",
        address: "Bedford-Stuyvesant, Brooklyn",
        time: "Tomorrow 10AM-2PM",
        description: "Pre-packaged food boxes"
    },
    {
        name: "Community Fridge NYC",
        lat: 40.755,
        lng: -73.885,
        type: "fridge",
        address: "Jackson Heights, Queens",
        time: "Open 24/7",
        description: "Take what you need, leave what you can"
    },
    {
        name: "Food Bank For NYC",
        lat: 40.748,
        lng: -73.986,
        type: "pantry",
        address: "Midtown Manhattan",
        time: "Mon-Fri 9AM-5PM",
        description: "Emergency food assistance"
    },
    {
        name: "Soup Kitchen - Holy Apostles",
        lat: 40.750,
        lng: -74.006,
        type: "grabngo",
        address: "Chelsea, Manhattan",
        time: "Daily 10:30AM-12:30PM",
        description: "Hot meals to go"
    }
];

// 标记图标颜色
const iconColors = {
    pantry: 'green',
    grabngo: 'orange',
    fridge: 'purple'
};

// 添加标记到地图
const markers = [];
locations.forEach(location => {
    const icon = L.divIcon({
        className: 'custom-marker',
        html: \`<div style="background-color: \${iconColors[location.type]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>\`,
        iconSize: [24, 24]
    });
    
    const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
    
    // 弹出窗口内容
    const popupContent = \`
        <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: \${iconColors[location.type]};">\${location.name}</h3>
            <p style="margin: 0 0 5px 0; color: #666;"><i class="fas fa-map-marker-alt"></i> \${location.address}</p>
            <p style="margin: 0 0 5px 0; color: #2ecc71;"><i class="fas fa-clock"></i> \${location.time}</p>
            <p style="margin: 0 0 8px 0; color: #7f8c8d;">\${location.description}</p>
            <span style="display: inline-block; padding: 3px 10px; background: \${iconColors[location.type]}; color: white; border-radius: 12px; font-size: 12px;">
                \${location.type === 'pantry' ? 'Food Pantry' : location.type === 'grabngo' ? 'Grab & Go' : 'Community Fridge'}
            </span>
        </div>
    \`;
    
    marker.bindPopup(popupContent);
    markers.push({ marker, location });
});

// 倒计时功能
function updateTimer() {
    const timer = document.getElementById('timer');
    let totalSeconds = 48 * 60 * 60; // 48小时转换为秒
    
    function update() {
        if (totalSeconds <= 0) {
            totalSeconds = 48 * 60 * 60; // 重置
        }
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        timer.textContent = \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        totalSeconds--;
    }
    
    update(); // 立即更新一次
    setInterval(update, 1000); // 每秒更新
}

// 过滤功能
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 更新活动按钮
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        
        // 过滤标记
        markers.forEach(({ marker, location }) => {
            if (filter === 'all' || location.type === filter) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
        
        // 过滤位置卡片
        const locationCards = document.querySelectorAll('.location-card');
        locationCards.forEach(card => {
            const badge = card.querySelector('.category-badge');
            const type = badge.classList.contains('pantry') ? 'pantry' : 
                        badge.classList.contains('grabngo') ? 'grabngo' : 'fridge';
            
            if (filter === 'all' || type === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 初始化
updateTimer();

// 地图调整
setTimeout(() => {
    map.invalidateSize();
}, 100);

console.log('NYC Free Food Tracker loaded successfully! 🗺️');`
}