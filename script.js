'use strict';

//switch to anchors and change active nav color
(function () {
  const mainNav = document.querySelector('.main-nav__list');
  const mainNavItems = mainNav.querySelectorAll('.main-nav__item');

  mainNav.addEventListener('click', function (evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'A' &&
      !evt.target.parentElement.classList.contains('main-nav__item--active')) {

      const blockID = evt.target.getAttribute('href').substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      for (let item of mainNavItems) {
        item.classList.remove('main-nav__item--active');
      }
      evt.target.parentElement.classList.add('main-nav__item--active');
    }
  })
})();
