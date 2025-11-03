const container = document.getElementById('images-container');

async function loadImages() {
  const res = await fetch('http://localhost:5000/api/images');
  const images = await res.json();

  container.innerHTML = ''; // clear container

  images.forEach(image => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="http://localhost:5000/uploads/${image.filename}" width="150">
      <p>${image.caption} - £${image.price}</p>
      <button onclick="deleteImage(${image.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function deleteImage(id) {
  const confirmed = confirm('Are you sure you want to delete this image?');
  if (!confirmed) return;

  const res = await fetch(`http://localhost:5000/api/images/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('Deleted successfully!');
    loadImages();
  } else {
    alert('Failed to delete');
  }
}

loadImages();