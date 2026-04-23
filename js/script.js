/**
 * ============================================================
 * Ghala Alqahtani – Portfolio  |  Assignment 4
 *
 * Features:
 *  1.  Theme toggle with localStorage persistence
 *  2.  Time-based greeting
 *  3.  Inspirational Quote API (Quotable.io) + fallback
 *  4.  GitHub Repositories API + fallback demo cards
 *  5.  Live project search with text highlight
 *  6.  Project category filter buttons
 *  7.  Project sort dropdown (A→Z / Z→A)
 *  8.  Combined filter + search + sort logic
 *  9.  Contact form validation (name, email, subject, message)
 *  10. Live word count + character count on message textarea
 *  11. Personalised success message (saves name to localStorage)
 *  12. Scroll-in animations via IntersectionObserver
 *  13. Active nav link highlight on scroll
 *  14. Smooth scrolling
 *  15. Navbar scroll shadow + mobile hamburger menu
 *  16. Back-to-top button
 *  17. Arabic / English language toggle with full RTL/LTR
 *          switching, translated UI strings, placeholder swap,
 *          select option translation, and localStorage persistence
 *  18. Scroll progress bar — thin accent bar at top of page
 *          reflecting how far the user has scrolled
 * ============================================================
 */

'use strict';

// ============================================================
// 1 · THEME TOGGLE
// ============================================================

/**
 * Initialise theme from localStorage or system preference.
 */
function initializeTheme() {
    const saved       = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme       = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

/**
 * Toggle between light and dark themes and persist the choice.
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
}

/**
 * Update the theme button icon to match the current theme.
 * @param {string} theme - 'light' or 'dark'
 */
function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================================
// 2 · TIME-BASED GREETING
// ============================================================

/**
 * Display a greeting based on the current hour of day.
 */
function setGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    el.textContent = hour < 12 ? 'Good Morning! ☀️'
                   : hour < 18 ? 'Good Afternoon! 🌤️'
                   :             'Good Evening! 🌙';
}

// ============================================================
// 3 · INSPIRATIONAL QUOTE API
// ============================================================

/**
 * Fetch a random inspirational quote from Quotable.io.
 * Falls back to a local list if the API is unavailable.
 */
