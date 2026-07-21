/**
 * HEAL Lab Website - Main JavaScript
 */

(function () {
  'use strict';

  // Theme handling
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('heal-theme', next);
    updateThemeIcon(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    updateThemeIcon(html.getAttribute('data-theme') || 'dark');
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarLinks = document.querySelector('.navbar-links');

  if (mobileMenuBtn && navbarLinks) {
    const menuOpenIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    const menuCloseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navbarLinks.classList.toggle('open');
      mobileMenuBtn.innerHTML = isOpen ? menuCloseIcon : menuOpenIcon;
    });

    navbarLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarLinks.classList.remove('open');
        mobileMenuBtn.innerHTML = menuOpenIcon;
      });
    });
  }

  // Active nav link
  function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  setActiveNav();

  // Back to top
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Fade in animations
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => observer.observe(el));
  }

  // TypeIt animation for hero subtitle
  function initTypeIt() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle || typeof TypeIt === 'undefined') return;

    const text = subtitle.getAttribute('data-text') || subtitle.textContent.trim();
    subtitle.textContent = '';

    new TypeIt(subtitle, {
      strings: [text],
      speed: 40,
      breakLines: false,
      loop: false,
      cursor: true,
      cursorChar: '|',
      lifeLike: true,
    }).go();
  }

  if (document.querySelector('.hero-subtitle')) {
    if (typeof TypeIt !== 'undefined') {
      initTypeIt();
    } else {
      window.addEventListener('load', initTypeIt);
    }
  }

  // Hero canvas: Futuristic neural network / data flow
  function initHeroCanvas() {
    const canvas = document.querySelector('.hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let pulses = [];
    let animationId;
    let isActive = true;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      createNodes();
    }

    function createNodes() {
      const count = Math.min(70, Math.floor((width * height) / 16000));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1.5,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    function getThemeColors() {
      const isDark = html.getAttribute('data-theme') !== 'light';
      return {
        node: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
        nodeGlow: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        line: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
        pulse: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
      };
    }

    function draw() {
      if (!isActive) return;
      ctx.clearRect(0, 0, width, height);
      const colors = getThemeColors();
      const time = Date.now() * 0.001;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = colors.line.replace(/[\d.]+\)$/, opacity + ')');
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = Math.sin(time * 2 + n.pulsePhase) * 0.5 + 0.5;
        const radius = n.radius + pulse * 1.5;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.node;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.nodeGlow;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Occasional data pulses along connections
      if (Math.random() < 0.03) {
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const nearby = nodes.filter(n => {
          if (n === n1) return false;
          const d = Math.sqrt((n.x - n1.x) ** 2 + (n.y - n1.y) ** 2);
          return d < 140;
        });
        if (nearby.length) {
          const n2 = nearby[Math.floor(Math.random() * nearby.length)];
          pulses.push({ x: n1.x, y: n1.y, tx: n2.x, ty: n2.y, progress: 0, speed: 0.02 });
        }
      }

      pulses = pulses.filter(p => {
        p.progress += p.speed;
        const x = p.x + (p.tx - p.x) * p.progress;
        const y = p.y + (p.ty - p.y) * p.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.pulse;
        ctx.shadowBlur = 12;
        ctx.shadowColor = colors.pulse;
        ctx.fill();
        ctx.shadowBlur = 0;

        return p.progress < 1;
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        cancelAnimationFrame(animationId);
      } else {
        isActive = true;
        draw();
      }
    });

    // Re-render on theme change
    const observer = new MutationObserver(() => draw);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  }

  initHeroCanvas();

  // Animated counters
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const end = parseInt(target.getAttribute('data-counter'), 10);
          const duration = 2200;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            target.textContent = Math.floor(ease * end);
            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  initCounters();

  // Sidebar TOC for About page
  function initTOC() {
    const tocSidebar = document.querySelector('.toc-sidebar');
    const tocContainer = document.querySelector('.toc-sidebar ul');
    const tocLayout = document.querySelector('.toc-layout');
    const tocToggle = document.querySelector('.toc-toggle');

    if (tocToggle && tocLayout && tocSidebar) {
      const savedCollapsed = localStorage.getItem('heal-toc-collapsed') === 'true';
      if (savedCollapsed) {
        tocLayout.classList.add('collapsed');
        tocSidebar.classList.add('collapsed');
      }
      tocToggle.addEventListener('click', () => {
        const collapsed = tocLayout.classList.toggle('collapsed');
        tocSidebar.classList.toggle('collapsed', collapsed);
        localStorage.setItem('heal-toc-collapsed', collapsed);
      });
    }

    if (!tocContainer) return;

    const content = document.querySelector('.page-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3, h4');
    if (!headings.length) return;

    const tocItems = [];
    const stack = [{ level: 0, ul: tocContainer }];
    headings.forEach((heading, idx) => {
      if (heading.closest('.toc-skip')) return;
      if (!heading.id) {
        heading.id = 'toc-' + idx;
      }
      const level = parseInt(heading.tagName[1], 10);

      while (stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      a.className = 'toc-level-' + level;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + heading.id);
      });
      li.appendChild(a);
      stack[stack.length - 1].ul.appendChild(li);
      tocItems.push({ link: a, heading });

      const childUl = document.createElement('ul');
      li.appendChild(childUl);
      stack.push({ level, ul: childUl });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocItems.forEach(({ link }) => link.classList.remove('active'));
            const active = tocItems.find(item => item.heading === entry.target);
            if (active) active.link.classList.add('active');
          }
        });
      }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

      headings.forEach(h => observer.observe(h));
    }
  }

  initTOC();

  // Shared Recent News loader
  function initNews() {
    const lists = document.querySelectorAll('.recent-news-list');
    if (!lists.length) return;

    fetch('/assets/data/news.json')
      .then(res => res.json())
      .then(news => {
        lists.forEach(list => {
          const limitAttr = list.getAttribute('data-news-limit');
          const limit = limitAttr ? parseInt(limitAttr, 10) : 0;
          const items = limit > 0 ? news.slice(0, limit) : news;
          list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        });
      })
      .catch(() => {
        lists.forEach(list => {
          list.innerHTML = '<li>News feed unavailable.</li>';
        });
      });
  }

  initNews();

  // Gallery auto-loader
  function initGallery() {
    const grid = document.getElementById('gallery-grid');
    const empty = document.getElementById('gallery-empty');
    if (!grid) return;

    fetch('/assets/data/gallery-index.json')
      .then(res => res.json())
      .then(data => {
        const images = data.images || [];
        if (!images.length) {
          if (empty) empty.style.display = 'block';
          return;
        }
        grid.innerHTML = images.map(name => `
          <div class="gallery-item fade-in">
            <img src="/assets/gallery/${encodeURIComponent(name).replace(/%2F/g, '/')}" alt="${name}" loading="lazy">
          </div>
        `).join('');

        // Hide items whose images no longer exist, and show empty hint if all fail
        const items = grid.querySelectorAll('.gallery-item');
        items.forEach(item => {
          const img = item.querySelector('img');
          img.addEventListener('error', () => {
            item.remove();
            if (empty && grid.children.length === 0) {
              empty.style.display = 'block';
            }
          });
        });

        // Trigger fade-in for dynamically added gallery items
        if ('IntersectionObserver' in window) {
          const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                galleryObserver.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
          document.querySelectorAll('.gallery-item.fade-in').forEach(el => galleryObserver.observe(el));
        } else {
          document.querySelectorAll('.gallery-item.fade-in').forEach(el => el.classList.add('visible'));
        }
      })
      .catch(() => {
        if (empty) empty.style.display = 'block';
      });
  }

  initGallery();

  // Search functionality
  function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (!searchOverlay || !searchInput || !searchResults) return;

    let searchIndex = [];

    // Load search index
    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => {
        searchIndex = data;
      })
      .catch(() => {
        searchResults.innerHTML = '<div class="search-empty">Search index not available.</div>';
      });

    function openSearch() {
      searchOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 100);
    }

    function closeSearch() {
      searchOverlay.classList.remove('open');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '';
    }

    if (searchToggle) searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
        closeSearch();
      }
    });

    function performSearch(query) {
      if (!query.trim() || !searchIndex.length) {
        searchResults.innerHTML = '';
        return;
      }

      const q = query.toLowerCase();
      const results = searchIndex
        .filter(item => {
          const text = (item.title + ' ' + (item.content || '') + ' ' + (item.tags || '')).toLowerCase();
          return text.includes(q);
        })
        .slice(0, 12);

      if (!results.length) {
        searchResults.innerHTML = '<div class="search-empty">No results found.</div>';
        return;
      }

      searchResults.innerHTML = results.map(item => {
        const excerpt = item.content ? item.content.substring(0, 140).replace(/<[^>]+>/g, '') + '...' : '';
        return `
          <div class="search-result-item">
            <a href="${item.url}">
              <div class="search-result-title">${escapeHtml(item.title)}</div>
              <div class="search-result-excerpt">${escapeHtml(excerpt)}</div>
            </a>
          </div>
        `;
      }).join('');
    }

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => performSearch(e.target.value), 150);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstResult = searchResults.querySelector('.search-result-item a');
        if (firstResult) window.location.href = firstResult.href;
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  initSearch();

  // Lightbox for all content images
  function initLightbox() {
    let lightbox = document.getElementById('pub-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'pub-lightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-label', 'Image preview');
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <img src="" alt="Preview">
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    function open(src) {
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    // Use event delegation so dynamically loaded images (e.g. gallery) also work
    document.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      // Skip UI-only images (navbar icons, hero canvas, lightbox itself, buttons)
      if (img.closest('.navbar, .hero-canvas, .lightbox, button, .btn')) return;
      if (!img.src) return;
      e.preventDefault();
      open(img.src);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  initLightbox();
})();
