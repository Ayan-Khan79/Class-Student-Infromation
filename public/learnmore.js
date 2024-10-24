// Add any specific animations or effects here if needed
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
        section.style.transitionDelay = ${index * 0.1}s;
    });
});
// Smooth page transition
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor click behavior
        const targetPage = this.getAttribute('href');

        // Fade out effect
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = targetPage; // Redirect to new page
        }, 300); // Match this time with the CSS transition time
    });
});