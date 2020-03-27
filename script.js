
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

  /**
   * Returns a DOM node
   * @param {string} element tag type
   * @param {string} classes css classes
   * @return {Object}
   */
  function createDomNode(element, ...classes){
    const node = document.createElement(element);
    node.classList.add(...classes);
    return node;
  }

  /**
   * Create overlay
   * @param {Object} settings
   */
  function createOverlay({
                           nodeAppend,
                           id,
                           eventType,
                           handler,
                           classes
                         }) {
    const body = document.body;
    const overlay = createDomNode('div', ...classes);
    overlay.id = id;

    if (nodeAppend) {
      overlay.append(nodeAppend);
    }
    body.insertAdjacentElement('beforeend', overlay);

    overlay.addEventListener(eventType, handler);
  }

  window.utils = {
    ENTER: KeyCode.ENTER,
    ESCAPE: KeyCode.ESCAPE,
    getRandomInt: getRandomInt,
    getRandomArrayItem: getRandomArrayItem,
    shuffleArray: shuffleArray,
    removeCssClass: removeCssClass,
    toggleClass: toggleClass,
    keyPressHandler: keyPressHandler,
    debounce: debounce,
    createDomNode: createDomNode,
    createOverlay: createOverlay
  };
})();

/* burger
 ******************************/
(function () {
  'use strict';

  const UTILS = window.utils;
  const body = document.body;
  const header = document.querySelector('#header');
  const headerInner = header.querySelector('.page-header__inner');
  const mainNav = document.querySelector('#main-nav');
  const headerLogo = document.querySelector('.page-header__logo');

  const burger = UTILS.createDomNode('button', 'burger');
  const burgerSpan = UTILS.createDomNode('span');
  burger.id = 'burger';
  burger.append(burgerSpan);
  headerInner.append(burger);

  const showMobileMenu = function () {
    UTILS.createOverlay({
      nodeAppend: false,
      id: 'overlay-mobil',
      eventType: 'click',
      handler: hideMobileMenu,
      classes: ['overlay', 'overlay--mobil', 'fadein']
    });

    mainNav.classList.add('page-header__nav--show');
    headerLogo.classList.add('page-header__logo--open-menu');
    body.classList.add('lock');
  };

  const hideMobileMenu = function () {
    const overlay = document.querySelector('#overlay-mobil');
    const burger = document.querySelector('#burger');

    if (overlay && burger) {
      overlay.classList.remove('fadein');
      overlay.classList.add('fadeout');
      mainNav.classList.remove('page-header__nav--show');
      burger.classList.remove('burger--close');
      headerLogo.classList.remove('page-header__logo--open-menu');
      body.classList.remove('lock');

      overlay.addEventListener('animationend', function () {
        this.remove();
      });
    }
  };

  const toggleMobileHandler = function (evt) {
    evt.preventDefault();

    const that = this;

    if (!that.classList.contains('burger--close')) {
      showMobileMenu();
      that.classList.add('burger--close');
    } else {
      hideMobileMenu();
    }
      that.blur();
  };

  burger.addEventListener('click', toggleMobileHandler);

  window.burger = {
    hideMobileMenu: hideMobileMenu
  };
})();

/* step to anchors and change the active nav color
 ******************************/
(function () {
  'use strict';

  const header = document.querySelector('#header');
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
      window.burger.hideMobileMenu();
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

  function previousItem(n) {
    hideItem('to-left');
    changeCurrentItem(n + 1);
    showItem('from-right');
  }

  function nextItem(n) {
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
              nextItem(currentItem);
            }
          } else {
            if (isEnabled) {
              previousItem(currentItem);
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
            nextItem(currentItem);
          }
        } else {
          if (isEnabled) {
            previousItem(currentItem);
          }
        }
      }
      const touchobj = evt.changedTouches[0];
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      // evt.preventDefault(); // for touching inner screen (!needs to remove comment)
    }, false);

    surface.addEventListener('touchmove', function (evt){
      evt.preventDefault();
    }, false);

    surface.addEventListener('touchend', function (evt){
      const touchobj = evt.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;

      switchItem(distX, distY);
      // evt.preventDefault(); // for touching inner screen (!needs to remove comment)
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
  const portfolioFilters = portfolioFilter.querySelectorAll('.filter__item');
  const portfolioItems = portfolioGroup.querySelectorAll('.portfolio__item');
  const portfolioImages = portfolioGroup.querySelectorAll('.portfolio__image');

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

    if (target.classList.contains('filter__item') &&
      !target.classList.contains('filter__item--selected')) {
      UTILS.toggleClass(portfolioFilters, 'filter__item--selected', false);
      target.classList.add('filter__item--selected');
      UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);
      const shuffledPortfolioItems = UTILS.shuffleArray([...portfolioItems], false);

      portfolioGroup.innerHTML = '';

      insertFragment(portfolioGroup, shuffledPortfolioItems);
    }
  }, DEBOUNCE_DELAY);

  const portfolioGroupHandler = function (evt) {
    evt.preventDefault();

    const target = evt.target;

    const toggleActiveImage = function (item, blurItem) {
      if (!item.classList.contains('portfolio__image--selected')) {
        UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);
        item.classList.add('portfolio__image--selected');
      } else if (item.classList.contains('portfolio__image--selected')) {
        item.classList.remove('portfolio__image--selected');
      }
      blurItem.blur();
    };

    if (target.classList.contains('portfolio__image')) {
      toggleActiveImage(target, target.parentElement);
    }

    if (target.classList.contains('portfolio__item')) {
      const portfolioImage = target.querySelector('.portfolio__image');
      toggleActiveImage(portfolioImage, target);
    }
  };

  portfolioFilter.addEventListener('click', function (evt) {
    evt.preventDefault();
    portfolioFilterHandler(evt);
  });
  portfolioGroup.addEventListener('click', portfolioGroupHandler);
})();

(function () {
  'use strict';

  const UTILS = window.utils;
  const body = document.body;
  const form = document.querySelector('#contact-form');
  const formInputsRequired = form.querySelectorAll('.form__input:required');
  const formSubject = form.querySelector('#subject');
  const formMessage = form.querySelector('#message');
  const formSubmit = form.querySelector('#submit');

  const openModal = function () {
    const subjectValue = formSubject.value  || 'Without subject';
    const messageValue = formMessage.value || 'Without description';

    const modal = UTILS.createDomNode('div', 'modal', 'bounce');
    modal.innerHTML = `<div class="modal__content">
        <div class="modal__heading title-secondary">The letter was sent</div>
          <dl class="modal__info text-secondary">
            <dt class="modal__info-title">Subject:</dt>
            <dd class="modal__info-text" id="info-subject">${subjectValue}</dd>
            <dt class="modal__info-title">Description:</dt>
            <dd class="modal__info-text" id="info-desc">${messageValue}</dd>
          </dl>
        <button class="modal__close" id="modal-close" type="button">OK</button>
      </div>`;

    UTILS.createOverlay({
      nodeAppend: modal,
      id: 'overlay-modal',
      eventType: 'click',
      handler: closeModalHandler,
      classes: ['overlay', 'overlay--modal', 'fadein']
    });
    body.classList.add('lock');

    formSubmit.blur();
    form.reset();

    window.addEventListener('keydown', closeModalHandler);
  };

  const closeModal = function () {
    const overlay = document.querySelector('#overlay-modal');
    overlay.classList.remove('fadein');
    overlay.classList.add('fadeout');
    body.classList.remove('lock');

    overlay.addEventListener('animationend', function () {
      this.remove();
    });

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

    if (target.classList.contains('overlay--modal') ||
      target.classList.contains('modal__close')||
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

