 # Compute API Reference
 
 ## Base URL
 
 ```
 /api/compute
 ```
 
 ## Endpoints
 
 ### Prayer Times
 
 ```
 GET /api/compute/prayer-times?latitude={lat}&longitude={lng}&date={date}&method={method}
 ```
 
 Calculate Islamic prayer times for a given location and date.
 
 **Parameters:**
 - `latitude` (number, required): Latitude in decimal degrees
 - `longitude` (number, required): Longitude in decimal degrees
 - `date` (string, optional): Date in YYYY-MM-DD format (default: today)
 - `method` (string, optional): Calculation method (default: muslima_world_league)
 
 **Response:**
 ```json
 {
   "date": "2026-11-13",
   "location": { "latitude": -6.2, "longitude": 106.8 },
   "times": {
     "fajr": "04:32",
     "sunrise": "05:48",
     "dhuhr": "11:52",
     "asr": "15:18",
     "maghrib": "17:56",
     "isha": "19:04"
   },
   "method": "muslima_world_league"
 }
 ```
 
 ### Lunar Phase
 
 ```
 GET /api/compute/lunar-phase?date={date}
 ```
 
 Get lunar phase information for a given date.
 
 ### Qibla Direction
 
 ```
 GET /api/compute/qibla?latitude={lat}&longitude={lng}
 ```
 
 Calculate Qibla direction from a given location.
 
 ### Solar Position
 
 ```
 GET /api/compute/solar-position?latitude={lat}&longitude={lng}&date={date}
 ```
 
 Get solar position (azimuth, elevation, declination, equation of time).
 
 ### Hilal Visibility
 
 ```
 GET /api/compute/hilal-visibility?latitude={lat}&longitude={lng}&date={date}
 ```
 
 Calculate lunar crescent visibility (Hilal) using Odeh/Yallop criteria.
