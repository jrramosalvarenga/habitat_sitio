(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  // Sticky header shadow
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Hero video fallback if it fails to load/play
  const heroVideo = document.querySelector('.hero-media video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; });
    const playPromise = heroVideo.play();
    if (playPromise) playPromise.catch(() => { heroVideo.style.display = 'none'; });
  }

  // Lightbox gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.img;
    lightboxImg.alt = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const showRelative = (delta) => {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.img;
    lightboxImg.alt = item.dataset.caption || '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showRelative(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showRelative(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  // Contact form -> WhatsApp
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const mensaje = form.mensaje.value.trim();
    const text = `Hola, soy ${nombre} (Tel: ${telefono}). ${mensaje || 'Quisiera información sobre los lotes disponibles.'}`;
    const url = `https://wa.me/50495925617?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
