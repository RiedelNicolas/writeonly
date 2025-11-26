/**
 * Divider Module
 * Handles drag-to-resize functionality between editor and preview panes
 */

/**
 * Minimum width percentage for each pane
 * @constant {number}
 */
const MIN_PANE_PERCENT = 20;

/**
 * Set up divider drag functionality
 * @param {HTMLElement} divider - The divider element
 * @param {HTMLElement} editorPane - The editor pane element
 * @param {HTMLElement} previewPane - The preview pane element
 * @param {HTMLElement} container - The container element holding both panes
 */
function setupDivider(divider, editorPane, previewPane, container) {
    let isDragging = false;

    /**
     * Handle mouse down event on divider
     * @param {MouseEvent} e - The mouse event
     */
    function onMouseDown(e) {
        isDragging = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        divider.classList.add('dragging');
    }

    /**
     * Handle mouse move event during drag
     * @param {MouseEvent} e - The mouse event
     */
    function onMouseMove(e) {
        if (!isDragging) return;

        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const offsetX = e.clientX - containerRect.left;

        // Calculate percentage
        let editorPercent = (offsetX / containerWidth) * 100;

        // Apply minimum constraints
        if (editorPercent < MIN_PANE_PERCENT) {
            editorPercent = MIN_PANE_PERCENT;
        } else if (editorPercent > 100 - MIN_PANE_PERCENT) {
            editorPercent = 100 - MIN_PANE_PERCENT;
        }

        const previewPercent = 100 - editorPercent;

        // Apply the new widths
        editorPane.style.flex = `0 0 ${editorPercent}%`;
        previewPane.style.flex = `0 0 ${previewPercent}%`;
    }

    /**
     * Handle mouse up event to end drag
     */
    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        divider.classList.remove('dragging');
    }

    // Attach event listeners
    divider.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
