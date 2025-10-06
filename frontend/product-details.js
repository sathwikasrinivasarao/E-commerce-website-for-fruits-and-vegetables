let currentProduct = null;
let selectedRating = 5;
let quantity = 1;

async function loadProductDetails() {
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  try {
    showLoading();
    const response = await fetch(`/api/products/${productId}`);
    if (response.ok) {
      currentProduct = await response.json();
      displayProduct();
      loadReviews();
    } else {
      showToast('Product not found', 'error');
      setTimeout(() => window.location.href = '/shop', 2000);
    }
  } catch (error) {
    console.error('Error loading product:', error);
    showToast('Error loading product', 'error');
  } finally {
    hideLoading();
  }
}

function displayProduct() {
  const productId = currentProduct._id || currentProduct.id;
  const inStock = currentProduct.stock > 0;

  document.getElementById('breadcrumbProduct').textContent = currentProduct.name;
  document.title = `${currentProduct.name} - Farm Marketplace`;

  const detailsHtml = `
    <div class="col-lg-6">
      <img src="${currentProduct.imageURL}" class="product-image-main" alt="${currentProduct.name}">
    </div>
    <div class="col-lg-6">
      <div class="product-info">
        <span class="badge bg-success mb-3">${currentProduct.category}</span>
        <h2 class="mb-3">${currentProduct.name}</h2>

        <div class="rating-stars mb-3">
          ${generateStars(currentProduct.rating || 0)}
          <span class="text-muted ms-2">(${currentProduct.rating || 0} rating)</span>
        </div>

        <h3 class="text-primary mb-4">$${parseFloat(currentProduct.price).toFixed(2)}</h3>

        <p class="mb-4">${currentProduct.description || 'Fresh and high quality produce directly from local farmers.'}</p>

        <div class="mb-4">
          <strong>Stock:</strong>
          <span class="${inStock ? 'text-success' : 'text-danger'}">
            ${inStock ? `${currentProduct.stock} available` : 'Out of Stock'}
          </span>
        </div>

        ${inStock ? `
          <div class="mb-4">
            <label class="form-label"><strong>Quantity:</strong></label>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
              <span class="quantity-display" id="quantityDisplay">1</span>
              <button class="quantity-btn" onclick="increaseQuantity()">+</button>
            </div>
          </div>

          <div class="d-flex gap-3">
            <button class="btn btn-primary btn-lg flex-grow-1" onclick="addToCartWithQuantity()">
              <i class="fas fa-shopping-cart me-2"></i>Add to Cart
            </button>
            <button class="btn btn-outline-primary btn-lg" onclick="addToFavorites()">
              <i class="far fa-heart"></i>
            </button>
          </div>
        ` : `
          <button class="btn btn-secondary btn-lg w-100" disabled>
            Out of Stock
          </button>
        `}
      </div>
    </div>
  `;

  document.getElementById('productDetails').innerHTML = detailsHtml;
  initializeRatingStars();
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

function increaseQuantity() {
  if (quantity < currentProduct.stock) {
    quantity++;
    document.getElementById('quantityDisplay').textContent = quantity;
  }
}

function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById('quantityDisplay').textContent = quantity;
  }
}

function addToCartWithQuantity() {
  if (currentProduct) {
    addToCart(currentProduct, quantity);
    quantity = 1;
    document.getElementById('quantityDisplay').textContent = quantity;
  }
}

function addToFavorites() {
  showToast('Added to favorites!', 'success');
}

async function loadReviews() {
  const productId = currentProduct._id || currentProduct.id;
  try {
    const response = await fetch(`/api/reviews/${productId}`);
    if (response.ok) {
      const reviews = await response.json();
      displayReviews(reviews);
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

function displayReviews(reviews) {
  const reviewsList = document.getElementById('reviewsList');

  if (reviews.length === 0) {
    reviewsList.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-comment-slash fa-3x text-muted mb-3"></i>
        <p class="text-muted">No reviews yet. Be the first to review this product!</p>
      </div>
    `;
    return;
  }

  reviewsList.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <strong>${review.userId?.name || 'Anonymous'}</strong>
          <div class="rating-stars">
            ${generateStars(review.rating)}
          </div>
        </div>
        <small class="text-muted">${formatDate(review.createdAt)}</small>
      </div>
      <p class="mb-0">${review.comment || 'No comment provided.'}</p>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function initializeRatingStars() {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach(star => {
    star.style.cursor = 'pointer';
    star.style.fontSize = '24px';
    star.style.color = '#FFB524';
  });
  updateStarDisplay();
}

function setRating(rating) {
  selectedRating = rating;
  document.getElementById('ratingValue').value = rating;
  updateStarDisplay();
}

function updateStarDisplay() {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.remove('far');
      star.classList.add('fas');
    } else {
      star.classList.remove('fas');
      star.classList.add('far');
    }
  });
}

async function submitReview(event) {
  event.preventDefault();

  const user = getUser();
  if (!user) {
    showToast('Please login to submit a review', 'error');
    setTimeout(() => window.location.href = '/login', 1500);
    return;
  }

  const productId = currentProduct._id || currentProduct.id;
  const rating = parseInt(document.getElementById('ratingValue').value);
  const comment = document.getElementById('reviewComment').value.trim();

  try {
    showLoading();
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId,
        userId: user.id,
        rating,
        comment
      })
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Review submitted successfully!', 'success');
      document.getElementById('reviewForm').reset();
      selectedRating = 5;
      updateStarDisplay();
      loadReviews();
    } else {
      showToast(data.message || 'Failed to submit review', 'error');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    showToast('Error submitting review', 'error');
  } finally {
    hideLoading();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProductDetails();
});
