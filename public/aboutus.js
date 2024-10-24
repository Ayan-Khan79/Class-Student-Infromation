document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor click behavior
        const targetPage = this.getAttribute('href');

        // Fade out effect
        document.body.style.transition = 'opacity 0.3s ease'; // Transition for body
        document.body.style.opacity = '0'; // Start fading out

        setTimeout(() => {
            window.location.href = targetPage; // Redirect to new page
        }, 300); // Match this time with the CSS transition time
    });
});