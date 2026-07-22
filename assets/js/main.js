/* ==============================================
   CENTRO RAÍCES — JavaScript modular
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR: Efecto scroll ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavbarScroll = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ========== NAVBAR: Menú mobile ==========
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar__link');

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : navMenu.classList.contains('navbar__menu--open');
    if (isOpen) {
      navMenu.classList.remove('navbar__menu--open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('navbar__menu--open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      document.body.style.overflow = 'hidden';
    }
  };

  navToggle.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('navbar__menu--open')) {
        toggleMenu(true);
      }
    });
  });

  // Cerrar menú al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('navbar__menu--open')) {
      toggleMenu(true);
      navToggle.focus();
    }
  });

  // ========== ANIMACIONES SCROLL (Intersection Observer) ==========
  const animateElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ========== FAQ ACORDEÓN ==========
  const faqQuestions = document.querySelectorAll('.faq__question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos
      faqQuestions.forEach(other => {
        other.setAttribute('aria-expanded', 'false');
      });

      // Abrir el clickeado si estaba cerrado
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========== FORMULARIO: Validación en tiempo real ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.form__input');

    // Limpiar mensajes de error
    const clearError = (input) => {
      const error = input.parentElement.querySelector('.form__error');
      if (error) error.textContent = '';
      input.classList.remove('form__input--error');
      input.classList.remove('form__input--success');
    };

    // Mostrar mensaje de error
    const showError = (input, message) => {
      const error = input.parentElement.querySelector('.form__error');
      if (error) error.textContent = message;
      input.classList.add('form__input--error');
      input.classList.remove('form__input--success');
    };

    // Mostrar estado válido
    const showSuccess = (input) => {
      input.classList.remove('form__input--error');
      input.classList.add('form__input--success');
    };

    // Validar campo individual
    const validateField = (input) => {
      clearError(input);
      const value = input.value.trim();

      if (input.required && !value) {
        showError(input, 'Este campo es obligatorio');
        return false;
      }

      if (value) {
        if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            showError(input, 'Ingresá un correo electrónico válido');
            return false;
          }
        }

        if (input.type === 'tel') {
          const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
          if (!phoneRegex.test(value)) {
            showError(input, 'Ingresá un número de teléfono válido');
            return false;
          }
        }
      }

      if (value) showSuccess(input);
      return true;
    };

    // Validar campo al perder foco
    formInputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));

      // Validar al escribir (con debounce)
      let debounceTimer;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        if (input.value.trim()) {
          debounceTimer = setTimeout(() => validateField(input), 400);
        } else {
          clearError(input);
        }
      });
    });

    // Validar formulario completo al enviar
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (isValid) {
        // Simulación de envío exitoso
        const submitBtn = contactForm.querySelector('.form__submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Enviado con éxito';
        submitBtn.style.background = '#70C1B3';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
          formInputs.forEach(input => input.classList.remove('form__input--success'));
        }, 3000);
      } else if (firstInvalid) {
        firstInvalid.focus();
      }
    });
  }

  // ========== SMOOTH SCROLL para enlaces de anclaje ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).scrollPaddingTop);
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

});
