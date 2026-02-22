// ===== gallery.js — Drag & Drop Image Gallery =====

(function initGallery() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryEmpty = document.getElementById('galleryEmpty');
    const galleryControls = document.getElementById('galleryControls');
    const galleryCount = document.getElementById('galleryCount');
    const clearBtn = document.getElementById('clearGallery');

    if (!dropZone) return;

    // Load saved images from localStorage
    let images = [];
    try {
        const stored = localStorage.getItem('portfolioGallery');
        if (stored) {
            images = JSON.parse(stored);
        }

        // If empty, preload the generated images
        if (!images || images.length === 0) {
            images = [
                { src: 'assets/images/gallery_code_1771753043549.png', name: 'Code Wallpaper' },
                { src: 'assets/images/gallery_setup_1771753063299.png', name: 'Developer Setup' },
                { src: 'assets/images/gallery_abstract_1771753088132.png', name: 'Abstract Tech' }
            ];
            // Initialize localstorage with defaults so they show persistently
            localStorage.setItem('portfolioGallery', JSON.stringify(images));
        }
    } catch (e) {
        images = [];
    }

    renderAll();

    // ---- Click to browse ----
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => handleFiles(e.target.files));

    // ---- Drag events ----
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // ---- Clear all ----
    clearBtn && clearBtn.addEventListener('click', () => {
        if (!confirm('Remove all photos from the gallery?')) return;
        images = [];
        save();
        renderAll();
    });

    // ---- Handle selected / dropped files ----
    function handleFiles(files) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        Array.from(files).forEach(file => {
            if (!validTypes.includes(file.type)) return;
            const reader = new FileReader();
            reader.onload = e => {
                images.push({ src: e.target.result, name: file.name });
                save();
                renderAll();
            };
            reader.readAsDataURL(file);
        });
        // Reset file input so same file can be re-added
        fileInput.value = '';
    }

    // ---- Render everything ----
    function renderAll() {
        galleryGrid.innerHTML = '';

        if (images.length === 0) {
            galleryEmpty.style.display = '';
            galleryControls.style.display = 'none';
            return;
        }

        galleryEmpty.style.display = 'none';
        galleryControls.style.display = 'flex';
        galleryCount.textContent = `${images.length} photo${images.length > 1 ? 's' : ''}`;

        images.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
        <img src="${img.src}" alt="${escapeHtml(img.name)}" loading="lazy" />
        <div class="gallery-item-overlay">
          <span class="gallery-item-name">${escapeHtml(img.name)}</span>
          <button class="gallery-item-remove" data-index="${index}" title="Remove">✕</button>
        </div>
      `;
            // Click image → open lightbox
            item.querySelector('img').addEventListener('click', () => openLightbox(img.src));
            // Remove button
            item.querySelector('.gallery-item-remove').addEventListener('click', e => {
                e.stopPropagation();
                removeImage(index);
            });
            galleryGrid.appendChild(item);
        });
    }

    // ---- Remove individual image ----
    function removeImage(index) {
        images.splice(index, 1);
        save();
        renderAll();
    }

    // ---- Lightbox ----
    function openLightbox(src) {
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
      <img src="${src}" alt="Gallery photo" />
      <button class="lightbox-close" title="Close">✕</button>
    `;
        lb.querySelector('.lightbox-close').addEventListener('click', () => lb.remove());
        lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); }
        });
        document.body.appendChild(lb);
    }

    // ---- Persist to localStorage ----
    function save() {
        try {
            localStorage.setItem('portfolioGallery', JSON.stringify(images));
        } catch (e) {
            // localStorage quota exceeded — clear old and try again
            localStorage.removeItem('portfolioGallery');
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
})();
