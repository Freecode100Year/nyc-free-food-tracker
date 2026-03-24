// Vercel Serverless Function for NYC Free Food Tracker
const express = require('express');
const path = require('path');
const axios = require('axios');

// Create Express app
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Set view engine
app.set('views', path.join(__dirname, '../views'));
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
    
    // Use a more reliable endpoint with CORS support
    const NYC_API_PROXY = 'https://api.allorigins.win/raw?url=';
    const encodedPantryUrl = encodeURIComponent(`${NYC_API_BASE}${FOOD_PANTRY_DATASET}.json?$limit=50&$where=status='Open'`);
    const encodedFridgeUrl = encodeURIComponent(`${NYC_API_BASE}${COMMUNITY_FRIDGE_DATASET}.json?$limit=50&$where=status='Open'`);
    
    // Fetch Food Pantries with proxy for CORS
    const pantryResponse = await axios.get(`${NYC_API_PROXY}${encodedPantryUrl}`, {
      timeout: 10000
    });
    
    // Fetch Community Fridges with proxy for CORS
    const fridgeResponse = await axios.get(`${NYC_API_PROXY}${encodedFridgeUrl}`, {
      timeout: 10000
    });
    
    console.log(`Fetched ${pantryResponse.data?.length || 0} pantries and ${fridgeResponse.data?.length || 0} fridges`);
    
    // Process and combine data
    const foodPantries = (pantryResponse.data || []).map(pantry => ({
      type: 'food_pantry',
      name: pantry.agency || pantry.program || 'Food Pantry',
      address: pantry.address || pantry.location_1_location || 'Address not available',
      hours: pantry.hours_of_operation || 'Hours not specified',
      borough: pantry.borough || 'Unknown',
      phone: pantry.contact_number || 'No phone',
      latitude: pantry.latitude || pantry.location_1?.latitude,
      longitude: pantry.longitude || pantry.location_1?.longitude,
      openWithin48Hours: isOpenWithin48Hours(pantry.hours_of_operation)
    })).filter(pantry => pantry.latitude && pantry.longitude);
    
    const communityFridges = (fridgeResponse.data || []).map(fridge => ({
      type: 'community_fridge',
      name: fridge.name || fridge.title || 'Community Fridge',
      address: fridge.address || fridge.location || 'Address not available',
      hours: fridge.hours || '24/7',
      borough: fridge.borough || 'Unknown',
      phone: fridge.phone || 'No phone',
      latitude: fridge.latitude || fridge.location_1?.latitude,
      longitude: fridge.longitude || fridge.location_1?.longitude,
      openWithin48Hours: true // Most fridges are 24/7
    })).filter(fridge => fridge.latitude && fridge.longitude);
    
    const allLocations = [...foodPantries, ...communityFridges];
    console.log(`Total locations with coordinates: ${allLocations.length}`);
    
    // If no real data, return sample data for demo
    if (allLocations.length === 0) {
      console.log('Using sample data for demo');
      return getSampleData();
    }
    
    return allLocations;
  } catch (error) {
    console.error('Error fetching food locations:', error.message, error.response?.status);
    // Return sample data if API fails
    return getSampleData();
  }
}

// Sample data for demo/testing
function getSampleData() {
  return [
    {
      type: 'food_pantry',
      name: 'Sample Food Pantry - Manhattan',
      address: '123 Main St, New York, NY 10001',
      hours: 'Mon-Fri 9am-5pm',
      borough: 'Manhattan',
      phone: '(212) 555-1234',
      latitude: 40.7128,
      longitude: -74.0060,
      openWithin48Hours: true
    },
    {
      type: 'community_fridge',
      name: 'Sample Community Fridge - Brooklyn',
      address: '456 Park Ave, Brooklyn, NY 11201',
      hours: '24/7',
      borough: 'Brooklyn',
      phone: '(718) 555-5678',
      latitude: 40.6782,
      longitude: -73.9442,
      openWithin48Hours: true
    },
    {
      type: 'food_pantry',
      name: 'Sample Food Pantry - Queens',
      address: '789 Queens Blvd, Queens, NY 11375',
      hours: 'Tue-Thu 10am-4pm',
      borough: 'Queens',
      phone: '(347) 555-9012',
      latitude: 40.7282,
      longitude: -73.7949,
      openWithin48Hours: true
    }
  ];
}

// Routes
app.get('/', async (req, res) => {
  try {
    const foodLocations = await fetchFoodLocations();
    res.render('index', { 
      foodLocations: JSON.stringify(foodLocations),
      locationsCount: foodLocations.length
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Error loading food locations');
  }
});

app.get('/api/food-locations', async (req, res) => {
  try {
    const foodLocations = await fetchFoodLocations();
    res.json(foodLocations);
  } catch (error) {
    console.error('Error fetching API data:', error);
    res.status(500).json({ error: 'Failed to fetch food locations' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;