document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetNode = document.querySelector(targetId);

            if (targetNode) {
                window.scrollTo({
                    top: targetNode.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }

    // Initial check and scroll listener
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load in case elements are purely visible

    // Fetch GitHub Projects
    const fetchGitHubProjects = async () => {
        const username = 'AGDhanasekar';
        const container = document.getElementById('github-projects');

        try {
            // Fetch public repositories, sort by updated
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            const repos = await response.json();

            if (repos.length === 0) {
                container.innerHTML = '<p class="loader">No public repositories found.</p>';
                return;
            }

            // Clear loader
            container.innerHTML = '';

            // Generate Project Cards
            repos.forEach(repo => {
                const language = repo.language ? `<span class="tech-tag">${repo.language}</span>` : '';
                const description = repo.description || 'No description provided for this repository.';

                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <div class="project-header">
                        <svg class="folder-icon" viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                            ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" aria-label="External Link" style="margin-left: 10px;">
                                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                            ` : ''}
                        </div>
                    </div>
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-desc">${description}</p>
                    <div class="project-tech">
                        ${language}
                        ${repo.topics ? repo.topics.slice(0, 3).map(topic => `<span class="tech-tag">${topic}</span>`).join('') : ''}
                    </div>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to fetch github projects:', error);
            container.innerHTML = `
                <div class="loader" style="color: #ff5f56;">
                    Unable to load projects from GitHub.<br>
                    <span style="font-size: 0.8rem; margin-top: 10px; display: block;">${error.message}</span>
                </div>
            `;
        }
    };

    fetchGitHubProjects();
});
