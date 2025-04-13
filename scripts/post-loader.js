// Function to load post content
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }

    const postsData = await loadJSON('./posts/posts.json');
    if (!postsData) {
        window.location.href = 'index.html';
        return;
    }

    const post = postsData.posts.find(p => p.id === postId);
    if (!post) {
        window.location.href = 'index.html';
        return;
    }

    // Load main data for site title
    const mainData = await loadJSON('./data/main.json');
    const baseTitle = mainData?.header?.title?.replace(/⚔️/g, '').trim() || 'My Blog';
    
    // Update page title
    document.title = `${post.title} | ${baseTitle}`;

    // Update header with post title
    document.getElementById('project-name').textContent = post.title.replace(/⚔️/g, '').trim();

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

// Function to load JSON data
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

// Function to load markdown content
async function loadMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        return marked.parse(text);
    } catch (error) {
        console.error('Error loading markdown:', error);
        return `<p>Error loading post content: ${error.message}</p>`;
    }
}

// Function to load footer content
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