const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // You can add an actual AJAX form submission here
    // For now, we are just simulating a submission

    // Simulate form submission
    setTimeout(function() {
        // Hide form and display success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
    }, 500); // Simulates a slight delay as if processing the form
});
