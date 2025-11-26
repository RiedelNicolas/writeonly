/**
 * Download Dropdown Module
 * Handles the download dropdown functionality
 */

/**
 * Get the current date-time string for file naming
 * @returns {string} Formatted date-time string
 */
function getDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
}

/**
 * Trigger a file download
 * @param {string} content - The file content
 * @param {string} filename - The filename
 * @param {string} mimeType - The MIME type of the file
 */
function triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download content as Markdown file
 */
function downloadAsMD() {
    const editor = document.getElementById('editor');
    if (!editor) {
        console.error('Editor element not found');
        return;
    }
    const content = editor.value;
    const filename = `writeonly_${getDateTimeString()}.md`;
    triggerDownload(content, filename, 'text/markdown');
}

/**
 * Download content as HTML file
 */
function downloadAsHTML() {
    const preview = document.getElementById('preview');
    if (!preview) {
        console.error('Preview element not found');
        return;
    }
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WriteOnly Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
            font-size: 0.9em;
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
        }
        pre {
            background-color: #f4f4f4;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 16px;
            margin: 0 0 16px 0;
            color: #666;
        }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background-color: #f4f4f4; }
        img { max-width: 100%; height: auto; }
        hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    </style>
</head>
<body>
${preview.innerHTML}
</body>
</html>`;
    const filename = `writeonly_${getDateTimeString()}.html`;
    triggerDownload(htmlContent, filename, 'text/html');
}

/**
 * Download content as PDF file
 */
function downloadAsPDF() {
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library is not loaded');
        return;
    }

    const preview = document.getElementById('preview');
    if (!preview) {
        console.error('Preview element not found');
        return;
    }
    
    // Create a temporary container with proper styling for PDF
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = preview.innerHTML;
    tempContainer.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
    `;
    
    // Apply inline styles for PDF rendering
    const style = document.createElement('style');
    style.textContent = `
        h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; color: #000; }
        h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 16px; }
        code { font-family: monospace; font-size: 0.9em; background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        pre { background-color: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin: 0 0 16px 0; color: #666; }
        a { color: #0366d6; }
        ul, ol { margin-bottom: 16px; padding-left: 24px; }
        li { margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background-color: #f4f4f4; }
        img { max-width: 100%; height: auto; }
        hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    `;
    tempContainer.prepend(style);
    
    const filename = `writeonly_${getDateTimeString()}.pdf`;
    
    const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(options).from(tempContainer).save();
}

/**
 * Close the download dropdown
 */
function closeDropdown() {
    const downloadBtn = document.getElementById('download-btn');
    const downloadDropdown = document.getElementById('download-dropdown');
    if (downloadDropdown) {
        downloadDropdown.classList.remove('open');
    }
    if (downloadBtn) {
        downloadBtn.setAttribute('aria-expanded', 'false');
    }
}

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

    /**
     * Set up download button handlers
     */
    const pdfBtn = document.getElementById('download-pdf');
    const mdBtn = document.getElementById('download-md');
    const htmlBtn = document.getElementById('download-html');

    if (pdfBtn) {
        pdfBtn.addEventListener('click', () => {
            downloadAsPDF();
            closeDropdown();
        });
    }

    if (mdBtn) {
        mdBtn.addEventListener('click', () => {
            downloadAsMD();
            closeDropdown();
        });
    }

    if (htmlBtn) {
        htmlBtn.addEventListener('click', () => {
            downloadAsHTML();
            closeDropdown();
        });
    }
}
