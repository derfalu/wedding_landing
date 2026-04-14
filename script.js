(() => {
  const loader = document.querySelector('.page-loader');
  const startedAt = performance.now();
  const minimumDuration = 650;
  const maximumDuration = 8000;

  if (!loader) {
    document.body.classList.remove('page-loading');
    document.body.classList.add('cover-intro-ready');
    return;
  }

  const collectImageUrls = () => {
    const urls = new Set();
    const addUrl = (url) => {
      if (!url || url.startsWith('data:')) {
        return;
      }

      urls.add(url);
    };

    document.querySelectorAll('img[src]').forEach((image) => {
      addUrl(image.getAttribute('src'));
    });

    document.querySelectorAll('[style*="background-image"], [style*="background:"]').forEach((element) => {
      const style = element.getAttribute('style') || '';
      const matches = style.matchAll(/url\(["']?([^"')]+)["']?\)/g);

      for (const match of matches) {
        addUrl(match[1]);
      }
    });

    return Array.from(urls);
  };

  const waitForImage = (url) =>
    new Promise((resolve) => {
      const image = new Image();

      image.onload = resolve;
      image.onerror = resolve;
      image.src = url;
    });

  const waitForWindowLoad = () =>
    new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
        return;
      }

      window.addEventListener('load', resolve, { once: true });
    });

  const waitForMinimumDuration = () =>
    new Promise((resolve) => {
      const elapsed = performance.now() - startedAt;
      window.setTimeout(resolve, Math.max(0, minimumDuration - elapsed));
    });

  const waitForTimeout = () =>
    new Promise((resolve) => {
      window.setTimeout(resolve, maximumDuration);
    });

  const hideLoader = () => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('page-loading');
    document.body.classList.add('cover-intro-ready');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  const imagesReady = Promise.all(collectImageUrls().map(waitForImage));
  const fontsReady = document.fonts?.ready || Promise.resolve();
  const pageReady = Promise.all([waitForWindowLoad(), imagesReady, fontsReady, waitForMinimumDuration()]);

  Promise.race([pageReady, waitForTimeout()]).then(hideLoader);
})();

(() => {
  const invitationSection = document.querySelector('#invitation-section');

  if (!(invitationSection instanceof HTMLElement)) {
    return;
  }

  invitationSection.classList.add('invitation-intro-enabled');

  const photoContainers = Array.from(invitationSection.querySelectorAll('.invite-photo'))
    .map((photo) => {
      const container = photo.closest('.absolute-container');

      if (!(container instanceof HTMLElement)) {
        return null;
      }

      if (photo.classList.contains('invite-photo--bride')) {
        container.classList.add('invitation-photo-intro-bride');
      }

      if (photo.classList.contains('invite-photo--groom')) {
        container.classList.add('invitation-photo-intro-groom');
      }

      return container;
    })
    .filter((container) => container instanceof HTMLElement);

  photoContainers.forEach((container) => {
    container.classList.add('invitation-photo-intro-enabled');
  });

  const revealInvitation = () => {
    invitationSection.classList.add('invitation-intro-visible');
  };

  const revealPhotos = () => {
    photoContainers.forEach((container) => {
      container.classList.add('invitation-photo-intro-visible');
    });
  };

  if (!('IntersectionObserver' in window)) {
    revealInvitation();
    revealPhotos();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      revealInvitation();
      observer.disconnect();
    },
    {
      threshold: 0.22,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  observer.observe(invitationSection);

  const photoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          return;
        }

        entry.target.classList.add('invitation-photo-intro-visible');
        photoObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.24,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  photoContainers.forEach((container) => {
    photoObserver.observe(container);
  });
})();

