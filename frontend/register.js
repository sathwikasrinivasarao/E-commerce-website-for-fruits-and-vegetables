document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('https://e-commerce-website-for-fruits-and.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            // ✅ Redirect user to login after successful registration
            window.location.href = "login.html";
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});
