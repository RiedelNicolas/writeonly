/**
 * Markdown Parser Module
 * Converts Markdown text to HTML
 */

/**
 * Parse Markdown text and convert it to HTML
 * @param {string} text - The Markdown text to parse
 * @returns {string} The parsed HTML
 */
function parseMarkdown(text) {
    if (!text.trim()) {
        return '<p class="placeholder">Your preview will appear here...</p>';
    }

    let html = text;

    // Escape HTML to prevent XSS
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks (must be before other replacements)
    // Note: content is already HTML-escaped from above
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        // Sanitize language identifier to only allow alphanumeric characters
        const safeLang = lang.replace(/[^a-zA-Z0-9]/g, '');
        return `<pre><code class="language-${safeLang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    html = html.replace(/^___$/gm, '<hr>');

    // Images (before links to avoid conflict)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists - use placeholder markers to distinguish list types
    html = html.replace(/^[\*\-] (.+)$/gm, '<!--UL_ITEM-->$1<!--/UL_ITEM-->');
    
    // Ordered lists - use placeholder markers to distinguish list types
    html = html.replace(/^\d+\. (.+)$/gm, '<!--OL_ITEM-->$1<!--/OL_ITEM-->');

    // Wrap consecutive unordered list items
    html = html.replace(/(<!--UL_ITEM-->.*<!--\/UL_ITEM-->\n?)+/g, (match) => {
        const items = match.replace(/<!--UL_ITEM-->/g, '<li>').replace(/<!--\/UL_ITEM-->/g, '</li>');
        return '<ul>' + items + '</ul>';
    });

    // Wrap consecutive ordered list items
    html = html.replace(/(<!--OL_ITEM-->.*<!--\/OL_ITEM-->\n?)+/g, (match) => {
        const items = match.replace(/<!--OL_ITEM-->/g, '<li>').replace(/<!--\/OL_ITEM-->/g, '</li>');
        return '<ol>' + items + '</ol>';
    });

    // Paragraphs - wrap remaining text
    const lines = html.split('\n');
    let result = [];
    let paragraphContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isBlock = line.startsWith('<h') || 
                       line.startsWith('<ul') || 
                       line.startsWith('<ol') || 
                       line.startsWith('<li') ||
                       line.startsWith('<blockquote') || 
                       line.startsWith('<pre') ||
                       line.startsWith('<hr') ||
                       line.startsWith('</');

        if (line.trim() === '') {
            if (paragraphContent.length > 0) {
                result.push('<p>' + paragraphContent.join(' ') + '</p>');
                paragraphContent = [];
            }
            continue;
        }

        if (isBlock) {
            if (paragraphContent.length > 0) {
                result.push('<p>' + paragraphContent.join(' ') + '</p>');
                paragraphContent = [];
            }
            result.push(line);
        } else {
            paragraphContent.push(line);
        }
    }

    if (paragraphContent.length > 0) {
        result.push('<p>' + paragraphContent.join(' ') + '</p>');
    }

    return result.join('\n');
}
