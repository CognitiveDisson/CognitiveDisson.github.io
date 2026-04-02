// Function to load post content
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = 'index.html';
        return;
    }

    const postsData = await loadJSON('./data/posts.json');
    if (!postsData) {
        window.location.href = 'index.html';
        return;
    }

    const posts = postsData.posts || [];
    const post = posts.find(p => p.id === postId);
    if (!post) {
        window.location.href = 'index.html';
        return;
    }

    // Load main data for site header
    const mainData = await loadJSON('./data/main.json');
    const siteName = mainData?.header?.name || 'My Blog';

    // Update page title
    document.title = `${post.title} | ${siteName}`;

    // Populate header
    if (mainData?.header) {
        const hero = document.getElementById('hero');
        if (hero) {
            hero.innerHTML = `
                <div class="hero-card">
                    <div class="rune-field"></div>
                    <div class="particle-field"></div>
                    <div class="hero">
                        <div class="hero-avatar">
                            <img src="${mainData.header.avatar}" alt="${mainData.header.name} avatar">
                        </div>
                        <div class="hero-text">
                            <div class="hero-name">${mainData.header.name}</div>
                            <div class="hero-meta">
                                <span class="hero-role">${mainData.header.role}</span>
                                <span class="hero-location">📍 ${mainData.header.location}</span>
                            </div>
                            <div class="hero-badge">${mainData.header.title}</div>
                            <div class="hero-tagline">${mainData.header.tagline}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Load post content from markdown file
    const postContent = document.getElementById('post-content');
    if (postContent) {
        const markdownContent = await loadMarkdown(`./posts/${post.file}`);
        postContent.innerHTML = `
            <a href="javascript:history.back()" class="btn close-btn">←</a>
            <div class="post-header">
                <div class="post-date">${new Date(post.date).toLocaleDateString()}</div>
            </div>
            <div class="post-body">
                ${markdownContent}
            </div>
        `;
        // Move post content below the main content
        document.querySelector('.main-content').appendChild(postContent);
    }
}

// Load footer content
async function loadFooter() {
    const data = await loadJSON('./data/main.json');
    if (data) {
        document.getElementById('footer-credits').innerHTML = `
            ╔══════════════════╗<br>
            ${data.footer.copyright}<br>
            ${data.footer.tagline}<br>
            ╚══════════════════╝
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    loadFooter();
});
