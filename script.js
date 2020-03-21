
/* utilities
 ******************************/
(function () {
  'use strict';

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
  'use strict';

  const header = document.querySelector('.page-header');
  const HEADER_HEIGHT = header.offsetHeight;
  const FIX_HEIGHT_ACTIVE_COLOR = 1;
  const mainNav = document.querySelector('#main-nav');
  const mainNavLinks = mainNav.querySelectorAll('.main-nav__link');
  const sections = document.querySelectorAll('section');

  const anchorStepHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target.classList.contains('main-nav__link') &&
      !target.parentElement.classList.contains('main-nav__item--active')) {

      const elementID = target.getAttribute('href').substr(1);
      const topOfElement = document.getElementById(elementID).offsetTop - HEADER_HEIGHT + FIX_HEIGHT_ACTIVE_COLOR;
      window.scroll({
        top: topOfElement,
        behavior: 'smooth'
      });
      target.blur();
    }
  };

  mainNav.addEventListener('click', anchorStepHandler);

  const scrollHandler = function (evt) {
    evt.preventDefault();

    const curPosition = window.pageYOffset + HEADER_HEIGHT;

    sections.forEach(function (section) {
      if (section.offsetTop < curPosition &&
        (section.offsetTop + section.offsetHeight) > curPosition) {
        mainNavLinks.forEach(function (link) {
          link.parentElement.classList.remove('main-nav__item--active');

          const elementID = link.getAttribute('href').substr(1);

          if (elementID === section.id) {
            link.parentElement.classList.add('main-nav__item--active');
          }
        });
      }
    });
  };

  document.addEventListener('scroll', scrollHandler);
})();

/* carousel slider
 ******************************/
(function () {
  'use strict';

  const slider = document.querySelector('#slider');
  const sliderList = slider.querySelector('.slider__list');
  const slides = slider.querySelectorAll('.slider__item');
  const controlPrev = slider.querySelector('.slider__control--prev');
  const controlNext = slider.querySelector('.slider__control--next');
  let currentItem = 0;
  let isEnabled = true;

  function changeCurrentItem(n) {
    currentItem = (n + slides.length) % slides.length;
  }

  function hideItem(direction) {
    isEnabled = false;
    slides[currentItem].classList.add(direction);
    slides[currentItem].addEventListener('animationend', function () {
      this.classList.remove('slider__item--active', direction);
    });
  }

  function showItem(direction) {
    slides[currentItem].classList.add('slider__item--next', direction);
    slides[currentItem].addEventListener('animationend', function () {
      this.classList.remove('slider__item--next', direction);
      this.classList.add('slider__item--active');
      isEnabled = true;
    });
    toggleBgColor(slides[currentItem]);
  }

  function nextItem(n) {
    hideItem('to-left');
    changeCurrentItem(n + 1);
    showItem('from-right');
  }

  function previousItem(n) {
    hideItem('to-right');
    changeCurrentItem(n - 1);
    showItem('from-left');
  }

  function toggleBgColor(nodeItem) {
    const promo = document.querySelector('.promo');

    const bgColor = nodeItem.getAttribute('data-theme');

    promo.className = 'promo';
    promo.classList.add('promo--theme-' + bgColor);
  }

  controlPrev.addEventListener('click', function () {
    if (isEnabled) {
      previousItem(currentItem);
    }
  });

  controlNext.addEventListener('click', function () {
    if (isEnabled) {
      nextItem(currentItem);
    }
  });

  const swipedetect = (el) => {
    let surface = el;
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let startTime = 0;
    let elapsedTime = 0;

    let threshold = 150;
    let restraint = 100;
    let allowedTime = 300;

    const switchItem = (distX, distY) => {
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime){
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
          if ((distX > 0)) {
            if (isEnabled) {
              previousItem(currentItem);
            }
          } else {
            if (isEnabled) {
              nextItem(currentItem);
            }
          }
        }
      }
    };

    surface.addEventListener('mousedown', function (evt){
      startX = evt.pageX;
      startY = evt.pageY;
      startTime = new Date().getTime();
      evt.preventDefault();
    }, false);

    surface.addEventListener('mouseup', function (evt){
      distX = evt.pageX - startX;
      distY = evt.pageY - startY;

      switchItem(distX, distY);
      evt.preventDefault();
    }, false);

    surface.addEventListener('touchstart', function (evt){
      if (evt.target.classList.contains('slider__control-icon') ||
        evt.target.classList.contains('slider__control')) {
        if (evt.target.classList.contains('slider__control--prev')) {
          if (isEnabled) {
            previousItem(currentItem);
          }
        } else {
          if (isEnabled) {
            nextItem(currentItem);
          }
        }
      }
      const touchobj = evt.changedTouches[0];
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      evt.preventDefault();
    }, false);

    surface.addEventListener('touchmove', function (evt){
      evt.preventDefault();
    }, false);

    surface.addEventListener('touchend', function (evt){
      const touchobj = evt.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;

      switchItem(distX, distY);
      evt.preventDefault();
    }, false);
  };

  swipedetect(sliderList);
})();

