# FarmConnect - Local Backend Setup

This project was developed, debugged, and enhanced using the **Antigravity** AI coding assistant along with various other advanced AI tools.

This setup stores user data in a JSON file and prevents duplicate phone number registrations.

## Files Created:

1. **data.json** - JSON database file that stores user information
2. **server.js** - Node.js Express server that handles signup/login
3. **auth-api.js** - Client-side JavaScript that communicates with the backend
4. **package.json** - Node.js dependencies

## How It Works:

1. When a user tries to signup, the server checks `data.json` for existing phone numbers
2. If phone number already exists → signup is rejected with error message
3. If phone number is new → user data is saved to `data.json` and signup succeeds
4. Login checks if phone + password match an existing user

## Installation & Setup:

### Step 1: Install Node.js dependencies
```bash
cd c:\Users\punit\OneDrive\Desktop\py\farm
npm install
```

### Step 2: Start the server
```bash
npm start
```

The server will run on `http://localhost:3000`

You should see:
```
🌾 FarmConnect Server running on http://localhost:3000
📄 Data stored in: ...\data.json
```

### Step 3: Open the app
Open `index.html` in your browser and try signing up/logging in.

## API Endpoints:

### Check if Phone Exists
```
POST /api/check-phone
Body: { "phone": "+91 12345 67890" }
Response: { "exists": true/false, "message": "..." }
```

### Signup
```
POST /api/signup
Body: {
  "name": "John Doe",
  "phone": "+91 12345 67890",
  "role": "laborer" or "farmer",
  "password": "password123"
}
Response: { "success": true/false, "message": "...", "user": {...} }
```

### Login
```
POST /api/login
Body: {
  "phone": "+91 12345 67890",
  "password": "password123"
}
Response: { "success": true/false, "message": "...", "user": {...} }
```

### Get All Users (for testing)
```
GET /api/users
Response: [{ "id": ..., "name": "...", "phone": "...", "role": "...", ... }, ...]
```

## Example data.json format:
```json
{
  "users": [
    {
      "id": 1685123456789,
      "name": "Namitha",
      "phone": "+91 95131 05575",
      "role": "laborer",
      "password": "password123",
      "createdAt": "2026-05-28T10:30:00.000Z"
    }
  ]
}
```

## Important Notes:

⚠️ **For Production:**
- Hash passwords using bcrypt instead of storing plaintext
- Use a real database (MongoDB, PostgreSQL) instead of JSON file
- Add proper authentication (JWT tokens)
- Remove the public `/api/users` endpoint

## Troubleshooting:

**Error: "Phone number already exists"**
- The phone number is already registered in data.json
- Use a different phone number or check data.json to see existing users

**Error: "Connection error"**
- Make sure server is running (`npm start`)
- Check if port 3000 is not blocked
- Open browser console (F12) to see detailed errors

**Want to reset all users?**
- Clear data.json and leave only: `{ "users": [] }`
- Or delete data.json and restart the server (it will create a new one)
