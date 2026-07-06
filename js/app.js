/* ========================================
   Main Application JavaScript
   ======================================== */

const App = {
  // Configuration
  config: {
    apiUrl: '',
    theme: 'dark',
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 100
  },

  // State
  state: {
    theme: 'dark',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    notificationPanelOpen: false,
    searchPanelOpen: false,
    currentUser: null
  },

  // Initialize application
  init() {
    this.initLoadingScreen();
    this.initTheme();
    this.initHeader();
    this.initFooter();
    this.initMobileMenu();
    this.initScrollTop();
    this.initAnimations();
    this.initForms();
    this.initModals();
    this.initTabs();
    this.initAccordions();
    this.initDropdowns();
    this.initCarousels();
    this.initTooltips();
    this.initCounters();
    this.initCountdowns();
    this.initParticles();
    this.initRippleEffects();
    this.initLazyLoading();
    this.initIntersectionObserver();
    this.initDashboard();
    this.initGlobalButtonRedirects();
    this.initHeroSlideshow();

    console.log('Conference & Exhibition Platform initialized');
  },

  // Global Redirects for all buttons
  initGlobalButtonRedirects() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) {
        const href = link.getAttribute('href') || '';
        if (href.includes('privacy.html') || href.includes('terms.html') || href.includes('gallery.html') || href.includes('venue.html')) {
          const path = window.location.pathname;
          const isSubfolder = path.includes('/admin/') || path.includes('/organizer/') || path.includes('/attendee/');
          const target404 = isSubfolder ? '../404.html' : '404.html';
          e.preventDefault();
          window.location.href = target404;
          return;
        }
      }
    });

    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn');
      if (!button) return;

      // Skip password visibility buttons
      if (button.onclick && button.onclick.toString().includes('togglePassword')) return;

      // Skip login and register link buttons
      if (button.tagName === 'A') {
        const href = button.getAttribute('href') || '';
        if (href.includes('login.html') || href.includes('register.html')) {
          return;
        }
      }

      // Skip login role selector tabs
      if (button.classList.contains('role-tab')) return;

      // Skip login form submit button
      if (button.type === 'submit' && button.closest('form') && button.closest('form').getAttribute('onsubmit') === 'handleLogin(event)') return;

      // Skip sidebar toggles, mobile triggers, or scroll top buttons
      if (button.classList.contains('sidebar-toggle') ||
        button.classList.contains('header-menu-toggle') ||
        button.classList.contains('mobile-nav-close-btn') ||
        button.classList.contains('mobile-nav-dropdown-toggle') ||
        button.classList.contains('scroll-top') ||
        button.closest('.sidebar') ||
        button.closest('.mobile-nav') ||
        button.closest('.footer-subscribe-form')) {
        return;
      }

      // Determine path to 404.html based on context
      const path = window.location.pathname;
      const isSubfolder = path.includes('/admin/') || path.includes('/organizer/') || path.includes('/attendee/');
      const target404 = isSubfolder ? '../404.html' : '404.html';

      e.preventDefault();
      window.location.href = target404;
    });
  },

  // Hero background slider cross-fade & content slider
  initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length === 0) return;

    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');

    const contentData = [
      {
        title: `<span class="hero-title-line">Transform Your</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Events</span> Into</span>
                <span class="hero-title-line">Extraordinary</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Experiences</span></span>`,
        desc: "Plan, manage, and execute world-class conferences and exhibitions with our cutting-edge platform. Connect with industry leaders, showcase innovations, and create unforgettable experiences."
      },
      {
        title: `<span class="hero-title-line">Learn From Elite</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Speakers</span> & Global</span>
                <span class="hero-title-line">Industry</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Visionaries</span></span>`,
        desc: "Gain invaluable insights from top industry pioneers, Nobel laureates, and technology CEOs speaking on the cutting-edge of science and business."
      },
      {
        title: `<span class="hero-title-line">Forge Lasting</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Partnerships</span> & Valuable</span>
                <span class="hero-title-line">Strategic</span>
                <span class="hero-title-line"><span class="hero-title-gradient">Connections</span></span>`,
        desc: "Connect with thousands of international delegates, coordinate targeted one-on-one speed networking, and build relationships that drive future growth."
      }
    ];

    let currentIndex = 0;
    setInterval(() => {
      // Transition out slides
      slides[currentIndex].classList.remove('active');

      // Transition out text
      const elementsToFade = [heroTitle, heroDesc].filter(Boolean);
      elementsToFade.forEach(el => {
        el.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
      });

      currentIndex = (currentIndex + 1) % slides.length;

      setTimeout(() => {
        // Change slide active
        slides[currentIndex].classList.add('active');

        // Update content
        if (heroTitle) heroTitle.innerHTML = contentData[currentIndex].title;
        if (heroDesc) heroDesc.textContent = contentData[currentIndex].desc;

        // Fade in new text
        elementsToFade.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }, 500);
    }, 6000);
  },

  // Dashboard Navigation Switcher
  initDashboard() {
    const isDashboard = document.querySelector('.dashboard') !== null;
    if (!isDashboard) return;

    // Detect role and set session state
    const path = window.location.pathname;
    let role = '';
    if (path.includes('/organizer/')) role = 'organizer';
    else if (path.includes('/attendee/')) role = 'attendee';
    else if (path.includes('/admin/')) role = 'admin';

    if (role) {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', role);
    }

    // Dynamically inject the logo-stackly.webp image inside sidebar and header
    const sidebarLogo = document.querySelector('.sidebar-logo');
    const isSubDir = window.location.pathname.includes('/organizer/') ||
      window.location.pathname.includes('/attendee/') ||
      window.location.pathname.includes('/admin/');
    const basePath = isSubDir ? '../' : '';

    if (sidebarLogo) {
      sidebarLogo.setAttribute('href', 'dashboard.html');
      const logoPath = isSubDir ? '../assets/logo-stackly.webp' : 'assets/logo-stackly.webp';

      sidebarLogo.innerHTML = `
        <img src="${logoPath}" alt="Stackly Logo" class="sidebar-logo-img" style="height: 40px; width: auto; border-radius: 6px; margin-right: 0; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%);">
        <span class="sidebar-logo-text" style="font-family: var(--font-display); font-weight: var(--fw-bold); font-size: var(--fs-lg); color: #00e6e6; letter-spacing: 0.5px;"></span>
      `;
    }

    // Override mobile close button icon to clean &times; close mark
    const mobileClose = document.querySelector('.mobile-sidebar-close');
    if (mobileClose) {
      mobileClose.innerHTML = '&times;';
      mobileClose.style.cssText = "font-size: 28px; line-height: 1; color: var(--text-secondary); background: transparent; border: none; padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: none; margin-left: auto;";
    }

    // Inject Search module inside sidebar content for mobile viewport
    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent && !sidebarContent.querySelector('.mobile-search-box')) {
      const searchBox = document.createElement('div');
      searchBox.className = 'mobile-search-box';
      searchBox.style.cssText = "padding: var(--space-4) var(--space-5) 0 var(--space-5); display: none; box-sizing: border-box;";
      searchBox.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-family: var(--font-display); font-size: var(--fs-sm); font-weight: var(--fw-bold); color: #fff;">Search Now!</h4>
        <div style="position: relative; width: 100%;">
          <input type="text" placeholder="Search here..." style="width: 100%; padding: 10px 40px 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); color: #fff; font-size: var(--fs-sm); box-sizing: border-box; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-500)'" onblur="this.style.borderColor='var(--border-primary)'">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; right: 12px; top: 11px; color: var(--text-muted); pointer-events: none;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      `;
      sidebarContent.insertBefore(searchBox, sidebarContent.firstChild);
    }

    // Inject actions (Login/Signup) inside dashboard sidebar for mobile layout parity
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.querySelector('.sidebar-actions')) {
      const actions = document.createElement('div');
      actions.className = 'sidebar-actions';
      actions.style.cssText = "display: none;"; // only visible via media query!
      actions.innerHTML = `
        <a href="${basePath}login.html" class="btn btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center;">Login</a>
        <a href="${basePath}register.html" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; margin-top: 8px;">Sign Up</a>
      `;

      const sidebarFooter = sidebar.querySelector('.sidebar-footer');
      if (sidebarFooter) {
        sidebar.insertBefore(actions, sidebarFooter);
      } else {
        sidebar.appendChild(actions);
      }
    }

    // Inject Contact Info inside sidebar footer for mobile viewport
    if (sidebar && !sidebar.querySelector('.mobile-contact-info')) {
      const contactInfo = document.createElement('div');
      contactInfo.className = 'mobile-contact-info';
      contactInfo.style.cssText = "padding: 0 var(--space-5) var(--space-5) var(--space-5); display: none; box-sizing: border-box;";
      contactInfo.innerHTML = `
        <div style="height: 1px; background: var(--border-primary); margin: var(--space-4) 0;"></div>
        <h4 style="margin: 0 0 8px 0; font-family: var(--font-display); font-size: var(--fs-sm); font-weight: var(--fw-bold); color: #fff; border-bottom: 1px solid var(--border-primary); padding-bottom: 6px;">Contact Info</h4>
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Phone</div>
        <div style="font-size: var(--fs-xs); color: #fff; font-weight: var(--fw-bold); margin-bottom: 10px;">+91 7010792745</div>
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Email</div>
        <div style="font-size: var(--fs-xs); color: #fff; font-weight: var(--fw-bold); margin-bottom: 10px;">info@thestackly.com</div>
        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Address</div>
        <div style="font-size: var(--fs-xs); color: #fff; font-weight: var(--fw-bold);">Salem, Tamil Nadu</div>
      `;

      const sidebarFooter = sidebar.querySelector('.sidebar-footer');
      if (sidebarFooter) {
        sidebar.insertBefore(contactInfo, sidebarFooter);
      } else {
        sidebar.appendChild(contactInfo);
      }
    }

    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
      const titleContainer = dashboardHeader.querySelector('.flex.items-center.gap-4');
      if (titleContainer) {
        const isSubDir = window.location.pathname.includes('/organizer/') ||
          window.location.pathname.includes('/attendee/') ||
          window.location.pathname.includes('/admin/');
        const logoPath = isSubDir ? '../assets/logo-stackly.webp' : 'assets/logo-stackly.webp';

        const headerLogo = document.createElement('img');
        headerLogo.src = logoPath;
        headerLogo.alt = "Stackly Logo";
        headerLogo.className = "dashboard-header-logo-img";
        headerLogo.style.cssText = "height: 36px; width: auto; display: none; margin-right: 8px; flex-shrink: 0; border-radius: 4px; cursor: pointer; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%);";

        headerLogo.addEventListener('click', () => {
          window.location.href = 'dashboard.html';
        });

        titleContainer.insertBefore(headerLogo, titleContainer.firstChild);
      }
    }

    const links = document.querySelectorAll('.sidebar-link');
    const mainContent = document.querySelector('.dashboard-content');
    const headerTitle = document.querySelector('.dashboard-header-title');
    const headerDesc = document.querySelector('.dashboard-header p');

    if (!mainContent || !headerTitle) return;

    // Store original view html
    const originalHtml = mainContent.innerHTML;

    links.forEach(link => {
      // Skip logout
      if (link.getAttribute('href') && link.getAttribute('href').includes('login.html')) {
        return;
      }

      link.addEventListener('click', (e) => {
        const textSpan = link.querySelector('.sidebar-link-text');
        if (!textSpan) return;

        e.preventDefault();

        // Remove active class from all links
        links.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        const viewText = textSpan.textContent.trim();

        // If sidebar is overlay (mobile), close it
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        }
        if (overlay && overlay.classList.contains('active')) {
          overlay.classList.remove('active');
        }

        if (viewText === 'Dashboard') {
          headerTitle.textContent = 'Dashboard Overview';
          if (headerDesc) headerDesc.textContent = "Welcome back! Here's what's happening today.";
          mainContent.innerHTML = originalHtml;

          // Re-trigger counter animations on dashboard restore
          document.querySelectorAll('.stat-card-value[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            if (!isNaN(target)) {
              el.textContent = target.toLocaleString();
            }
          });
          this.updateMobilePageTitle();
          return;
        }

        headerTitle.textContent = viewText;
        if (headerDesc) headerDesc.textContent = `Manage and view ${viewText.toLowerCase()} records and live configurations.`;

        // Render custom content dynamically!
        this.renderDashboardView(viewText, mainContent);
        this.updateMobilePageTitle();
      });
    });

    // Initial page title sync
    this.updateMobilePageTitle();
  },

  updateMobilePageTitle() {
    const mainContent = document.querySelector('.dashboard-content');
    const headerTitle = document.querySelector('.dashboard-header-title');
    const headerDesc = document.querySelector('.dashboard-header p');
    if (!mainContent || !headerTitle) return;

    let mobileHeader = mainContent.querySelector('.mobile-page-header');
    if (!mobileHeader) {
      mobileHeader = document.createElement('div');
      mobileHeader.className = 'mobile-page-header';
      // Prepend to main content
      mainContent.insertBefore(mobileHeader, mainContent.firstChild);
    }

    const titleText = headerTitle.textContent.trim();
    const descText = headerDesc ? headerDesc.textContent.trim() : '';

    mobileHeader.innerHTML = `
      <h1 class="mobile-page-title">${titleText}</h1>
      <p class="mobile-page-desc">${descText}</p>
    `;
  },

  renderDashboardView(view, container) {
    let html = '';
    const isSubDir = window.location.pathname.includes('/organizer/') ||
      window.location.pathname.includes('/attendee/') ||
      window.location.pathname.includes('/admin/');
    const basePath = isSubDir ? '../' : '';

    if (view === 'Conferences' || view === 'My Events' || view === 'Registered Events') {
      html = `
        <div class="card card-glass p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: 12px;">
            <h3 style="margin: 0; font-family: var(--font-display);">${view} Dashboard</h3>
            <button class="btn btn-primary btn-sm">+ Create New</button>
          </div>
          
          <!-- Filters & Search -->
          <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-6); flex-wrap: wrap; width: 100%;">
            <input type="text" placeholder="Search events..." style="flex: 1; min-width: 200px; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); color: #fff; outline: none;" />
            <select style="padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); color: #fff; outline: none;">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          <!-- Highlight Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
            <div class="card p-4" style="background: var(--bg-glass); border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <img src="${basePath}assets/pexels_photo_2774556.webp" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-3);" alt="Main Stage" />
                <span class="badge badge-primary" style="margin-bottom: 8px;">Upcoming</span>
                <h4 style="margin: 0 0 4px 0;">Global Quantum Summit 2026</h4>
                <p style="margin: 0 0 12px 0; font-size: var(--fs-xs); color: var(--text-muted);">Nov 12-14 | Boston, MA</p>
              </div>
              <div class="progress" style="height: 6px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div class="progress-bar" style="width: 75%; height: 100%; background: var(--gradient-primary);"></div>
              </div>
              <p style="margin: 0; font-size: 11px; color: var(--text-secondary);">1,240 Registered (75% Goal)</p>
            </div>
            
            <div class="card p-4" style="background: var(--bg-glass); border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <img src="${basePath}assets/pexels_photo_1181396.webp" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-3);" alt="Developer Workshop" />
                <span class="badge badge-success" style="margin-bottom: 8px;">Active</span>
                <h4 style="margin: 0 0 4px 0;">Global AI Exhibition 2026</h4>
                <p style="margin: 0 0 12px 0; font-size: var(--fs-xs); color: var(--text-muted);">Dec 05-07 | Geneva, Switzerland</p>
              </div>
              <div class="progress" style="height: 6px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div class="progress-bar" style="width: 90%; height: 100%; background: var(--gradient-primary);"></div>
              </div>
              <p style="margin: 0; font-size: 11px; color: var(--text-secondary);">850 Exhibiting (90% Goal)</p>
            </div>

            <div class="card p-4" style="background: var(--bg-glass); border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <img src="${basePath}assets/pexels_photo_3183183.webp" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-3);" alt="Sponsors Lounge" />
                <span class="badge badge-secondary" style="margin-bottom: 8px;">Planning</span>
                <h4 style="margin: 0 0 4px 0;">Cybersecurity Pioneers 2027</h4>
                <p style="margin: 0 0 12px 0; font-size: var(--fs-xs); color: var(--text-muted);">Jan 18-20 | Tokyo, Japan</p>
              </div>
              <div class="progress" style="height: 6px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div class="progress-bar" style="width: 40%; height: 100%; background: var(--gradient-primary);"></div>
              </div>
              <p style="margin: 0; font-size: 11px; color: var(--text-secondary);">2,100 Confirmed (40% Goal)</p>
            </div>
          </div>

          <!-- Main Table View -->
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Event Records Table</h4>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Event Name</th>
                  <th style="padding: var(--space-3) var(--space-4);">Date</th>
                  <th style="padding: var(--space-3) var(--space-4);">Location</th>
                  <th style="padding: var(--space-3) var(--space-4);">Attendance</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                  <th style="padding: var(--space-3) var(--space-4); text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Global Quantum Summit 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Nov 12-14, 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Boston, MA</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">1,240 Registered</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-primary" style="background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3);">Upcoming</span></td>
                  <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Manage</button></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Global AI Exhibition 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Dec 05-07, 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Geneva, Switzerland</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">850 Exhibiting</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3);">Active</span></td>
                  <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Manage</button></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Cybersecurity Pioneers 2027</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jan 18-20, 2027</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Tokyo, Japan</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">2,100 Confirmed</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-secondary" style="background: rgba(160, 160, 184, 0.15); color: var(--text-muted); border: 1px solid rgba(160, 160, 184, 0.3);">Planning</span></td>
                  <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Manage</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Exhibitions' || view === 'Booths' || view === 'Exhibitors') {
      html = `
        <div class="card card-glass p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Exhibitions Floor Dashboard</h3>
            <button class="btn btn-primary btn-sm">+ Assign Booth</button>
          </div>

          <!-- Summary Stats -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Total Booths Available</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff;">150 Booths</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Assigned / Booked</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #00e6e6;">96 Reserved</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Occupancy Rate</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #00ff7a;">64% Occupied</div>
            </div>
          </div>

          <!-- Booth Interactive Grid Map -->
          <h4 style="margin: 0 0 var(--space-3) 0; font-family: var(--font-display);">Exhibition Floor Layout Map (Live)</h4>
          <div style="background: rgba(0,0,0,0.2); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6); border: 1px solid var(--border-primary); overflow-x: auto;">
            <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px; min-width: 600px;">
              ${Array.from({ length: 20 }, (_, i) => {
                const colors = ['rgba(0,255,122,0.15)', 'rgba(0,102,255,0.15)', 'rgba(255,0,160,0.15)', 'rgba(255,255,255,0.03)'];
                const borders = ['rgba(0,255,122,0.4)', 'rgba(0,102,255,0.4)', 'rgba(255,0,160,0.4)', 'var(--border-primary)'];
                const label = ['VIP', 'Reserved', 'Blocked', 'Empty'];
                const idx = i % 4;
                return `
                  <div style="background: ${colors[idx]}; border: 1px solid ${borders[idx]}; border-radius: 4px; padding: 12px 4px; text-align: center; cursor: pointer;">
                    <span style="font-size: 10px; font-weight: bold; color: #fff; display: block;">B-${i+101}</span>
                    <span style="font-size: 7px; color: var(--text-secondary); text-transform: uppercase;">${label[idx]}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Active Pavilion Tiers</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6);">
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl);">
              <span class="badge badge-accent mb-3" style="display: inline-block; background: rgba(255, 0, 160, 0.15); color: var(--accent-400); border: 1px solid rgba(255, 0, 160, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Hall A</span>
              <h4 style="margin: 0 0 var(--space-2); font-weight: var(--fw-bold);">Robotics Innovation Pavilion</h4>
              <p class="text-secondary text-sm mb-4" style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">32 registered exhibitors, 98% occupancy rate.</p>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3);">Lead Coordinator: Elena Rostova</div>
            </div>
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl);">
              <span class="badge badge-primary mb-3" style="display: inline-block; background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Hall B</span>
              <h4 style="margin: 0 0 var(--space-2); font-weight: var(--fw-bold);">Sustainable Tech Pavilion</h4>
              <p class="text-secondary text-sm mb-4" style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">24 registered exhibitors, 80% occupancy rate.</p>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3);">Lead Coordinator: Sophia Martinez</div>
            </div>
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl);">
              <span class="badge badge-success mb-3" style="display: inline-block; background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Hall C</span>
              <h4 style="margin: 0 0 var(--space-2); font-weight: var(--fw-bold);">Fintech Solutions Pavilion</h4>
              <p class="text-secondary text-sm mb-4" style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">40 registered exhibitors, 100% occupancy rate.</p>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3);">Lead Coordinator: David Chen</div>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Attendees' || view === 'Speakers' || view === 'Sponsors' || view === 'Staff') {
      const items = {
        Attendees: [
          { name: 'Sarah Jenkins', detail: 'sarah.j@google.com', company: 'Google', status: 'Registered' },
          { name: 'Michael Chang', detail: 'mchang@openai.com', company: 'OpenAI', status: 'Checked In' },
          { name: 'Amara Okafor', detail: 'amara@tech.io', company: 'Tech.io', status: 'Registered' },
          { name: 'David Lee', detail: 'david@microsoft.com', company: 'Microsoft', status: 'Checked In' },
          { name: 'Chloe Vance', detail: 'chloe@apple.com', company: 'Apple', status: 'Registered' }
        ],
        Speakers: [
          { name: 'Dr. Sarah Chen', detail: 'Google DeepMind', topic: 'Scaling AI Agent Architectures', status: 'Confirmed' },
          { name: 'Marcus Johnson', detail: 'TechVentures CEO', topic: 'The Future of Venture Capital', status: 'Confirmed' },
          { name: 'Prof. Alan Vance', detail: 'MIT Quantum Lab', topic: 'Quantum Cryptography in Web3', status: 'Pending' }
        ],
        Sponsors: [
          { name: 'Google Cloud', detail: 'Main Keynote Sponsor', tier: 'Platinum', status: 'Active' },
          { name: 'Meta Platforms', detail: 'Networking Lounge Sponsor', tier: 'Gold', status: 'Active' },
          { name: 'Amazon AWS', detail: 'Hackathon Track Sponsor', tier: 'Gold', status: 'Active' },
          { name: 'Microsoft Azure', detail: 'Badge & Lanyard Sponsor', tier: 'Silver', status: 'Active' }
        ],
        Staff: [
          { name: 'Elena Rostova', detail: 'Event Director', hall: 'Hall A Roster', status: 'On Site' },
          { name: 'Sophia Martinez', detail: 'Operations Lead', hall: 'Hall B Roster', status: 'On Site' },
          { name: 'David Chen', detail: 'Finance Director', hall: 'Main Desk', status: 'Remote' }
        ]
      };
      const list = items[view] || [];
      
      let viewSpecHtml = '';
      if (view === 'Attendees') {
        viewSpecHtml = `
          <!-- Summary Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">VIP Attendees</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #ff00a0;">450 Registered</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Standard Attendees</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #00e6e6;">1,820 Registered</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Check-in Completion</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #00ff7a;">92% Checked In</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: var(--space-4); flex-wrap: wrap;">
            <input type="text" placeholder="Search attendee list..." style="flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: #fff; outline: none; font-size: var(--fs-sm);" />
            <button class="btn btn-outline btn-sm">Filter</button>
          </div>
        `;
      } else if (view === 'Speakers') {
        viewSpecHtml = `
          <!-- Speakers Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-4 text-center" style="background: var(--bg-glass); border-radius: var(--radius-xl);">
              <img src="${basePath}assets/pexels_photo_2379004.webp" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto;" alt="Marcus" />
              <h4 style="margin: 0 0 4px 0;">Marcus Johnson</h4>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: var(--text-muted);">CEO, TechVentures</p>
              <span class="badge badge-success" style="font-size: 9px; padding: 2px 6px;">Keynote Speaker</span>
            </div>
            <div class="card p-4 text-center" style="background: var(--bg-glass); border-radius: var(--radius-xl);">
              <img src="${basePath}assets/pexels_photo_774909.webp" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto;" alt="Sarah" />
              <h4 style="margin: 0 0 4px 0;">Dr. Sarah Chen</h4>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: var(--text-muted);">Google DeepMind</p>
              <span class="badge badge-success" style="font-size: 9px; padding: 2px 6px;">Keynote Speaker</span>
            </div>
            <div class="card p-4 text-center" style="background: var(--bg-glass); border-radius: var(--radius-xl);">
              <img src="${basePath}assets/pexels_photo_1181686.webp" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto;" alt="Sophia" />
              <h4 style="margin: 0 0 4px 0;">Sophia Martinez</h4>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: var(--text-muted);">OpenWeb Foundation</p>
              <span class="badge badge-primary" style="font-size: 9px; padding: 2px 6px;">Panelist</span>
            </div>
          </div>
        `;
      }
      
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">${view} Manager</h3>
            <button class="btn btn-primary btn-sm">+ Add ${view.slice(0, -1)}</button>
          </div>
          
          ${viewSpecHtml}

          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Name</th>
                  <th style="padding: var(--space-3) var(--space-4);">Detail / Company</th>
                  <th style="padding: var(--space-3) var(--space-4);">${view === 'Speakers' ? 'Topic' : (view === 'Sponsors' ? 'Tier' : (view === 'Staff' ? 'Area' : 'Company'))}</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                  <th style="padding: var(--space-3) var(--space-4); text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(item => `
                  <tr style="border-bottom: 1px solid var(--border-secondary);">
                    <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">${item.name}</td>
                    <td style="padding: var(--space-4); color: var(--text-secondary);">${item.detail}</td>
                    <td style="padding: var(--space-4); color: var(--text-secondary);">${item.company || item.topic || item.tier || item.hall}</td>
                    <td style="padding: var(--space-4);"><span class="badge badge-primary" style="background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">${item.status}</span></td>
                    <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Edit</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Settings') {
      html = `
        <div class="card card-glass p-6" style="max-width: 800px; margin: 0 auto;">
          <h3 class="mb-4" style="margin-bottom: var(--space-4); font-family: var(--font-display);">Settings & Configurations</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-6);">
            <div style="border-right: 1px solid var(--border-primary); padding-right: var(--space-4);">
              <nav style="display: flex; flex-direction: column; gap: var(--space-2);">
                <a href="#" style="padding: 10px; border-radius: var(--radius-md); background: rgba(0,102,255,0.15); color: #fff; font-weight: 600; text-decoration: none; font-size: var(--fs-sm);">User Profile</a>
                <a href="#" style="padding: 10px; border-radius: var(--radius-md); color: var(--text-secondary); text-decoration: none; font-size: var(--fs-sm);">Email Notifications</a>
                <a href="#" style="padding: 10px; border-radius: var(--radius-md); color: var(--text-secondary); text-decoration: none; font-size: var(--fs-sm);">Security & Password</a>
                <a href="#" style="padding: 10px; border-radius: var(--radius-md); color: var(--text-secondary); text-decoration: none; font-size: var(--fs-sm);">Organization Info</a>
              </nav>
            </div>
            <div>
              <form style="display: flex; flex-direction: column; gap: var(--space-4);" onsubmit="event.preventDefault(); alert('Settings Saved!');">
                <div class="form-group" style="margin-bottom: var(--space-3);">
                  <label class="form-label" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: var(--fs-sm);">Display Name</label>
                  <input type="text" class="form-input" style="width: 100%;" value="Sarah Jenkins" />
                </div>
                <div class="form-group" style="margin-bottom: var(--space-3);">
                  <label class="form-label" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: var(--fs-sm);">Notification Email</label>
                  <input type="email" class="form-input" style="width: 100%;" value="sarah.j@google.com" />
                </div>
                <div class="form-group" style="margin-bottom: var(--space-3);">
                  <label class="form-label" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: var(--fs-sm);">Time Zone</label>
                  <select class="form-input" style="width: 100%; background: var(--bg-secondary); color: #fff; border: 1px solid var(--border-primary); padding: 8px;">
                    <option>Pacific Standard Time (PST)</option>
                    <option>Eastern Standard Time (EST)</option>
                    <option>Greenwich Mean Time (GMT)</option>
                    <option>Indian Standard Time (IST)</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-4);">
                  <label class="checkbox-animated" style="display: inline-flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked />
                    <span class="text-sm text-secondary">Enable live browser dashboard popups</span>
                  </label>
                </div>
                <button type="submit" class="btn btn-primary" style="width: max-content;">Save Profile</button>
              </form>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'My Tickets' || view === 'Tickets') {
      html = `
        <div class="card card-glass p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Your Access Passes</h3>
            <button class="btn btn-outline btn-sm">PDF Download</button>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
            <!-- Ticket 1 -->
            <div class="dashboard-ticket-card" style="border: 2px dashed var(--border-primary); border-radius: var(--radius-2xl); padding: var(--space-5); background: var(--bg-secondary); position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; height: 210px;">
              <div style="position: absolute; right: -10px; top: -10px; width: 40px; height: 40px; background: rgba(0, 102, 255, 0.1); border-radius: 50%;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-primary); padding-bottom: var(--space-3); margin-bottom: var(--space-3);">
                  <h4 style="margin: 0; color: var(--primary-400); font-weight: bold;">Professional Pass</h4>
                  <span style="font-weight: bold; color: var(--text-primary);">$299.00</span>
                </div>
                <p style="margin: 0 0 var(--space-1); font-weight: 600;">Global Quantum Summit 2026</p>
                <p style="margin: 0 0 var(--space-3); color: var(--text-muted); font-size: var(--fs-xs);">Attendee: Sarah Jenkins | Code: #QN-9824</p>
              </div>
              <div style="background: white; padding: 6px 12px; border-radius: var(--radius-md); display: flex; justify-content: center; width: max-content; margin: 0 auto;">
                <div style="height: 30px; width: 140px; background: repeating-linear-gradient(90deg, black, black 3px, white 3px, white 6px, black 6px, black 8px, white 8px, white 12px);"></div>
              </div>
            </div>

            <!-- Ticket 2 -->
            <div class="dashboard-ticket-card" style="border: 2px dashed var(--border-primary); border-radius: var(--radius-2xl); padding: var(--space-5); background: var(--bg-secondary); position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; height: 210px;">
              <div style="position: absolute; right: -10px; top: -10px; width: 40px; height: 40px; background: rgba(0, 255, 122, 0.1); border-radius: 50%;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-primary); padding-bottom: var(--space-3); margin-bottom: var(--space-3);">
                  <h4 style="margin: 0; color: var(--success-400); font-weight: bold;">Standard Pass</h4>
                  <span style="font-weight: bold; color: var(--text-primary);">$149.00</span>
                </div>
                <p style="margin: 0 0 var(--space-1); font-weight: 600;">Business Expo 2026</p>
                <p style="margin: 0 0 var(--space-3); color: var(--text-muted); font-size: var(--fs-xs);">Attendee: Sarah Jenkins | Code: #BE-2026-392</p>
              </div>
              <div style="background: white; padding: 6px 12px; border-radius: var(--radius-md); display: flex; justify-content: center; width: max-content; margin: 0 auto;">
                <div style="height: 30px; width: 140px; background: repeating-linear-gradient(90deg, black, black 3px, white 3px, white 6px, black 6px, black 8px, white 8px, white 12px);"></div>
              </div>
            </div>
          </div>

          <!-- Transaction Info -->
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Ticket Order History</h4>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 500px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Order ID</th>
                  <th style="padding: var(--space-3) var(--space-4);">Event</th>
                  <th style="padding: var(--space-3) var(--space-4);">Billing Date</th>
                  <th style="padding: var(--space-3) var(--space-4);">Amount</th>
                  <th style="padding: var(--space-3) var(--space-4);">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">#TN-2026-847</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Tech Innovation Summit</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jul 02, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">$299.00</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Visa ending in 4242</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">#BE-2026-392</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Business Expo 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jun 15, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">$149.00</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Mastercard ending in 9812</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Gallery') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: 10px;">
            <h3 style="margin: 0; font-family: var(--font-display);">Event Gallery</h3>
            <button class="btn btn-primary btn-sm">+ Upload Media</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-4);">
            <div class="card overflow-hidden" style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 0;">
              <img src="${basePath}assets/pexels_photo_2774556.webp" style="width: 100%; height: 140px; object-fit: cover;" alt="Main Stage" />
              <div style="padding: 12px;">
                <h5 style="margin: 0 0 4px 0; font-size: var(--fs-sm); font-weight: var(--fw-semibold);">Tech Innovation Summit</h5>
                <p style="margin: 0; font-size: 11px; color: var(--text-muted);">Main stage keynotes</p>
              </div>
            </div>
            <div class="card overflow-hidden" style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 0;">
              <img src="${basePath}assets/pexels_photo_1181396.webp" style="width: 100%; height: 140px; object-fit: cover;" alt="Workshop" />
              <div style="padding: 12px;">
                <h5 style="margin: 0 0 4px 0; font-size: var(--fs-sm); font-weight: var(--fw-semibold);">Developer Workshop</h5>
                <p style="margin: 0; font-size: 11px; color: var(--text-muted);">Interactive coding lab</p>
              </div>
            </div>
            <div class="card overflow-hidden" style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 0;">
              <img src="${basePath}assets/pexels_photo_3183183.webp" style="width: 100%; height: 140px; object-fit: cover;" alt="Networking" />
              <div style="padding: 12px;">
                <h5 style="margin: 0 0 4px 0; font-size: var(--fs-sm); font-weight: var(--fw-semibold);">Sponsors Networking</h5>
                <p style="margin: 0; font-size: 11px; color: var(--text-muted);">Executive lounge meeting</p>
              </div>
            </div>
            <div class="card overflow-hidden" style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 0;">
              <img src="${basePath}assets/pexels_photo_3184183.webp" style="width: 100%; height: 140px; object-fit: cover;" alt="Discussion" />
              <div style="padding: 12px;">
                <h5 style="margin: 0 0 4px 0; font-size: var(--fs-sm); font-weight: var(--fw-semibold);">Panel Discussion</h5>
                <p style="margin: 0; font-size: 11px; color: var(--text-muted);">QA session on future trends</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Reports') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Event Analytics & Reports</h3>
            <button class="btn btn-outline btn-sm">Export PDF</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 8px 0; color: var(--text-muted); font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.5px;">Avg. Session Rating</h5>
              <div style="font-size: var(--fs-2xl); font-weight: var(--fw-bold); color: #00e6e6;">4.8 / 5.0</div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: var(--success-400);">▲ +0.3 from last event</p>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 8px 0; color: var(--text-muted); font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.5px;">Check-in Rate</h5>
              <div style="font-size: var(--fs-2xl); font-weight: var(--fw-bold); color: #00ff7a;">92.4%</div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: var(--success-400);">▲ 2,270 attendees verified</p>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 8px 0; color: var(--text-muted); font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.5px;">Audience Engagement</h5>
              <div style="font-size: var(--fs-2xl); font-weight: var(--fw-bold); color: #ff00a0;">78%</div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: var(--success-400);">▲ Live polls & Q&A active</p>
            </div>
          </div>
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Event Registration Goals</h4>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: var(--fs-sm); margin-bottom: 6px;">
                <span>Tech Innovation Summit 2026</span>
                <span style="font-weight: 600;">75% (1,500 / 2,000)</span>
              </div>
              <div class="progress" style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; width: 100%;">
                <div class="progress-bar" style="width: 75%; height: 100%; background: var(--gradient-primary);"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: var(--fs-sm); margin-bottom: 6px;">
                <span>Business Expo 2026</span>
                <span style="font-weight: 600;">40% (400 / 1,000)</span>
              </div>
              <div class="progress" style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; width: 100%;">
                <div class="progress-bar" style="width: 40%; height: 100%; background: var(--gradient-primary);"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Revenue') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Revenue Dashboard</h3>
            <span style="font-size: var(--fs-sm); color: var(--text-muted);">Currency: USD ($)</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Ticket Sales</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff;">$245,800</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Sponsorship Deals</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff;">$180,000</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h5 style="margin: 0 0 4px 0; color: var(--text-muted); font-size: var(--fs-xs);">Booth Rentals</h5>
              <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff;">$95,500</div>
            </div>
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary); background: linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 230, 230, 0.05));">
              <h5 style="margin: 0 0 4px 0; color: var(--primary-400); font-size: var(--fs-xs); font-weight: var(--fw-bold);">Net Total Revenue</h5>
              <div style="font-size: var(--fs-2xl); font-weight: var(--fw-bold); color: #00e6e6;">$521,300</div>
            </div>
          </div>
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Recent Inbound Payments</h4>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 500px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Tx ID</th>
                  <th style="padding: var(--space-3) var(--space-4);">From</th>
                  <th style="padding: var(--space-3) var(--space-4);">Item</th>
                  <th style="padding: var(--space-3) var(--space-4);">Date</th>
                  <th style="padding: var(--space-3) var(--space-4);">Amount</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); color: var(--text-secondary); font-family: monospace;">#TX-9023</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">Google DeepMind</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Platinum Sponsorship</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jul 05, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-bold); color: #00ff7a;">+$50,000</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Completed</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); color: var(--text-secondary); font-family: monospace;">#TX-9022</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">Alice Vance</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Tech Summit Ticket VIP</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jul 05, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-bold); color: #00ff7a;">+$299</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Completed</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); color: var(--text-secondary); font-family: monospace;">#TX-9021</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">Starlight Labs</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Exhibit Booth #A-14</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jul 04, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-bold); color: #00ff7a;">+$1,500</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Certificates' || view === 'Certifications') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">My Certificates</h3>
            <button class="btn btn-outline btn-sm">Verify Credentials</button>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; overflow: hidden;">
              <div style="position: absolute; right: -15px; top: -15px; width: 60px; height: 60px; background: rgba(0, 255, 122, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--success-500)" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: var(--text-primary);">Web3 Innovation Summit 2025</h4>
              <p style="margin: 0 0 var(--space-4) 0; font-size: var(--fs-xs); color: var(--text-muted);">Awarded December 2025</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-primary); padding-top: var(--space-3);">
                <span style="font-size: 11px; color: var(--text-secondary);">Credential ID: #C-W3-9824</span>
                <button class="btn btn-primary btn-sm" style="padding: var(--space-1) var(--space-3); font-size: var(--fs-xs);">Download PDF</button>
              </div>
            </div>
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; overflow: hidden;">
              <div style="position: absolute; right: -15px; top: -15px; width: 60px; height: 60px; background: rgba(0, 255, 122, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--success-500)" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: var(--text-primary);">Global AI Summit 2025</h4>
              <p style="margin: 0 0 var(--space-4) 0; font-size: var(--fs-xs); color: var(--text-muted);">Awarded October 2025</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-primary); padding-top: var(--space-3);">
                <span style="font-size: 11px; color: var(--text-secondary);">Credential ID: #C-AI-8241</span>
                <button class="btn btn-primary btn-sm" style="padding: var(--space-1) var(--space-3); font-size: var(--fs-xs);">Download PDF</button>
              </div>
            </div>
          </div>

          <!-- Achievements Timeline -->
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Achievements & Learning Milestones</h4>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="display: flex; gap: var(--space-4); background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--border-primary);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #00ff7a; margin-top: 4px; box-shadow: 0 0 8px #00ff7a;"></div>
              <div>
                <p style="margin: 0; font-weight: 600; font-size: var(--fs-sm);">Attendee checked-in for 10+ sessions</p>
                <p style="margin: 2px 0 0 0; font-size: var(--fs-xs); color: var(--text-muted);">Earned during Web3 Innovation Summit</p>
              </div>
            </div>
            <div style="display: flex; gap: var(--space-4); background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--border-primary);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #00ff7a; margin-top: 4px; box-shadow: 0 0 8px #00ff7a;"></div>
              <div>
                <p style="margin: 0; font-weight: 600; font-size: var(--fs-sm);">Perfect session attendance badge</p>
                <p style="margin: 2px 0 0 0; font-size: var(--fs-xs); color: var(--text-muted);">Earned during Global AI Summit</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Payments' || view === 'Invoices') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Invoices & Payments</h3>
            <button class="btn btn-primary btn-sm">Download All</button>
          </div>
          
          <!-- Summary Spend -->
          <div style="background: linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 230, 230, 0.05)); padding: var(--space-4); border-radius: var(--radius-xl); border: 1px solid var(--border-primary); margin-bottom: var(--space-6);">
            <h5 style="margin: 0 0 4px 0; color: var(--primary-400); font-weight: bold; font-size: var(--fs-xs);">Total Paid Transactions</h5>
            <div style="font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff;">$448.00 USD</div>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: var(--text-muted);">Verified through Stackly Billing System</p>
          </div>

          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Invoice ID</th>
                  <th style="padding: var(--space-3) var(--space-4);">Event / Vendor</th>
                  <th style="padding: var(--space-3) var(--space-4);">Billing Date</th>
                  <th style="padding: var(--space-3) var(--space-4);">Amount</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                  <th style="padding: var(--space-3) var(--space-4); text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">#INV-2026-084</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Tech Innovation Summit 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jul 02, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">$299.00</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Paid</span></td>
                  <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Receipt</button></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">#INV-2026-042</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Business Expo 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jun 15, 2026</td>
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">$149.00</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Paid</span></td>
                  <td style="padding: var(--space-4); text-align: right;"><button class="btn btn-ghost btn-sm" style="color: var(--primary-400);">Receipt</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Venues') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Venue Management</h3>
            <button class="btn btn-primary btn-sm">+ Add Venue</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-6);">
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl);">
              <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: #fff;">Moscone Center</h4>
              <p style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-sm); color: var(--text-secondary);">747 Howard St, San Francisco, CA 94103</p>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between;">
                <span>Capacity: 50,000</span>
                <span style="color: var(--success-400);">Active Contracts</span>
              </div>
            </div>
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl);">
              <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: #fff;">Javits Center</h4>
              <p style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-sm); color: var(--text-secondary);">429 11th Ave, New York, NY 10001</p>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between;">
                <span>Capacity: 40,000</span>
                <span style="color: var(--success-400);">Active Contracts</span>
              </div>
            </div>
          </div>

          <!-- Room capacities table -->
          <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Rooms & Layouts Config</h4>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 500px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Room / Hall Name</th>
                  <th style="padding: var(--space-3) var(--space-4);">Venue</th>
                  <th style="padding: var(--space-3) var(--space-4);">Seating Capacity</th>
                  <th style="padding: var(--space-3) var(--space-4);">AV Setup</th>
                  <th style="padding: var(--space-3) var(--space-4);">Stage</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">Main Hall A</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Moscone Center</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">10,000 seats</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Dual Projectors & Line Array</td>
                  <td style="padding: var(--space-4); color: var(--success-400);">Yes</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: #fff;">Grand Room B</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Javits Center</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">5,000 seats</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Ultra-Wide LED Wall & Surround Sound</td>
                  <td style="padding: var(--space-4); color: var(--success-400);">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Bookmarked') {
      html = `
        <div class="card card-glass p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: 10px;">
            <h3 style="margin: 0; font-family: var(--font-display);">Your Saved & Bookmarked Items</h3>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-primary btn-sm" style="background: var(--gradient-primary); padding: 4px 10px; font-size: 11px;">All (5)</button>
              <button class="btn btn-outline btn-sm" style="padding: 4px 10px; font-size: 11px; border-color: rgba(255,255,255,0.15);">Sessions (2)</button>
              <button class="btn btn-outline btn-sm" style="padding: 4px 10px; font-size: 11px; border-color: rgba(255,255,255,0.15);">Speakers (2)</button>
              <button class="btn btn-outline btn-sm" style="padding: 4px 10px; font-size: 11px; border-color: rgba(255,255,255,0.15);">Exhibitors (1)</button>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
            <!-- Bookmarked Session 1 -->
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-accent mb-3" style="display: inline-block; background: rgba(255, 0, 160, 0.15); color: var(--accent-400); border: 1px solid rgba(255, 0, 160, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Session</span>
                <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: #fff;">Scaling AI Agent Architectures</h4>
                <p style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-sm); color: var(--text-secondary);">Speaker: Marcus Johnson | Date: Aug 16, 2:00 PM</p>
              </div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
                <span>Room A | Moscone</span>
                <button class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: var(--fs-xs);">Attend</button>
              </div>
            </div>

            <!-- Bookmarked Session 2 -->
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-accent mb-3" style="display: inline-block; background: rgba(255, 0, 160, 0.15); color: var(--accent-400); border: 1px solid rgba(255, 0, 160, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Session</span>
                <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: #fff;">Workshop: Hands-on Web3 Scale & UX</h4>
                <p style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-sm); color: var(--text-secondary);">Speaker: Sophia Martinez | Date: Aug 17, 10:30 AM</p>
              </div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
                <span>Room B | Javits</span>
                <button class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: var(--fs-xs);">Attend</button>
              </div>
            </div>

            <!-- Bookmarked Speaker 1 -->
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-primary mb-3" style="display: inline-block; background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Speaker</span>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <img src="${basePath}assets/pexels_photo_774909.webp" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" alt="Dr. Sarah" />
                  <div>
                    <h4 style="margin: 0; font-weight: var(--fw-bold); color: #fff;">Dr. Sarah Chen</h4>
                    <p style="margin: 0; font-size: 11px; color: var(--text-muted);">Google DeepMind</p>
                  </div>
                </div>
              </div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
                <span>1 Bookmarked Talk</span>
                <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: var(--fs-xs); border-color: rgba(255,255,255,0.15);">Profile</button>
              </div>
            </div>

            <!-- Bookmarked Speaker 2 -->
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-primary mb-3" style="display: inline-block; background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Speaker</span>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <img src="${basePath}assets/pexels_photo_2379004.webp" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" alt="Marcus" />
                  <div>
                    <h4 style="margin: 0; font-weight: var(--fw-bold); color: #fff;">Marcus Johnson</h4>
                    <p style="margin: 0; font-size: 11px; color: var(--text-muted);">CEO, TechVentures</p>
                  </div>
                </div>
              </div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
                <span>2 Bookmarked Talks</span>
                <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: var(--fs-xs); border-color: rgba(255,255,255,0.15);">Profile</button>
              </div>
            </div>

            <!-- Bookmarked Exhibitor -->
            <div class="card p-5" style="border: 1px solid var(--border-primary); background: var(--bg-secondary); border-radius: var(--radius-xl); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-success mb-3" style="display: inline-block; background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs);">Exhibitor</span>
                <h4 style="margin: 0 0 var(--space-2) 0; font-weight: var(--fw-bold); color: #fff;">OpenAI Inc.</h4>
                <p style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-sm); color: var(--text-secondary);">Demoing multimodal search and agent systems.</p>
              </div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); border-top: 1px solid var(--border-primary); padding-top: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
                <span>Booth #A-102 (Hall A)</span>
                <button class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: var(--fs-xs);">Visit Booth</button>
              </div>
            </div>
          </div>

          <!-- Bottom Part: Agenda timeline preview and Saved brochures downloads -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); flex-wrap: wrap;">
            <!-- Saved Schedule Agenda -->
            <div class="card p-5" style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-primary); border-radius: var(--radius-xl);">
              <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Your Saved Agenda Schedule</h4>
              <div style="display: flex; flex-direction: column; gap: var(--space-4); border-left: 2px solid rgba(255,255,255,0.08); padding-left: var(--space-4); margin-left: 8px;">
                <div style="position: relative;">
                  <div style="position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary-500); box-shadow: 0 0 8px var(--primary-500);"></div>
                  <span style="font-size: 10px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Day 1 - Aug 16, 2:00 PM</span>
                  <p style="margin: 2px 0 0 0; font-size: var(--fs-sm); font-weight: 600; color: #fff;">Scaling AI Agent Architectures</p>
                  <p style="margin: 0; font-size: 11px; color: var(--text-secondary);">Room A (Moscone)</p>
                </div>
                <div style="position: relative;">
                  <div style="position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-500); box-shadow: 0 0 8px var(--accent-500);"></div>
                  <span style="font-size: 10px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Day 2 - Aug 17, 10:30 AM</span>
                  <p style="margin: 2px 0 0 0; font-size: var(--fs-sm); font-weight: 600; color: #fff;">Workshop: Hands-on Web3 Scale & UX</p>
                  <p style="margin: 0; font-size: 11px; color: var(--text-secondary);">Room B (Javits)</p>
                </div>
              </div>
            </div>

            <!-- Saved Brochures & Media Downloads -->
            <div class="card p-5" style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-primary); border-radius: var(--radius-xl);">
              <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Saved Resources & Slides</h4>
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
                  <div>
                    <span style="font-size: var(--fs-sm); font-weight: 600; color: #fff; display: block;">OpenAI Multimodal SDK.pdf</span>
                    <span style="font-size: 10px; color: var(--text-muted);">14.2 MB | PDF Brochure</span>
                  </div>
                  <button class="btn btn-ghost btn-sm" style="color: var(--primary-400); padding: 4px 8px; font-size: 11px;">Download</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
                  <div>
                    <span style="font-size: var(--fs-sm); font-weight: 600; color: #fff; display: block;">Tech Summit Keynote Slides.pdf</span>
                    <span style="font-size: 10px; color: var(--text-muted);">8.5 MB | Presentation Slides</span>
                  </div>
                  <button class="btn btn-ghost btn-sm" style="color: var(--primary-400); padding: 4px 8px; font-size: 11px;">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Schedule') {
      html = `
        <div class="card card-glass p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: 10px;">
            <h3 style="margin: 0; font-family: var(--font-display);">Event Schedule Calendar</h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" style="background: var(--gradient-primary);">Day 1</button>
              <button class="btn btn-outline btn-sm">Day 2</button>
              <button class="btn btn-outline btn-sm">Day 3</button>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <!-- Session 1 -->
            <div class="card p-4" style="background: var(--bg-secondary); border-left: 4px solid var(--primary-500); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
              <div>
                <span class="badge badge-primary" style="font-size: var(--fs-xs); margin-bottom: var(--space-2); display: inline-block;">09:00 AM - 10:30 AM</span>
                <h4 style="margin: 0 0 var(--space-1) 0; color: #fff;">Keynote: Scaling AI Agent Architectures</h4>
                <p style="margin: 0; font-size: var(--fs-sm); color: var(--text-secondary);">Speaker: Dr. Sarah Chen | Venue: Main Hall A</p>
              </div>
              <button class="btn btn-outline btn-sm" style="padding: 4px 12px; font-size: var(--fs-xs);">Remove Session</button>
            </div>

            <!-- Session 2 -->
            <div class="card p-4" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-500); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
              <div>
                <span class="badge badge-accent" style="font-size: var(--fs-xs); margin-bottom: var(--space-2); display: inline-block; background: rgba(255, 0, 160, 0.15); color: var(--accent-400); border: 1px solid rgba(255, 0, 160, 0.3);">11:00 AM - 12:30 PM</span>
                <h4 style="margin: 0 0 var(--space-1) 0; color: #fff;">Workshop: Hands-on Web3 Scale & UX</h4>
                <p style="margin: 0; font-size: var(--fs-sm); color: var(--text-secondary);">Speaker: Sophia Martinez | Venue: Hall B</p>
              </div>
              <button class="btn btn-primary btn-sm" style="padding: 4px 12px; font-size: var(--fs-xs);">Add to Calendar</button>
            </div>

            <!-- Session 3 -->
            <div class="card p-4" style="background: var(--bg-secondary); border-left: 4px solid var(--success-500); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
              <div>
                <span class="badge badge-success" style="font-size: var(--fs-xs); margin-bottom: var(--space-2); display: inline-block; background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3);">02:00 PM - 03:30 PM</span>
                <h4 style="margin: 0 0 var(--space-1) 0; color: #fff;">Panel: Quantum Cryptography in Practice</h4>
                <p style="margin: 0; font-size: var(--fs-sm); color: var(--text-secondary);">Moderator: Prof. Alan Vance | Venue: Hall C</p>
              </div>
              <button class="btn btn-outline btn-sm" style="padding: 4px 12px; font-size: var(--fs-xs);">Remove Session</button>
            </div>
          </div>
        </div>
      `;
    } else if (view === 'Feedback') {
      html = `
        <div class="card card-glass p-6">
          <h3 style="margin: 0 0 var(--space-6) 0; font-family: var(--font-display);">Event Feedback & Surveys</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-bottom: var(--space-6); flex-wrap: wrap;">
            <!-- Left Side: Live Feed -->
            <div>
              <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Attendee Feed</h4>
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div class="card p-3" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 600; font-size: var(--fs-sm); color: #fff;">Michael Chang</span>
                    <span style="color: #ffc107;">★★★★★</span>
                  </div>
                  <p style="margin: 0; font-size: var(--fs-xs); color: var(--text-secondary);">"The AI Agent keynote was mindblowing! Incredibly detailed architecture slides."</p>
                </div>
                <div class="card p-3" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 600; font-size: var(--fs-sm); color: #fff;">Amara Okafor</span>
                    <span style="color: #ffc107;">★★★★☆</span>
                  </div>
                  <p style="margin: 0; font-size: var(--fs-xs); color: var(--text-secondary);">"Great networking events, food was fantastic. Wifi in Hall B was a bit spotty."</p>
                </div>
              </div>
            </div>

            <!-- Right Side: Submit Survey -->
            <div class="card p-4" style="background: var(--bg-secondary); border: 1px solid var(--border-primary);">
              <h4 style="margin: 0 0 var(--space-4) 0; font-family: var(--font-display);">Submit Event Feedback</h4>
              <form onsubmit="event.preventDefault(); alert('Thank you for your feedback!'); this.reset();">
                <div style="margin-bottom: var(--space-3);">
                  <label style="display: block; margin-bottom: 4px; font-size: var(--fs-sm); font-weight: 500;">Select Session</label>
                  <select style="width: 100%; padding: 8px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-primary); color: #fff; border-radius: var(--radius-md);">
                    <option>Keynote: Scaling AI Agent Architectures</option>
                    <option>Workshop: Hands-on Web3 Scale & UX</option>
                    <option>Panel: Quantum Cryptography in Practice</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-3);">
                  <label style="display: block; margin-bottom: 4px; font-size: var(--fs-sm); font-weight: 500;">Rating</label>
                  <select style="width: 100%; padding: 8px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-primary); color: #fff; border-radius: var(--radius-md);">
                    <option>5 Stars - Excellent</option>
                    <option>4 Stars - Good</option>
                    <option>3 Stars - Average</option>
                    <option>2 Stars - Poor</option>
                    <option>1 Star - Very Bad</option>
                  </select>
                </div>
                <div style="margin-bottom: var(--space-4);">
                  <label style="display: block; margin-bottom: 4px; font-size: var(--fs-sm); font-weight: 500;">Your Comments</label>
                  <textarea rows="3" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-primary); color: #fff; border-radius: var(--radius-md); font-family: inherit;" placeholder="Tell us what you liked or how we can improve..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-sm" style="width: 100%;">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      `;
    } else {
      // Dynamic General Mockup
      html = `
        <div class="card card-glass p-8 text-center">
          <h3 class="mb-2" style="font-family: var(--font-display);">${view} Module</h3>
          <p class="text-secondary mb-6">Database module for ${view.toLowerCase()} has been mounted. Ready for API endpoint binding.</p>
          <div style="display: inline-flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="location.reload()">Reload View</button>
            <button class="btn btn-primary btn-sm">New Entry</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // Loading Screen
  initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      const isSubDir = window.location.pathname.includes('/organizer/') ||
        window.location.pathname.includes('/attendee/') ||
        window.location.pathname.includes('/admin/');
      const logoPath = isSubDir ? '../assets/logo-stackly.webp' : 'assets/logo-stackly.webp';

      loadingScreen.innerHTML = `
        <div class="loader-backdrop" style="position: absolute; inset: 0; background: #07070a; overflow: hidden; z-index: -1;"></div>
        
        <!-- Animated Spotlights / Event Lights representing conference & exhibition stage -->
        <div class="loader-spotlight spotlight-1" style="position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, transparent 70%); filter: blur(50px); animation: floatLight1 8s infinite ease-in-out; z-index: -1;"></div>
        <div class="loader-spotlight spotlight-2" style="position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 230, 230, 0.2) 0%, transparent 70%); filter: blur(60px); animation: floatLight2 12s infinite ease-in-out; z-index: -1;"></div>
        <div class="loader-spotlight spotlight-3" style="position: absolute; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 0, 160, 0.15) 0%, transparent 70%); filter: blur(50px); animation: floatLight3 10s infinite ease-in-out; z-index: -1;"></div>
        
        <!-- Grid representing event floor / tech layouts -->
        <div class="loader-grid-pattern" style="position: absolute; inset: 0; background: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 50px 50px; z-index: -1;"></div>
        
        <div class="loader-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-6); text-align: center; z-index: 10;">
          <div class="loader-logo-wrapper" style="position: relative; display: flex; align-items: center; justify-content: center; width: 90px; height: 90px; border-radius: 50%; border: 2px solid rgba(0, 102, 255, 0.4); background: rgba(0, 102, 255, 0.05); box-shadow: 0 0 25px rgba(0, 102, 255, 0.2); animation: loaderPulse 2s infinite ease-in-out;">
            <img src="${logoPath}" alt="Stackly Logo" style="height: 46px; width: auto; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%); border-radius: 8px;">
            <div class="loader-ring" style="position: absolute; inset: -6px; border: 2px solid transparent; border-top-color: var(--secondary-500); border-radius: 50%; animation: spin 1.5s linear infinite;"></div>
          </div>
          
          <div>
            <h3 style="font-family: var(--font-display); font-size: var(--fs-xl); font-weight: var(--fw-bold); color: #fff; margin: 0 0 8px 0; letter-spacing: 1px; text-transform: uppercase;">Stackly</h3>
            <p style="font-size: var(--fs-xs); color: var(--text-secondary); margin: 0 0 16px 0; font-weight: var(--fw-medium);">Experience the future of events...</p>
            
            <div class="loader-progress-bar" style="width: 180px; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin: 0 auto;">
              <div class="loader-progress-fill" style="width: 0%; height: 100%; background: var(--gradient-primary); border-radius: 2px; animation: loadFill 3s linear forwards;"></div>
            </div>
          </div>
        </div>
      `;

      if (!document.getElementById('loader-styles')) {
        const style = document.createElement('style');
        style.id = 'loader-styles';
        style.innerHTML = `
          @keyframes loaderPulse {
            0% { transform: scale(1); box-shadow: 0 0 35px rgba(0, 102, 255, 0.25); border-color: rgba(0, 102, 255, 0.4); }
            50% { transform: scale(1.08); box-shadow: 0 0 55px rgba(0, 230, 230, 0.45); border-color: rgba(0, 230, 230, 0.8); }
            100% { transform: scale(1); box-shadow: 0 0 35px rgba(0, 102, 255, 0.25); border-color: rgba(0, 102, 255, 0.4); }
          }
          @keyframes floatLight1 {
            0% { top: -10%; left: 10%; transform: scale(1); }
            50% { top: 40%; left: 60%; transform: scale(1.3); }
            100% { top: -10%; left: 10%; transform: scale(1); }
          }
          @keyframes floatLight2 {
            0% { bottom: -10%; right: 10%; transform: scale(1.2); }
            50% { bottom: 50%; right: 50%; transform: scale(0.9); }
            100% { bottom: -10%; right: 10%; transform: scale(1.2); }
          }
          @keyframes floatLight3 {
            0% { top: 50%; left: 50%; transform: scale(0.8); }
            50% { top: 10%; left: -10%; transform: scale(1.2); }
            100% { top: 50%; left: 50%; transform: scale(0.8); }
          }
          @keyframes loadFill {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .loading-screen {
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Prevent page-level scripts from hiding loader immediately
      const originalAdd = loadingScreen.classList.add;
      loadingScreen.classList.add = function (className) {
        if (className === 'hidden') return;
        originalAdd.apply(this, arguments);
      };

      // Slide or fade out after 3 seconds
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        setTimeout(() => {
          loadingScreen.remove();
        }, 800);
      }, 3000);
    }
  },

  // Theme Management
  initTheme() {
    const savedTheme = Utils.storage.get('theme', 'dark');
    this.setTheme(savedTheme);

    const themeToggle = document.querySelector('.header-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  },

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    Utils.storage.set('theme', theme);
  },

  toggleTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  // Header
  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Dynamically inject Stackly logo brand img and styled text
    const headerLogo = document.querySelector('.header-logo');
    if (headerLogo) {
      const isSubDir = window.location.pathname.includes('/organizer/') ||
        window.location.pathname.includes('/attendee/') ||
        window.location.pathname.includes('/admin/');
      const logoPath = isSubDir ? '../assets/logo-stackly.webp' : 'assets/logo-stackly.webp';

      headerLogo.innerHTML = `
        <img src="${logoPath}" alt="Stackly Logo" class="header-logo-img" style="height: 40px; width: auto; border-radius: 6px; margin-right: 0; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%);">
      `;
    }

    let lastScroll = 0;
    const handleScroll = Utils.throttle(() => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show on scroll direction (optional)
      if (currentScroll > lastScroll && currentScroll > 400) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  // Footer
  initFooter() {
    const footerLogo = document.querySelector('.footer-logo');
    const isSubDir = window.location.pathname.includes('/organizer/') ||
      window.location.pathname.includes('/attendee/') ||
      window.location.pathname.includes('/admin/');

    if (footerLogo) {
      const logoPath = isSubDir ? '../assets/logo-stackly.webp' : 'assets/logo-stackly.webp';
      footerLogo.innerHTML = `
        <a href="${isSubDir ? '../' : ''}index.html" style="display: flex; align-items: center; justify-content: flex-start; gap: 0;">
          <img src="${logoPath}" alt="Stackly Logo" class="footer-logo-img" style="height: 44px; width: auto; border-radius: 6px; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%);">
        </a>
      `;
    }

    const footerSocial = document.querySelector('.footer-social');
    if (footerSocial) {
      const row = footerSocial.parentElement;
      if (row && row.classList.contains('footer-social-subscribe-row')) {
        const brand = row.parentElement;
        brand.insertBefore(footerSocial, row);
        row.remove();
        footerSocial.style.cssText = "";
      }
    }

    const footerContact = document.querySelector('.footer-contact');
    if (footerContact) {
      footerContact.innerHTML = `
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Chinna Tirupathi, Salem, TN – 636008</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>info@thestackly.com</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>+91 7010792745</span>
        </div>
      `;

      const contactCol = footerContact.parentElement;
      if (contactCol && !contactCol.querySelector('.footer-subscribe-form')) {
        const subscribeForm = document.createElement('form');
        subscribeForm.className = 'footer-subscribe-form';
        subscribeForm.style.cssText = "display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1.5px solid var(--primary-500); border-radius: var(--radius-lg); padding: 4px; width: 100%; max-width: 260px; box-shadow: 0 0 8px rgba(0, 102, 255, 0.15); box-sizing: border-box; margin-top: var(--space-5);";
        subscribeForm.innerHTML = `
          <input type="email" placeholder="Subscribe..." required style="background: transparent; border: none; outline: none; padding: 6px 12px; color: #fff; font-size: var(--fs-xs); flex: 1; min-width: 0; box-sizing: border-box;">
          <button type="submit" style="background: var(--gradient-primary); border: none; outline: none; color: #fff; border-radius: var(--radius-md); padding: 6px 14px; font-size: var(--fs-xs); font-weight: var(--fw-bold); cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;">Go</button>
        `;

        subscribeForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const btn = subscribeForm.querySelector('button');
          const input = subscribeForm.querySelector('input');
          const originalText = btn.innerText;

          btn.innerText = 'Subscribed!';
          btn.style.background = 'var(--gradient-success)';
          input.value = '';

          setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--gradient-primary)';
          }, 3000);
        });

        contactCol.appendChild(subscribeForm);
      }
    }
  },

  // Mobile Menu
  initMobileMenu() {
    const toggle = document.querySelector('.header-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!toggle || !mobileNav) return;

    // Dynamically inject sidebar-overlay if not present in DOM
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    // Build the premium structure inside the mobile-nav drawer
    const isSubDir = window.location.pathname.includes('/organizer/') ||
      window.location.pathname.includes('/attendee/') ||
      window.location.pathname.includes('/admin/');
    const basePath = isSubDir ? '../' : '';

    // Reconstruct the mobile navigation contents to match screenshot model exactly!
    mobileNav.innerHTML = `
      <div class="mobile-nav-header" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--border-primary);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${basePath}assets/logo-stackly.webp" alt="Stackly Logo" style="height: 36px; width: auto; border-radius: 4px; filter: brightness(0) saturate(100%) invert(32%) sepia(86%) saturate(2987%) hue-rotate(210deg) brightness(98%) contrast(107%);">
          <span class="mobile-nav-brand" style="font-family: var(--font-display); font-weight: var(--fw-bold); font-size: var(--fs-lg); color: #00e6e6; letter-spacing: 0.5px;"></span>
        </div>
        <button class="mobile-nav-close-btn" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; font-size: 24px; line-height: 1; padding: 4px; display: flex; align-items: center; justify-content: center; outline: none;">&times;</button>
      </div>

      <div class="mobile-nav-body" style="padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-5); overflow-y: auto; height: calc(100% - 65px); box-sizing: border-box;">
        <!-- Search Box -->
        <div class="mobile-search-box">
          <h4 style="margin: 0 0 8px 0; font-family: var(--font-display); font-size: var(--fs-sm); font-weight: var(--fw-bold); color: #fff;">Search Now!</h4>
          <div style="position: relative; width: 100%;">
            <input type="text" placeholder="Search here..." style="width: 100%; padding: 10px 40px 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); color: #fff; font-size: var(--fs-sm); box-sizing: border-box; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary-500)'" onblur="this.style.borderColor='var(--border-primary)'">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; right: 12px; top: 11px; color: var(--text-muted); pointer-events: none;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <!-- Links List -->
        <div class="mobile-links-list" style="display: flex; flex-direction: column; gap: 6px;">
          <!-- Home -->
          <a href="${basePath}index.html" class="mobile-nav-link" style="display: flex; align-items: center; color: var(--text-secondary); padding: var(--space-3) 0;">
            <span>Home</span>
          </a>
          
          <!-- Collapsible Events Group -->
          <div class="mobile-nav-dropdown">
            <button class="mobile-nav-link mobile-nav-dropdown-toggle" style="width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between; background: transparent; border: none; cursor: pointer; padding: var(--space-3) 0; color: var(--text-secondary); font-size: var(--fs-lg); font-weight: var(--fw-medium); outline: none;">
              <span>Events</span>
              <svg class="dropdown-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease;">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="mobile-nav-dropdown-menu" style="display: none; padding-left: var(--space-4); margin-top: 4px; border-left: 2px solid var(--border-primary);">
              <a href="${basePath}conferences.html" class="mobile-nav-link" style="font-size: var(--fs-md); padding: 8px 0; color: var(--text-secondary);">Conferences</a>
              <a href="${basePath}exhibitions.html" class="mobile-nav-link" style="font-size: var(--fs-md); padding: 8px 0; color: var(--text-secondary);">Exhibitions</a>
              <a href="${basePath}speakers.html" class="mobile-nav-link" style="font-size: var(--fs-md); padding: 8px 0; color: var(--text-secondary);">Speakers</a>
            </div>
          </div>

          <a href="${basePath}about.html" class="mobile-nav-link" style="color: var(--text-secondary); padding: var(--space-3) 0;">About Us</a>
          <a href="${basePath}services.html" class="mobile-nav-link" style="color: var(--text-secondary); padding: var(--space-3) 0;">Services</a>
          <a href="${basePath}pricing.html" class="mobile-nav-link" style="color: var(--text-secondary); padding: var(--space-3) 0;">Pricing</a>
          <a href="${basePath}blog.html" class="mobile-nav-link" style="color: var(--text-secondary); padding: var(--space-3) 0;">Blog</a>
          <a href="${basePath}contact.html" class="mobile-nav-link" style="color: var(--text-secondary); padding: var(--space-3) 0;">Contact</a>
        </div>

        <!-- Auth Buttons -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: var(--space-2);">
          <a href="${basePath}login.html" class="btn btn-outline" style="border-radius: var(--radius-full) !important; text-align: center; justify-content: center; padding: 10px !important; border: 1px solid rgba(255,255,255,0.2) !important; color: #fff !important; background: transparent !important; font-weight: var(--fw-semibold);">Login</a>
          <a href="${basePath}register.html" class="btn btn-primary" style="border-radius: var(--radius-full) !important; text-align: center; justify-content: center; padding: 10px !important; background: var(--gradient-primary) !important; color: #fff !important; font-weight: var(--fw-semibold); border: none !important;">Sign Up</a>
        </div>

        <!-- Divider -->
        <div style="height: 1px; background: var(--border-primary); margin: var(--space-2) 0;"></div>

        <!-- Contact Info -->
        <div class="mobile-contact-info" style="margin-bottom: var(--space-6);">
          <h4 style="margin: 0 0 12px 0; font-family: var(--font-display); font-size: var(--fs-md); font-weight: var(--fw-bold); color: #fff; border-bottom: 1px solid var(--border-primary); padding-bottom: 8px;">Contact Info</h4>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Phone</div>
          <div style="font-size: var(--fs-sm); color: #fff; font-weight: var(--fw-bold); margin-bottom: 10px;">+91 7010792745</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Email</div>
          <div style="font-size: var(--fs-sm); color: #fff; font-weight: var(--fw-bold); margin-bottom: 10px;">info@thestackly.com</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; font-weight: var(--fw-semibold); letter-spacing: 0.5px;">Address</div>
          <div style="font-size: var(--fs-sm); color: #fff; font-weight: var(--fw-bold);">Salem, Tamil Nadu</div>
        </div>
      </div>
    `;

    // Hook events toggler click listener
    const toggleBtn = mobileNav.querySelector('.mobile-nav-dropdown-toggle');
    const menuContainer = mobileNav.querySelector('.mobile-nav-dropdown-menu');
    if (toggleBtn && menuContainer) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = menuContainer.style.display === 'none';
        menuContainer.style.display = isCollapsed ? 'block' : 'none';
        const chevron = toggleBtn.querySelector('.dropdown-chevron');
        if (chevron) {
          chevron.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    // Set active states dynamically based on current page URL
    const currentPath = window.location.pathname;
    const links = mobileNav.querySelectorAll('.mobile-links-list a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isHomePath = currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html');

      let isMatch = false;
      if (href) {
        if (href.includes('index.html')) {
          isMatch = isHomePath;
        } else {
          isMatch = !isHomePath && currentPath.includes(href);
        }
      }

      if (isMatch) {
        link.style.color = '#00e6e6';
        link.style.fontWeight = 'var(--fw-semibold)';

        if (link.closest('.mobile-nav-dropdown-menu')) {
          menuContainer.style.display = 'block';
          if (toggleBtn) {
            toggleBtn.style.color = '#00e6e6';
            const chevron = toggleBtn.querySelector('.dropdown-chevron');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          }
        }
      } else {
        link.style.color = 'var(--text-secondary)';
        link.style.fontWeight = 'normal';
      }
    });

    // Close button click listener
    const closeBtn = mobileNav.querySelector('.mobile-nav-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    toggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    overlay.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Auto-close mobile menu and sidebar overlays when resizing window to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 600) {
        this.closeMobileMenu();
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebar) {
          sidebar.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        }
        if (sidebarOverlay) {
          sidebarOverlay.classList.remove('active');
        }
      }
    });
  },

  toggleMobileMenu() {
    this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
    const mobileNav = document.querySelector('.mobile-nav');
    const toggle = document.querySelector('.header-menu-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (this.state.mobileMenuOpen) {
      mobileNav?.classList.add('active');
      toggle?.classList.add('active');
      overlay?.classList.add('active');
      document.body.classList.add('mobile-menu-active');
    } else {
      this.closeMobileMenu();
    }
  },

  closeMobileMenu() {
    this.state.mobileMenuOpen = false;
    document.querySelector('.mobile-nav')?.classList.remove('active');
    document.querySelector('.header-menu-toggle')?.classList.remove('active');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
    document.body.classList.remove('mobile-menu-active');
  },

  // Scroll to Top Button
  initScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    const handleScroll = Utils.throttle(() => {
      if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // Scroll Animations
  initAnimations() {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  },

  // Form Validation
  initForms() {
    // Add real-time input event filter for names and phone/mobile fields
    document.addEventListener('input', (e) => {
      const target = e.target;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

      const id = (target.id || '').toLowerCase();
      const name = (target.name || '').toLowerCase();
      const placeholder = (target.placeholder || '').toLowerCase();
      const type = (target.type || '').toLowerCase();

      // Check if it is a name field
      const isNameField = id.includes('firstname') ||
        id.includes('lastname') ||
        name.includes('firstname') ||
        name.includes('lastname') ||
        placeholder.includes('first name') ||
        placeholder.includes('last name') ||
        id === 'name' ||
        name === 'name' ||
        placeholder === 'name' ||
        placeholder.includes('full name') ||
        placeholder.includes('your name');

      if (isNameField) {
        // Strip numbers from input value
        const cleaned = target.value.replace(/[0-9]/g, '');
        if (target.value !== cleaned) {
          target.value = cleaned;
        }
      }

      // Check if it is a phone/mobile field
      const isPhoneField = type === 'tel' ||
        id.includes('phone') ||
        id.includes('mobile') ||
        id.includes('tele') ||
        name.includes('phone') ||
        name.includes('mobile') ||
        name.includes('tele') ||
        placeholder.includes('phone') ||
        placeholder.includes('mobile') ||
        placeholder.includes('contact number');

      if (isPhoneField) {
        // Strip alphabetic letters (A-Z, a-z) from input value
        const cleaned = target.value.replace(/[a-zA-Z]/g, '');
        if (target.value !== cleaned) {
          target.value = cleaned;
        }
      }
    });

    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateInput(input);
        });

        input.addEventListener('input', Utils.debounce(() => {
          if (input.classList.contains('form-input-error')) {
            this.validateInput(input);
          }
        }, 300));
      });
    });
  },

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  },

  validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Name field validation (cannot contain numbers)
    const isNameField = id.includes('firstname') ||
      id.includes('lastname') ||
      name.includes('firstname') ||
      name.includes('lastname') ||
      placeholder.includes('first name') ||
      placeholder.includes('last name') ||
      id === 'name' ||
      name === 'name' ||
      placeholder === 'name' ||
      placeholder.includes('full name') ||
      placeholder.includes('your name');

    if (isNameField && value && /[0-9]/.test(value)) {
      isValid = false;
      errorMessage = 'Numbers are not allowed in name fields';
    }

    // Phone field validation (cannot contain letters)
    const isPhoneField = type === 'tel' ||
      id.includes('phone') ||
      id.includes('mobile') ||
      id.includes('tele') ||
      name.includes('phone') ||
      name.includes('mobile') ||
      name.includes('tele') ||
      placeholder.includes('phone') ||
      placeholder.includes('mobile') ||
      placeholder.includes('contact number');

    if (isPhoneField && value && /[a-zA-Z]/.test(value)) {
      isValid = false;
      errorMessage = 'Alphabets are not allowed in phone fields';
    }

    // Email validation
    if (type === 'email' && value && !Utils.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    // Phone validation
    if (type === 'tel' && value && !Utils.isValidPhone(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }

    // Min length
    const minLength = input.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      isValid = false;
      errorMessage = `Minimum ${minLength} characters required`;
    }

    // Max length
    const maxLength = input.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
      isValid = false;
      errorMessage = `Maximum ${maxLength} characters allowed`;
    }

    // Password match
    const matchId = input.getAttribute('data-match');
    if (matchId) {
      const matchInput = document.getElementById(matchId);
      if (matchInput && value !== matchInput.value) {
        isValid = false;
        errorMessage = 'Passwords do not match';
      }
    }

    // Update UI
    const errorEl = input.parentElement.querySelector('.form-error');
    if (isValid) {
      input.classList.remove('form-input-error');
      input.classList.add('form-input-success');
      if (errorEl) errorEl.remove();
    } else {
      input.classList.add('form-input-error');
      input.classList.remove('form-input-success');
      if (!errorEl) {
        const error = document.createElement('span');
        error.className = 'form-error';
        error.textContent = errorMessage;
        input.parentElement.appendChild(error);
      } else {
        errorEl.textContent = errorMessage;
      }
    }

    return isValid;
  },

  // Modals
  initModals() {
    // Open modal triggers
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modalOpen;
        this.openModal(modalId);
      });
    });

    // Close modal triggers
    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  openModal(modalId) {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.getElementById(modalId);

    if (backdrop && modal) {
      backdrop.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal() {
    document.querySelector('.modal-backdrop')?.classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  },

  // Tabs
  initTabs() {
    document.querySelectorAll('.tabs').forEach(tabsContainer => {
      const tabs = tabsContainer.querySelectorAll('.tab');
      const contents = tabsContainer.parentElement.querySelectorAll('.tab-content');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.dataset.tab;

          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          // Update content
          contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
              content.classList.add('active');
            }
          });
        });
      });
    });
  },

  // Accordions
  initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.accordion-body');
        const isActive = header.classList.contains('active');

        // Close all others in the same accordion
        const accordion = item.parentElement;
        accordion.querySelectorAll('.accordion-header').forEach(h => {
          h.classList.remove('active');
        });
        accordion.querySelectorAll('.accordion-body').forEach(b => {
          b.classList.remove('active');
          b.style.maxHeight = '0';
        });

        // Toggle current
        if (!isActive) {
          header.classList.add('active');
          body.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  },

  // Dropdowns
  initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = toggle.closest('.dropdown');

        // Close all other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });

        dropdown.classList.toggle('active');
      });
    });

    // Close on click outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
      });
    });
  },

  // Carousels/Sliders
  initCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      if (!track || slides.length === 0) return;

      let currentIndex = 0;
      const totalSlides = slides.length;
      const slidesToShow = parseInt(carousel.dataset.slidesToShow) || 1;

      const updateSlide = () => {
        const slideWidth = 100 / slidesToShow;
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

        // Update dots
        if (dotsContainer) {
          dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
          });
        }
      };

      const next = () => {
        currentIndex = (currentIndex + 1) % Math.ceil(totalSlides / slidesToShow);
        updateSlide();
      };

      const prev = () => {
        currentIndex = (currentIndex - 1 + Math.ceil(totalSlides / slidesToShow)) % Math.ceil(totalSlides / slidesToShow);
        updateSlide();
      };

      nextBtn?.addEventListener('click', next);
      prevBtn?.addEventListener('click', prev);

      // Auto-play
      if (carousel.dataset.autoplay) {
        setInterval(next, parseInt(carousel.dataset.autoplay));
      }
    });
  },

  // Tooltips
  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      el.classList.add('tooltip');
    });
  },

  // Animated Counters
  initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.textContent = Utils.formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  },

  // Countdown Timers
  initCountdowns() {
    document.querySelectorAll('[data-countdown]').forEach(element => {
      const targetDate = new Date(element.dataset.countdown).getTime();

      const update = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          element.innerHTML = 'Event Started';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = element.querySelector('[data-days]');
        const hoursEl = element.querySelector('[data-hours]');
        const minutesEl = element.querySelector('[data-minutes]');
        const secondsEl = element.querySelector('[data-seconds]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      update();
      setInterval(update, 1000);
    });
  },

  // Particle Animation
  initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${Utils.getRandomInt(-100, 100)}px`);
      particle.style.setProperty('--ty', `${Utils.getRandomInt(-200, -50)}px`);
      particle.style.setProperty('--r', `${Utils.getRandomInt(0, 360)}deg`);
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Utils.getRandomInt(5, 15)}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particle.style.width = `${Utils.getRandomInt(2, 6)}px`;
      particle.style.height = `${Utils.getRandomInt(2, 6)}px`;
      particle.style.background = `var(--${Utils.getRandomColor()}-500)`;
      container.appendChild(particle);
    }
  },

  // Ripple Effect
  initRippleEffects() {
    document.querySelectorAll('.btn-ripple').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  },

  // Lazy Loading Images
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => observer.observe(img));
  },

  // Intersection Observer for Animations
  initIntersectionObserver() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  },

  // Toast Notifications
  showToast(message, type = 'info', duration = 5000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' :
        type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
          type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' :
            '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Loading State
  showLoading(element) {
    element.classList.add('loading');
    element.dataset.originalContent = element.innerHTML;
    element.innerHTML = `
      <div class="spinner spinner-sm"></div>
      <span>Loading...</span>
    `;
    element.disabled = true;
  },

  hideLoading(element) {
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }
    element.classList.remove('loading');
    element.disabled = false;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
