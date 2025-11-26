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
 * Handle Enter key press in the editor for list continuation
 * @param {KeyboardEvent} e - The keyboard event
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {Function} updateCallback - Callback function to update the preview
 */
function handleEnterKey(e, editor, updateCallback) {
    if (e.key === 'Enter') {
        const cursorPos = editor.selectionStart;
        const text = editor.value;
        
        // Find the start of the current line
        const lineStart = text.lastIndexOf('\n', cursorPos - 1) + 1;
        const currentLine = text.substring(lineStart, cursorPos);
        
        // Check for unordered list (- or *)
        const unorderedMatch = currentLine.match(/^(\s*)([\-\*])\s(.*)$/) || currentLine.match(/^(\s*)([\-\*])()$/);
        if (unorderedMatch) {
            const [, indent, marker, content] = unorderedMatch;
            
            // If line has content, continue the list
            if (content.trim()) {
                e.preventDefault();
                const newListItem = '\n' + indent + marker + ' ';
                editor.value = text.substring(0, cursorPos) + newListItem + text.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = cursorPos + newListItem.length;
                updateCallback();
                return;
            } else {
                // Empty list item - remove the marker and exit list
                e.preventDefault();
                editor.value = text.substring(0, lineStart) + '\n' + text.substring(cursorPos);
                editor.selectionStart = editor.selectionEnd = lineStart + 1;
                updateCallback();
                return;
            }
        }
        
        // Check for ordered list (1. 2. etc.)
        const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/) || currentLine.match(/^(\s*)(\d+)\.()$/);
        if (orderedMatch) {
            const [, indent, number, content] = orderedMatch;
            
            // If line has content, continue the list with incremented number
            if (content.trim()) {
                e.preventDefault();
                const nextNumber = parseInt(number, 10) + 1;
                const newListItem = '\n' + indent + nextNumber + '. ';
                editor.value = text.substring(0, cursorPos) + newListItem + text.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = cursorPos + newListItem.length;
                updateCallback();
                return;
            } else {
                // Empty list item - remove the marker and exit list
                e.preventDefault();
                editor.value = text.substring(0, lineStart) + '\n' + text.substring(cursorPos);
                editor.selectionStart = editor.selectionEnd = lineStart + 1;
                updateCallback();
                return;
            }
        }
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
    
    // Tab key support and Enter key for list continuation
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            handleTabKey(e, editor, updateCallback);
        } else if (e.key === 'Enter') {
            handleEnterKey(e, editor, updateCallback);
        }
    });
}