/* toggle phones image
 ******************************/
(function () {
  'use strict';

  const phones = document.querySelectorAll('.phone');

  const toggleImageHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;
    const phone = target.closest('.phone');

    if (phone) {
      phone.querySelector('img').classList.toggle('hide');
    }
  };

  phones.forEach( function (phone) {
    phone.addEventListener('click', toggleImageHandler);
  });

})();

/* toggle portfolio filter tags and select an image
 ******************************/
(function () {
  'use strict';

  const UTILS = window.utils;
  const DEBOUNCE_DELAY = 300;
  const portfolioFilter = document.querySelector('#portfolio-filter');
  const portfolioGroup = document.querySelector('#portfolio-group');
  const portfolioItems = portfolioGroup.querySelectorAll('.portfolio__item');
  const portfolioImages = portfolioGroup.querySelectorAll('.portfolio__image');

  const getShuffledPortfolioItems = function () {
    const portfolioItemsArray = Array.from(portfolioItems);
    let shuffledPortfolioItems = [];

    if (!portfolioFilter.querySelector('.filter__item--selected')) {
      return shuffledPortfolioItems;
    }
    if (portfolioFilter.querySelector('#all').classList.contains('filter__item--selected')) {
      shuffledPortfolioItems = UTILS.shuffleArray(portfolioItemsArray, false);
    } else {
      shuffledPortfolioItems = UTILS.shuffleArray(portfolioItemsArray, true);
    }

    return shuffledPortfolioItems;
  };

  const insertFragment = function (where, nodeList) {
    if (!nodeList.length) {
      return;
    }
    const fragment = document.createDocumentFragment();

    nodeList.forEach(function (nodeItem) {
      fragment.appendChild(nodeItem);
    });

    where.appendChild(fragment);
  };

  const portfolioFilterHandler = UTILS.debounce(function (evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target.classList.contains('filter__item')) {
      target.classList.toggle('filter__item--selected');
      target.blur();
      UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);

      portfolioGroup.innerHTML = '';

      insertFragment(portfolioGroup, getShuffledPortfolioItems());
    }
  }, DEBOUNCE_DELAY);

  const portfolioGroupHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;

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
    evt.preventDefault();
    portfolioFilterHandler(evt);
  });
  portfolioGroup.addEventListener('click', portfolioGroupHandler);
})();

/* easy validation form and showing modal window
 ******************************/
(function () {
  'use strict';

  const UTILS = window.utils;
  const form = document.querySelector('#contact-form');
  const formInputsRequired = form.querySelectorAll('.form__input:required');
  const formSubject = form.querySelector('#subject');
  const formMessage = form.querySelector('#message');
  const formSubmit = form.querySelector('#submit');
  const modalOverlay = document.querySelector('#modal-overlay');
  const modal = modalOverlay.querySelector('.modal');
  const modalSubject = modalOverlay.querySelector('#info-subject');
  const modalDescription = modalOverlay.querySelector('#info-desc');
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

  const requiredInputHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;

    UTILS.removeCssClass(target, 'form__input--invalid');
  };

  const setInvalidSubmitBtn = function () {
    formSubmit.classList.add('shake');

    setTimeout(function () {
      UTILS.removeCssClass(formSubmit, 'shake');
    }, 450);
  };

  const submitErrorHandler = function () {
    for (let input of formInputsRequired) {
      if (!input.checkValidity()) {
        input.classList.add('form__input--invalid');
        setInvalidSubmitBtn();
        // break; // was turned off to show all invalid inputs
      }
    }
  };

  const formSubmitHandler = function (evt) {
    evt.preventDefault();

    openModal();
  };

  const closeModalHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target === modalOverlay ||
      target === modalClose ||
      evt.key === UTILS.ESCAPE.key ||
      evt.keyCode === UTILS.ESCAPE.keyCode) {
      closeModal();
    }
  };

  formSubmit.addEventListener('click', submitErrorHandler);
  form.addEventListener('submit', formSubmitHandler);
  formInputsRequired.forEach( function (input) {
    input.addEventListener('input', requiredInputHandler);
  });
})();

