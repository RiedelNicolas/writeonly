/**
 * Mobile View Module
 * Handles toggle between editor and preview views on mobile devices
 */

/**
 * Mobile breakpoint in pixels
 * @constant {number}
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Storage key for mobile view preference
 * @constant {string}
 */
const MOBILE_VIEW_KEY = 'writeonly_mobile_view';

/**
 * Check if the current viewport is mobile
 * @returns {boolean} True if viewport width is less than or equal to MOBILE_BREAKPOINT
 */
function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

/**
 * Get the saved mobile view preference
 * @returns {string} The saved view preference ('editor' or 'preview'), defaults to 'editor'
 */
function getMobileViewPreference() {
    try {
        const saved = localStorage.getItem(MOBILE_VIEW_KEY);
        return saved === 'preview' ? 'preview' : 'editor';
    } catch (e) {
        return 'editor';
    }
}

/**
 * Save the mobile view preference
 * @param {string} view - The view to save ('editor' or 'preview')
 */
function saveMobileViewPreference(view) {
    try {
        localStorage.setItem(MOBILE_VIEW_KEY, view);
    } catch (e) {
        console.error('Failed to save mobile view preference:', e);
    }
}

/**
 * Set the active mobile view
 * @param {string} view - The view to activate ('editor' or 'preview')
 */
function setMobileView(view) {
    const toggleEditor = document.getElementById('toggle-editor');
    const togglePreview = document.getElementById('toggle-preview');
    const container = document.querySelector('.container');

    if (!toggleEditor || !togglePreview || !container) {
        return;
    }

    if (view === 'preview') {
        container.classList.add('mobile-preview-active');
        toggleEditor.classList.remove('active');
        togglePreview.classList.add('active');
        toggleEditor.setAttribute('aria-selected', 'false');
        togglePreview.setAttribute('aria-selected', 'true');
    } else {
        container.classList.remove('mobile-preview-active');
        toggleEditor.classList.add('active');
        togglePreview.classList.remove('active');
        toggleEditor.setAttribute('aria-selected', 'true');
        togglePreview.setAttribute('aria-selected', 'false');
    }

    saveMobileViewPreference(view);
}

/**
 * Initialize mobile view functionality
 */
function setupMobileToggle() {
    const toggleEditor = document.getElementById('toggle-editor');
    const togglePreview = document.getElementById('toggle-preview');
    const container = document.querySelector('.container');

    if (!toggleEditor || !togglePreview || !container) {
        return;
    }

    // Set up click handlers for toggle buttons
    toggleEditor.addEventListener('click', () => {
        setMobileView('editor');
    });

    togglePreview.addEventListener('click', () => {
        setMobileView('preview');
    });

    // Initialize view based on saved preference
    const savedView = getMobileViewPreference();
    
    // Apply initial mobile state
    if (isMobileView()) {
        setMobileView(savedView);
    }

    // Handle resize events
    window.addEventListener('resize', () => {
        if (isMobileView()) {
            // Restore editor view when entering mobile mode if preview is not active
            if (!container.classList.contains('mobile-preview-active')) {
                setMobileView('editor');
            }
        } else {
            // Clean up mobile classes when returning to desktop
            container.classList.remove('mobile-preview-active');
        }
    });
}
