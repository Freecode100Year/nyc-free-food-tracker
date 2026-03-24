// Cloudflare Worker 版本 - NYC Free Food Tracker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API 端点
    if (url.pathname === '/api/food-locations') {
      return handleAPIRequest();
    }
    
    // 主页面
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(getHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }
    
    // 静态资源
    if (url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/')) {
      // 这里可以添加静态资源服务逻辑
      return new Response('Static resource', { status: 404 });
    }
    
    return new Response('NYC Free Food Tracker API', { status: 200 });
  }
};

// 处理 API 请求
async function handleAPIRequest() {
  const sampleData = getSampleData();
  
  return new Response(JSON.stringify(sampleData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 获取示例数据（简化版）
function getSampleData() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[now.getDay()];
  const tomorrowName = days[(now.getDay() + 1) % 7];
  
  return [
    {
      name: 'St. John\'s Food Pantry',
      address: '123 Main St, Manhattan, NY 10001',
      latitude: 40.7489,
      longitude: -73.9680,
      hours: `${todayName}: 10am-2pm, ${tomorrowName}: 9am-1pm`,
      category: 'Pantry',
      description: 'Food pantry providing fresh produce and groceries'
    },
    {
      name: 'Community Kitchen NYC',
      address: '456 Broadway, Brooklyn, NY 11201',
      latitude: 40.6782,
      longitude: -73.9442,
      hours: `${todayName}: 12pm-4pm, ${tomorrowName}: 11am-3pm`,
      category: 'Grab & Go',
      description: 'Hot meals served to go'
    },
    {
      name: 'Williamsburg Community Fridge',
      address: '789 Bedford Ave, Brooklyn, NY 11211',
      latitude: 40.7081,
      longitude: -73.9571,
      hours: '24/7 Accessible',
      category: 'Community Fridge',
      description: 'Take what you need, leave what you can'
    }
  ];
}

// 生成 HTML 页面
function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NYC 48-Hour Free Food Tracker</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .filter-btn { display: flex; align-items: center; padding: 0.75rem 1rem; border-radius: 0.5rem; border-width: 2px; font-weight: 500; }
        .location-card { background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; }
        #map { height: 100%; width: 100%; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="flex flex-col h-screen">
        <header class="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4">
            <h1 class="text-2xl font-bold"><i class="fas fa-utensils mr-2"></i>NYC 48-Hour Free Food Tracker</h1>
            <p class="text-blue-100">Find free food locations open within the next 48 hours</p>
        </header>
        
        <div class="flex flex-1">
            <aside class="w-80 bg-white p-4 border-r">
                <h2 class="text-xl font-bold mb-3">Filter by Type</h2>
                <div class="space-y-2">
                    <button class="filter-btn bg-blue-100 text-blue-700 w-full" onclick="filterLocations('all')">All Locations</button>
                    <button class="filter-btn bg-green-100 text-green-700 w-full" onclick="filterLocations('Pantry')">Food Pantry</button>
                    <button class="filter-btn bg-orange-100 text-orange-700 w-full" onclick="filterLocations('Grab & Go')">Grab & Go</button>
                    <button class="filter-btn bg-purple-100 text-purple-700 w-full" onclick="filterLocations('Community Fridge')">Community Fridge</button>
                </div>
                
                <div class="mt-6">
                    <h2 class="text-xl font-bold mb-3">Location List</h2>
                    <div id="location-list">Loading...</div>
                </div>
            </aside>
            
            <main class="flex-1 relative">
                <div id="map"></div>
            </main>
        </div>
    </div>
    
    <script>
        let map;
        let markers = [];
        let allLocations = [];
        
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化地图
            map = L.map('map').setView([40.7128, -74.0060], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // 加载数据
            loadLocations();
        });
        
        async function loadLocations() {
            try {
                const response = await fetch('/api/food-locations');
                allLocations = await response.json();
                updateMap();
                updateLocationList();
            } catch (error) {
                console.error('Error loading locations:', error);
                document.getElementById('location-list').innerHTML = '<p class="text-red-500">Failed to load locations</p>';
            }
        }
        
        function updateMap(filter = 'all') {
            // 清除现有标记
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            
            const filtered = allLocations.filter(loc => filter === 'all' || loc.category === filter);
            
            filtered.forEach(location => {
                const marker = L.marker([location.latitude, location.longitude])
                    .bindPopup(\`
                        <h3 class="font-bold">\${location.name}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> \${location.address}</p>
                        <p><i class="fas fa-clock"></i> \${location.hours}</p>
                        <p>\${location.description}</p>
                    \`)
                    .addTo(map);
                markers.push(marker);
            });
            
            if (filtered.length > 0) {
                const group = new L.FeatureGroup(markers);
                map.fitBounds(group.getBounds());
            }
        }
        
        function updateLocationList() {
            const list = document.getElementById('location-list');
            list.innerHTML = allLocations.map(loc => \`
                <div class="location-card">
                    <h4 class="font-bold">\${loc.name}</h4>
                    <p class="text-sm text-gray-600">\${loc.address}</p>
                    <p class="text-sm">\${loc.hours}</p>
                    <span class="text-xs px-2 py-1 rounded-full \${getCategoryClass(loc.category)}">
                        \${loc.category}
                    </span>
                </div>
            \`).join('');
        }
        
        function filterLocations(category) {
            updateMap(category);
        }
        
        function getCategoryClass(category) {
            switch(category) {
                case 'Pantry': return 'bg-green-100 text-green-800';
                case 'Grab & Go': return 'bg-orange-100 text-orange-800';
                case 'Community Fridge': return 'bg-purple-100 text-purple-800';
                default: return 'bg-blue-100 text-blue-800';
            }
        }
    </script>
</body>
</html>`;
}