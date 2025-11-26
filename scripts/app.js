/**
 * Main Application Module
 * Initializes the WriteOnly Markdown Editor
 */

/**
 * Check if the device is a mobile device
 * @returns {boolean} True if the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Show mobile disclaimer if on mobile device
 */
function showMobileDisclaimer() {
    const disclaimer = document.getElementById('mobile-disclaimer');
    if (disclaimer && isMobileDevice()) {
        disclaimer.style.display = 'flex';
    }
}

/**
 * Update preview and syntax highlighting
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {HTMLElement} preview - The preview element
 * @param {HTMLElement} highlight - The highlight overlay element
 */
function update(editor, preview, highlight) {
    preview.innerHTML = parseMarkdown(editor.value);
    highlight.innerHTML = highlightSyntax(editor.value) + '\n';
    // Save content to localStorage
    EditorStorage.save(editor.value);
}

/**
 * Initialize the application
 */
function initApp() {
    // Check for mobile device first
    showMobileDisclaimer();

    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const highlight = document.getElementById('highlight');

    // Initialize with saved content or sample content
    // Use default sample markdown if saved content is null or empty string
    const savedContent = EditorStorage.load();
    editor.value = savedContent ? savedContent : sampleMarkdown;

    // Create update callback
    const updateCallback = () => update(editor, preview, highlight);

    // Set up editor event listeners
    setupEditorListeners(editor, highlight, updateCallback);

    // Initial render
    updateCallback();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
