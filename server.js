const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// NYC Open Data API endpoints
const NYC_API_BASE = 'https://data.cityofnewyork.us/resource/';
const FOOD_PANTRY_DATASET = 's7vy-9q6d'; // Food Pantries dataset
const COMMUNITY_FRIDGE_DATASET = 'if26-z6xq'; // Community Fridges dataset

// Helper function to check if location is open within next 48 hours
function isOpenWithin48Hours(hoursString) {
  if (!hoursString) return false;
  
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  
  // Simple check - if hours string contains day names for today or tomorrow
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[now.getDay()];
  const tomorrow = days[(now.getDay() + 1) % 7];
  
  const hoursLower = hoursString.toLowerCase();
  return hoursLower.includes(today.toLowerCase()) || hoursLower.includes(tomorrow.toLowerCase());
}

// Fetch and process data from NYC Open Data
async function fetchFoodLocations() {
  try {
    console.log('Fetching food locations from NYC Open Data...');
    
    // Fetch Food Pantries
    const pantryResponse = await axios.get(`${NYC_API_BASE}${FOOD_PANTRY_DATASET}.json`, {
      params: {
        $limit: 100,
        $where: "status='Open'"
      }
    });
    
    // Fetch Community Fridges
    const fridgeResponse = await axios.get(`${NYC_API_BASE}${COMMUNITY_FRIDGE_DATASET}.json`, {
      params: {
        $limit: 100
      }
    });
    
    const locations = [];
    
    // Process Food Pantries
    if (pantryResponse.data) {
      pantryResponse.data.forEach(location => {
        if (location.latitude && location.longitude && location.hours_of_operation) {
          if (isOpenWithin48Hours(location.hours_of_operation)) {
            locations.push({
              name: location.agency || location.site_name || 'Food Pantry',
              address: location.address || 'Address not available',
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
              hours: location.hours_of_operation,
              category: 'Pantry',
              description: location.notes || 'Food pantry providing groceries'
            });
          }
        }
      });
    }
    
    // Process Community Fridges
    if (fridgeResponse.data) {
      fridgeResponse.data.forEach(location => {
        if (location.latitude && location.longitude) {
          // Community fridges are typically always accessible
          locations.push({
            name: location.name || 'Community Fridge',
            address: location.address || 'Address not available',
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            hours: '24/7 Accessible',
            category: 'Community Fridge',
            description: location.notes || 'Community refrigerator with free food'
          });
        }
      });
    }
    
    console.log(`Found ${locations.length} food locations open within 48 hours`);
    return locations;
    
  } catch (error) {
    console.error('Error fetching data from NYC Open Data:', error.message);
    // Return sample data for demo purposes
    return getSampleData();
  }
}

// Sample data for demo/testing
function getSampleData() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  
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
    },
    {
      name: 'Queens Food Distribution',
      address: '321 Queens Blvd, Queens, NY 11373',
      latitude: 40.7282,
      longitude: -73.7949,
      hours: `${todayName}: 9am-1pm`,
      category: 'Pantry',
      description: 'Weekly food distribution'
    },
    {
      name: 'Bronx Soup Kitchen',
      address: '654 Fordham Rd, Bronx, NY 10458',
      latitude: 40.8628,
      longitude: -73.8825,
      hours: `${tomorrowName}: 11am-2pm`,
      category: 'Grab & Go',
      description: 'Hot soup and sandwiches'
    }
  ];
}

// Cache for food locations (refresh every 30 minutes)
let cachedLocations = null;
let lastFetchTime = null;

// API endpoint to get food locations
app.get('/api/food-locations', async (req, res) => {
  try {
    const now = Date.now();
    // Refresh cache every 30 minutes
    if (!cachedLocations || !lastFetchTime || (now - lastFetchTime) > 30 * 60 * 1000) {
      cachedLocations = await fetchFoodLocations();
      lastFetchTime = now;
    }
    
    res.json(cachedLocations);
  } catch (error) {
    console.error('Error serving food locations:', error);
    res.status(500).json({ error: 'Failed to fetch food locations' });
  }
});

// Home page
app.get('/', (req, res) => {
  res.render('index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`NYC Free Food Tracker running on http://localhost:${PORT}`);
  console.log('API available at /api/food-locations');
});