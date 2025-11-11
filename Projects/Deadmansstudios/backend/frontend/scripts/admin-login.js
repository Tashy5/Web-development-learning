const form = document.getElementById('admin-login-form');
const keyInput = document.getElementById('admin-key');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload

  const key = keyInput.value;

  try {
    const res = await fetch('http://localhost:5000/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });

    if (res.ok) {
      // Key is correct, redirect to admin panel
      window.location.href = 'admin.html';
    } else {
      // Key is incorrect
      const data = await res.json();
      alert(data.message || 'Invalid login! Please try again.');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
});
