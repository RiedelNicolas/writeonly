/**
 * Image Handler Module
 * Handles drag & drop and paste functionality for images
 * Converts images to base64 data URLs for embedding in Markdown
 */

/**
 * Convert a File object to a base64 data URL
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} A promise that resolves to the base64 data URL
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Check if a file is a valid image type
 * @param {File} file - The file to check
 * @returns {boolean} True if the file is a supported image type
 */
function isValidImageType(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    return validTypes.includes(file.type);
}

/**
 * Generate a simple image name from file or timestamp
 * @param {File} file - The image file (optional)
 * @returns {string} A sanitized image name
 */
function generateImageName(file) {
    if (file && file.name) {
        // Remove extension and sanitize
        const baseName = file.name.replace(/\.[^.]+$/, '');
        return baseName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'image';
    }
    return 'image_' + Date.now();
}

/**
 * Insert text at the current cursor position in a textarea
 * @param {HTMLTextAreaElement} editor - The editor textarea
 * @param {string} text - The text to insert
 */
function insertAtCursor(editor, text) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    
    editor.value = value.substring(0, start) + text + value.substring(end);
    
    // Move cursor to end of inserted text
    const newPosition = start + text.length;
    editor.selectionStart = newPosition;
    editor.selectionEnd = newPosition;
    
    // Focus the editor
    editor.focus();
}

/**
 * Process an image file and insert it into the editor
 * @param {File} file - The image file to process
 * @param {HTMLTextAreaElement} editor - The editor textarea
 * @param {Function} updateCallback - Callback to update the preview
 */
async function processImageFile(file, editor, updateCallback) {
    if (!isValidImageType(file)) {
        console.warn('Unsupported image type:', file.type);
        return;
    }
    
    try {
        const base64Data = await fileToBase64(file);
        const imageName = generateImageName(file);
        const markdownImage = `![${imageName}](${base64Data})`;
        
        insertAtCursor(editor, markdownImage);
        
        // Trigger update callback to refresh preview and save
        if (updateCallback) {
            updateCallback();
        }
    } catch (error) {
        console.error('Failed to process image:', error);
    }
}

/**
 * Handle drag over event
 * @param {DragEvent} e - The drag event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Handle drag enter event
 * @param {DragEvent} e - The drag event
 * @param {HTMLElement} editorWrapper - The editor wrapper element
 */
function handleDragEnter(e, editorWrapper) {
    e.preventDefault();
    e.stopPropagation();
    editorWrapper.classList.add('drag-over');
}

/**
 * Handle drag leave event
 * @param {DragEvent} e - The drag event
 * @param {HTMLElement} editorWrapper - The editor wrapper element
 */
function handleDragLeave(e, editorWrapper) {
    e.preventDefault();
    e.stopPropagation();
    // Only remove class if we're leaving the wrapper entirely
    if (!editorWrapper.contains(e.relatedTarget)) {
        editorWrapper.classList.remove('drag-over');
    }
}

/**
 * Handle drop event
 * @param {DragEvent} e - The drag event
 * @param {HTMLTextAreaElement} editor - The editor textarea
 * @param {HTMLElement} editorWrapper - The editor wrapper element
 * @param {Function} updateCallback - Callback to update the preview
 */
async function handleDrop(e, editor, editorWrapper, updateCallback) {
    e.preventDefault();
    e.stopPropagation();
    editorWrapper.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    for (const file of files) {
        if (isValidImageType(file)) {
            await processImageFile(file, editor, updateCallback);
        }
    }
}

/**
 * Handle paste event
 * @param {ClipboardEvent} e - The clipboard event
 * @param {HTMLTextAreaElement} editor - The editor textarea
 * @param {Function} updateCallback - Callback to update the preview
 */
async function handlePaste(e, editor, updateCallback) {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;
    
    const items = clipboardData.items;
    if (!items) return;
    
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
                await processImageFile(file, editor, updateCallback);
            }
            return;
        }
    }
    // If no images found, let the default paste behavior handle text
}

/**
 * Set up image handling event listeners
 * @param {HTMLTextAreaElement} editor - The editor textarea element
 * @param {HTMLElement} editorWrapper - The editor wrapper element
 * @param {Function} updateCallback - Callback function to update the preview
 */
function setupImageHandler(editor, editorWrapper, updateCallback) {
    // Drag and drop events on the editor wrapper
    editorWrapper.addEventListener('dragover', handleDragOver);
    editorWrapper.addEventListener('dragenter', (e) => handleDragEnter(e, editorWrapper));
    editorWrapper.addEventListener('dragleave', (e) => handleDragLeave(e, editorWrapper));
    editorWrapper.addEventListener('drop', (e) => handleDrop(e, editor, editorWrapper, updateCallback));
    
    // Paste event on the editor
    editor.addEventListener('paste', (e) => handlePaste(e, editor, updateCallback));
}
