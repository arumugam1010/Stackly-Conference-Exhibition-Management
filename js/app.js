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
        button.classList.contains('scroll-top') ||
        button.closest('.sidebar')) {
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
        <img src="${logoPath}" alt="Stackly Logo" class="sidebar-logo-img" style="height: 32px; width: auto; border-radius: 6px; margin-right: 0; filter: invert(1) hue-rotate(180deg) brightness(1.6);">
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
        headerLogo.style.cssText = "height: 28px; width: auto; display: none; margin-right: 8px; flex-shrink: 0; border-radius: 4px; cursor: pointer; filter: invert(1) hue-rotate(180deg) brightness(1.6);";

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

    if (view === 'Conferences' || view === 'My Events' || view === 'Registered Events') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">${view} Overview</h3>
            <button class="btn btn-primary btn-sm">+ Create New</button>
          </div>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Event Name</th>
                  <th style="padding: var(--space-3) var(--space-4);">Date</th>
                  <th style="padding: var(--space-3) var(--space-4);">Location</th>
                  <th style="padding: var(--space-3) var(--space-4);">Attendance</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Global Quantum Summit 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Nov 12-14, 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Boston, MA</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">1,240 Registered</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-primary" style="background: rgba(0, 102, 255, 0.15); color: var(--primary-400); border: 1px solid rgba(0, 102, 255, 0.3);">Upcoming</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Global AI Exhibition 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Dec 05-07, 2026</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Geneva, Switzerland</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">850 Exhibiting</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-success" style="background: rgba(0, 255, 122, 0.15); color: var(--success-400); border: 1px solid rgba(0, 255, 122, 0.3);">Active</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">Cybersecurity Pioneers 2027</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Jan 18-20, 2027</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">Tokyo, Japan</td>
                  <td style="padding: var(--space-4); color: var(--text-secondary);">2,100 Confirmed</td>
                  <td style="padding: var(--space-4);"><span class="badge badge-secondary" style="background: rgba(160, 160, 184, 0.15); color: var(--text-muted); border: 1px solid rgba(160, 160, 184, 0.3);">Planning</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (view === 'Exhibitions' || view === 'Booths' || view === 'Exhibitors') {
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">Exhibition Halls & Booth Layout</h3>
            <button class="btn btn-primary btn-sm">+ Assign Booth</button>
          </div>
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
          { name: 'Sarah Jenkins', detail: 'sarah.j@google.com', status: 'Registered' },
          { name: 'Michael Chang', detail: 'mchang@openai.com', status: 'Checked In' },
          { name: 'Amara Okafor', detail: 'amara@tech.io', status: 'Registered' }
        ],
        Speakers: [
          { name: 'Dr. Sarah Chen', detail: 'Google DeepMind', status: 'Confirmed' },
          { name: 'Marcus Johnson', detail: 'TechVentures CEO', status: 'Confirmed' },
          { name: 'Prof. Alan Vance', detail: 'MIT Quantum Lab', status: 'Pending' }
        ],
        Sponsors: [
          { name: 'Google Cloud', detail: 'Main Keynote Sponsor', status: 'Active' },
          { name: 'Meta Platforms', detail: 'Networking Lounge Sponsor', status: 'Active' },
          { name: 'Amazon AWS', detail: 'Hackathon Track Sponsor', status: 'Active' }
        ],
        Staff: [
          { name: 'Elena Rostova', detail: 'Event Director', status: 'On Site' },
          { name: 'Sophia Martinez', detail: 'Operations Lead', status: 'On Site' },
          { name: 'David Chen', detail: 'Finance Director', status: 'Remote' }
        ]
      };
      const list = items[view] || [];
      html = `
        <div class="card card-glass p-6">
          <div class="flex justify-between items-center mb-6" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
            <h3 style="margin: 0; font-family: var(--font-display);">${view} Directory</h3>
            <button class="btn btn-primary btn-sm">+ Add ${view.slice(0, -1)}</button>
          </div>
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-primary); color: var(--text-muted); font-size: var(--fs-sm);">
                  <th style="padding: var(--space-3) var(--space-4);">Name</th>
                  <th style="padding: var(--space-3) var(--space-4);">Detail / Company</th>
                  <th style="padding: var(--space-3) var(--space-4);">Status</th>
                  <th style="padding: var(--space-3) var(--space-4); text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(item => `
                  <tr style="border-bottom: 1px solid var(--border-secondary);">
                    <td style="padding: var(--space-4); font-weight: var(--fw-semibold); color: var(--text-primary);">${item.name}</td>
                    <td style="padding: var(--space-4); color: var(--text-secondary);">${item.detail}</td>
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
        <div class="card card-glass p-6" style="max-width: 600px; margin: 0 auto;">
          <h3 class="mb-4" style="margin-bottom: var(--space-4); font-family: var(--font-display);">Settings Configuration</h3>
          <form style="display: flex; flex-direction: column; gap: var(--space-4);" onsubmit="event.preventDefault(); alert('Settings Saved!');">
            <div class="form-group" style="margin-bottom: var(--space-3);">
              <label class="form-label" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: var(--fs-sm);">Display Name</label>
              <input type="text" class="form-input" style="width: 100%;" value="Demo User" />
            </div>
            <div class="form-group" style="margin-bottom: var(--space-3);">
              <label class="form-label" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: var(--fs-sm);">Notification Email</label>
              <input type="email" class="form-input" style="width: 100%;" value="user@nexusevents.com" />
            </div>
            <div style="margin-bottom: var(--space-4);">
              <label class="checkbox-animated" style="display: inline-flex; align-items: center; gap: 8px;">
                <input type="checkbox" checked />
                <span class="text-sm text-secondary">Enable live browser dashboard popups</span>
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </form>
        </div>
      `;
    } else if (view === 'My Tickets' || view === 'Tickets') {
      html = `
        <div class="card card-glass p-6">
          <h3 class="mb-4" style="font-family: var(--font-display);">Your Access Passes</h3>
          <div class="dashboard-ticket-card" style="border: 2px dashed var(--border-primary); border-radius: var(--radius-2xl); padding: var(--space-6); background: var(--bg-secondary); position: relative; max-width: 500px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-primary); padding-bottom: var(--space-4); margin-bottom: var(--space-4);">
              <h4 style="margin: 0; color: var(--primary-400);">Professional Pass</h4>
              <span style="font-weight: bold; color: var(--text-primary);">$299.00</span>
            </div>
            <p style="margin: 0 0 var(--space-2); font-weight: 600;">Global Quantum Summit 2026</p>
            <p style="margin: 0 0 var(--space-4); color: var(--text-muted); font-size: var(--fs-sm);">Attendee: Sarah Jenkins | Code: #QN-9824</p>
            <div style="background: white; padding: var(--space-3); border-radius: var(--radius-md); display: flex; justify-content: center; width: max-content; margin: 0 auto;">
              <div style="height: 50px; width: 180px; background: repeating-linear-gradient(90deg, black, black 4px, white 4px, white 8px, black 8px, black 10px, white 10px, white 14px);"></div>
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
          <div class="loader-logo-wrapper" style="position: relative; display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(0, 102, 255, 0.4); background: rgba(0, 102, 255, 0.05); box-shadow: 0 0 25px rgba(0, 102, 255, 0.2); animation: loaderPulse 2s infinite ease-in-out;">
            <img src="${logoPath}" alt="Stackly Logo" style="height: 38px; width: auto; filter: invert(1) hue-rotate(180deg) brightness(1.6); border-radius: 8px;">
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
      loadingScreen.classList.add = function(className) {
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
        <img src="${logoPath}" alt="Stackly Logo" class="header-logo-img" style="height: 32px; width: auto; border-radius: 6px; margin-right: 0; filter: invert(1) hue-rotate(180deg) brightness(1.6);">
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
          <img src="${logoPath}" alt="Stackly Logo" class="footer-logo-img" style="height: 36px; width: auto; border-radius: 6px; filter: invert(1) hue-rotate(180deg) brightness(1.6);">
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
          <input type="email" placeholder="Subscribe..." required style="background: transparent; border: none; outline: none; padding: 6px 12px; color: #fff; font-size: var(--fs-xs); width: 100%; box-sizing: border-box;">
          <button type="submit" style="background: var(--gradient-primary); border: none; outline: none; color: #fff; border-radius: var(--radius-md); padding: 6px 14px; font-size: var(--fs-xs); font-weight: var(--fw-bold); cursor: pointer; transition: all 0.2s; white-space: nowrap;">Go</button>
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
          <img src="${basePath}assets/logo-stackly.webp" alt="Stackly Logo" style="height: 28px; width: auto; border-radius: 4px; filter: invert(1) hue-rotate(180deg) brightness(1.6);">
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
