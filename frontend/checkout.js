function loadOrderSummary() {
  const cart = getCart();
  const orderItems = document.getElementById('orderItems');

  orderItems.innerHTML = cart.map(item => `
    <div class="order-summary-item d-flex justify-content-between">
      <div><strong>${item.name}</strong><br><small class="text-muted">Qty: ${item.quantity}</small></div>
      <div>$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.00;
  const total = subtotal + shipping;

  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.querySelector(`input[value="${method}"]`).checked = true;
}

async function placeOrder(event) {
  event.preventDefault();

  const user = getUser();
  if (!user) {
    showToast('Please login first', 'error');
    setTimeout(() => window.location.href = '/login', 1500);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Cart is empty', 'error');
    return;
  }

  const shippingAddress = {
    fullName: document.getElementById('fullName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zipCode: document.getElementById('zipCode').value,
    phone: document.getElementById('phone').value
  };

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.00;
  const totalAmount = subtotal + shipping;

  const orderData = {
    userId: user.id,
    items: cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount,
    paymentMethod,
    shippingAddress
  };

  try {
    showLoading();
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem('cart');
      updateCartBadge();
      showToast('Order placed successfully!', 'success');
      setTimeout(() => window.location.href = '/profile', 2000);
    } else {
      showToast(data.message || 'Failed to place order', 'error');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    showToast('Error placing order', 'error');
  } finally {
    hideLoading();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty', 'error');
    setTimeout(() => window.location.href = '/shop', 1500);
    return;
  }
  loadOrderSummary();
});
