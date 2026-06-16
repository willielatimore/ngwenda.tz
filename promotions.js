// ===== PROMOTIONS PAGE WITH ADMIN AUTHORIZATION =====

// Admin credentials (in production, this should be server-side)
// For demo purposes, using localStorage. Change password as needed.
const ADMIN_CREDENTIALS = {
  username: "ngwenda_admin",
  password: "Fuckdemundies"  // CHANGE THIS TO A SECURE PASSWORD
};

// Check if admin is logged in
function isAdminLoggedIn() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Admin login function
function adminLogin(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    return true;
  }
  return false;
}

// Admin logout function
function adminLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  location.reload();
}

// Update UI based on login status
function updateUIForAdminStatus() {
  const isAdmin = isAdminLoggedIn();
  const adminPanel = document.getElementById('adminPanel');
  const authBtn = document.getElementById('adminAuthBtn');
  
  if (isAdmin) {
    if (adminPanel) adminPanel.classList.remove('d-none');
    if (authBtn) {
      authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Admin Logout';
      authBtn.classList.remove('btn-outline-warning');
      authBtn.classList.add('btn-warning');
    }
  } else {
    if (adminPanel) adminPanel.classList.add('d-none');
    if (authBtn) {
      authBtn.innerHTML = '<i class="fas fa-lock"></i> Admin Login';
      authBtn.classList.remove('btn-warning');
      authBtn.classList.add('btn-outline-warning');
    }
  }
}

// Initialize promotions array from localStorage
let promotions = JSON.parse(localStorage.getItem('ngwendaPromotions')) || [];

// Default promotions if empty
if (promotions.length === 0) {
  promotions = [
    {
      id: Date.now() + 1,
      title: "Early Bird Discount",
      category: "Motorbike",
      discount: "15% OFF",
      expiry: getFutureDate(30),
      description: "Get 15% off on all Bajaj motorbikes. Limited time offer!",
      createdAt: new Date().toISOString()
    },
    {
      id: Date.now() + 2,
      title: "Festive Season Special",
      category: "Tuk-Tuk",
      discount: "Buy 1 Get 1 Free Service",
      expiry: getFutureDate(45),
      description: "Free first year maintenance on all passenger tuk-tuks purchased during festive season.",
      createdAt: new Date().toISOString()
    },
    {
      id: Date.now() + 3,
      title: "Electric Revolution",
      category: "Electric",
      discount: "Zero Deposit",
      expiry: getFutureDate(60),
      description: "Own an electric vehicle with zero deposit and 0% interest for first 6 months!",
      createdAt: new Date().toISOString()
    }
  ];
  savePromotions();
}

// Helper function to get future date
function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Save promotions to localStorage
function savePromotions() {
  localStorage.setItem('ngwendaPromotions', JSON.stringify(promotions));
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Check if promotion is expired
function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}

