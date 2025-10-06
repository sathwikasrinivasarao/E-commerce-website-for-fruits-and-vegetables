let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';

async function loadProducts() {
  try {
    showLoading();
    const response = await fetch('/api/products');
    if (response.ok) {
      allProducts = await response.json();
      filteredProducts = [...allProducts];
      displayProducts();
      updateProductCount();
    } else {
      showToast('Failed to load products', 'error');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Error loading products', 'error');
  } finally {
    hideLoading();
  }
}

function displayProducts() {
  const grid = document.getElementById('productsGrid');
  const noProducts = document.getElementById('noProducts');

  if (filteredProducts.length === 0) {
    grid.innerHTML = '';
    noProducts.style.display = 'block';
    return;
  }

  noProducts.style.display = 'none';

  grid.innerHTML = filteredProducts.map(product => {
    const productId = product._id || product.id;
    const inStock = product.stock > 0;

    return `
      <div class="col-md-6 col-lg-4 col-xl-3">
        <div class="card product-card">
          <div class="position-relative">
            <span class="badge-stock ${inStock ? '' : 'out-of-stock'}">
              ${inStock ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
            <img src="${product.imageURL}" class="card-img-top product-image" alt="${product.name}">
          </div>
          <div class="card-body">
            <span class="badge bg-success mb-2">${product.category}</span>
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted" style="font-size: 14px; height: 40px; overflow: hidden;">
              ${product.description || 'Fresh and high quality'}
            </p>
            <div class="rating-stars mb-2">
              ${generateStars(product.rating || 0)}
              <span class="text-muted ms-2">(${product.rating || 0})</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="price-tag">$${parseFloat(product.price).toFixed(2)}</span>
              <div>
                <a href="/product-details/${productId}" class="btn btn-outline-primary btn-sm me-1">
                  <i class="fas fa-eye"></i>
                </a>
                <button
                  class="btn btn-primary btn-sm"
                  onclick="addToCartFromShop('${productId}')"
                  ${!inStock ? 'disabled' : ''}>
                  <i class="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

function addToCartFromShop(productId) {
  const product = allProducts.find(p => (p._id || p.id) == productId);
  if (product) {
    addToCart(product, 1);
  }
}

function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm));
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    return matchesSearch && matchesCategory;
  });
  displayProducts();
  updateProductCount();
}

document.getElementById('searchInput').addEventListener('input', searchProducts);

function filterByCategory(category) {
  currentCategory = category;

  document.querySelectorAll('.category-filter .btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  searchProducts();
}

function sortProducts() {
  const sortValue = document.getElementById('sortSelect').value;

  switch(sortValue) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      filteredProducts = allProducts.filter(product => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        return matchesSearch && matchesCategory;
      });
  }

  displayProducts();
}

function updateProductCount() {
  const count = filteredProducts.length;
  const total = allProducts.length;
  document.getElementById('productCount').textContent =
    `Showing ${count} of ${total} products`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
