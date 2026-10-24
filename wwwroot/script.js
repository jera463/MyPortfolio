/* =========================================================
   JERALYN A. MONDIJAR — PORTFOLIO
   script.js — normal scrolling website

   1. Smooth scroll when a nav button is clicked
   2. Active nav link follows the section you're viewing
   3. Mobile hamburger menu
   4. Scroll progress bar
   5. Reveal-on-scroll animation
========================================================= */

(function () {
    'use strict';

    const pages = Array.from(document.querySelectorAll('.page[data-page]'));

    const navToggle = document.getElementById('nav-toggle');
    const navPanel = document.getElementById('primary-navigation');
    const navBackdrop = document.getElementById('nav-backdrop');
    const header = document.getElementById('site-header');
    const progressBar = document.getElementById('page-progress-bar');

    const DESKTOP_BREAKPOINT = 960; // must match the CSS nav breakpoint

    let menuIsOpen = false;

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -----------------------------------------------------
       1. SMOOTH SCROLL TO SECTION
    ----------------------------------------------------- */
    function scrollToPage(id) {
        const target = document.getElementById(id);

        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
        });

        try {
            history.replaceState(null, '', `#${id}`);
        } catch (error) {
            /* history API may be blocked */
        }
    }

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('a[data-nav]');

        if (!trigger) {
            return;
        }

        if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();

        closeMenu();
        scrollToPage(trigger.dataset.nav);
    });

    /* -----------------------------------------------------
       2. ACTIVE LINK (scroll spy)
    ----------------------------------------------------- */
    function setActiveLink(id) {
        document.querySelectorAll('.nav-link[data-nav]').forEach((link) => {
            const isCurrent = link.dataset.nav === id;

            link.classList.toggle('is-active', isCurrent);

            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    if ('IntersectionObserver' in window && pages.length) {
        // A section becomes "current" when it crosses the middle of the screen.
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.dataset.page);
                    }
                });
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
        );

        // Reveal animation: show content once a section is on screen.
        const reveal = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        reveal.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        pages.forEach((page) => {
            spy.observe(page);
            reveal.observe(page);
        });
    } else {
        // Very old browsers: just show everything.
        pages.forEach((page) => page.classList.add('is-visible'));
    }

    setActiveLink(pages[0] ? pages[0].dataset.page : 'home');

    /* -----------------------------------------------------
       3. MOBILE MENU
    ----------------------------------------------------- */
    function openMenu() {
        if (!navToggle || !navPanel || menuIsOpen) {
            return;
        }

        menuIsOpen = true;

        navPanel.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');

        if (navBackdrop) {
            navBackdrop.hidden = false;
        }
    }

    function closeMenu() {
        if (!navToggle || !navPanel || !menuIsOpen) {
            return;
        }

        menuIsOpen = false;

        navPanel.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');

        if (navBackdrop) {
            navBackdrop.hidden = true;
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (menuIsOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuIsOpen) {
            closeMenu();

            if (navToggle) {
                navToggle.focus();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > DESKTOP_BREAKPOINT) {
            closeMenu();
        }
    });

    /* -----------------------------------------------------
       4. SCROLL PROGRESS + HEADER SHADOW
    ----------------------------------------------------- */
    let ticking = false;

    function updateOnScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        if (progressBar) {
            const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }

        if (header) {
            header.classList.toggle('is-scrolled', scrollTop > 20);
        }

        ticking = false;
    }

    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        },
        { passive: true }
    );

    window.addEventListener('resize', updateOnScroll);
    updateOnScroll();

    /* -----------------------------------------------------
       5. FOOTER YEAR
    ----------------------------------------------------- */
    const yearElement = document.getElementById('current-year');

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
})();