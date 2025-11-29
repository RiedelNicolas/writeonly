/**
 * Analytics Module
 * Handles Google Analytics tracking for the WriteOnly application
 */

/**
 * Track a download event in Google Analytics
 * @param {string} format - The format of the download (pdf, md, html)
 */
function trackDownload(format) {
    if (typeof gtag === 'function') {
        gtag('event', 'download', {
            'file_format': format
        });
    }
}