// Render promotions to grid (Public view - no delete buttons)
function renderPromotions() {
  const grid = document.getElementById('promotionsGrid');
  const noPromotionsDiv = document.getElementById('noPromotions');
  const isAdmin = isAdminLoggedIn();
  
  if (!grid) return;
  
  const activePromotions = promotions.filter(p => !isExpired(p.expiry));
  
  if (activePromotions.length === 0) {
    grid.innerHTML = '';
    if (noPromotionsDiv) noPromotionsDiv.classList.remove('d-none');
    return;
  }
  
  if (noPromotionsDiv) noPromotionsDiv.classList.add('d-none');
  
  grid.innerHTML = activePromotions.map(promo => `
    <div class="col-lg-4 col-md-6">
      <div class="promotion-card" data-id="${promo.id}">
        <div class="promotion-badge">HOT DEAL</div>
        <div class="promotion-icon">
          <i class="fas ${getCategoryIcon(promo.category)}"></i>
        </div>
        <div class="promotion-content">
          <span class="promotion-category">${escapeHtml(promo.category)}</span>
          <h3 class="promotion-title">${escapeHtml(promo.title)}</h3>
          <div class="promotion-discount">${escapeHtml(promo.discount)}</div>
          <p class="promotion-description">${escapeHtml(promo.description)}</p>
          <div class="promotion-expiry ${isExpired(promo.expiry) ? 'expired' : ''}">
            <i class="fas fa-hourglass-half"></i>
            <span>Expires: ${formatDate(promo.expiry)}</span>
          </div>
          <div class="promotion-actions">
            <button class="btn-claim" onclick="claimPromotion('${promo.id}')">
              <i class="fas fa-gift"></i> Claim Offer
            </button>
            ${isAdmin ? `
              <button class="btn-delete-promo" onclick="deletePromotion(${promo.id})">
                <i class="fas fa-trash"></i> Delete
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Get icon based on category
function getCategoryIcon(category) {
  const icons = {
    'Motorbike': 'fa-motorcycle',
    'Tuk-Tuk': 'fa-truck',
    'Electric': 'fa-bolt',
    'Accessories': 'fa-helmet-safety',
    'Credit': 'fa-hand-holding-usd'
  };
  return icons[category] || 'fa-tag';
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Add new promotion (Admin only)
function addPromotion(event) {
  event.preventDefault();
  
  if (!isAdminLoggedIn()) {
    alert("You must be logged in as admin to add promotions.");
    return;
  }
  
  const title = document.getElementById('promoTitle')?.value.trim();
  const category = document.getElementById('promoCategory')?.value;
  const discount = document.getElementById('promoDiscount')?.value.trim();
  const expiry = document.getElementById('promoExpiry')?.value;
  const description = document.getElementById('promoDescription')?.value.trim();
  const feedback = document.getElementById('promoFormFeedback');
  
  // Validation
  if (!title || !discount || !expiry || !description) {
    if (feedback) {
      feedback.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
      setTimeout(() => feedback.innerHTML = '', 3000);
    }
    return;
  }
  
  // Check if expiry date is valid
  if (new Date(expiry) < new Date()) {
    if (feedback) {
      feedback.innerHTML = '<div class="alert alert-danger">Expiry date must be in the future.</div>';
      setTimeout(() => feedback.innerHTML = '', 3000);
    }
    return;
  }
  
  // Create new promotion
  const newPromotion = {
    id: Date.now(),
    title: title,
    category: category,
    discount: discount,
    expiry: expiry,
    description: description,
    createdAt: new Date().toISOString()
  };
  
  promotions.push(newPromotion);
  savePromotions();
  renderPromotions();
  
  // Reset form
  document.getElementById('addPromotionForm')?.reset();
  
  // Show success message
  if (feedback) {
    feedback.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Promotion added successfully!</div>';
    setTimeout(() => feedback.innerHTML = '', 3000);
  }
  
  // Scroll to promotions grid
  document.querySelector('.active-promotions-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Delete promotion (Admin only)
function deletePromotion(id) {
  if (!isAdminLoggedIn()) {
    alert("You must be logged in as admin to delete promotions.");
    return;
  }
  
  if (confirm('Are you sure you want to delete this promotion?')) {
    promotions = promotions.filter(p => p.id !== id);
    savePromotions();
    renderPromotions();
    showToast('Promotion deleted successfully', 'success');
  }
}

// Claim promotion (Public)
function claimPromotion(id) {
  const promo = promotions.find(p => p.id == id);
  if (promo) {
    showToast(`🎉 You're interested in: ${promo.title}! A sales agent will contact you shortly.`, 'success');
  }
}

// Show toast notification
function showToast(message, type) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  const toastId = 'toast-' + Date.now();
  const bgColor = type === 'success' ? '#28a745' : '#ffc107';
  
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white border-0 mb-2" role="alert" data-bs-autohide="true" data-bs-delay="3000">
      <div class="d-flex">
        <div class="toast-body" style="background: ${bgColor}; color: #1a1a2e; border-radius: 8px;">
          <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

// ===== ADMIN LOGIN HANDLERS =====
function showLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
  loginModal.show();
}

function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  const feedback = document.getElementById('loginFeedback');
  
  if (adminLogin(username, password)) {
    feedback.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('adminLoginModal'));
      modal.hide();
      updateUIForAdminStatus();
      renderPromotions();
      showToast('Welcome back, Admin!', 'success');
    }, 1000);
  } else {
    feedback.innerHTML = '<div class="alert alert-danger">Invalid username or password!</div>';
    setTimeout(() => feedback.innerHTML = '', 3000);
  }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Update UI based on admin status
  updateUIForAdminStatus();
  renderPromotions();
  
  // Admin login button
  const authBtn = document.getElementById('adminAuthBtn');
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (isAdminLoggedIn()) {
        adminLogout();
      } else {
        showLoginModal();
      }
    });
  }
  
  // Login form submission
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Add promotion form
  const addForm = document.getElementById('addPromotionForm');
  if (addForm) {
    addForm.addEventListener('submit', addPromotion);
  }
});