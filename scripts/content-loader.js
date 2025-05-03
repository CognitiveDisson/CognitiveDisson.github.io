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
        console.log('Loading markdown from:', url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Failed to load markdown:', response.statusText);
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        console.log('Markdown content loaded:', text.substring(0, 100) + '...');
        return marked.parse(text, {
            gfm: true,
            breaks: true,
            headerIds: true
        });
    } catch (error) {
        console.error('Error loading markdown:', error);
        // Fallback content for local development
        return `
            <h1>Error Loading Post</h1>
            <p>Could not load the post content. Please make sure you're running a local server.</p>
            <p>Error: ${error.message}</p>
            <p>Try running: <code>python -m http.server 8000</code></p>
        `;
    }
}

// Function to create navigation buttons
function createNavButtons(navigation) {
    return navigation.map(nav => 
        `<a href="${nav.href}" class="btn">${nav.text}</a>`
    ).join('');
}

// Function to create skill tags
function createSkillTags(skills) {
    return skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// Function to create social links
function createSocialLinks(social) {
    return social.map(link => 
        `<a href="${link.url}" class="social-link">${link.name}</a>`
    ).join('');
}

// Function to populate header
function populateHeader(data) {
    const header = document.querySelector('.page-header');
    header.innerHTML = `
        <h1 class="project-name">${data.header.title}</h1>
        <h2 class="project-subtitle">${data.header.subtitle}</h2>
        <p class="project-tagline">
            ╔══════════════════╗<br>
            ${data.header.tagline}<br>
            ╚══════════════════╝
        </p>
        <nav class="header-nav">
            ${createNavButtons(data.header.navigation)}
        </nav>
    `;
}

// Function to populate about section
function populateAbout(data) {
    const about = document.getElementById('about');
    about.innerHTML = `
        <h2>${data.about.title}</h2>
        <p>${data.about.description}</p>
        
        <div class="skills-container">
            <h3>${data.about.skills.title}</h3>
            <div class="skill-tags">
                ${data.about.skills.items.map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
            </div>
        </div>

        <div class="experience-section">
            <h3>${data.about.experience.title}</h3>
            ${data.about.experience.items.map(exp => `
                <div class="experience-item">
                    <h4>${exp.company}</h4>
                    <p class="role">${exp.role}</p>
                    <p class="duration">${exp.duration}</p>
                </div>
            `).join('')}
        </div>

        <div class="education-section">
            <h3>${data.about.education.title}</h3>
            ${data.about.education.items.map(edu => `
                <div class="education-item">
                    <h4>${edu.school}</h4>
                    <p>${edu.degree}</p>
                    <p class="duration">${edu.duration}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to create post cards
function createPostCards(posts) {
    return posts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <h3>${post.title}</h3>
            <div class="post-date">${new Date(post.date).toLocaleDateString()}</div>
            <p>${post.description}</p>
            <div class="post-links">
                <a href="./posts/${post.id}.md" class="post-link read-more" data-post-id="${post.id}">Read More</a>
            </div>
        </div>
    `).join('');
}

// Function to populate posts section
async function populatePosts() {
    const postsContainer = document.querySelector('.posts-grid');
    if (!postsContainer) return;

    try {
        const postsData = await loadJSON('./data/posts.json');
        if (!postsData) {
            throw new Error('Failed to load posts data');
        }
        postsContainer.innerHTML = createPostCards(postsData.posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <h3>Failed to load posts</h3>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Function to populate contact section
function populateContact(data) {
    const contact = document.getElementById('contact');
    contact.innerHTML = `
        <h2>${data.contact.title}</h2>
        <p>${data.contact.description}</p>
        <div class="social-links">
            ${data.contact.social.map(link => 
                `<a href="${link.url}" class="social-link">${link.name}</a>`
            ).join('')}
        </div>
    `;
}

// Function to populate footer
function populateFooter(data) {
    const footer = document.querySelector('.site-footer');
    footer.innerHTML = `
        <span class="site-footer-credits">
            ╔══════════════════╗<br>
            ${data.footer.copyright}<br>
            ${data.footer.tagline}<br>
            ╚══════════════════╝
        </span>
    `;
}

// Function to update document metadata
function updateDocumentMetadata(data) {
    document.title = `${data.header.title.replace(/⚔️/g, '').trim()} | ${data.header.subtitle}`;
    document.querySelector('meta[name="description"]').content = 
        `Personal portfolio and blog of ${data.header.subtitle} (${data.header.title.replace(/⚔️/g, '').trim()}) - ${data.header.tagline.replace(/Lvl\.99/g, '')}`;
}

// Add event listener for post clicks
function initializePostLinks() {
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            const postId = e.target.dataset.postId;
            try {
                const content = await loadMarkdown(`./posts/${postId}.md`);
                // Create a modal or update page content with the markdown
                const mainContent = document.querySelector('.main-content');
                mainContent.innerHTML = `
                    <section id="post-content">
                        ${content}
                        <a href="./index.html" class="btn post-link">Back</a>
                    </section>
                `;
            } catch (error) {
                console.error('Error loading post:', error);
            }
        }
    });
}

// Main function to initialize the page
async function initializePage() {
    try {
        const mainData = await loadJSON('./data/main.json');
        if (!mainData) {
            throw new Error('Failed to load main data');
        }

        document.body.innerHTML = `
            <div class="page-wrapper">
                <header class="page-header"></header>
                <main class="main-content">
                    <section id="about"></section>
                    <section id="posts" class="posts-section">
                        <h2>Chronicles</h2>
                        <div class="posts-grid"></div>
                    </section>
                    <section id="chronicles"></section>
                    <section id="contact"></section>
                </main>
                <footer class="site-footer"></footer>
            </div>
        `;
        
        updateDocumentMetadata(mainData);
        populateHeader(mainData);
        populateAbout(mainData);
        await populatePosts();
        populateContact(mainData);
        populateFooter(mainData);
        initializePostLinks();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);