(() => {
  const timingSection = document.querySelector('#timing-section');

  if (!(timingSection instanceof HTMLElement)) {
    return;
  }

  timingSection.classList.add('timing-intro-enabled');

  const revealTiming = () => {
    timingSection.classList.add('timing-intro-visible');
  };

  if (!('IntersectionObserver' in window)) {
    revealTiming();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      revealTiming();
      observer.disconnect();
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  observer.observe(timingSection);
})();

(() => {
  const storySection = document.querySelector('#story-section');

  if (!(storySection instanceof HTMLElement)) {
    return;
  }

  storySection.classList.add('story-intro-enabled');

  storySection.querySelectorAll('[data-src*="story_media_left_center_image.svg"]').forEach((decorSvg) => {
    const decorContainer = decorSvg.closest('.absolute-container');

    if (!(decorContainer instanceof HTMLElement)) {
      return;
    }

    decorContainer.classList.add('story-side-decor');

    const decorStyle = decorContainer.getAttribute('style') || '';

    if (decorStyle.includes('left:')) {
      decorContainer.classList.add('story-side-decor--left');
    }

    if (decorStyle.includes('right:')) {
      decorContainer.classList.add('story-side-decor--right');
    }
  });

  const revealStory = () => {
    storySection.classList.add('story-intro-visible');
  };

  if (!('IntersectionObserver' in window)) {
    revealStory();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      revealStory();
      observer.disconnect();
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  observer.observe(storySection);
})();

(() => {
  const mapsSection = document.querySelector('#maps-section');

  if (!(mapsSection instanceof HTMLElement)) {
    return;
  }

  const textPanel = mapsSection.querySelector(':scope > .flex-box > .container:first-child > .container');
  const sourceDecor = mapsSection.querySelector('[data-src*="maps_media_top_right_image.svg"]');

  if (!(textPanel instanceof HTMLElement) || !(sourceDecor instanceof SVGElement)) {
    return;
  }

  const decor = sourceDecor.cloneNode(true);

  if (!(decor instanceof SVGElement)) {
    return;
  }

  decor.classList.add('maps-section-decor-svg');
  decor.setAttribute('aria-hidden', 'true');
  decor.removeAttribute('data-aos');
  decor.removeAttribute('data-aos-anchor');
  decor.style.color = 'rgba(241, 243, 241, 0.2)';

  textPanel.prepend(decor);
})();

(() => {
  const countdownSection = document.querySelector('#countdown-section');

  if (!(countdownSection instanceof HTMLElement)) {
    return;
  }

  countdownSection.classList.add('countdown-intro-enabled');

  const decorBoxes = Array.from(countdownSection.querySelectorAll('[data-src*="countdown_media_bottom_center_image.svg"]'))
    .map((decorSvg) => decorSvg.closest('.box'))
    .filter((decorBox) => decorBox instanceof HTMLElement);

  decorBoxes.forEach((decorBox, index) => {
    decorBox.classList.add('countdown-decor-intro');
    decorBox.classList.add(index === 0 ? 'countdown-decor-intro--top' : 'countdown-decor-intro--bottom');
  });

  const revealCountdown = () => {
    countdownSection.classList.add('countdown-intro-visible');
  };

  const revealDecor = (decorBox) => {
    decorBox.classList.add('countdown-decor-intro-visible');
  };

  if (!('IntersectionObserver' in window)) {
    revealCountdown();
    decorBoxes.forEach(revealDecor);
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    const decorObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
            return;
          }

          revealDecor(entry.target);
          decorObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.28,
        rootMargin: '0px 0px -16% 0px',
      }
    );

    decorBoxes.forEach((decorBox) => decorObserver.observe(decorBox));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      revealCountdown();
      decorBoxes.forEach(revealDecor);
      observer.disconnect();
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  observer.observe(countdownSection);
})();

(() => {
  const weddingDate = new Date('2026-06-27T00:00:00+05:00');
  const fields = {
    days: document.querySelector('[data-countdown-value="days"]'),
    hours: document.querySelector('[data-countdown-value="hours"]'),
    minutes: document.querySelector('[data-countdown-value="minutes"]'),
    seconds: document.querySelector('[data-countdown-value="seconds"]'),
  };

  if (!Object.values(fields).every(Boolean)) {
    return;
  }

  const pad = (value) => String(value).padStart(2, '0');

  const renderCountdown = () => {
    const difference = Math.max(0, weddingDate.getTime() - Date.now());
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    fields.days.textContent = String(days);
    fields.hours.textContent = pad(hours);
    fields.minutes.textContent = pad(minutes);
    fields.seconds.textContent = pad(seconds);
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
})();

(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = nav?.querySelector('.site-nav__toggle');
  const closeButton = nav?.querySelector('.site-nav__close');
  const links = nav ? Array.from(nav.querySelectorAll('.site-nav__link')) : [];

  if (!nav || !(toggle instanceof HTMLButtonElement) || !(closeButton instanceof HTMLButtonElement) || !links.length) {
    return;
  }

  const setOpen = (isOpen) => {
    document.body.classList.toggle('site-nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  };

  const scrollToTarget = (hash) => {
    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  toggle.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('site-nav-open'));
  });

  closeButton.addEventListener('click', () => {
    setOpen(false);
  });

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');

      if (!hash?.startsWith('#')) {
        return;
      }

      event.preventDefault();
      setOpen(false);
      scrollToTarget(hash);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('site-nav-open')) {
      return;
    }

    if (event.target instanceof Node && nav.contains(event.target)) {
      return;
    }

    setOpen(false);
  });
})();

