const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const tabs = document.querySelectorAll('.tab');
const productGrids = document.querySelectorAll('.product-grid');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialPrev = document.querySelector('.control.prev');
const testimonialNext = document.querySelector('.control.next');
const scrollTopBtn = document.querySelector('.scroll-top');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

if (tabs.length && productGrids.length) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      productGrids.forEach((grid) => {
        grid.classList.toggle('active', grid.id === targetId);
      });
    });
  });
}

let currentTestimonial = 0;
const updateTestimonial = () => {
  testimonials.forEach((item, index) => {
    const isActive = index === currentTestimonial;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-hidden', String(!isActive));
    item.setAttribute('tabindex', isActive ? '0' : '-1');
  });
};

const focusActiveTestimonial = () => {
  const activeTestimonial = testimonials[currentTestimonial];
  if (activeTestimonial) {
    activeTestimonial.focus();
  }
};

if (testimonialNext && testimonialPrev && testimonials.length) {
  testimonialNext.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
    if (document.activeElement === testimonialNext) {
      focusActiveTestimonial();
    }
  });

  testimonialPrev.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
    if (document.activeElement === testimonialPrev) {
      focusActiveTestimonial();
    }
  });

  if (testimonialSlider) {
    testimonialSlider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
        focusActiveTestimonial();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
        focusActiveTestimonial();
      }
    });
  }
}

if (testimonials.length) {
  if (testimonialSlider && !testimonialSlider.hasAttribute('tabindex')) {
    testimonialSlider.setAttribute('tabindex', '0');
  }
  updateTestimonial();
}

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
