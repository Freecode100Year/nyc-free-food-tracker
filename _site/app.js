// NYC Free Food Tracker - Main Application Script

// 应用配置
const CONFIG = {
    mapCenter: [40.7128, -74.0060],
    mapZoom: 12,
    countdownHours: 48,
    updateInterval: 1000 // 1秒
};

// 位置数据
const LOCATIONS = [
    {
        id: 1,
        name: "Harvest Home Farmers' Market",
        lat: 40.793,
        lng: -73.944,
        type: "pantry",
        address: "E 110th St & Lexington Ave, Manhattan, NY 10029",
        time: "Today 8:00 AM - 4:00 PM",
        description: "Fresh produce distribution for local residents. Bring your own bags.",
        phone: "(212) 123-4567",
        requirements: "NYC residency required",
        hours: "Mon-Sat: 8AM-4PM"
    },
    {
        id: 2,
        name: "City Harvest Mobile Market",
        lat: 40.678,
        lng: -73.944,
        type: "grabngo",
        address: "Bedford-Stuyvesant, Brooklyn, NY 11233",
        time: "Tomorrow 10:00 AM - 2:00 PM",
        description: "Pre-packaged food boxes with non-perishable items.",
        phone: "(718) 234-5678",
        requirements: "First come, first served",
        hours: "Wed: 10AM-2PM"
    },
    {
        id: 3,
        name: "Community Fridge NYC - Jackson Heights",
        lat: 40.755,
        lng: -73.885,
        type: "fridge",
        address: "37th Ave & 82nd St, Queens, NY 11372",
        time: "Open 24/7",
        description: "Community-supported refrigerator. Take what you need, leave what you can.",
        phone: "(718) 345-6789",
        requirements: "None",
        hours: "24/7"
    },
    {
        id: 4,
        name: "Food Bank For NYC - Midtown",
        lat: 40.748,
        lng: -73.986,
        type: "pantry",
        address: "39 Broadway, Manhattan, NY 10006",
        time: "Mon-Fri 9:00 AM - 5:00 PM",
        description: "Emergency food assistance and SNAP application help.",
        phone: "(212) 456-7890",
        requirements: "Income verification",
        hours: "Mon-Fri: 9AM-5PM"
    },
    {
        id: 5,
        name: "Holy Apostles Soup Kitchen",
        lat: 40.750,
        lng: -74.006,
        type: "grabngo",
        address: "296 9th Ave, Manhattan, NY 10001",
        time: "Daily 10:30 AM - 12:30 PM",
        description: "Hot meals to go. One of NYC's largest soup kitchens.",
        phone: "(212) 567-8901",
        requirements: "None",
        hours: "Daily: 10:30AM-12:30PM"
    },
    {
        id: 6,
        name: "Bronx Community Fridge",
        lat: 40.826,
        lng: -73.916,
        type: "fridge",
        address: "149th St & 3rd Ave, Bronx, NY 10451",
        time: "Open 24/7",
        description: "Stocked daily by local volunteers and businesses.",
        phone: "(718) 678-9012",
        requirements: "None",
        hours: "24/7"
    },
    {
        id: 7,
        name: "Staten Island Food Distribution",
        lat: 40.579,
        lng: -74.150,
        type: "pantry",
        address: "Bay Street, Staten Island, NY 10301",
        time: "Thursday 11:00 AM - 3:00 PM",
        description: "Weekly food distribution for Staten Island residents.",
        phone: "(718) 789-0123",
        requirements: "Staten Island residency",
        hours: "Thu: 11AM-3PM"
    }
];

// 图标配置
const ICON_CONFIG = {
    pantry: {
        color: '#10b981',
        icon: 'shopping-basket',
        name: 'Food Pantry'
    },
    grabngo: {
        color: '#f59e0b',
        icon: 'utensils',
        name: 'Grab & Go'
    },
    fridge: {
        color: '#8b5cf6',
        icon: 'snowflake',
        name: 'Community Fridge'
    }
};

// 全局变量
let map;
let markers = [];
let currentFilter = 'all';
let countdownInterval;

// 初始化应用
function initApp() {
    initMap();
    initCountdown();
    renderLocationCards();
    setupEventListeners();
    updateFilterCounts();
    
    // 调整地图大小
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 100);
    
    console.log('NYC Free Food Tracker initialized successfully! 🗺️');
}

// 初始化地图
function initMap() {
    map = L.map('map').setView(CONFIG.mapCenter, CONFIG.mapZoom);
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 10
    }).addTo(map);
    
    // 添加位置标记
    addLocationMarkers();
}

