function loadCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    emptyCart.style.display = 'block';
    cartSummary.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';

  cartItems.innerHTML = cart.map(item => `
    <tr>
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.imageURL}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;" alt="${item.name}">
          <div class="ms-3">
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">$${parseFloat(item.price).toFixed(2)} each</small>
          </div>
        </div>
      </td>
      <td>$${parseFloat(item.price).toFixed(2)}</td>
      <td>
        <div class="quantity-controls d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span class="fw-bold">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="removeItem('${item.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  updateTotals();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeItem(productId);
    return;
  }

  updateCartQuantity(productId, newQuantity);
  loadCart();
}

function removeItem(productId) {
  removeFromCart(productId);
  showToast('Item removed from cart', 'info');
  loadCart();
}

function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.00;
  const total = subtotal + shipping;

  document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shippingAmount').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart');
    showToast('Cart cleared', 'info');
    loadCart();
    updateCartBadge();
  }
}

function proceedToCheckout() {
  const user = getUser();
  if (!user) {
    showToast('Please login to proceed', 'error');
    setTimeout(() => window.location.href = '/login', 1500);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }

  window.location.href = '/checkout';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});
