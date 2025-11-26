/**
 * Download Dropdown Module
 * Handles the download dropdown functionality
 */

/**
 * Initialize the download dropdown
 */
function setupDownloadDropdown() {
    const downloadBtn = document.getElementById('download-btn');
    const downloadDropdown = document.getElementById('download-dropdown');

    if (!downloadBtn || !downloadDropdown) {
        return;
    }

    /**
     * Toggle dropdown visibility
     */
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = downloadDropdown.classList.toggle('open');
        downloadBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    /**
     * Close dropdown when clicking outside
     */
    document.addEventListener('click', (e) => {
        if (!downloadDropdown.contains(e.target) && !downloadBtn.contains(e.target)) {
            downloadDropdown.classList.remove('open');
            downloadBtn.setAttribute('aria-expanded', 'false');
        }
    });

    /**
     * Close dropdown on Escape key
     */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && downloadDropdown.classList.contains('open')) {
            downloadDropdown.classList.remove('open');
            downloadBtn.setAttribute('aria-expanded', 'false');
            downloadBtn.focus();
        }
    });
}
