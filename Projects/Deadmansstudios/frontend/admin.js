// admin.js
const form = document.getElementById('admin-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent default form submission

  // Create FormData from the form; includes file + caption + price
  const formData = new FormData(form);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Image uploaded successfully!');
      form.reset(); // clear the form
    } else {
      const text = await res.text();
      alert('Upload failed: ' + text);
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while uploading.');
  }
});