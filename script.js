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
   * Removes empty DOM elements
   * @param {Object} list NodeList elements
   */
  const removeEmptyElements = function (list) {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].textContent) {
        list[i].parentElement.removeChild(list[i]);
      }
    }
  };

  /**
   * Removes DOM elements
   * @param {Object} parentNodeItem Parent DOM element
   * @param {Object} nodeList
   */
  const removeNodeList = function (parentNodeItem, nodeList) {
    if (parentNodeItem && nodeList.length) {
      for (let i = 0; i < nodeList.length; i++) {
        parentNodeItem.removeChild(nodeList[i]);
      }
    }
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
    removeEmptyElements: removeEmptyElements,
    removeNodeList: removeNodeList,
    removeCssClass: removeCssClass,
    toggleClass: toggleClass,
    keyPressHandler: keyPressHandler,
    debounce: debounce
  };
})();

// switch to anchors and change active nav color
(function () {
  const UTILS = window.utils;
  const mainNav = document.querySelector('#main-nav');
  const mainNavItems = mainNav.querySelectorAll('.main-nav__item');

  mainNav.addEventListener('click', function (evt) {
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    const target = evt ? evt.target : window.event.srcElement;

    if (target.classList.contains('main-nav__link') &&
      !target.parentElement.classList.contains('main-nav__item--active')) {

      const blockID = target.getAttribute('href').substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      UTILS.toggleClass(mainNavItems, 'main-nav__item--active', false);
      target.parentElement.classList.add('main-nav__item--active');
    }
  })
})();

// portfolio
(function () {
  const UTILS = window.utils;
  const DEBOUNCE_DELAY = 500;
  const portfolio = document.querySelector('#portfolio');
  const portfolioGroup = portfolio.querySelector('.portfolio__group');
  const portfolioItems = portfolio.querySelectorAll('.portfolio__item');
  const portfolioImages = portfolio.querySelectorAll('.portfolio__image');

  portfolio.addEventListener('click', function (evt) {
    console.log(evt.preventDefault);
    console.log(window.event.returnValue);
    evt.preventDefault ? evt.preventDefault() : (window.event.returnValue = false);

    // UTILS.debounce(function () {
      const target = evt ? evt.target : window.event.srcElement;

      if (target.classList.contains('filter__item')) {
        target.classList.toggle('filter__item--selected');
        target.blur();
        UTILS.toggleClass(portfolioImages, 'portfolio__image--selected', false);

        const fragment = document.createDocumentFragment();

        portfolioGroup.innerHTML = '';

        if (!portfolio.querySelector('.filter__item--selected')) {
          return false;
        } else if (portfolio.querySelector('#all').classList.contains('filter__item--selected')) {
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
    // }, DEBOUNCE_DELAY)();
  })
})();
