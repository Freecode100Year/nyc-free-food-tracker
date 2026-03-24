# NYC 48-Hour Free Food Tracker

A web application that shows users where they can get free food in New York City within the next 48 hours.

## Features

- **Real-time Data**: Fetches data from NYC Open Data API (Food Pantries and Community Fridges datasets)
- **48-Hour Filter**: Only shows locations that are open or active within the next 48 hours
- **Interactive Map**: Leaflet.js map with custom markers for different food location types
- **Filtering**: Filter by location type (All, Pantry, Grab & Go, Community Fridge)
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Updates data every 30 minutes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js
- **Data Source**: NYC Open Data API

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
nyc-free-food-tracker/
├── server.js              # Express server and API endpoints
├── package.json          # Dependencies and scripts
├── views/
│   └── index.html       # Main HTML template
├── public/
│   ├── css/
│   │   └── tailwind.css # Compiled Tailwind CSS
│   └── js/
│       └── app.js       # Frontend JavaScript
└── README.md            # This file
```

## API Endpoints

- `GET /` - Serves the main web page
- `GET /api/food-locations` - Returns JSON array of food locations open within 48 hours

## Data Processing

The backend:
1. Fetches data from NYC Open Data API
2. Filters locations that are open within the next 48 hours
3. Formats data into a clean JSON structure
4. Caches results for 30 minutes to reduce API calls

## Frontend Features

- Interactive Leaflet.js map centered on NYC
- Custom markers with different colors/icons for each food category
- Clickable location cards with details
- Real-time filtering by food type
- Countdown timer emphasizing 48-hour availability
- Responsive sidebar with location list

## License

MIT