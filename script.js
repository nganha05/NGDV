/**
 * NGDV METAL - KIM KHI NGDV LANDING PAGE SCRIPT
 * Handles Sticky Header, Mobile Navigation, Product Filtering,
 * Pre-selected Quote Product, Lightbox Gallery, Scroll Reveal, and Modal Form
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const backToTopBtn = document.getElementById('backToTop');

  // 1. Sticky Header, Back-to-Top Button & Active Nav Highlight
  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 400);
    }

    const sections = document.querySelectorAll('section[id], div[id="contact"]');
    let currentSectionId = 'home';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSectionId}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Product Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  const applyFilter = (category) => {
    filterBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });

    productCards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.classList.toggle('hidden', !match);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
    });
  });

  // Footer quick links that trigger product filter
  document.querySelectorAll('[data-filter-trigger]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetFilter = link.getAttribute('data-filter-trigger');
      if (targetFilter) {
        applyFilter(targetFilter);
      }
    });
  });

  // 4. Pre-select Product in Quote Form when clicking "Yêu cầu báo giá"
  const productSelect = document.getElementById('productCategory');
  const customerNameInput = document.getElementById('customerName');

  document.querySelectorAll('.product-link[data-product]').forEach((link) => {
    link.addEventListener('click', () => {
      const productName = link.getAttribute('data-product');
      if (productSelect && productName) {
        productSelect.value = productName;
      }
      setTimeout(() => {
        if (customerNameInput) customerNameInput.focus();
      }, 500);
    });
  });

  // 5. Gallery Lightbox Preview
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  };

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = title ? title.textContent : img.alt;
        }
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 6. Scroll Reveal Animation using IntersectionObserver
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 7. Quote Form Submission & Custom Modal
  const quoteForm = document.getElementById('quoteForm');
  const quoteModal = document.getElementById('quoteModal');
  const modalMessage = document.getElementById('modalMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const closeModal = () => {
    if (quoteModal) {
      quoteModal.classList.remove('open');
      quoteModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('customerName')?.value.trim() || 'Quý khách';
      const phoneVal = document.getElementById('customerPhone')?.value.trim() || '';
      const categoryVal = document.getElementById('productCategory')?.value || 'Vật tư kim khí';

      if (modalMessage) {
        modalMessage.innerHTML = `Cảm ơn <strong>${nameVal}</strong> (${phoneVal}) đã gửi yêu cầu báo giá hạng mục <strong>${categoryVal}</strong>.<br/>Phòng kinh doanh <strong>Kim Khí NGDV (NGDV Metal)</strong> sẽ liên hệ gửi bảng báo giá sỉ trong thời gian sớm nhất! (Hotline/Zalo: <strong>0968.812.815</strong>)`;
      }

      if (quoteModal) {
        quoteModal.classList.add('open');
        quoteModal.setAttribute('aria-hidden', 'false');
      }

      quoteForm.reset();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeModal();
    }
  });
});
