// Load and render JSON data
document.addEventListener('DOMContentLoaded', function() {
    loadJSON();
    setupFAQ();
    setupCTAButtons();
});

async function loadJSON() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.error('Error loading JSON data:', error);
        document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 1.5rem; color: red;">Error loading data. Please refresh the page.</div>';
    }
}

function renderData(data) {
    // Render Metadata
    if (data.Metadata) {
        document.title = data.Metadata.Title;
        document.querySelector('meta[name="description"]').setAttribute('content', data.Metadata.Description);
    }

    // Render Hero section
    if (data.Hero) {
        document.getElementById('promotion').textContent = data.Hero.Promotion;
        document.getElementById('hero-title').textContent = data.Hero.Title;
        document.getElementById('hero-description').textContent = data.Hero.Description;
    }

    // Render Highlights
    if (data.highlights) {
        const highlightsGrid = document.getElementById('highlights-grid');
        highlightsGrid.innerHTML = data.highlights.map(highlight => `
            <div class="highlight-card">
                <h3>${highlight.title}</h3>
                <p>${highlight.description}</p>
            </div>
        `).join('');
    }

    // Render Features
    if (data.Features) {
        document.getElementById('features-title').textContent = data.Features.Title;
        document.getElementById('features-description').innerHTML = data.Features.Description;

        const featuresGrid = document.getElementById('features-grid');
        featuresGrid.innerHTML = data.Features.Items.map(feature => `
            <div class="feature-card">
                <h3>${feature.Title}</h3>
                <p>${feature.Description}</p>
            </div>
        `).join('');
    }

    // Render Testimonials
    if (data.Testimonial) {
        document.getElementById('testimonials-title').textContent = data.Testimonial.Title;
        document.getElementById('testimonials-description').textContent = data.Testimonial.Description;

        const testimonialsGrid = document.getElementById('testimonials-grid');
        testimonialsGrid.innerHTML = data.Testimonial.Items.map(testimonial => `
            <div class="testimonial-card">
                <p class="testimonial-quote">"${testimonial.Quote}"</p>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${testimonial.Name}</h4>
                        <p>${testimonial.Occupation}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render FAQ
    if (data.FAQ) {
        document.getElementById('faq-title').textContent = data.FAQ.Title;
        document.getElementById('faq-description').textContent = data.FAQ.Description;

        const faqList = document.getElementById('faq-list');
        faqList.innerHTML = data.FAQ.Items.map((faq, index) => `
            <div class="faq-item" data-index="${index}">
                <button class="faq-question" onclick="toggleFAQ(${index})">
                    ${faq.Question}
                </button>
                <div class="faq-answer">
                    <p>${faq.Answer}</p>
                </div>
            </div>
        `).join('');
    }

    // Render CTA
    if (data.CTA) {
        document.getElementById('cta-title').textContent = data.CTA.Title;
        document.getElementById('cta-description').textContent = data.CTA.Description;
        document.getElementById('cta-button').textContent = data.CTA.ButtonText;
    }

    // Render Footer
    if (data.Footer) {
        document.getElementById('footer-product-name').textContent = data.Footer.ProductName;
        document.getElementById('footer-description').textContent = data.Footer.ProductDescription;
        document.getElementById('footer-copyright').textContent = data.Footer.Copyright;
    }
}

function setupFAQ() {
    // FAQ functionality will be handled by toggleFAQ function
}

function toggleFAQ(index) {
    const faqItem = document.querySelector(`[data-index="${index}"]`);
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function setupCTAButtons() {
    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simple alert for demo - in real app, this would redirect to sign up page
            alert('This would redirect to the What an AI sign up page!');
        });
    });
}

// Add smooth scrolling for better UX
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
