// Escape HTML special characters to prevent XSS in error messages
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Load and parse a JSON file
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// Load a markdown file and parse it to HTML
async function loadMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        return marked.parse(text, { gfm: true, breaks: true });
    } catch (error) {
        console.error('Error loading markdown:', error);
        return '<p>Could not load content. Please make sure you\'re running a local server.</p>';
    }
}
