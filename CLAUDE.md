# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WriteOnly is a minimal, single-page Markdown editor with live split-screen HTML preview. Built with plain HTML, CSS, and vanilla JavaScript - no build tools, frameworks, or bundlers.

## Development

No build or install steps required. Open `index.html` directly in a browser or use any static file server:

```bash
python -m http.server 8000
# or
npx serve .
```

## Architecture

The application is a single HTML page (`index.html`) that loads modular JavaScript files:

- **app.js** - Entry point, initializes all modules and sets up the update loop
- **editor.js** - Editor event handling (input, scroll sync, keyboard shortcuts)
- **markdown-parser.js** - Wraps the `marked` library with XSS-safe link rendering
- **syntax-highlighter.js** - Applies syntax highlighting overlay to editor text
- **storage.js** - LocalStorage persistence for editor content
- **divider.js** - Resizable pane divider functionality
- **download.js** - Export to PDF/MD/HTML using html2pdf.js
- **mobile.js** - Toggle between editor/preview on mobile

External dependencies (loaded via CDN):
- `marked` - Markdown parsing
- `html2pdf.js` - PDF generation

## Code Style

### JavaScript
- Use JSDoc comments with `@param` and `@returns` for all functions
- No external libraries except marked and html2pdf.js (loaded via CDN)
- Functions should be small and single-purpose

### CSS
- Dark theme colors: background `#1e1e1e`, secondary `#2d2d2d`, text `#d4d4d4`, accent blue `#569cd6`, accent green `#4ec9b0`
- Use kebab-case for class names

## Security

- The Markdown parser escapes HTML and validates URL protocols to prevent XSS
- External links use `target="_blank"` with `rel="noopener noreferrer nofollow"`
