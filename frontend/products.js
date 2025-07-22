document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://e-commerce-website-for-fruits-and.onrender.com/api/products');
        const products = await response.json();

        const productList = document.getElementById('productList');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4';
            productCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${product.imageURL}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Price: $${product.price}</p>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });

        // 🧠 Optional: Initialize map if you have a real use case
        function initMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });

            new google.maps.Marker({
                position: { lat: -34.397, lng: 150.644 },
                map,
                title: 'Farm Location'
            });
        }
    } catch (error) {
        alert('An error occurred while fetching products.');
    }
});
