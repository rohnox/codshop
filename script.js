const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const tabs = document.querySelectorAll('.tab');
const productGrids = document.querySelectorAll('.product-grid');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialPrev = document.querySelector('.control.prev');
const testimonialNext = document.querySelector('.control.next');
const scrollTopBtn = document.querySelector('.scroll-top');
const overlay = document.querySelector('[data-overlay]');
const cartDrawer = document.querySelector('.cart-drawer');
const cartToggleButton = document.querySelector('.cart-toggle');
const cartCloseButton = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('[data-cart-items]');
const cartTotalElement = document.querySelector('[data-cart-total]');
const cartBadge = document.querySelector('[data-cart-count]');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const subscriptionSection = document.querySelector('.subscription-layout');
const authForms = document.querySelectorAll('.auth-form');

const currencyFormatter = new Intl.NumberFormat('fa-IR');
const formatCurrency = (value) => `${currencyFormatter.format(Number(value) || 0)} تومان`;

let cartItems = [];

const updateBodyScroll = (isLocked) => {
  document.body.classList.toggle('no-scroll', isLocked);
};

const openOverlay = (type) => {
  if (!overlay) return;
  overlay.hidden = false;
  overlay.dataset.active = type;
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });
  updateBodyScroll(true);
};

const closeOverlay = () => {
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.removeAttribute('data-active');
  setTimeout(() => {
    if (!overlay.classList.contains('active')) {
      overlay.hidden = true;
      updateBodyScroll(false);
    }
  }, 220);
};

const calculateCartTotal = () =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

const updateCartBadge = () => {
  if (!cartBadge) return;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    cartBadge.hidden = false;
    cartBadge.textContent = currencyFormatter.format(totalItems);
  } else {
    cartBadge.hidden = true;
    cartBadge.textContent = currencyFormatter.format(0);
  }
};

const renderCart = () => {
  if (!cartItemsContainer || !cartTotalElement) return;
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <span class="icon">🛍️</span>
        <p>هنوز محصولی به سبد خرید اضافه نشده است.</p>
      </div>
    `;
    cartTotalElement.textContent = formatCurrency(0);
    updateCartBadge();
    return;
  }

  const itemsMarkup = cartItems
    .map(
      (item, index) => `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <span>${item.plan}</span>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control" aria-label="تعداد">
              <button type="button" class="qty-btn" data-action="decrease" aria-label="کاهش تعداد">−</button>
              <span aria-live="polite">${currencyFormatter.format(item.quantity)}</span>
              <button type="button" class="qty-btn" data-action="increase" aria-label="افزایش تعداد">+</button>
            </div>
            <strong>${formatCurrency(item.price * item.quantity)}</strong>
            <button type="button" class="remove-item" aria-label="حذف ${item.title}">حذف</button>
          </div>
        </div>
      `
    )
    .join('');

  cartItemsContainer.innerHTML = itemsMarkup;
  cartTotalElement.textContent = formatCurrency(calculateCartTotal());
  updateCartBadge();

  cartItemsContainer.querySelectorAll('.qty-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const cartItem = button.closest('.cart-item');
      if (!cartItem) return;
      const index = Number(cartItem.dataset.index);
      if (Number.isNaN(index)) return;
      if (button.dataset.action === 'increase') {
        cartItems[index].quantity += 1;
      } else if (button.dataset.action === 'decrease') {
        cartItems[index].quantity = Math.max(1, cartItems[index].quantity - 1);
      }
      renderCart();
    });
  });

  cartItemsContainer.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const cartItem = button.closest('.cart-item');
      if (!cartItem) return;
      const index = Number(cartItem.dataset.index);
      if (Number.isNaN(index)) return;
      cartItems.splice(index, 1);
      renderCart();
    });
  });
};

const openCart = () => {
  if (!cartDrawer) return;
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  openOverlay('cart');
};

const closeCart = () => {
  if (!cartDrawer) return;
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  closeOverlay();
};

const addItemToCart = ({ id, title, price, plan }) => {
  if (!id || !title || !price) return;
  const existing = cartItems.find((item) => item.id === id && item.plan === plan);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ id, title, price, plan, quantity: 1 });
  }
  renderCart();
};

const handleAddToCartClick = (button) => {
  const id = button.dataset.productId;
  const title = button.dataset.productTitle;
  const price = Number(button.dataset.productPrice || 0);
  const plan = button.dataset.planName || 'خرید نقدی';

  addItemToCart({ id, title, price, plan });
  openCart();

  const originalText = button.dataset.originalText || button.textContent.trim();
  button.dataset.originalText = originalText;
  button.classList.add('added');
  button.textContent = 'به سبد اضافه شد';
  setTimeout(() => {
    button.classList.remove('added');
    button.textContent = originalText;
  }, 2200);
};

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

if (addToCartButtons.length) {
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => handleAddToCartClick(button));
  });
}

if (cartToggleButton) {
  cartToggleButton.addEventListener('click', openCart);
}

if (cartCloseButton) {
  cartCloseButton.addEventListener('click', closeCart);
}

if (overlay) {
  overlay.addEventListener('click', () => {
    if (overlay.dataset.active === 'cart') {
      closeCart();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('open')) {
    closeCart();
  }
});

if (subscriptionSection) {
  const planButtons = subscriptionSection.querySelectorAll('.plan-option');
  const selectedPlanLabel = subscriptionSection.querySelector('[data-selected-plan]');
  const selectedPriceLabel = subscriptionSection.querySelector('[data-selected-price]');
  const subscriptionAddButton = subscriptionSection.querySelector('.subscription-footer .add-to-cart');

  planButtons.forEach((button) => {
    button.addEventListener('click', () => {
      planButtons.forEach((option) => option.classList.remove('active'));
      button.classList.add('active');

      const price = Number(button.dataset.price || 0);
      const label = button.dataset.planLabel || '';

      if (selectedPlanLabel) {
        selectedPlanLabel.textContent = label;
      }

      if (selectedPriceLabel) {
        selectedPriceLabel.textContent = formatCurrency(price);
      }

      if (subscriptionAddButton) {
        subscriptionAddButton.dataset.productPrice = price;
        subscriptionAddButton.dataset.planName = label;
        subscriptionAddButton.dataset.planMonths = button.dataset.planMonths || '';
      }
    });
  });
}

if (authForms.length) {
  const successMessages = {
    login: 'ورود شما با موفقیت ثبت شد! به داشبورد منتقل می‌شوید.',
    signup: 'ثبت‌نام شما با موفقیت انجام شد! ایمیل فعال‌سازی ارسال گردید.'
  };

  authForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const type = form.dataset.type;
      const alertBox = form.querySelector('.form-alert');

      if (alertBox) {
        alertBox.textContent = successMessages[type] || 'اطلاعات شما با موفقیت ثبت شد.';
        alertBox.classList.add('visible');
      }

      form.reset();

      if (alertBox) {
        setTimeout(() => {
          alertBox.textContent = '';
          alertBox.classList.remove('visible');
        }, 4000);
      }
    });
  });
}

renderCart();
