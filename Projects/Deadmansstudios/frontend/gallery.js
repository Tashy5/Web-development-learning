// gallery.js
const galleryContainer = document.getElementById('gallery-container');

// Fetch images from backend and display them
async function loadGallery() {
  try {
    const res = await fetch('/api/gallery');
    const images = await res.json();

    galleryContainer.innerHTML = ''; // clear container

    images.forEach(img => {
      // Create image wrapper
      const div = document.createElement('div');
      div.classList.add('gallery-item');

      // Create image element
      const imageEl = document.createElement('img');
      imageEl.src = `images/${img.filename}`;
      imageEl.alt = img.caption;
      imageEl.style.width = '200px'; // optional fixed size
      imageEl.style.height = 'auto';

      // Create caption & price
      const captionEl = document.createElement('p');
      captionEl.textContent = img.caption;

      const priceEl = document.createElement('p');
      priceEl.textContent = `$${img.price}`;

      // Append to wrapper
      div.appendChild(imageEl);
      div.appendChild(captionEl);
      div.appendChild(priceEl);

      // Append to gallery container
      galleryContainer.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}

// Load gallery on page load
window.addEventListener('DOMContentLoaded', loadGallery);