 const imageInput = document.getElementById('image-file');
    const captionInput = document.getElementById('caption');
    const priceInput = document.getElementById('price');
    const previewBox = document.getElementById('preview-box');

    function updatePreview() {
      const file = imageInput.files[0];
      const caption = captionInput.value;
      const price = priceInput.value;

      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        previewBox.innerHTML = `
          <img src="${e.target.result}" alt="${caption}">
          <div class="caption">${caption}</div>
          <div class="price">£${price}</div>
        `;
      };
      reader.readAsDataURL(file);
    }

    imageInput.addEventListener('change', updatePreview);
    captionInput.addEventListener('input', updatePreview);
    priceInput.addEventListener('input', updatePreview);

