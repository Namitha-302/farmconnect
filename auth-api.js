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
  const captchaInput = document.getElementById('login-captcha').value.trim();
  const errorEl = document.getElementById('login-error');

  if (!phone || !password || !captchaInput) {
    errorEl.textContent = 'Please fill in all fields, including the verification code.';
    errorEl.classList.add('show');
    return;
  }

  // Validate Captcha
  if (captchaInput.toLowerCase() !== currentCaptchaCode.toLowerCase()) {
    errorEl.textContent = 'Invalid verification code. Please try again.';
    errorEl.classList.add('show');
    document.getElementById('login-captcha').value = '';
    generateCaptcha();
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
      // Redirect to home or admin - manual navigation
      setTimeout(() => {
        if (data.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          document.querySelectorAll('.screen, .auth-screen').forEach(s => s.classList.remove('active'));
          document.getElementById('s-home').classList.add('active');
          // Update user name in greeting
          document.querySelectorAll('.greet-name, .pname').forEach(el => {
            el.textContent = data.user.name;
          });
          document.querySelectorAll('.av, .pav').forEach(el => {
            el.textContent = data.user.name[0].toUpperCase();
          });
        }
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

// Perform Logout
function doLogout() {
  localStorage.removeItem('user');
  showToast('👋 Logged out successfully!');
  setTimeout(() => {
    // Go to login screen
    document.querySelectorAll('.screen, .auth-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('s-login').classList.add('active');
    // Hide bottom nav
    const bnav = document.getElementById('bnav');
    if (bnav) bnav.style.display = 'none';
  }, 1000);
}

// Switch between User and Admin login tabs
function switchLoginTab(tab) {
  const userTab = document.getElementById('tab-user');
  const adminTab = document.getElementById('tab-admin');
  const title = document.querySelector('#s-login .auth-title');
  const subtitle = document.querySelector('#s-login .auth-subtitle');
  const phoneInput = document.getElementById('login-phone');
  const passInput = document.getElementById('login-pass');

  if (tab === 'admin') {
    if (userTab) userTab.classList.remove('active');
    if (adminTab) adminTab.classList.add('active');
    if (title) title.textContent = 'Admin Login';
    if (subtitle) subtitle.textContent = 'Sign in as administrator';
    if (phoneInput) {
      phoneInput.placeholder = '9988776655';
      phoneInput.value = '9988776655';
    }
    if (passInput) {
      passInput.placeholder = '••••••••';
      passInput.value = 'admin@123';
    }
    const sLogin = document.getElementById('s-login');
    if (sLogin) sLogin.classList.add('admin-mode');
  } else {
    if (userTab) userTab.classList.add('active');
    if (adminTab) adminTab.classList.remove('active');
    if (title) title.textContent = 'Welcome back';
    if (subtitle) subtitle.textContent = 'Sign in to your account';
    if (phoneInput) {
      phoneInput.placeholder = '+91 00000 00000';
      phoneInput.value = '';
    }
    if (passInput) {
      passInput.placeholder = 'Enter your password';
      passInput.value = '';
    }
    const sLogin = document.getElementById('s-login');
    if (sLogin) sLogin.classList.remove('admin-mode');
  }
  generateCaptcha();
}

let currentCaptchaCode = '';

// Generate alphanumeric captcha
function generateCaptcha() {
  const canvas = document.getElementById('captcha-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Generate random 6 character code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; // skipped similar chars like I, O, 0, 1, l
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptchaCode = code;
  
  // Draw background gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#161616');
  grad.addColorStop(1, '#0c0c0c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add background noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(29, 185, 122, ${Math.random() * 0.2 + 0.1})`;
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  
  // Add noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw code text with distortion (random rot, font, scale)
  ctx.textBaseline = 'middle';
  const charWidth = (canvas.width - 20) / 6;
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    ctx.font = `bold ${Math.floor(Math.random() * 6) + 20}px 'Nunito', sans-serif`;
    
    // Choose color (either green or white/muted)
    const isGreen = Math.random() > 0.5;
    ctx.fillStyle = isGreen ? '#1db97a' : '#eaeaea';
    
    // Draw character at position with rotation
    ctx.save();
    ctx.translate(15 + i * charWidth + Math.random() * 4 - 2, canvas.height / 2 + Math.random() * 6 - 3);
    ctx.rotate((Math.random() * 30 - 15) * Math.PI / 180); // rotate between -15 and +15 degrees
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}

// Initialise captcha on script load (once DOM is parsed)
document.addEventListener('DOMContentLoaded', () => {
  generateCaptcha();
});
// Fallback if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  generateCaptcha();
}
