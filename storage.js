/**
 * Storage module for WriteOnly Markdown Editor
 * Handles persistence of editor content using localStorage
 */
const EditorStorage = (function () {
    const STORAGE_KEY = 'writeonly_content';

    /**
     * Save content to localStorage
     * @param {string} content - The content to save
     * @returns {boolean} - True if save was successful, false otherwise
     */
    function save(content) {
        try {
            localStorage.setItem(STORAGE_KEY, content);
            return true;
        } catch (e) {
            console.error('Failed to save content to localStorage:', e);
            return false;
        }
    }

    /**
     * Load content from localStorage
     * @returns {string|null} - The saved content or null if not found
     */
    function load() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to load content from localStorage:', e);
            return null;
        }
    }

    /**
     * Check if there is saved content
     * @returns {boolean} - True if saved content exists
     */
    function hasSavedContent() {
        return load() !== null;
    }

    /**
     * Clear saved content from localStorage
     * @returns {boolean} - True if clear was successful
     */
    function clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Failed to clear content from localStorage:', e);
            return false;
        }
    }

    // Public API
    return {
        save,
        load,
        hasSavedContent,
        clear
    };
})();