(() => {
  const rsvpSection = document.querySelector('#rsvp-section');
  const confirmButtons = Array.from(document.querySelectorAll('.base-button')).filter((button) =>
    button.textContent?.trim().includes('Подтвердить присутствие')
  );

  if (!rsvpSection || !confirmButtons.length) {
    return;
  }

  const scrollToRsvp = () => {
    rsvpSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  confirmButtons.forEach((button) => {
    button.classList.add('rsvp-scroll-button');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Перейти к выбору статуса');

    button.addEventListener('click', scrollToRsvp);
    button.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      scrollToRsvp();
    });
  });
})();

(() => {
  const googleScriptUrl =
    window.RSVP_GOOGLE_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbwo55L5GfxZotXSqRpIIxIpWJCYaU2PTyQAtepcU6ZNu9TPmSHvg-_Gv7jwJbzaC2OS/exec';
  const statusButton = Array.from(document.querySelectorAll('#rsvp-section .base-button')).find((button) =>
    button.textContent?.trim().includes('Выбрать статус')
  );

  if (!statusButton) {
    return;
  }

  let previouslyFocused = null;
  let successNoticeTimer = 0;

  const modal = document.createElement('div');
  modal.className = 'rsvp-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'rsvp-modal-title');
  modal.innerHTML = `
    <div class="rsvp-modal__panel">
      <form class="rsvp-modal__form">
        <div class="rsvp-modal__header">
          <p class="rsvp-modal__eyebrow">RSVP</p>
          <h2 class="rsvp-modal__title" id="rsvp-modal-title">Подтвердите статус</h2>
        </div>
        <label class="rsvp-modal__field">
          <span>Ваше имя или название семьи</span>
          <input name="name" type="text" autocomplete="name" required>
        </label>
        <div class="rsvp-modal__grid">
          <label class="rsvp-modal__field">
            <span>Количество взрослых</span>
            <input name="adults" type="number" min="0" step="1" inputmode="numeric" required>
          </label>
          <label class="rsvp-modal__field">
            <span>Количество детей</span>
            <input name="children" type="number" min="0" step="1" inputmode="numeric" required>
          </label>
        </div>
        <label class="rsvp-modal__field">
          <span>Предпочтения или аллергии по еде</span>
          <textarea name="foodPreferences" rows="3"></textarea>
        </label>
        <label class="rsvp-modal__field">
          <span>Количество гостей, употребляющих алкоголь</span>
          <input name="drinkers" type="number" min="0" step="1" inputmode="numeric" required>
        </label>
        <label class="rsvp-modal__field">
          <span>Будете ли с нами на природе 28.06?</span>
          <select name="natureTrip" required>
            <option value="" selected disabled>Выберите вариант</option>
            <option value="Да">Да</option>
            <option value="Нет">Нет</option>
            <option value="Пока не знаю">Пока не знаю</option>
          </select>
        </label>
        <p class="rsvp-modal__message" aria-live="polite"></p>
        <div class="rsvp-modal__actions">
          <button class="rsvp-modal__button rsvp-modal__button--ghost" type="button" data-rsvp-cancel>Отмена</button>
          <button class="rsvp-modal__button" type="submit">Подтвердить</button>
        </div>
      </form>
    </div>
  `;
  document.body.append(modal);

  const form = modal.querySelector('.rsvp-modal__form');
  const cancelButton = modal.querySelector('[data-rsvp-cancel]');
  const submitButton = modal.querySelector('[type="submit"]');
  const message = modal.querySelector('.rsvp-modal__message');
  const firstField = modal.querySelector('input[name="name"]');
  const requiredFields = Array.from(modal.querySelectorAll('[required]'));

  if (!(form instanceof HTMLFormElement) || !(cancelButton instanceof HTMLButtonElement) || !(submitButton instanceof HTMLButtonElement)) {
    return;
  }

  const setMessage = (text, type = '') => {
    if (!message) {
      return;
    }

    message.textContent = text;
    message.dataset.type = type;
  };

  const showSuccessNotice = (text) => {
    window.clearTimeout(successNoticeTimer);

    let notice = document.querySelector('.rsvp-success-notice');

    if (!(notice instanceof HTMLElement)) {
      notice = document.createElement('div');
      notice.className = 'rsvp-success-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      document.body.append(notice);
    }

    notice.textContent = text;
    notice.classList.add('is-visible');

    successNoticeTimer = window.setTimeout(() => {
      notice.classList.remove('is-visible');
    }, 3200);
  };

  const openModal = () => {
    previouslyFocused = document.activeElement;
    submitButton.disabled = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rsvp-modal-open');

    if (firstField instanceof HTMLInputElement) {
      firstField.focus({ preventScroll: true });
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('rsvp-modal-open');
    setMessage('');

    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus({ preventScroll: true });
    }
  };

  requiredFields.forEach((field) => {
    field.addEventListener('invalid', () => {
      field.setCustomValidity('Пожалуйста, заполните это поле.');
    });

    field.addEventListener('input', () => {
      field.setCustomValidity('');
    });

    field.addEventListener('change', () => {
      field.setCustomValidity('');
    });
  });

  statusButton.classList.add('rsvp-status-button');
  statusButton.setAttribute('role', 'button');
  statusButton.setAttribute('tabindex', '0');
  statusButton.setAttribute('aria-label', 'Открыть форму подтверждения статуса');
  statusButton.addEventListener('click', openModal);
  statusButton.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openModal();
  });

  cancelButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!googleScriptUrl) {
      setMessage('Добавьте URL Google Apps Script в script.js, чтобы отправлять ответы в Google Таблицу.', 'error');
      return;
    }

    const payload = new FormData(form);
    payload.append('submittedAt', new Date().toISOString());
    submitButton.disabled = true;
    setMessage('Отправляем...', 'pending');

    let isSubmitted = false;

    try {
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      });

      form.reset();
      setMessage('Все отправлено.', 'success');
      isSubmitted = true;

      window.setTimeout(() => {
        closeModal();
        showSuccessNotice('Все отправлено');
      }, 650);
    } catch {
      setMessage('Не получилось отправить. Попробуйте еще раз.', 'error');
    } finally {
      if (!isSubmitted) {
        submitButton.disabled = false;
      }
    }
  });
})();

