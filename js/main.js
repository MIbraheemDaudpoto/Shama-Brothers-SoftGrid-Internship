// Main interactive behaviors: sticky nav, mobile toggle, particles, scroll animations
(function(){
  // ── LOADING SCREEN ─────────────────────────────────────────
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 800);
    }
  });

  // ── STICKY NAVBAR ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const scrollBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      if (scrollBtn) scrollBtn.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      if (scrollBtn) scrollBtn.classList.remove('visible');
    }
  });
  
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── MOBILE NAVIGATION ──────────────────────────────────────
  const ham = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  
  if (ham && mobileNav) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileNav.classList.remove('open');
    }));
  }

  // ── SCROLL ANIMATIONS ──────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) e.target.classList.add('visible'); 
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── PARTICLES EFFECT ───────────────────────────────────────
  const container = document.getElementById('particles');
  if (container) {
    const colors = ['#c0392b','#e74c3c','#f39c12','#e67e22','#ff6b35'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size * 3}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --dur: ${Math.random() * 6 + 5}s;
        --delay: ${Math.random() * 8}s;
      `;
      container.appendChild(p);
    }
  }

  // Set current year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ── MENU SEARCH AND FILTER ────────────────────────────────
  const menuSearch = document.getElementById('menuSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');
  const noResults = document.getElementById('noResults');
  const searchResults = document.getElementById('searchResults');
  let currentCategory = 'all';

  function filterMenu() {
    let visibleCount = 0;
    
    dishCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const searchText = menuSearch ? menuSearch.value.toLowerCase() : '';
      const cardName = card.getAttribute('data-name').toLowerCase();
      const cardSearchTerms = card.getAttribute('data-search').toLowerCase();

      // Check category filter
      const categoryMatch = currentCategory === 'all' || cardCategory === currentCategory;
      
      // Check search filter
      const searchMatch = !searchText || cardName.includes(searchText) || cardSearchTerms.includes(searchText);

      if (categoryMatch && searchMatch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide no results message
    if (noResults) {
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }

    // Hide search results dropdown when menu is filtered
    if (searchResults) searchResults.classList.remove('show');
  }

  // Search functionality with live preview
  if (menuSearch) {
    menuSearch.addEventListener('input', (e) => {
      const searchText = e.target.value.toLowerCase().trim();

      if (searchText.length > 0) {
        const matches = [];
        dishCards.forEach(card => {
          const cardName = card.getAttribute('data-name');
          const cardSearchTerms = card.getAttribute('data-search');
          if (cardName.toLowerCase().includes(searchText) || cardSearchTerms.toLowerCase().includes(searchText)) {
            matches.push(cardName);
          }
        });

        if (matches.length > 0 && searchResults) {
          searchResults.innerHTML = matches
            .slice(0, 5)
            .map(match => `<div class="search-result-item">${match}</div>`)
            .join('');
          searchResults.classList.add('show');
        } else if (searchResults) {
          searchResults.innerHTML = '<div class="search-result-item">No items found</div>';
          searchResults.classList.add('show');
        }
      } else if (searchResults) {
        searchResults.classList.remove('show');
      }

      filterMenu();
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (searchResults && !e.target.closest('.menu-search-wrapper')) {
        searchResults.classList.remove('show');
      }
    });
  }

  // Category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update current category
      currentCategory = btn.getAttribute('data-category');
      
      // Clear search and hide search results
      if (menuSearch) {
        menuSearch.value = '';
        if (searchResults) searchResults.classList.remove('show');
      }
      
      // Apply filter
      filterMenu();
    });
  });

  // ── CONTACT FORM VALIDATION ───────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');
    const formSuccessMessage = document.getElementById('formSuccessMessage');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    const successName = document.getElementById('successName');
    const successEmail = document.getElementById('successEmail');

    // Helper functions for validation
    const showError = (input, errorElId, msg) => {
      input.classList.add('error');
      input.classList.remove('valid');
      const errorEl = document.getElementById(errorElId);
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
      }
    };

    const showValid = (input, errorElId) => {
      input.classList.remove('error');
      input.classList.add('valid');
      const errorEl = document.getElementById(errorElId);
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (input, errorElId, errorMsg) => {
      if (!input.value.trim()) {
        showError(input, errorElId, errorMsg);
        return false;
      }
      showValid(input, errorElId);
      return true;
    };

    const validateForm = () => {
      let isValid = true;

      // Validate Name
      if (!validateField(contactName, 'nameError', 'Full Name is required')) {
        isValid = false;
      }

      // Validate Email
      const emailValue = contactEmail.value.trim();
      if (!emailValue) {
        showError(contactEmail, 'emailError', 'Email address is required');
        isValid = false;
      } else if (!validateEmail(emailValue)) {
        showError(contactEmail, 'emailError', 'Please enter a valid email address');
        isValid = false;
      } else {
        showValid(contactEmail, 'emailError');
      }

      // Validate Subject
      if (!validateField(contactSubject, 'subjectError', 'Subject is required')) {
        isValid = false;
      }

      // Validate Message
      if (!validateField(contactMessage, 'messageError', 'Message is required')) {
        isValid = false;
      }

      return isValid;
    };

    // Live validation on input
    contactName.addEventListener('input', () => validateField(contactName, 'nameError', 'Full Name is required'));
    contactEmail.addEventListener('input', () => {
      const emailValue = contactEmail.value.trim();
      if (!emailValue) {
        showError(contactEmail, 'emailError', 'Email address is required');
      } else if (!validateEmail(emailValue)) {
        showError(contactEmail, 'emailError', 'Please enter a valid email address');
      } else {
        showValid(contactEmail, 'emailError');
      }
    });
    contactSubject.addEventListener('input', () => validateField(contactSubject, 'subjectError', 'Subject is required'));
    contactMessage.addEventListener('input', () => validateField(contactMessage, 'messageError', 'Message is required'));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        // Form is valid! Set success elements
        if (successName) successName.textContent = contactName.value.trim();
        if (successEmail) successEmail.textContent = contactEmail.value.trim();
        
        // Show success animation/container
        contactForm.classList.add('form-hidden');
        if (formSuccessMessage) {
          formSuccessMessage.classList.add('visible');
        }
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        
        // Clear classes
        [contactName, contactEmail, contactSubject, contactMessage].forEach(input => {
          input.classList.remove('valid', 'error');
        });
        
        // Hide success message, show form
        contactForm.classList.remove('form-hidden');
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('visible');
        }
      });
    }
  }
})();
