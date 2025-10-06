async function loadProfile() {
  const user = getUser();
  if (!user) {
    showToast('Please login first', 'error');
    setTimeout(() => window.location.href = '/login', 1500);
    return;
  }

  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileRole').textContent = user.role.toUpperCase();
  loadOrders();
}

async function loadOrders() {
  const user = getUser();
  try {
    showLoading();
    const response = await fetch(`/api/orders/${user.id}`);
    if (response.ok) {
      const orders = await response.json();
      displayOrders(orders);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    showToast('Error loading orders', 'error');
  } finally {
    hideLoading();
  }
}

function displayOrders(orders) {
  const ordersList = document.getElementById('ordersList');
  const noOrders = document.getElementById('noOrders');

  if (orders.length === 0) {
    ordersList.innerHTML = '';
    noOrders.style.display = 'block';
    return;
  }

  noOrders.style.display = 'none';
  ordersList.innerHTML = orders.map(order => `
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <div><strong>Order #${order._id || order.id}</strong></div>
        <span class="badge bg-${getStatusColor(order.status)}">${order.status.toUpperCase()}</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <strong>Items:</strong>
            <ul class="mb-2">
              ${order.items.map(item => `<li>${item.quantity}x ${item.product?.name || 'Product'} - $${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p class="mb-0"><strong>Delivery:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
          </div>
          <div class="col-md-4 text-end">
            <h5 class="text-primary">$${order.totalAmount.toFixed(2)}</h5>
            <small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getStatusColor(status) {
  const colors = { pending: 'warning', processing: 'info', delivered: 'success', cancelled: 'danger' };
  return colors[status] || 'secondary';
}

document.addEventListener('DOMContentLoaded', loadProfile);
