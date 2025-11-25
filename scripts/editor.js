/**
 * Editor Module
 * Handles editor-related functionality like scroll syncing and keyboard shortcuts
 */

/**
 * Sync scrolling between editor and highlight overlay
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {HTMLElement} highlight - The highlight overlay element
 */
function syncScroll(editor, highlight) {
    highlight.scrollTop = editor.scrollTop;
    highlight.scrollLeft = editor.scrollLeft;
}

/**
 * Handle Tab key press in the editor
 * @param {KeyboardEvent} e - The keyboard event
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {Function} updateCallback - Callback function to update the preview
 */
function handleTabKey(e, editor, updateCallback) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updateCallback();
    }
}

/**
 * Set up editor event listeners
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {HTMLElement} highlight - The highlight overlay element
 * @param {Function} updateCallback - Callback function to update the preview
 */
function setupEditorListeners(editor, highlight, updateCallback) {
    // Update preview and highlighting on input
    editor.addEventListener('input', updateCallback);
    
    // Sync scrolling
    editor.addEventListener('scroll', () => syncScroll(editor, highlight));
    
    // Tab key support
    editor.addEventListener('keydown', (e) => handleTabKey(e, editor, updateCallback));
}
