# Copilot Instructions for WriteOnly

## Project Overview

WriteOnly is a minimal, single-page Markdown editor featuring a live, split-screen HTML preview. The project is built with plain HTML, CSS, and vanilla JavaScript for ultimate simplicity and performance.

## Technology Stack

- **HTML5**: Single `index.html` page for the entire application
- **CSS**: Plain CSS in `styles/styles.css`
- **JavaScript**: Vanilla JavaScript with modular structure in `scripts/`

No build tools, frameworks, or external dependencies are used.

## Project Structure

```
writeonly/
├── index.html              # Main HTML file
├── scripts/
│   ├── app.js              # Application entry point and initialization
│   ├── editor.js           # Editor functionality (scroll sync, keyboard handling)
│   ├── markdown-parser.js  # Markdown to HTML conversion
│   └── syntax-highlighter.js # Syntax highlighting for the editor
├── styles/
│   └── styles.css          # All CSS styles
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment workflow
```

## Code Style Guidelines

### JavaScript

- Use JSDoc comments for all functions with `@param` and `@returns` documentation
- Use `const` for constants and `let` for variables that need reassignment
- Use descriptive function and variable names
- Keep functions small and focused on a single responsibility
- No external libraries or frameworks - vanilla JavaScript only

### CSS

- Use CSS variables for consistent theming (dark theme)
- Follow the existing naming conventions (kebab-case for class names)
- Maintain the existing dark color scheme:
  - Background: `#1e1e1e`
  - Secondary background: `#2d2d2d`
  - Text: `#d4d4d4`
  - Accent blue: `#569cd6`
  - Accent green: `#4ec9b0`

### HTML

- Use semantic HTML5 elements
- Maintain accessibility with appropriate ARIA attributes where needed
- Keep the single-page architecture

## Security Considerations

- The Markdown parser escapes HTML to prevent XSS attacks
- External links should use `target="_blank"` with `rel="noopener noreferrer nofollow"`
- Sanitize any user input before rendering

## Deployment

The project deploys to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. No build step is required - the static files are deployed directly.

## Key Design Principles

1. **Simplicity**: No build tools, no frameworks, no dependencies
2. **Performance**: Fast loading and responsive editing experience
3. **Focus**: The editor helps users focus entirely on writing
4. **Minimalism**: Clean, distraction-free interface
