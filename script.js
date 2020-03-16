'use strict';

// utils
(function () {
  const KeyCode = {
    ENTER: {
      key: 'Enter',
      keyCode: 13
    },
    ESCAPE: {
      key: 'Escape',
      keyCode: 27
    }
  };

  /**
   * Returns a random number between min and max
   * @param {number} min (inclusive)
   * @param {number} max (inclusive)
   * @return {number} integer number
   */
  const getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  /**
   * Returns a random item from an array
   * @param {Array} arr An array containing items
   * @return {string|number|boolean|null|undefined|Object}
   */
  const getRandomArrayItem = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  /**
   * Shuffles array in place
   * @param {Array} arr Array containing items
   * @param {boolean} isLength Flag to reduce array length
   * @return {Array}
   */
  const shuffleArray = function (arr, isLength) {
    const length = !isLength ? arr.length : getRandomInt(0, arr.length);
    for (let i = length - 1; i > 0; i--) {
      const random = Math.floor(Math.random() * length);
      const choosen = arr[i];
      arr[i] = arr[random];
      arr[random] = choosen;
    }
    return arr.slice(0, length);
  };

  /**
   * Removes a CSS class from a DOM element
   * @param {Object} nodeItem Target DOM element
   * @param {string} cssClass CSS class of an element (without .point)
   */
  const removeCssClass = function (nodeItem, cssClass) {
    if (nodeItem.classList.contains(cssClass)) {
      nodeItem.classList.remove(cssClass);
    }
  };

  /**
   * Toggles a CSS class on a DOM element
   * @param {Object} nodeItem Target DOM element or elements (not for FORMs)
   * @param {string} cssClass CSS class on an element (without .point)
   * @param {boolean} flag (false removes, true adds)
   */
  const toggleClass = function (nodeItem, cssClass, flag) {
    if (!nodeItem.length) {
      nodeItem.classList.toggle(cssClass, flag);
    } else {
      for (let i = 0; i < nodeItem.length; i++) {
        nodeItem[i].classList.toggle(cssClass, flag);
      }
    }
  };

  /**
   * Returns a handler function for the pressed key
   * @param {Object} obj Keycodes
   * @param {Function} action Callback
   * @return {Function}
   */
  const keyPressHandler = function (obj, action) {
    return function (evt) {
      if (evt.key === obj.key || evt.keyCode === obj.keyCode) {
        action();
      }
    };
  };

  /**
   * Returns a function, that, as long as it continues to be invoked, will not be triggered
   * @param {Function} fun The function that will be called
   * @param {number} delay Debounce interval
   * @return {Function}
   */
  const debounce = function (fun, delay) {
    let lastTimeout = null;

    return function () {
      const args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, delay);
    };
  };

  window.utils = {
    ENTER: KeyCode.ENTER,
    ESCAPE: KeyCode.ESCAPE,
    getRandomInt: getRandomInt,
    getRandomArrayItem: getRandomArrayItem,
    shuffleArray: shuffleArray,
    removeCssClass: removeCssClass,
    toggleClass: toggleClass,
    keyPressHandler: keyPressHandler,
    debounce: debounce
  };
})();

/* step to anchors and change the active nav color
 ******************************/
(function () {
  const UTILS = window.utils;
  const HEADER_HEIGHT = 95;
  const mainNav = document.querySelector('#main-nav');
  const mainNavItems = mainNav.querySelectorAll('.main-nav__item');

  const anchorStepHandler = function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target.classList.contains('main-nav__link') &&
      !target.parentElement.classList.contains('main-nav__item--active')) {

      const elementID = target.getAttribute('href').substr(1);
      const topOfElement = document.getElementById(elementID).offsetTop - HEADER_HEIGHT;
      window.scroll({
        top: topOfElement,
        behavior: 'smooth'
      });

      UTILS.toggleClass(mainNavItems, 'main-nav__item--active', false);
      target.parentElement.classList.add('main-nav__item--active');
    }
  };

  mainNav.addEventListener('click', anchorStepHandler);
})();

/* switch slides and toggle the phone image
 ******************************/
(function () {
  const UTILS = window.utils;
  const DEBOUNCE_DELAY = 300;
  const slider = document.querySelector('#slider');
  const sliderControls = document.querySelector('#slider-controls');
  const phones = slider.querySelectorAll('.phone');

  let slideIndex = 0;
  toggleSlides(slideIndex);

  function plusSlides(n) {
    return toggleSlides(slideIndex += n);
  }

  function toggleSlides(n) {
    const slides = slider.querySelectorAll('.slider__item');

    if (n > slides.length - 1) {
      slideIndex = 0;
    }

    if (n < 0) {
      slideIndex = slides.length - 1;
    }

    UTILS.toggleClass(slides, 'hide', true);
    UTILS.toggleClass(slides[slideIndex], 'hide', false);

    return slides[slideIndex];
  }

  function toggleBgColor(nodeItem) {
    const promo = document.querySelector('#home');

    const bgColor = nodeItem.getAttribute('data-theme');

    promo.className = 'promo';
    promo.classList.add('promo--theme-' + bgColor);
  }

  const fadeSlidesHandler = UTILS.debounce(function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target.classList.contains('slider__control--prev') ||
      target.closest('.slider__control--prev')) {
      const currentSlide = plusSlides(-1);
      toggleBgColor(currentSlide);
    }

    if (target.classList.contains('slider__control--next') ||
      target.closest('.slider__control--next')) {
      const currentSlide = plusSlides(1);
      toggleBgColor(currentSlide);
    }
  }, DEBOUNCE_DELAY);

  sliderControls.addEventListener('click', function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);
    fadeSlidesHandler(evt);
  });

  const toggleImageHandler = function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;
    const phone = target.closest('.phone');

    if (phone) {
      phone.querySelector('img').classList.toggle('hide');
    }
  };

  Array.from(phones, function (phone) {
    phone.addEventListener('click', toggleImageHandler);
  });

})();

