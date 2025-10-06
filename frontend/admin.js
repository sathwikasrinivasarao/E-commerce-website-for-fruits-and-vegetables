async function checkAdminAccess() {
  const user = getUser();
  if (!user || user.role !== 'farmer') {
    showToast('Access denied. Farmers only.', 'error');
    setTimeout(() => window.location.href = '/', 1500);
    return false;
  }
  return true;
}

async function loadAllOrders() {
  try {
    const response = await fetch('/api/orders');
    if (response.ok) {
      const orders = await response.json();
      displayAllOrders(orders);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayAllOrders(orders) {
  const list = document.getElementById('allOrdersList');
  list.innerHTML = orders.map(order => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <h6>Order #${order._id || order.id}</h6>
            <p class="mb-1">Customer: ${order.userId?.name || 'N/A'}</p>
            <p class="mb-1">Total: $${order.totalAmount.toFixed(2)}</p>
            <small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
          </div>
          <div class="col-md-4 text-end">
            <select class="form-select form-select-sm" onchange="updateOrderStatus('${order._id || order.id}', this.value)">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      showToast('Order status updated', 'success');
    }
  } catch (error) {
    showToast('Error updating status', 'error');
  }
}

async function loadMyProducts() {
  const user = getUser();
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      const products = await response.json();
      const myProducts = products.filter(p => p.addedByUserId == user.id);
      displayMyProducts(myProducts);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayMyProducts(products) {
  const list = document.getElementById('myProductsList');
  list.innerHTML = products.map(p => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2"><img src="${p.imageURL}" class="img-fluid rounded" alt="${p.name}"></div>
          <div class="col-md-7">
            <h6>${p.name}</h6>
            <p class="mb-0">Price: $${p.price} | Stock: ${p.stock}</p>
          </div>
          <div class="col-md-3 text-end">
            <button class="btn btn-sm btn-outline-primary me-2"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (await checkAdminAccess()) {
    loadAllOrders();
    loadMyProducts();
  }
});
