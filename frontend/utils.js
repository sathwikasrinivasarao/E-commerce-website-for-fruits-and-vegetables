function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  const style = document.createElement('style');
  if (!document.getElementById('toast-styles')) {
    style.id = 'toast-styles';
    style.textContent = `
      .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      }
      .toast-notification.success {
        background: #81C408;
        color: white;
      }
      .toast-notification.error {
        background: #dc3545;
        color: white;
      }
      .toast-notification.info {
        background: #0dcaf0;
        color: white;
      }
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return !!getUser();
}

function logout() {
  localStorage.removeItem('user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

function getCart() {
  const cartStr = localStorage.getItem('cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      imageURL: product.imageURL,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

function updateAuthUI() {
  const user = getUser();
  const authButtons = document.querySelector('.auth-buttons');

  if (authButtons) {
    if (user) {
      authButtons.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
            <i class="fas fa-user me-2"></i>${user.name}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="/profile"><i class="fas fa-user me-2"></i>Profile</a></li>
            ${user.role === 'farmer' ? '<li><a class="dropdown-item" href="/add-product"><i class="fas fa-plus me-2"></i>Add Product</a></li>' : ''}
            ${user.role === 'farmer' ? '<li><a class="dropdown-item" href="/admin"><i class="fas fa-cog me-2"></i>Dashboard</a></li>' : ''}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
          </ul>
        </div>
      `;
    } else {
      authButtons.innerHTML = `
        <a href="/register" class="btn btn-outline-primary">Register</a>
        <a href="/login" class="btn btn-primary">Login</a>
      `;
    }
  }
}

function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'loading-overlay';
  loader.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;

  const style = document.createElement('style');
  if (!document.getElementById('loader-styles')) {
    style.id = 'loader-styles';
    style.textContent = `
      #loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      #loading-overlay .spinner-border {
        width: 3rem;
        height: 3rem;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    loader.remove();
  }
}

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

function isMobileDevice() {
  return window.innerWidth <= 768;
}

function debounceResize(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('resize', debounceResize(() => {
  if (isMobileDevice()) {
    document.body.classList.add('mobile-view');
  } else {
    document.body.classList.remove('mobile-view');
  }
}, 250));

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartBadge();

  if (isMobileDevice()) {
    document.body.classList.add('mobile-view');
  }

  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
});
