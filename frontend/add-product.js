document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const imageURL = document.getElementById('imageURL').value;
    const userId = document.getElementById('userId').value;

    try {
        const response = await fetch('https://e-commerce-website-for-fruits-and.onrender.com/api/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, imageURL, userId })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Product added successfully!');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});
