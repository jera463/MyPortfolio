// Initialize AOS Animation Library
AOS.init({
    duration: 1000,
    once: true
});

// Contact Form Backend API Integration
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
        document.getElementById('contactForm').reset();
    } catch (err) {
        alert('Nagkaroon ng problema sa pagpapadala ng mensahe.');
    }
});