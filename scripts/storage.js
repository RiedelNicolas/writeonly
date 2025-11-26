/**
 * Storage module for WriteOnly Markdown Editor
 * Handles persistence of editor content and preferences using localStorage
 */
const EditorStorage = (function () {
    const STORAGE_KEY = 'writeonly_content';
    const DIVIDER_KEY = 'writeonly_divider_position';

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
        try {
            return localStorage.getItem(STORAGE_KEY) !== null;
        } catch (e) {
            return false;
        }
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

    /**
     * Save divider position to localStorage
     * @param {number} position - The editor pane percentage (20-80)
     * @returns {boolean} - True if save was successful
     */
    function saveDividerPosition(position) {
        try {
            localStorage.setItem(DIVIDER_KEY, position.toString());
            return true;
        } catch (e) {
            console.error('Failed to save divider position to localStorage:', e);
            return false;
        }
    }

    /**
     * Load divider position from localStorage
     * @returns {number|null} - The saved position or null if not found
     */
    function loadDividerPosition() {
        try {
            const saved = localStorage.getItem(DIVIDER_KEY);
            if (saved !== null) {
                const position = parseFloat(saved);
                if (!isNaN(position) && position >= 20 && position <= 80) {
                    return position;
                }
            }
            return null;
        } catch (e) {
            console.error('Failed to load divider position from localStorage:', e);
            return null;
        }
    }

    // Public API
    return {
        save,
        load,
        hasSavedContent,
        clear,
        saveDividerPosition,
        loadDividerPosition
    };
})();
