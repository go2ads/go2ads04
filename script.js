(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const opened = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(opened));
      menuButton.querySelector('.menu-icon').textContent = opened ? '×' : '☰';
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.menu-icon').textContent = '☰';
    }));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.querySelector('.menu-icon').textContent = '☰'; } });
  }

  const makeCard = (className, content) => {
    const card = document.createElement('article');
    card.className = className;
    content(card);
    return card;
  };

  const logoGrid = document.getElementById('client-logo-grid');
  if (logoGrid && Array.isArray(window.go2adsClients)) {
    window.go2adsClients.forEach(client => {
      if (!client.logo) return;
      const card = makeCard('client-logo-tile', el => {
        const img = document.createElement('img');
        img.src = client.logo; img.alt = client.alt || 'Client logo'; img.loading = 'lazy';
        el.appendChild(img);
      });
      logoGrid.appendChild(card);
    });
  }

  const testimonialGrid = document.getElementById('testimonial-grid');
  if (testimonialGrid && Array.isArray(window.go2adsTestimonials)) {
    window.go2adsTestimonials.forEach(item => {
      if (!item.review || !item.businessName || !item.district) return;
      const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
      testimonialGrid.appendChild(makeCard('testimonial-card', card => {
        const stars = document.createElement('div'); stars.className = 'stars';
        stars.setAttribute('aria-label', `${rating} out of 5 stars`);
        stars.textContent = '★'.repeat(rating) + '☆'.repeat(5-rating);
        const review = document.createElement('p'); review.textContent = `“${item.review}”`;
        const business = document.createElement('b'); business.textContent = item.businessName;
        const district = document.createElement('small'); district.textContent = item.district;
        card.append(stars, review, business, district);
      }));
    });
  }

  const resultsSection = document.getElementById('campaign-results');
  const resultsTrack = document.getElementById('campaign-results-track');
  if (resultsSection && resultsTrack && Array.isArray(window.go2adsCampaignResults) && window.go2adsCampaignResults.length) {
    window.go2adsCampaignResults.forEach(item => {
      if (!item.title || !item.businessName || !item.metric) return;
      resultsTrack.appendChild(makeCard('campaign-result-card', card => {
        const title = document.createElement('small'); title.textContent = item.title;
        const metric = document.createElement('strong'); metric.textContent = item.metric;
        const business = document.createElement('b'); business.textContent = item.businessName;
        const district = document.createElement('span'); district.textContent = item.district || '';
        const description = document.createElement('p'); description.textContent = item.description || '';
        card.append(title, metric, business, district, description);
      }));
    });
    if (resultsTrack.children.length) resultsSection.hidden = false;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.carousel-shell').forEach(shell => {
    const track = shell.querySelector('.client-grid, .feedback-grid, .carousel-track');
    if (!track) return;
    const step = () => Math.max(220, Math.round(track.clientWidth * 0.72));
    shell.querySelectorAll('.carousel-arrow').forEach(button => button.addEventListener('click', () => {
      track.scrollBy({ left: Number(button.dataset.direction) * step(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }));
    let timer;
    const start = () => {
      if (reducedMotion || track.scrollWidth <= track.clientWidth + 4) return;
      stop();
      timer = window.setInterval(() => {
        if (shell.matches(':hover') || shell.contains(document.activeElement)) return;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: reducedMotion ? 'auto' : 'smooth' });
      }, 3500);
    };
    const stop = () => { if (timer) window.clearInterval(timer); };
    shell.addEventListener('mouseenter', stop);
    shell.addEventListener('mouseleave', start);
    shell.addEventListener('focusin', stop);
    shell.addEventListener('focusout', start);
    start();
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]'); if (!link) return;
    const href = link.href;
    if (typeof window.gtag !== 'function') return;
    const label = (link.innerText || link.getAttribute('aria-label') || '').trim();
    if (href.includes('wa.me/') || href.includes('whatsapp.com/')) window.gtag('event', 'whatsapp_click', { link_url: href, link_text: label });
    else if (href.startsWith('tel:')) window.gtag('event', 'phone_click', { link_url: href, link_text: label });
    else if (href.startsWith('mailto:')) window.gtag('event', 'email_click', { link_url: href, link_text: label });
  });
})();
