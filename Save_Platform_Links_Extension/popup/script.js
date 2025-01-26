document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('linksContainer');
    const platformInput = document.getElementById('platformInput');
    const linkInput = document.getElementById('linkInput');
    const addLinkButton = document.getElementById('addLinkButton');

    // Retrieve stored links from localStorage
    const storedLinks = JSON.parse(localStorage.getItem('profileLinks')) || {};

    // Function to render links
    const renderLinks = () => {
        linksContainer.innerHTML = '';
        Object.entries(storedLinks).forEach(([platform, link]) => {
            const linkElement = document.createElement('div');
            linkElement.className = 'link-card';
            linkElement.innerHTML = `
                <span>${platform}</span>
                <div>
                    <button 
                        class="copy-btn"
                        data-link="${link}">
                        Copy
                    </button>
                    <button 
                        class="delete-btn"
                        data-platform="${platform}">
                        Delete
                    </button>
                </div>
            `;
            linksContainer.appendChild(linkElement);
        });

        // Add event listeners to Copy buttons
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const link = e.target.getAttribute('data-link');
                navigator.clipboard.writeText(link).then(() => {
                }).catch(err => {
                    console.error('Error copying text: ', err);
                });
            });
        });

        // Add event listeners to Delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const platform = e.target.getAttribute('data-platform');
                delete storedLinks[platform];
                localStorage.setItem('profileLinks', JSON.stringify(storedLinks));
                renderLinks();
            });
        });
    };

    // Initial rendering of links
    renderLinks();

    // Add Link button click handler
    addLinkButton.addEventListener('click', () => {
        const platform = platformInput.value.trim();
        const link = linkInput.value.trim();

        if (!platform || !link) {
            alert('Please enter both platform name and link.');
            return;
        }

        storedLinks[platform] = link;
        localStorage.setItem('profileLinks', JSON.stringify(storedLinks));
        renderLinks();
        platformInput.value = '';
        linkInput.value = '';
    });
});
