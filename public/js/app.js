// NYC Free Food Tracker - Frontend Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('map').setView([40.7128, -74.0060], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Initialize variables
    let allLocations = [];
    let currentFilter = 'all';
    let markers = L.layerGroup().addTo(map);
    let selectedLocationId = null;
    
    // DOM Elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const locationList = document.getElementById('location-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const countElements = {
        'all': document.getElementById('count-all'),
        'Pantry': document.getElementById('count-pantry'),
        'Grab & Go': document.getElementById('count-grabgo'),
        'Community Fridge': document.getElementById('count-fridge')
    };
    const lastUpdatedElement = document.getElementById('last-updated');
    
    // Initialize filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
        });
    });
    
    // Set active filter
    function setActiveFilter(filter) {
        currentFilter = filter;
        
        // Update button states
        filterButtons.forEach(button => {
            const btnFilter = button.getAttribute('data-filter');
            if (btnFilter === filter) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update map markers
        updateMapMarkers();
        
        // Update location list
        updateLocationList();
    }
    
    // Get icon for category
    function getCategoryIcon(category) {
        const iconOptions = {
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        };
        
        let iconUrl;
        let iconColor;
        
        switch(category) {
            case 'Pantry':
                iconColor = '#10B981'; // green
                iconUrl = `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" width="30" height="30">
                        <path d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 9H7v7h2v-7zm4 0h-2v7h2v-7zm4 0h-2v7h2v-7zM7 4v4h10V4H7z"/>
                    </svg>
                `)}`;
                break;
            case 'Grab & Go':
                iconColor = '#F59E0B'; // orange
                iconUrl = `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" width="30" height="30">
                        <path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-1 2H4v14h16V5zm-8 2v3h3v2h-3v3h-2v-3H8v-2h3V7h2z"/>
                    </svg>
                `)}`;
                break;
            case 'Community Fridge':
                iconColor = '#8B5CF6'; // purple
                iconUrl = `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" width="30" height="30">
                        <path d="M19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14zm-1 2H6v16h12V4zm-8 2v4h8V6h-8zm0 6v4h8v-4h-8zm-2-6H7v4h1V6zm0 6H7v4h1v-4z"/>
                    </svg>
                `)}`;
                break;
            default:
                iconColor = '#3B82F6'; // blue
                iconUrl = `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" width="30" height="30">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                `)}`;
        }
        
        return L.icon({
            ...iconOptions,
            iconUrl: iconUrl
        });
    }
    
    // Create marker popup content
    function createPopupContent(location) {
        let categoryClass = '';
        switch(location.category) {
            case 'Pantry': categoryClass = 'category-pantry'; break;
            case 'Grab & Go': categoryClass = 'category-grabgo'; break;
            case 'Community Fridge': categoryClass = 'category-fridge'; break;
        }
        
        return `
            <div class="min-w-64">
                <h3>${location.name}</h3>
                <p class="mb-2"><i class="fas fa-map-marker-alt text-gray-400 mr-1"></i> ${location.address}</p>
                <p class="mb-2"><i class="fas fa-clock text-gray-400 mr-1"></i> <strong>Hours:</strong> ${location.hours}</p>
                <p class="mb-3"><i class="fas fa-info-circle text-gray-400 mr-1"></i> ${location.description}</p>
                <span class="category-badge ${categoryClass}">
                    <i class="fas fa-tag mr-1"></i> ${location.category}
                </span>
            </div>
        `;
    }
    
    // Update map markers based on current filter
    function updateMapMarkers() {
        markers.clearLayers();
        
        const filteredLocations = allLocations.filter(location => {
            if (currentFilter === 'all') return true;
            return location.category === currentFilter;
        });
        
        filteredLocations.forEach((location, index) => {
            const marker = L.marker([location.latitude, location.longitude], {
                icon: getCategoryIcon(location.category)
            })
            .bindPopup(createPopupContent(location))
            .addTo(markers);
            
            // Store reference to location
            marker.locationId = index;
            
            // Add click event to select location in list
            marker.on('click', function() {
                selectLocationInList(index);
            });
        });
        
        // Fit map bounds to show all markers if there are any
        if (filteredLocations.length > 0) {
            const bounds = markers.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }
    
    // Create location card HTML
    function createLocationCard(location, index) {
        let categoryClass = '';
        let categoryIcon = '';
        
        switch(location.category) {
            case 'Pantry':
                categoryClass = 'category-pantry';
                categoryIcon = 'fa-shopping-basket';
                break;
            case 'Grab & Go':
                categoryClass = 'category-grabgo';
                categoryIcon = 'fa-utensils';
                break;
            case 'Community Fridge':
                categoryClass = 'category-fridge';
                categoryIcon = 'fa-refrigerator';
                break;
        }
        
        const isActive = selectedLocationId === index ? 'active' : '';
        
        return `
            <div class="location-card ${isActive}" data-index="${index}" onclick="selectLocation(${index})">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-gray-800">${location.name}</h4>
                    <span class="category-badge ${categoryClass}">
                        <i class="fas ${categoryIcon} mr-1"></i> ${location.category}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                    <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i> ${location.address}
                </p>
                <p class="text-sm text-gray-700 mb-3">
                    <i class="fas fa-clock text-gray-400 mr-1"></i> ${location.hours}
                </p>
                <p class="text-xs text-gray-500">${location.description}</p>
                <button class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium" onclick="event.stopPropagation(); focusOnMap(${index})">
                    <i class="fas fa-map-pin mr-1"></i> Show on map
                </button>
            </div>
        `;
    }
    
    // Update location list
    function updateLocationList() {
        const filteredLocations = allLocations.filter(location => {
            if (currentFilter === 'all') return true;
            return location.category === currentFilter;
        });
        
        if (filteredLocations.length === 0) {
            locationList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-utensils text-3xl mb-3"></i>
                    <p class="font-medium">No ${currentFilter === 'all' ? '' : currentFilter} locations found</p>
                    <p class="text-sm mt-1">Try a different filter or check back later</p>
                </div>
            `;
            return;
        }
        
        locationList.innerHTML = filteredLocations.map((location, index) => {
            // Find the original index in allLocations
            const originalIndex = allLocations.findIndex(loc => 
                loc.name === location.name && 
                loc.latitude === location.latitude && 
                loc.longitude === location.longitude
            );
            return createLocationCard(location, originalIndex);
        }).join('');
    }
    
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
    
    // Focus on location on map
    function focusOnMap(index) {
        const location = allLocations[index];
        if (location) {
            map.setView([location.latitude, location.longitude], 16);
            
            // Find and open the marker popup
            markers.eachLayer(function(marker) {
                if (marker.locationId === index) {
                    marker.openPopup();
                }
            });
        }
    }
    
    // Select location in list when marker is clicked
    function selectLocationInList(index) {
        selectedLocationId = index;
        updateLocationList();
    }
    
    // Update count badges
    function updateCountBadges() {
        const counts = {
            'all': allLocations.length,
            'Pantry': allLocations.filter(l => l.category === 'Pantry').length,
            'Grab & Go': allLocations.filter(l => l.category === 'Grab & Go').length,
            'Community Fridge': allLocations.filter(l => l.category === 'Community Fridge').length
        };
        
        for (const [category, count] of Object.entries(counts)) {
            if (countElements[category]) {
                countElements[category].textContent = count;
            }
        }
    }
    
    // Fetch food locations from API
    async function fetchFoodLocations() {
        try {
            loadingOverlay.style.display = 'flex';
            
            const response = await fetch('/api/food-locations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allLocations = data;
            
            // Update UI
            updateCountBadges();
            updateMapMarkers();
            updateLocationList();
            
            // Update last updated time
            const now = new Date();
            lastUpdatedElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            console.log(`Loaded ${allLocations.length} food locations`);
            
        } catch (error) {
            console.error('Error fetching food locations:', error);
            locationList.innerHTML = `
                <div class="text-center text-red-500 py-8">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p class="font-medium">Failed to load food locations</p>
                    <p class="text-sm mt-1">Please try refreshing the page</p>
                </div>
            `;
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }
    
    // Make functions available globally for inline onclick handlers
    window.selectLocation = selectLocation;
    window.focusOnMap = focusOnMap;
    window.selectLocationInList = selectLocationInList;
    
    // Initial fetch
    fetchFoodLocations();
    
    // Auto-refresh every 5 minutes
    setInterval(fetchFoodLocations, 5 * 60 * 1000);
});