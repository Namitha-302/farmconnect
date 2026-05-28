// API Configuration
const API_URL = 'http://localhost:3000/api';

// Variables
let selectedRole = 'laborer';

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

// Select role for signup
function selectRole(role) {
  selectedRole = role;
  document.getElementById('role-laborer').classList.toggle('selected', role === 'laborer');
  document.getElementById('role-farmer').classList.toggle('selected', role === 'farmer');
}

// Perform Signup
async function doSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-pass').value.trim();
  const errorEl = document.getElementById('signup-error');

  if (!name || !phone || !password) {
    errorEl.textContent = 'Please fill in all fields.';
    errorEl.classList.add('show');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        role: selectedRole,
        password
      })
    });

    const data = await response.json();

    if (data.success) {
      errorEl.classList.remove('show');
      showToast('✅ Account created successfully!');
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      // Clear form
      document.getElementById('signup-name').value = '';
      document.getElementById('signup-phone').value = '';
      document.getElementById('signup-pass').value = '';
      // Redirect to login - manual navigation
      setTimeout(() => {
        document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
        document.getElementById('s-login').classList.add('active');
      }, 1500);
    } else {
      errorEl.textContent = data.message;
      errorEl.classList.add('show');
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorEl.textContent = 'Connection error. Check if server is running on localhost:3000';
    errorEl.classList.add('show');
  }
}

// Perform Login
async function doLogin() {
  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  const errorEl = document.getElementById('login-error');

  if (!phone || !password) {
    errorEl.textContent = 'Please fill in all fields.';
    errorEl.classList.add('show');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const data = await response.json();

    if (data.success) {
      errorEl.classList.remove('show');
      showToast('✅ Login successful!');
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      // Clear form
      document.getElementById('login-phone').value = '';
      document.getElementById('login-pass').value = '';
      // Redirect to home - manual navigation
      setTimeout(() => {
        document.querySelectorAll('.screen, .auth-screen').forEach(s => s.classList.remove('active'));
        document.getElementById('s-home').classList.add('active');
        // Update user name in greeting
        document.querySelectorAll('.greet-name, .pname').forEach(el => {
          el.textContent = data.user.name;
        });
        document.querySelectorAll('.av, .pav').forEach(el => {
          el.textContent = data.user.name[0].toUpperCase();
        });
      }, 1500);
    } else {
      errorEl.textContent = data.message;
      errorEl.classList.add('show');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorEl.textContent = 'Connection error. Check if server is running on localhost:3000';
    errorEl.classList.add('show');
  }
}

// Check if phone number already exists (optional real-time validation)
async function checkPhoneExists(phone) {
  try {
    const response = await fetch(`${API_URL}/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Check phone error:', error);
    return false;
  }
}
