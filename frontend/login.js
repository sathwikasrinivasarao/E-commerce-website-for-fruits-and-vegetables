document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            // Optionally redirect to another page
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});