/* toggle portfolio filter tags and select an image
 ******************************/
(function () {
  const UTILS = window.utils;
  const DEBOUNCE_DELAY = 300;
  const portfolioFilter = document.querySelector('#portfolio-filter');
  const portfolioGroup = document.querySelector('#portfolio-group');
  const portfolioItems = portfolioGroup.querySelectorAll('.portfolio__item');
  const portfolioImages = portfolioGroup.querySelectorAll('.portfolio__image');

  const portfolioFilterHandler = UTILS.debounce(function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target.classList.contains('filter__item')) {
      target.classList.toggle('filter__item--selected');
      target.blur();
      UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);

      const fragment = document.createDocumentFragment();

      portfolioGroup.innerHTML = '';

      if (!portfolioFilter.querySelector('.filter__item--selected')) {
        return false;
      } else if (portfolioFilter.querySelector('#all').classList.contains('filter__item--selected')) {
        const shuffledPortfolioItems = UTILS.shuffleArray(Array.from(portfolioItems), false);
        shuffledPortfolioItems.forEach(function (nodeItem) {
          fragment.appendChild(nodeItem);
        });
      } else {
        const shuffledPortfolioItems = UTILS.shuffleArray(Array.from(portfolioItems), true);
        shuffledPortfolioItems.forEach(function (nodeItem) {
          fragment.appendChild(nodeItem);
        });
      }

      portfolioGroup.appendChild(fragment);
    }
  }, DEBOUNCE_DELAY);

  const portfolioGroupHandler = function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target.classList.contains('portfolio__image')) {
      UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);
      target.classList.add('portfolio__image--selected');
      target.parentElement.blur();
    }

    if (target.classList.contains('portfolio__item')) {
      UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);
      target.querySelector('.portfolio__image').classList.add('portfolio__image--selected');
      target.blur();
    }
  };

  portfolioFilter.addEventListener('click', function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);
    portfolioFilterHandler(evt);
  });
  portfolioGroup.addEventListener('click', portfolioGroupHandler);
})();

/* easy validation form and showing modal window
 ******************************/
(function () {
  const UTILS = window.utils;
  const form = document.querySelector('#contact-form');
  const formName = form.querySelector('#name');
  const formEmail = form.querySelector('#email');
  const formSubject = form.querySelector('#subject');
  const formMessage = form.querySelector('#message');
  const formSubmit = form.querySelector('#submit');
  const modalOverlay = document.querySelector('#modal-overlay');
  const modal = modalOverlay.querySelector('.modal');
  const modalSubject = modalOverlay.querySelector('#result-subject');
  const modalDescription = modalOverlay.querySelector('#result-desc');
  const modalClose = modalOverlay.querySelector('#modal-close');

  const openModal = function () {
    modalOverlay.classList.remove('hide');
    modalOverlay.classList.add('fadein');
    modal.classList.add('bounce');
    modalSubject.textContent = formSubject.value  || 'Without subject';
    modalDescription.textContent = formMessage.value || 'Without description';
    formSubmit.blur();
    form.reset();

    modalOverlay.addEventListener('click', closeModalHandler);
    window.addEventListener('keydown', closeModalHandler);
  };

  const closeModal = function () {
    modalOverlay.classList.remove('fadein');
    modalOverlay.classList.add('fadeout');
    modal.classList.remove('bounce');
    setTimeout(function () {
      modalOverlay.classList.remove('fadeout');
      modalOverlay.classList.add('hide');
    }, 450);

    modalOverlay.removeEventListener('click', closeModalHandler);
    window.removeEventListener('keydown', closeModalHandler);
  };

  const submitErrorHandler = function () {
    if (!formName.checkValidity() && !formEmail.checkValidity()) {
      formSubmit.classList.add('shake');
      setTimeout(function () {
        UTILS.removeCssClass(formSubmit, 'shake');
      }, 450);
    }
  };

  const formSubmitHandler = function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    openModal();
  };

  const closeModalHandler = function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target === modalOverlay ||
      target === modalClose ||
      evt.key === UTILS.ESCAPE.key ||
      evt.keyCode === UTILS.ESCAPE.keyCode) {
      closeModal();
    }
  };

  formSubmit.addEventListener('click', submitErrorHandler);
  form.addEventListener('submit', formSubmitHandler);
})();

