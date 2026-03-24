# selectLocation 函数详解

## 完整函数代码

```javascript
// Select location in list and on map
function selectLocation(index) {
    selectedLocationId = index;
    updateLocationList();
    
    // Find and open the corresponding marker popup
    markers.eachLayer(function(marker) {
        if (marker.locationId === index) {
            map.setView([marker.getLatLng().lat, marker.getLatLng().lng], 15);
            marker.openPopup();
        }
    });
}
```

## 函数作用
这个函数用于在用户点击位置卡片时：
1. 设置当前选中的位置ID
2. 更新位置列表显示
3. 在地图上找到对应的标记并打开弹出窗口
4. 将地图视图移动到该位置

## 相关函数

### 1. updateLocationList()
```javascript
function updateLocationList() {
    // Filter locations based on current filter
    const filteredLocations = currentFilter === 'all' 
        ? allLocations 
        : allLocations.filter(location => location.category === currentFilter);
    
    // Update location list
    locationList.innerHTML = filteredLocations.map((location, index) => {
        // Find original index in allLocations
        const originalIndex = allLocations.findIndex(loc => 
            loc.name === location.name && 
            loc.latitude === location.latitude && 
            loc.longitude === location.longitude
        );
        return createLocationCard(location, originalIndex);
    }).join('');
}
```

### 2. createLocationCard()
```javascript
function createLocationCard(location, index) {
    const isActive = selectedLocationId === index ? 'active' : '';
    return `
        <div class="location-card ${isActive}" data-index="${index}" onclick="selectLocation(${index})">
            <div class="location-header">
                <h3 class="location-name">${location.name}</h3>
                <span class="location-category ${location.category.toLowerCase().replace(' & ', '-')}">
                    ${location.category}
                </span>
            </div>
            <div class="location-details">
                <p class="location-address">${location.address}</p>
                <p class="location-hours">${location.hours}</p>
                <div class="location-actions">
                    <button class="btn-map" onclick="focusOnMap(${index}); event.stopPropagation();">
                        <i class="fas fa-map-marker-alt"></i> View on Map
                    </button>
                </div>
            </div>
        </div>
    `;
}
```

### 3. 全局导出
```javascript
// Make functions available globally for inline onclick handlers
window.selectLocation = selectLocation;
window.focusOnMap = focusOnMap;
window.selectLocationInList = selectLocationInList;
```

## 使用示例

### HTML中的调用
```html
<!-- 在位置卡片中调用 -->
<div class="location-card" onclick="selectLocation(0)">
    <!-- 卡片内容 -->
</div>

<!-- 在地图标记中调用 -->
<script>
marker.on('click', function() {
    selectLocation(this.locationId);
});
</script>
```

### JavaScript中的调用
```javascript
// 通过事件监听器调用
document.querySelector('.location-card').addEventListener('click', function() {
    const index = this.getAttribute('data-index');
    selectLocation(parseInt(index));
});

// 直接调用
selectLocation(5); // 选择第6个位置（0-based索引）
```

## 常见问题解决

### 1. 乱码问题
如果看到乱码，可能是：
- 文件编码问题：确保使用UTF-8编码
- 浏览器缓存：清除浏览器缓存
- 特殊字符：检查是否有不可打印字符

### 2. 函数未定义
确保函数已全局导出：
```javascript
window.selectLocation = selectLocation;
```

### 3. 索引错误
确保传递正确的索引值：
- 使用 `parseInt()` 转换字符串索引
- 检查索引是否在有效范围内

## 调试建议
1. 打开浏览器开发者工具（F12）
2. 检查Console标签页是否有错误
3. 在Sources标签页中查看app.js文件
4. 在selectLocation函数中添加调试语句：
```javascript
function selectLocation(index) {
    console.log('selectLocation called with index:', index);
    console.log('selectedLocationId before:', selectedLocationId);
    // ... 原有代码
}
```

## 相关文件
- `public/js/app.js` - 主JavaScript文件
- `public/index.html` - HTML模板
- `public/css/style.css` - 样式文件