async function fetchQuote() {
    const loadingEl = document.getElementById('quoteLoading');
    const contentEl = document.getElementById('quoteContent');
    const errorEl   = document.getElementById('quoteError');
    const textEl    = document.getElementById('quoteText');
    const authorEl  = document.getElementById('quoteAuthor');
    const newBtn    = document.getElementById('newQuoteBtn');

    // Show loading state
    loadingEl.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display   = 'none';
    if (newBtn) newBtn.style.display = 'none';

    try {
        const response = await fetch(
            'https://api.quotable.io/random?tags=inspirational|life|wisdom|motivational',
            { signal: AbortSignal.timeout(6000) }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        textEl.textContent   = data.content;
        authorEl.textContent = `— ${data.author}`;

        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        if (newBtn) newBtn.style.display = 'flex';

    } catch (err) {
        console.warn('Quote API failed, using fallback:', err.message);
        showFallbackQuote(textEl, authorEl, loadingEl, contentEl, newBtn);
    }
}

/** Local fallback quotes used when the API is unavailable. */
const FALLBACK_QUOTES = [
    { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { content: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
    { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { content: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { content: "Believe you can and you are halfway there.", author: "Theodore Roosevelt" },
];

/**
 * Pick a random fallback quote and display it.
 */
function showFallbackQuote(textEl, authorEl, loadingEl, contentEl, newBtn) {
    const q = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    textEl.textContent   = q.content;
    authorEl.textContent = `— ${q.author}`;
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    if (newBtn) newBtn.style.display = 'flex';
}

// ============================================================
// 4 · GITHUB REPOSITORIES API
// ============================================================

/** Replace with your actual GitHub username */
const GITHUB_USERNAME = 'ghalaq75';

/**
 * Fetch the 6 most recently updated public repos from GitHub
 * and render them as cards. Shows demo cards if the API fails.
 */
async function fetchGitHubRepos() {
    const loadingEl = document.getElementById('githubLoading');
    const gridEl    = document.getElementById('githubGrid');
    const errorEl   = document.getElementById('githubError');

    if (!loadingEl || !gridEl || !errorEl) return;

    loadingEl.style.display = 'flex';
    gridEl.style.display    = 'none';
    errorEl.style.display   = 'none';

    try {
        const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`;
        const response = await fetch(url, {
            headers: { Accept: 'application/vnd.github.v3+json' },
            signal: AbortSignal.timeout(8000),
        });

        if (response.status === 404) throw new Error('GitHub user not found');
        if (!response.ok)            throw new Error(`GitHub API error ${response.status}`);

        const repos = await response.json();

        gridEl.innerHTML = repos.length === 0
            ? '<p style="text-align:center;color:var(--text-muted)">No public repositories found.</p>'
            : repos.map(buildRepoCard).join('');

        loadingEl.style.display = 'none';
        gridEl.style.display    = 'grid';

    } catch (err) {
        console.warn('GitHub API failed, showing demo cards:', err.message);
        loadingEl.style.display = 'none';
        gridEl.innerHTML        = buildDemoRepoCards();
        gridEl.style.display    = 'grid';
    }
}

/**
 * Build the HTML for a single GitHub repo card.
 * @param {Object} repo - GitHub API repo object
 * @returns {string} HTML string
 */
function buildRepoCard(repo) {
    const desc    = repo.description || 'No description provided.';
    const lang    = repo.language    || 'N/A';
    const updated = new Date(repo.updated_at).toLocaleDateString('en-GB', { year:'numeric', month:'short' });

    return `
        <article class="repo-card">
            <a class="repo-card__name"
               href="${repo.html_url}"
               target="_blank"
               rel="noopener noreferrer">
                📁 ${escapeHTML(repo.name)}
            </a>
            <p class="repo-card__desc">${escapeHTML(desc)}</p>
            <div class="repo-card__meta">
                <span><span class="repo-card__lang"></span> ${escapeHTML(lang)}</span>
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>🗓 ${updated}</span>
            </div>
        </article>`;
}

/**
 * Build demo repo cards shown when the GitHub API is unavailable.
 * @returns {string} HTML string
 */
function buildDemoRepoCards() {
    const demos = [
        { name:'distributed-storage', desc:'Multi-threaded distributed storage with fault tolerance using Java socket programming.', lang:'Java',  stars:3, forks:1, updated:'Jan 2025' },
        { name:'dining-pubsub',       desc:'Publisher-subscriber dining system built with UML design principles.',                  lang:'Java',  stars:2, forks:0, updated:'Nov 2024' },
        { name:'kfupm-events',        desc:'University events management prototype with full requirements documentation.',          lang:'N/A',   stars:1, forks:0, updated:'Oct 2024' },
        { name:'portfolio-site',      desc:'Personal portfolio website built for KFUPM SWE coursework.',                           lang:'HTML',  stars:4, forks:1, updated:'Apr 2025' },
    ];

    return demos.map(d => `
        <article class="repo-card">
            <span class="repo-card__name">📁 ${escapeHTML(d.name)}</span>
            <p class="repo-card__desc">${escapeHTML(d.desc)}</p>
            <div class="repo-card__meta">
                <span><span class="repo-card__lang"></span> ${escapeHTML(d.lang)}</span>
                <span>⭐ ${d.stars}</span>
                <span>🍴 ${d.forks}</span>
                <span>🗓 ${d.updated}</span>
            </div>
        </article>`).join('');
}

// ============================================================
// 5 · PROJECT FILTER, SEARCH & SORT (combined)
// ============================================================

/** Tracks which category filter is currently active */
let activeFilter = 'all';

/**
 * Apply the active category filter, search query, and sort order
 * to the project cards — all three work together in one pass.
 */
function applyFiltersAndSort() {
    const searchQuery = (document.getElementById('projectSearch')?.value || '').trim().toLowerCase();
    const sortValue   = document.getElementById('sortSelect')?.value || 'default';
    const cards       = Array.from(document.querySelectorAll('.project-card'));
    const emptyState  = document.getElementById('emptyState');
    const countEl     = document.getElementById('searchCount');
    const clearBtn    = document.getElementById('clearSearch');

    let visibleCards = [];

    cards.forEach(card => {
        const title       = card.getAttribute('data-title')    || '';
        const tags        = card.getAttribute('data-tags')     || '';
        const category    = card.getAttribute('data-category') || '';
        const description = card.querySelector('p')?.textContent || '';
        const combined    = `${title} ${tags} ${description} ${category}`.toLowerCase();

        // Step 1: category filter
        const passesFilter = activeFilter === 'all' || category.includes(activeFilter);
        // Step 2: keyword search
        const passesSearch = !searchQuery || combined.includes(searchQuery);

        if (passesFilter && passesSearch) {
            card.classList.remove('hidden');
            visibleCards.push(card);

            // Highlight matching text in the card title
            const h3 = card.querySelector('h3');
            if (h3) {
                h3.innerHTML = searchQuery ? highlightText(title, searchQuery) : title;
            }
        } else {
            card.classList.add('hidden');
            const h3 = card.querySelector('h3');
            if (h3) h3.textContent = title;
        }
    });

    // Step 3: sort visible cards
    if (sortValue !== 'default') {
        const grid = document.getElementById('projectsGrid');
        visibleCards.sort((a, b) => {
            const ta = (a.getAttribute('data-title') || '').toLowerCase();
            const tb = (b.getAttribute('data-title') || '').toLowerCase();
            return sortValue === 'az' ? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
        visibleCards.forEach(c => grid.appendChild(c));
    }

    // Update UI feedback elements
    if (clearBtn) clearBtn.style.display = searchQuery ? 'inline-block' : 'none';
    if (emptyState) emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';

    if (countEl) {
        const total = cards.length;
        if (!searchQuery && activeFilter === 'all') {
            countEl.textContent = '';
        } else if (visibleCards.length === 0) {
            countEl.textContent = 'No projects matched.';
        } else {
            countEl.textContent = `Showing ${visibleCards.length} of ${total} project${total !== 1 ? 's' : ''}`;
        }
    }
}

/**
 * Wire up the category filter buttons.
 */
function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.getAttribute('data-filter') || 'all';
            applyFiltersAndSort();
        });
    });
}

/**
 * Wire up the search input and clear button.
 */
function initializeSearch() {
    const searchInput = document.getElementById('projectSearch');
    const clearBtn    = document.getElementById('clearSearch');

    if (!searchInput) return;

    searchInput.addEventListener('input', applyFiltersAndSort);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            applyFiltersAndSort();
            searchInput.focus();
        });
    }
}

/**
 * Wire up the sort dropdown.
 */
function initSortDropdown() {
    document.getElementById('sortSelect')?.addEventListener('change', applyFiltersAndSort);
}

// ============================================================
// 6 · LIVE WORD COUNT + CHARACTER COUNT  (replaces timer)
// ============================================================

/**
 * Count the number of words in a string.
 * Handles multiple spaces, newlines, and punctuation gracefully.
 *
 * @param {string} text - Raw textarea value
 * @returns {number} Word count (0 if blank)
 */
function countWords(text) {
    const trimmed = text.trim();
    if (trimmed === '') return 0;
    // Split on any whitespace sequence; filter removes empty strings
    return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Initialise the live word count and character count display
 * on the contact form's message textarea.
 *
 * - Word count: updates on every keystroke, turns green (accent)
 *   once the user starts writing, resets to muted when empty.
 * - Char count: updates on every keystroke, turns red (error)
 *   when ≥ 90% of the 500-char limit is reached.
 * - A visually hidden <span aria-live="polite"> announces the
 *   word count to screen readers without disrupting the visual UI.
 */
function initMessageCounters() {
    const textarea = document.getElementById('message');
    const wordEl   = document.getElementById('wordCount');
    const charEl   = document.getElementById('charCount');
    const announceEl = document.getElementById('wordCountAnnounce');

    if (!textarea || !wordEl || !charEl) return;

    const MAX_CHARS = parseInt(textarea.getAttribute('maxlength')) || 500;

    textarea.addEventListener('input', () => {
        const text     = textarea.value;
        const words    = countWords(text);
        const chars    = text.length;

        // ── Word count display ──
        wordEl.textContent = words === 1 ? '1 word' : `${words} words`;
        // Toggle 'active' class: green when writing, muted when empty
        wordEl.classList.toggle('active', words > 0);

        // ── Character count display ──
        charEl.textContent = `${chars} / ${MAX_CHARS}`;
        // Toggle 'warn' class: red when ≥ 90% full
        charEl.classList.toggle('warn', chars >= MAX_CHARS * 0.9);

        // ── Screen reader announcement (throttled to every 10 words) ──
        if (announceEl && words % 10 === 0 && words > 0) {
            announceEl.textContent = `${words} words written`;
        }
    });
}

// ============================================================
// 7 · CONTACT FORM VALIDATION
// ============================================================

/**
 * Validate a single form field and show or clear its error message.
 * @param {HTMLElement} field - input, textarea, or select element
 * @returns {boolean} true if the field passes validation
 */
function validateField(field) {
    const errorEl = document.getElementById(`${field.id}Error`);
    let msg = '';

    const val = field.value.trim();

    if (val === '') {
        msg = `${capitalize(field.name || field.id)} is required.`;
    } else if (field.type === 'email' && !isValidEmail(val)) {
        msg = 'Please enter a valid email address.';
    } else if (field.tagName === 'SELECT' && val === '') {
        msg = 'Please select a subject.';
    }

    if (errorEl) errorEl.textContent = msg;
    field.classList.toggle('invalid', !!msg);
    return !msg;
}

/**
 * Basic email format check using a regular expression.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Handle contact form submission: validate all fields at once,
 * simulate a network request, then show a personalised success message.
 * @param {Event} e - submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const nameField    = document.getElementById('visitorName');
    const emailField   = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const submitBtn    = document.getElementById('submitBtn');

    // Validate all fields simultaneously so all errors appear at once
    const isValid = [
        validateField(nameField),
        validateField(emailField),
        validateField(subjectField),
        validateField(messageField),
    ].every(Boolean);

    if (!isValid) return;

    // Disable button to prevent double-submit
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    // Simulate network delay
    setTimeout(() => {
        // Personalised success message — state management via DOM + localStorage
        const firstName = nameField.value.trim().split(' ')[0];
        const senderEl  = document.getElementById('senderName');
        if (senderEl) senderEl.textContent = firstName;

        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.classList.add('show');

        // Persist visitor name for potential future use
        localStorage.setItem('lastVisitorName', nameField.value.trim());

        console.log('Form submitted:', {
            name:    nameField.value,
            email:   emailField.value,
            subject: subjectField.value,
            message: messageField.value,
        });

        // Reset form and counters
        e.target.reset();
        const wordEl = document.getElementById('wordCount');
        const charEl = document.getElementById('charCount');
        if (wordEl) { wordEl.textContent = '0 words'; wordEl.classList.remove('active'); }
        if (charEl) { charEl.textContent = '0 / 500';  charEl.classList.remove('warn'); }

        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';

        // Auto-hide success message after 6 seconds
        setTimeout(() => successEl?.classList.remove('show'), 6000);
    }, 900);
}

// ============================================================
// 8 · SMOOTH SCROLLING + ACTIVE NAV
// ============================================================

/**
 * Add smooth scrolling to all internal anchor links,
 * offsetting by navbar height to avoid overlap.
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = document.querySelector('.navbar')?.offsetHeight || 70;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });
}

/**
 * Highlight the nav link that corresponds to the currently
 * visible section as the user scrolls.
 */
function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    document.querySelectorAll('section[id]').forEach(section => {
        if (scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight) {
            current = section.id;
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ============================================================
// 9 · NAVBAR: SCROLL SHADOW + MOBILE HAMBURGER
// ============================================================

/**
 * Add scroll-dependent shadow to the navbar and wire up
 * the mobile hamburger toggle.
 */
function initNavbarBehaviour() {
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    // Deepen shadow when user has scrolled
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ============================================================
// 10 · BACK-TO-TOP BUTTON
// ============================================================

/**
 * Show the back-to-top button after 400 px of scroll
 * and scroll to the top when clicked.
 */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// 11 · SCROLL-IN ANIMATIONS (IntersectionObserver)
// ============================================================

/**
 * Fade and slide project/repo cards into view as they
 * enter the viewport. More performant than scroll listeners.
 */
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.project-card, .repo-card').forEach(el => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Wrap matched substrings in a <mark> highlight span.
 * @param {string} text  - Original text
 * @param {string} query - Lowercase search query
 * @returns {string} HTML string with highlights
 */
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

/**
 * Escape special characters for safe use in a RegExp.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escape HTML special characters to prevent XSS when
 * inserting API data into the DOM.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================================
// 18 · SCROLL PROGRESS BAR
// ============================================================

/**
 * Update the scroll progress bar width based on how far
 * the user has scrolled down the page.
 */
function updateScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${pct.toFixed(1)}%`;
    bar.setAttribute('aria-valuenow', Math.round(pct));
}

// ============================================================
// 17 · ARABIC / ENGLISH LANGUAGE TOGGLE
// ============================================================

const GREETINGS = {
    en: { morning: 'Good Morning! ☀️', afternoon: 'Good Afternoon! 🌤️', evening: 'Good Evening! 🌙' },
    ar: { morning: 'صباح الخير! ☀️',   afternoon: 'مساء الخير! 🌤️',    evening: 'مساء النور! 🌙'  },
};

/**
 * Apply a language to the entire page — swaps all data-en/data-ar
 * text, placeholders, select options, greeting, and persists to localStorage.
 * @param {'en'|'ar'} lang
 */
function applyLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('lang',      lang);
    html.setAttribute('dir',       lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('data-lang', lang);

    // Swap text content
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        const text = el.getAttribute(`data-${lang}`);
        if (text !== null) el.innerHTML = text;
    });

    // Swap placeholder attributes
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`) || '';
    });

    // Swap <option> text
    document.querySelectorAll('option[data-en][data-ar]').forEach(opt => {
        opt.textContent = opt.getAttribute(`data-${lang}`) || '';
    });

    // Update greeting
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        const g    = GREETINGS[lang];
        greetingEl.textContent = hour < 12 ? g.morning : hour < 18 ? g.afternoon : g.evening;
    }

    // Update toggle button label
    const btn     = document.getElementById('langToggle');
    const labelEl = btn?.querySelector('.lang-label');
    if (labelEl) labelEl.textContent = lang === 'ar' ? 'EN' : 'ع';
    btn?.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'Switch to Arabic');

    // Animate button
    btn?.classList.add('switching');
    setTimeout(() => btn?.classList.remove('switching'), 350);

    localStorage.setItem('lang', lang);
}

function toggleLanguage() {
    const current = document.documentElement.getAttribute('data-lang') || 'en';
    applyLanguage(current === 'ar' ? 'en' : 'ar');
}

function initLanguage() {
    const saved = localStorage.getItem('lang') || 'en';
    applyLanguage(saved);
    document.getElementById('langToggle')?.addEventListener('click', toggleLanguage);
}

// ============================================================
// INITIALIZATION — boot everything once the DOM is ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // Theme & greeting
    initializeTheme();
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    setGreeting();

    // Language toggle (Arabic / English RTL)
    initLanguage();

    // Quote API
    fetchQuote();
    document.getElementById('newQuoteBtn')?.addEventListener('click', fetchQuote);
    document.getElementById('retryQuote')?.addEventListener('click', fetchQuote);

    // GitHub API
    fetchGitHubRepos();
    document.getElementById('retryGithub')?.addEventListener('click', fetchGitHubRepos);

    // Project controls
    initializeSearch();
    initFilterButtons();
    initSortDropdown();

    // Navigation
    initializeSmoothScrolling();
    initNavbarBehaviour();
    initBackToTop();
    window.addEventListener('scroll', updateActiveNavLink,  { passive: true });
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateActiveNavLink();
    updateScrollProgress();

    // Scroll animations
    observeElements();
    setTimeout(observeElements, 1500);

    // Contact form
    document.getElementById('contactForm')?.addEventListener('submit', handleFormSubmit);

    // Live word count + char count
    initMessageCounters();

    // Real-time field validation
    ['visitorName', 'email', 'subject', 'message'].forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener('blur',  () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) validateField(field);
        });
    });
});

// ============================================================
// DEVELOPER CONSOLE MESSAGE
// ============================================================
console.log('%c👋 Hello Developer!', 'color:#7a9b7f; font-size:20px; font-weight:bold;');
console.log('%cGhala\'s Portfolio – Assignment 4', 'color:#5a5a5a; font-size:14px;');
console.log('%cFeatures: Arabic/English RTL · Scroll Progress · Live Word Count · Filter & Sort · GitHub API · Quotes API · Dark Mode · Form Validation', 'color:#8a8a8a; font-size:12px;');