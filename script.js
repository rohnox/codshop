const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const tabs = document.querySelectorAll('.tab');
const productGrids = document.querySelectorAll('.product-grid');
const testimonials = document.querySelectorAll('.testimonial');
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
    item.classList.toggle('active', index === currentTestimonial);
  });
};

if (testimonialNext && testimonialPrev && testimonials.length) {
  testimonialNext.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
  });

  testimonialPrev.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
  });
}

updateTestimonial();

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
