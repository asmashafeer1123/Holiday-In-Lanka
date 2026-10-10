/* =========================================================
   Holiday in Lanka - front-end behaviour
   ========================================================= */
(function () {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatMoney(n) { return 'USD ' + Number(n).toLocaleString('en-US'); }

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = $('#site-header');
  var nav = $('#main-nav');
  var navToggle = $('#nav-toggle');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    navToggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  }
  navToggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $all('a', nav).forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); navToggle.focus(); }
  });

  /* ---------- Highlight the nav link for the section in view ---------- */
  if ('IntersectionObserver' in window) {
    var navLinks = $all('a[href^="#"]', nav);
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) sectionObserver.observe(target);
    });
  }

  /* ---------- Hero video ----------
     The video fades in only once public/assets/videos/hero.mp4 (or .webm) exists and can play.
     Until then the labelled placeholder stays visible. */
  var hero = $('.hero');
  var heroVideo = $('#hero-video');
  var heroToggle = $('#hero-video-toggle');

  function showHeroVideo() {
    hero.classList.add('has-video');
    heroToggle.hidden = false;
    if (reduceMotion) { heroVideo.pause(); updateHeroToggle(); }
  }
  function updateHeroToggle() {
    var paused = heroVideo.paused;
    heroToggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    heroToggle.querySelector('use').setAttribute('href', paused ? '#i-play' : '#i-pause');
  }
  if (heroVideo) {
    if (heroVideo.readyState >= 2) showHeroVideo();
    heroVideo.addEventListener('loadeddata', showHeroVideo);
    heroVideo.addEventListener('play', updateHeroToggle);
    heroVideo.addEventListener('pause', updateHeroToggle);
    heroToggle.addEventListener('click', function () {
      if (heroVideo.paused) heroVideo.play(); else heroVideo.pause();
    });
  }

  /* ---------- Placeholder swapping ----------
     Any element with data-src (image) or data-video (video) is a placeholder.
     When it scrolls near the viewport we check if the real file exists; if it does,
     the file is shown and the placeholder label is hidden. */
  function loadMedia(el) {
    var alt = el.getAttribute('aria-label') || '';
    if (el.dataset.src) {
      var img = new Image();
      img.onload = function () {
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        el.appendChild(img);
        el.classList.add('is-loaded');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      };
      img.src = el.dataset.src;
    } else if (el.dataset.video) {
      var video = document.createElement('video');
      video.preload = 'metadata';
      video.controls = true;
      video.playsInline = true;
      if (el.dataset.poster) video.poster = el.dataset.poster;
      video.setAttribute('aria-label', alt);
      video.addEventListener('loadedmetadata', function () {
        el.appendChild(video);
        el.classList.add('is-loaded');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }, { once: true });
      video.src = el.dataset.video;
    }
  }

  var mediaObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { loadMedia(entry.target); observer.unobserve(entry.target); }
        });
      }, { rootMargin: '300px 0px' })
    : null;

  function watchMedia(root) {
    $all('[data-src], [data-video]', root).forEach(function (el) {
      if (mediaObserver) mediaObserver.observe(el); else loadMedia(el);
    });
  }
  watchMedia(document);

  /* ---------- Scroll reveal ---------- */
  var revealObserver = !reduceMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.12 })
    : null;

  function watchReveal(root) {
    if (!revealObserver) return;
    $all('.section-head, .feature-card, .experience-card, .step, .card, .video-card, .testimonial-card', root)
      .forEach(function (el) {
        if (el.classList.contains('reveal') || el.closest('#plan')) return;
        el.classList.add('reveal');
        revealObserver.observe(el);
      });
  }
  watchReveal(document);

  /* ---------- Stats count-up ---------- */
  var statsObserver = !reduceMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = Number(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / 1400, 1);
            var value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
            el.textContent = value.toLocaleString('en-US') + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      }, { threshold: 0.6 })
    : null;
  if (statsObserver) $all('[data-count]').forEach(function (el) { statsObserver.observe(el); });

  /* ---------- Best time to visit + hidden gems ---------- */
  var monthPicker = $('#month-picker');
  var seasonColumns = $('#season-columns');
  var gemsGrid = $('#hidden-gems');
  var destinations = [];

  function seasonOf(d, month) {
    if (d.best.indexOf(month) !== -1) return 'best';
    if (d.wet.indexOf(month) !== -1) return 'wet';
    return 'good';
  }

  function bestMonthsText(d) {
    // Turn e.g. [12,1,2,3,4] into "Dec to Apr"; fall back to a list.
    var sorted = d.best.slice().sort(function (a, b) { return a - b; });
    var months = MONTHS.map(function (_, i) { return sorted.indexOf(i + 1) !== -1; });
    var startIndex = months.findIndex(function (inBest, i) { return inBest && !months[(i + 11) % 12]; });
    if (startIndex === -1) return 'All year';
    var runs = [];
    for (var i = 0; i < 12; i += 1) {
      var idx = (startIndex + i) % 12;
      if (months[idx] && !months[(idx + 11) % 12]) runs.push([idx, idx]);
      else if (months[idx] && runs.length) runs[runs.length - 1][1] = idx;
    }
    return runs.map(function (r) { return r[0] === r[1] ? MONTHS[r[0]] : MONTHS[r[0]] + ' to ' + MONTHS[r[1]]; }).join(', ');
  }

  function renderSeasons(month) {
    var groups = { best: [], good: [], wet: [] };
    destinations.forEach(function (d) { groups[seasonOf(d, month)].push(d.name); });
    var cols = [
      { key: 'best', title: 'Great right now', icon: 'i-check' },
      { key: 'good', title: 'Good, with some showers', icon: 'i-compass' },
      { key: 'wet', title: 'Wet season: plan around it', icon: 'i-rain' }
    ];
    seasonColumns.innerHTML = cols.map(function (c) {
      var items = groups[c.key].length
        ? groups[c.key].map(function (n) { return '<li>' + escapeHtml(n) + '</li>'; }).join('')
        : '<li>No region is at its peak this month</li>';
      return '<div class="season-col season-' + c.key + '"><h4><svg class="icon" aria-hidden="true"><use href="#' + c.icon + '"/></svg>' +
        c.title + '</h4><ul>' + items + '</ul></div>';
    }).join('');
  }

  function renderMonthPicker(selected) {
    monthPicker.innerHTML = MONTHS.map(function (m, i) {
      var checked = i + 1 === selected;
      return '<button type="button" role="radio" aria-checked="' + checked + '" tabindex="' + (checked ? 0 : -1) +
        '" data-month="' + (i + 1) + '">' + m + '</button>';
    }).join('');
  }

  function selectMonth(month, focus) {
    $all('button', monthPicker).forEach(function (b) {
      var on = Number(b.dataset.month) === month;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) { b.focus(); b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
    renderSeasons(month);
  }

  monthPicker.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-month]');
    if (btn) selectMonth(Number(btn.dataset.month), false);
  });
  // Arrow keys move between months (radio group keyboard pattern).
  monthPicker.addEventListener('keydown', function (e) {
    var current = Number((document.activeElement && document.activeElement.dataset.month) || 1);
    var next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current === 12 ? 1 : current + 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = current === 1 ? 12 : current - 1;
    if (next) { e.preventDefault(); selectMonth(next, true); }
  });

  function renderGems() {
    var gems = destinations.filter(function (d) { return d.hidden; }).slice(0, 6);
    gemsGrid.innerHTML = gems.map(function (d) {
      return '<article class="gem-card card">' +
        '<!-- TODO: Replace with real image: public/assets/images/dest-' + d.id + '.webp -->' +
        '<div class="ph ph-card" role="img" aria-label="' + escapeHtml(d.name + ', ' + d.region + ', Sri Lanka') + '" data-src="/assets/images/dest-' + d.id + '.webp">' +
          '<span class="ph-label">[IMAGE PLACEHOLDER: ' + escapeHtml(d.name) + ']</span></div>' +
        '<div class="card-body">' +
          '<p class="region">' + escapeHtml(d.region) + '</p>' +
          '<h3>' + escapeHtml(d.name) + '</h3>' +
          '<p>' + escapeHtml(d.summary) + '</p>' +
          '<p class="best-months"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-calendar"/></svg>Best: ' + escapeHtml(bestMonthsText(d)) + '</p>' +
        '</div></article>';
    }).join('');
    watchMedia(gemsGrid);
    watchReveal(gemsGrid);
  }

  fetch('/api/destinations')
    .then(function (res) { if (!res.ok) throw new Error('Request failed'); return res.json(); })
    .then(function (data) {
      destinations = data.destinations;
      var month = new Date().getMonth() + 1;
      renderMonthPicker(month);
      renderSeasons(month);
      renderGems();
    })
    .catch(function () {
      seasonColumns.innerHTML = '<p class="loading-text">Season data could not be loaded. Make sure the site is running with <code>npm start</code>.</p>';
    });

  /* ---------- Plan My Trip form ---------- */
  var form = $('#plan-form');
  var errorsBox = $('#form-errors');
  var submitBtn = $('#plan-submit');
  var output = $('#itinerary');
  var startInput = $('#start-date');
  var endInput = $('#end-date');

  function toIso(date) {
    var local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  // Default: a 10-day trip starting about a month from today.
  var today = new Date();
  var defaultStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
  var defaultEnd = new Date(defaultStart.getFullYear(), defaultStart.getMonth(), defaultStart.getDate() + 9);
  startInput.min = toIso(today);
  endInput.min = toIso(today);
  startInput.value = toIso(defaultStart);
  endInput.value = toIso(defaultEnd);
  startInput.addEventListener('change', function () {
    endInput.min = startInput.value;
    if (endInput.value < startInput.value) endInput.value = startInput.value;
  });

  function showErrors(list) {
    if (!list.length) { errorsBox.hidden = true; errorsBox.innerHTML = ''; return; }
    errorsBox.innerHTML = '<ul>' + list.map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join('') + '</ul>';
    errorsBox.hidden = false;
  }

  function collectForm() {
    var data = new FormData(form);
    return {
      startDate: data.get('startDate'),
      endDate: data.get('endDate'),
      travelers: data.get('travelers'),
      budget: data.get('budget') || '',
      pace: data.get('pace'),
      interests: data.getAll('interests'),
      mustSee: data.get('mustSee')
    };
  }

  function validateForm(payload) {
    var errors = [];
    [startInput, endInput, $('#travelers'), $('#budget')].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (!payload.startDate) { errors.push('Please choose a start date.'); startInput.setAttribute('aria-invalid', 'true'); }
    if (!payload.endDate) { errors.push('Please choose an end date.'); endInput.setAttribute('aria-invalid', 'true'); }
    if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
      errors.push('The end date must be on or after the start date.');
      endInput.setAttribute('aria-invalid', 'true');
    }
    var t = Number(payload.travelers);
    if (!(t >= 1 && t <= 20)) { errors.push('Number of travellers must be between 1 and 20.'); $('#travelers').setAttribute('aria-invalid', 'true'); }
    if (!payload.budget) { errors.push('Please choose a budget range.'); $('#budget').setAttribute('aria-invalid', 'true'); }
    return errors;
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function renderItinerary(data) {
    var s = data.summary;
    var route = s.route.map(function (r) { return '<span>' + escapeHtml(r) + '</span>'; })
      .join('<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>');

    var days = data.days.map(function (d) {
      var travel = d.travel
        ? '<span class="day-travel"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-clock"/></svg>' + escapeHtml(d.travel.label) + ' travel</span>'
        : '';
      var weather = d.weather
        ? '<span class="day-weather' + (d.weather.indexOf('Monsoon') === 0 ? ' is-wet' : '') + '"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-rain"/></svg>' + escapeHtml(d.weather) + '</span>'
        : '';
      return '<li class="day-card">' +
        '<div class="day-num"><div><small>Day</small><strong>' + d.day + '</strong></div></div>' +
        '<div><h4>' + escapeHtml(d.title) + '</h4>' +
        '<p class="day-date">' + escapeHtml(formatDate(d.date)) + ' &middot; ' + escapeHtml(d.location) + '</p>' +
        '<ul>' + d.activities.map(function (a) { return '<li>' + escapeHtml(a) + '</li>'; }).join('') + '</ul>' +
        travel + weather + '</div></li>';
    }).join('');

    var c = data.costs;
    output.innerHTML =
      '<div class="itinerary-head">' +
        '<div>' +
          '<p class="eyebrow">Your itinerary</p>' +
          '<h3>' + s.days + ' days in Sri Lanka, ' + escapeHtml(s.month) + '</h3>' +
          '<p>' + s.travelers + ' traveller' + (s.travelers > 1 ? 's' : '') + ' &middot; ' + escapeHtml(s.budget) +
            ' &middot; ' + escapeHtml(s.pace.charAt(0).toUpperCase() + s.pace.slice(1)) + ' pace &middot; about ' + s.totalTravelHours + ' hours of travel in total</p>' +
          '<div class="route-line" aria-label="Route">' + route + '</div>' +
          '<p class="season-advice"><strong>Weather in ' + escapeHtml(s.month) + ':</strong> ' + escapeHtml(s.regionAdvice) + '</p>' +
        '</div>' +
        '<div class="cost-box">' +
          '<h3>Estimated cost</h3>' +
          '<p>Per person</p>' +
          '<p class="cost-big">' + formatMoney(c.perPerson.low) + ' to ' + formatMoney(c.perPerson.high) + '</p>' +
          '<p>Group total: ' + formatMoney(c.group.low) + ' to ' + formatMoney(c.group.high) + '</p>' +
          '<p>Stays, food and activities: ' + formatMoney(c.breakdown.dailyPerPerson.low) + ' to ' + formatMoney(c.breakdown.dailyPerPerson.high) + ' per person per day</p>' +
          '<p>Transport (' + escapeHtml(c.breakdown.transportMode.toLowerCase()) + '): about ' + formatMoney(c.breakdown.transportGroup) + '</p>' +
        '</div>' +
      '</div>' +
      '<ol class="day-list">' + days + '</ol>' +
      '<ul class="itinerary-notes">' + data.notes.map(function (n) { return '<li>' + escapeHtml(n) + '</li>'; }).join('') + '</ul>' +
      '<div class="itinerary-actions">' +
        '<button type="button" class="btn btn-primary" id="itinerary-print">Save or print this plan</button>' +
        '<button type="button" class="btn btn-outline" id="itinerary-edit">Change my answers</button>' +
      '</div>';

    output.hidden = false;
    output.focus({ preventScroll: true });
    output.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

    $('#itinerary-print').addEventListener('click', function () { window.print(); });
    $('#itinerary-edit').addEventListener('click', function () {
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      startInput.focus({ preventScroll: true });
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var payload = collectForm();
    var errors = validateForm(payload);
    showErrors(errors);
    if (errors.length) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Building your itinerary...';

    fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (result) {
        if (!result.ok) { showErrors(result.body.errors || ['Something went wrong. Please try again.']); return; }
        renderItinerary(result.body);
      })
      .catch(function () {
        showErrors(['We could not reach the trip planner. Make sure the server is running (npm start) and try again.']);
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate My Itinerary';
      });
  });

  /* ---------- "View details" dialog ---------- */
  var dialog = $('#detail-dialog');
  $all('.js-details').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $('#dialog-title').textContent = btn.dataset.title;
      $('#dialog-body').textContent = btn.dataset.body;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else window.alert(btn.dataset.title + '\n\n' + btn.dataset.body);
    });
  });
  $('#dialog-cta').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  /* ---------- Newsletter ---------- */
  var newsletter = $('#newsletter-form');
  var newsletterMsg = $('#newsletter-message');
  newsletter.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#newsletter-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      return;
    }
    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) { return res.json(); })
      .then(function (body) {
        newsletterMsg.textContent = body.message || (body.errors && body.errors[0]) || '';
        if (body.message) newsletter.reset();
      })
      .catch(function () { newsletterMsg.textContent = 'Sorry, we could not subscribe you right now.'; });
  });

  /* ---------- Mobile sticky CTA: hide it while the form or footer is on screen ---------- */
  var mobileCta = $('#mobile-cta');
  if ('IntersectionObserver' in window) {
    var hiders = new Set();
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) hiders.add(entry.target); else hiders.delete(entry.target);
      });
      mobileCta.classList.toggle('is-hidden', hiders.size > 0);
    });
    [$('#plan'), $('#contact')].forEach(function (el) { ctaObserver.observe(el); });
  }

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
