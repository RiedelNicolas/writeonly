/**
 * Main Application Module
 * Initializes the WriteOnly Markdown Editor
 */

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
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const highlight = document.getElementById('highlight');

    // Initialize with saved content or sample content
    const savedContent = EditorStorage.load();
    editor.value = savedContent !== null ? savedContent : sampleMarkdown;

    // Create update callback
    const updateCallback = () => update(editor, preview, highlight);

    // Set up editor event listeners
    setupEditorListeners(editor, highlight, updateCallback);

    // Initial render
    updateCallback();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
