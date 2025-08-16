'use strict';

// --- tiny toast helper ---
function toast(msg, ok = false) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.left = '50%';
  el.style.top = '20px';
  el.style.transform = 'translateX(-50%)';
  el.style.padding = '10px 16px';
  el.style.borderRadius = '8px';
  el.style.background = ok ? '#10b981' : '#ef4444';
  el.style.color = 'white';
  el.style.zIndex = 99999;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result).split(',')[1]); // strip data URL prefix
    reader.readAsDataURL(file);
  });
}

function getCurrentUserId() {
  try {
    const fbUser = (window.firebase && firebase.auth && firebase.auth().currentUser)
      ? firebase.auth().currentUser
      : null;
    if (fbUser && fbUser.email) return fbUser.email;
  } catch (_) {}
  const stored = localStorage.getItem('userId');
  if (stored) return stored;
  return null;
}

// --- Hook up the SVG as file picker + preview ---
document.addEventListener('DOMContentLoaded', () => {
  // Create a hidden file input if not present
  let fileInput = document.getElementById('imageFile');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'imageFile';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }

  // Your SVG wrapper and <img>
  const uploadWrap = document.querySelector('.upload-wrapper');
  const uploadImg  = uploadWrap ? uploadWrap.querySelector('img') : null;

  if (uploadWrap) {
    uploadWrap.style.cursor = 'pointer';
    uploadWrap.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        if (uploadImg) {
          uploadImg.src = e.target.result; // preview
          uploadImg.alt = 'Selected design preview';
          uploadImg.style.objectFit = 'cover';
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    console.warn('No .upload-wrapper found.');
  }
});

// --- Form submit handler ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('email-form');
  if (!form) return;

  const designNameEl = document.getElementById('designName');
  const categoryEl   = document.getElementById('category');
  const materialEl   = document.getElementById('material');
  const priceEl      = document.getElementById('price');
  const descEl       = document.getElementById('description');
  const imageEl      = document.getElementById('imageFile');
  const confirmEl    = document.getElementById('confirmOwnWork');
  const submitBtn    = form.querySelector('input[type="submit"]');

  async function handleSubmit(e) {
    e.preventDefault();

    if (confirmEl && !confirmEl.checked) {
      toast('Please confirm you own this design.');
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      toast('Please log in first.');
      const m = document.getElementById('auth-modal');
      if (m) m.style.display = 'block';
      return;
    }

    const file = imageEl && imageEl.files && imageEl.files[0];
    if (!file) {
      toast('Please choose an image.');
      return;
    }
    if (file.size > 14 * 1024 * 1024) {
      toast('Image is too large (max ~14MB).');
      return;
    }

    const priceNumber = parseFloat(priceEl ? priceEl.value : '');
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast('Please enter a valid price.');
      return;
    }

    const oldBtnText = submitBtn ? submitBtn.value : '';
    if (submitBtn) { submitBtn.value = 'Uploading...'; submitBtn.disabled = true; }

    try {
      const base64Image = await fileToBase64(file);

      const payload = {
        imageBase64: base64Image,
        type: (categoryEl && categoryEl.value || '').trim(),   // API "type" <- Category
        userId: userId,                                        // email or stored id
        price: priceNumber,
        material: (materialEl && materialEl.value || '').trim(),
        description: (descEl && descEl.value || '').trim() || null,
        addToMarket: true,
        designName: (designNameEl && designNameEl.value || '').trim()
      };

      const res = await fetch('https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Upload failed (${res.status}): ${errText || 'Unknown error'}`);
      }

      await res.json().catch(() => ({}));
      toast('Uploaded successfully!', true);

      form.reset();
      // Optional: window.location.href = 'sell.html';
    } catch (err) {
      console.error(err);
      toast(err.message || 'Upload failed');
    } finally {
      if (submitBtn) { submitBtn.value = oldBtnText; submitBtn.disabled = false; }
    }
  }

  form.addEventListener('submit', handleSubmit);
});
