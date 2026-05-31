const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Read data from JSON file
function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [] };
  }
}

// Write data to JSON file
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Check if phone number already exists
app.post('/api/check-phone', (req, res) => {
  const { phone } = req.body;
  const data = readData();
  const exists = data.users.some(user => user.phone === phone);
  
  res.json({
    exists: exists,
    message: exists ? 'Phone number already exists' : 'Phone number is available'
  });
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { name, phone, role, password } = req.body;

  // Validate input
  if (!name || !phone || !role || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const data = readData();
  
  // Check if phone already exists
  const phoneExists = data.users.some(user => user.phone === phone);
  if (phoneExists) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number already exists. Please use a different phone number or login.' 
    });
  }

  // Add new user
  const newUser = {
    id: Date.now(),
    name,
    phone,
    role,
    password, // Note: In production, hash the password!
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  writeData(data);

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role
    }
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: 'Phone and password are required' });
  }

  // Handle Admin Login
  if (phone === '9988776655' && password === 'admin@123') {
    return res.json({
      success: true,
      message: 'Admin login successful!',
      user: {
        id: 9988776655,
        name: 'Admin',
        phone: '9988776655',
        role: 'admin'
      }
    });
  }

  const data = readData();
  const user = data.users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Incorrect phone number or password' 
    });
  }

  res.json({
    success: true,
    message: 'Login successful!',
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    }
  });
});

// Get all users (for debugging/admin)
app.get('/api/users', (req, res) => {
  const data = readData();
  res.json(data.users);
});

app.listen(PORT, () => {
  console.log(`🌾 FarmConnect Server running on http://localhost:${PORT}`);
  console.log(`📄 Data stored in: ${dataFile}`);
});
