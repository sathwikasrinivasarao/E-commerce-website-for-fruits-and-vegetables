document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://e-commerce-website-for-fruits-and.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            // ✅ You can redirect to products page if needed
            window.location.href = "products.html";
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});
