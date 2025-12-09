// Load and render JSON data
document.addEventListener('DOMContentLoaded', function() {
    loadJSON();
    setupFAQ();
    setupCTAButtons();
});

async function loadJSON() {
    try {
        // Try fetch API first (works with http/https)
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.warn('Fetch API failed (might be running from file:// protocol), trying FileReader fallback...', error);

        // Fallback for file:// protocol - try to read file directly
        try {
            await loadJSONWithFileReader();
        } catch (fallbackError) {
            console.error('FileReader fallback also failed:', fallbackError);
            document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 1.5rem; color: red;">Error loading data. Please use a local server (see RUN-LOCAL.md) or ensure data.json exists.</div>';
        }
    }
}

async function loadJSONWithFileReader() {
    return new Promise((resolve, reject) => {
        // This will only work if the browser supports it and user has permission
        // For most cases, running a local server is recommended
        const scriptPath = document.currentScript?.src;
        const basePath = scriptPath ? scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1) : '';

        // Try to use the File System Access API (if available)
        if ('showOpenFilePicker' in window) {
            console.log('File System Access API is available but requires user interaction.');
            showManualLoadOption();
            reject(new Error('File System Access API requires user interaction'));
        } else {
            console.error('Cannot load data.json from file:// protocol. Please use a local server.');
            showManualLoadOption();
            reject(new Error('Cannot load from file:// protocol'));
        }
    });
}

function showManualLoadOption() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;';
    errorDiv.innerHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 15px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #856404; margin-bottom: 20px;">⚠️ Running from File System</h2>
            <p style="color: #856404; font-size: 1.1rem; line-height: 1.6;">
                You are trying to open the website directly from the file system.
            </p>
        </div>

        <div style="background: #f8f9ff; border: 2px solid #e1e5f0; border-radius: 15px; padding: 30px;">
            <h3 style="color: #333; margin-bottom: 20px;">Quick Fix:</h3>

            <div style="text-align: left; background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">Option 1: Use Local Server (Recommended)</h4>
                <p style="margin-bottom: 15px; color: #666;">Run this command in terminal:</p>
                <code style="background: #f0f0f0; padding: 10px; border-radius: 5px; display: block; font-family: 'Monaco', monospace;">python server.py</code>
                <p style="margin-top: 15px; color: #666; font-size: 0.9rem;">Or on Windows: double-click <code>server.bat</code></p>
            </div>

            <div style="text-align: left; background: white; border-radius: 10px; padding: 20px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">Option 2: Open Keyword Density Tool Directly</h4>
                <p style="margin-bottom: 15px; color: #666;">The keyword density calculator works directly from file system:</p>
                <a href="keyword-density.html" style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">Open Keyword Density Tool</a>
            </div>
        </div>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(errorDiv);
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
