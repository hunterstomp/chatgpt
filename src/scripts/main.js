// Main JavaScript file for Q10UX Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('/src/partials/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('/src/partials/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});