// 添加位置标记
function addLocationMarkers() {
    markers = [];
    
    LOCATIONS.forEach(location => {
        const config = ICON_CONFIG[location.type];
        
        // 创建自定义图标
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: ${config.color};
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                ">
                    <i class="fas fa-${config.icon}"></i>
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // 创建标记
        const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
        
        // 弹出窗口内容
        const popupContent = `
            <div style="min-width: 280px; padding: 15px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <div style="
                        background-color: ${config.color};
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 18px;
                    ">
                        <i class="fas fa-${config.icon}"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #1e293b;">${location.name}</h3>
                        <div style="
                            display: inline-block;
                            padding: 4px 12px;
                            background: ${config.color};
                            color: white;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: bold;
                        ">
                            ${config.name}
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <p style="margin: 0 0 8px 0; color: #475569;">
                        <i class="fas fa-map-marker-alt" style="color: ${config.color};"></i>
                        ${location.address}
                    </p>
                    <p style="margin: 0 0 8px 0; color: #10b981;">
                        <i class="fas fa-clock" style="color: #10b981;"></i>
                        ${location.time}
                    </p>
                    <p style="margin: 0 0 8px 0; color: #475569;">
                        <i class="fas fa-info-circle" style="color: ${config.color};"></i>
                        ${location.description}
                    </p>
                </div>
                
                <div style="
                    background: #f8fafc;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 10px;
                    border-left: 3px solid ${config.color};
                ">
                    <p style="margin: 0 0 5px 0; color: #475569; font-size: 13px;">
                        <strong>Hours:</strong> ${location.hours}
                    </p>
                    <p style="margin: 0 0 5px 0; color: #475569; font-size: 13px;">
                        <strong>Phone:</strong> ${location.phone}
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 13px;">
                        <strong>Requirements:</strong> ${location.requirements}
                    </p>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push({ marker, location });
    });
}

// 初始化倒计时
function initCountdown() {
    const timerElement = document.getElementById('timer');
    let totalSeconds = CONFIG.countdownHours * 3600;
    
    function updateCountdown() {
        if (totalSeconds <= 0) {
            totalSeconds = CONFIG.countdownHours * 3600; // 重置
        }
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
        
        totalSeconds--;
        
        // 每小时更新一次位置状态
        if (totalSeconds % 3600 === 0) {
            updateLocationStatus();
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, CONFIG.updateInterval);
}

// 更新位置状态（模拟实时更新）
function updateLocationStatus() {
    console.log('Updating location status...');
    // 在实际应用中，这里会调用 API 获取最新数据
}

// 渲染位置卡片
function renderLocationCards() {
    const container = document.getElementById('locations-list');
    container.innerHTML = '';
    
    const filteredLocations = filterLocations(currentFilter);
    
    filteredLocations.forEach(location => {
        const config = ICON_CONFIG[location.type];
        const card = document.createElement('div');
        card.className = 'location-card';
        card.dataset.id = location.id;
        card.dataset.type = location.type;
        
        card.innerHTML = `
            <div class="location-name">
                <i class="fas fa-${config.icon}" style="color: ${config.color};"></i>
                ${location.name}
            </div>
            <div class="location-address">
                <i class="fas fa-map-marker-alt"></i>
                ${location.address}
            </div>
            <div class="location-time">
                <i class="fas fa-clock"></i>
                ${location.time}
            </div>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #cbd5e1;">
                <i class="fas fa-info-circle"></i>
                ${location.description}
            </div>
            <div class="category-badge ${location.type}">
                ${config.name}
            </div>
        `;
        
        // 点击卡片时打开对应的地图标记
        card.addEventListener('click', () => {
            const markerData = markers.find(m => m.location.id === location.id);
            if (markerData) {
                markerData.marker.openPopup();
                map.setView([location.lat, location.lng], 15);
            }
        });
        
        container.appendChild(card);
    });
}

// 过滤位置
function filterLocations(filter) {
    if (filter === 'all') {
        return LOCATIONS;
    }
    return LOCATIONS.filter(location => location.type === filter);
}

// 设置事件监听器
function setupEventListeners() {
    // 过滤器按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新活动按钮
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新过滤器
            currentFilter = this.dataset.filter;
            
            // 更新地图标记
            updateMapMarkers();
            
            // 更新位置卡片
            renderLocationCards();
        });
    });
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
        if (map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
}

// 更新地图标记
function updateMapMarkers() {
    markers.forEach(({ marker, location }) => {
        if (currentFilter === 'all' || location.type === currentFilter) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
}

// 更新过滤器计数
function updateFilterCounts() {
    const counts = {
        all: LOCATIONS.length,
        pantry: LOCATIONS.filter(l => l.type === 'pantry').length,
        grabngo: LOCATIONS.filter(l => l.type === 'grabngo').length,
        fridge: LOCATIONS.filter(l => l.type === 'fridge').length
    };
    
    Object.keys(counts).forEach(filter => {
        const element = document.getElementById(`count-${filter}`);
        if (element) {
            element.textContent = counts[filter];
        }
    });
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 隐藏加载动画，显示应用
    const loading = document.getElementById('loading');
    const app = document.getElementById('app');
    
    if (loading && app) {
        setTimeout(() => {
            loading.style.display = 'none';
            app.style.display = 'flex';
            initApp();
        }, 500);
    } else {
        initApp();
    }
});

// 导出全局函数（如果需要）
window.NYC_FoodTracker = {
    initApp,
    filterLocations,
    updateFilterCounts
};