/**
 * Syntax Highlighter Module
 * Provides syntax highlighting for the Markdown editor
 */

/**
 * Apply syntax highlighting to the editor text
 * @param {string} text - The Markdown text to highlight
 * @returns {string} The highlighted HTML
 */
function highlightSyntax(text) {
    if (!text) return '';

    let highlighted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Headings
    highlighted = highlighted.replace(/^(#{1,6} .+)$/gm, '<span class="heading">$1</span>');

    // Bold (use non-greedy matching and process before italic)
    highlighted = highlighted.replace(/(\*\*.*?\*\*)/g, '<span class="bold">$1</span>');
    highlighted = highlighted.replace(/(__.*?__)/g, '<span class="bold">$1</span>');

    // Italic (use negative lookahead to avoid matching ** or __)
    highlighted = highlighted.replace(/(?<!\*)(\*(?!\*).*?(?<!\*)\*)(?!\*)/g, '<span class="italic">$1</span>');
    highlighted = highlighted.replace(/(?<!_)(_(?!_).*?(?<!_)_)(?!_)/g, '<span class="italic">$1</span>');

    // Links and images
    highlighted = highlighted.replace(/(!?\[[^\]]+\]\([^)]+\))/g, '<span class="link">$1</span>');

    // Inline code
    highlighted = highlighted.replace(/(`[^`]+`)/g, '<span class="code">$1</span>');

    // List markers
    highlighted = highlighted.replace(/^([\*\-] )/gm, '<span class="list">$1</span>');
    highlighted = highlighted.replace(/^(\d+\. )/gm, '<span class="list">$1</span>');

    return highlighted;
}
