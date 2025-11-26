/**
 * Markdown Parser Module
 * Converts Markdown text to HTML using marked library
 */

// Configure marked options when library is loaded
(function() {
    if (typeof marked === 'undefined') {
        console.error('marked library is not loaded');
        return;
    }
    
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    /**
     * Validate URL protocol to prevent javascript: and other dangerous schemes
     * @param {string} href - URL to validate
     * @returns {string|null} Safe URL or null if invalid
     */
    function getSafeUrl(href) {
        if (!href) return null;
        
        // Allow relative URLs
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('./') || href.startsWith('../')) {
            return href;
        }
        
        // Check for safe protocols
        const lowerHref = href.toLowerCase().trim();
        if (lowerHref.startsWith('http://') || 
            lowerHref.startsWith('https://') || 
            lowerHref.startsWith('mailto:')) {
            return href;
        }
        
        // Block dangerous protocols
        return null;
    }
    
    // Use marked.use() to configure custom renderer for links
    marked.use({
        renderer: {
            link({ href, title, tokens }) {
                const text = this.parser.parseInline(tokens);
                const safeUrl = getSafeUrl(href);
                
                // If URL is not safe, return just the text without a link
                if (safeUrl === null) {
                    return text;
                }
                
                const safeHref = escapeHtml(safeUrl);
                const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
                return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer nofollow">${text}</a>`;
            }
        },
        gfm: true,
        breaks: false
    });
})();

/**
 * Parse Markdown text and convert it to HTML
 * @param {string} text - The Markdown text to parse
 * @returns {string} The parsed HTML
 */
function parseMarkdown(text) {
    if (!text.trim()) {
        return '<p class="placeholder">Your preview will appear here...</p>';
    }

    if (typeof marked === 'undefined') {
        return '<p class="placeholder">Markdown parser not loaded</p>';
    }

    return marked.parse(text);
}