(() => {
  const button = document.querySelector('.scroll-to-top-button');

  if (!button) {
    return;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', 'Вернуться к началу страницы');

  button.addEventListener('click', scrollToTop);
  button.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    scrollToTop();
  });
})();

(() => {
  const slider = document.querySelector('#story-section .love-story-slider');
  const images = slider ? Array.from(slider.querySelectorAll('.swiper-slide img')) : [];

  if (!slider || !images.length) {
    return;
  }

  let activeIndex = 0;
  let pointerStart = null;
  let previouslyFocused = null;

  const lightbox = document.createElement('div');
  lightbox.className = 'love-story-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('role', 'dialog');

  const image = document.createElement('img');
  image.className = 'love-story-lightbox__image';
  image.alt = '';

  const closeButton = document.createElement('button');
  closeButton.className = 'love-story-lightbox__close';
  closeButton.type = 'button';
  closeButton.textContent = 'x';
  closeButton.setAttribute('aria-label', 'Close photo');

  const previousButton = document.createElement('button');
  previousButton.className = 'love-story-lightbox__arrow love-story-lightbox__arrow--prev';
  previousButton.type = 'button';
  previousButton.textContent = '<';
  previousButton.setAttribute('aria-label', 'Previous photo');

  const nextButton = document.createElement('button');
  nextButton.className = 'love-story-lightbox__arrow love-story-lightbox__arrow--next';
  nextButton.type = 'button';
  nextButton.textContent = '>';
  nextButton.setAttribute('aria-label', 'Next photo');

  lightbox.append(previousButton, image, nextButton, closeButton);
  document.body.append(lightbox);

  const setImage = (index) => {
    activeIndex = (index + images.length) % images.length;
    image.src = images[activeIndex].currentSrc || images[activeIndex].src;
  };

  const openLightbox = (index) => {
    previouslyFocused = document.activeElement;
    setImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('love-story-lightbox-open');
    closeButton.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('love-story-lightbox-open');

    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus({ preventScroll: true });
    }
  };

  const showNext = (direction) => {
    setImage(activeIndex + direction);
  };

  images.forEach((slideImage, index) => {
    const clickable = slideImage.closest('.aspect-image') || slideImage;

    clickable.setAttribute('role', 'button');
    clickable.setAttribute('tabindex', '0');
    clickable.setAttribute('aria-label', 'Open photo');

    clickable.addEventListener('pointerdown', (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    });

    clickable.addEventListener('click', (event) => {
      if (pointerStart) {
        const movedX = Math.abs(event.clientX - pointerStart.x);
        const movedY = Math.abs(event.clientY - pointerStart.y);
        pointerStart = null;

        if (movedX > 8 || movedY > 8) {
          return;
        }
      }

      openLightbox(index);
    });

    clickable.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      openLightbox(index);
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showNext(-1));
  nextButton.addEventListener('click', () => showNext(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      showNext(-1);
    }

    if (event.key === 'ArrowRight') {
      showNext(1);
    }
  });
})();
