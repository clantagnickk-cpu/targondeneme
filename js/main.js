// Theme Initialization (Runs immediately to prevent flash)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    });

    // Dynamic Cursor & Glow Element Creation
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    // Cursor Tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    
    // Disable custom cursor on mobile
    const isMobile = window.matchMedia("(max-width: 992px)").matches;

    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate dot follow
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smooth glow follower
        function animateGlow() {
            // Easing
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        // Add hover effects for cursor dot
        const interactables = document.querySelectorAll('a, button, input, textarea, .service-card, .about-image');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
                dot.style.background = 'transparent';
                dot.style.border = '1px solid var(--accent-cyan)';
            });
            el.addEventListener('mouseleave', () => {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
                dot.style.background = 'var(--accent-cyan)';
                dot.style.border = 'none';
            });
        });
    }

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Navbar logic
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress logic
        const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPx / winHeightPx) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = document.querySelector('.mobile-toggle i');

    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-times');
            } else {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
    }

    // Scroll Reveal Animation (Upgraded for smoother feeling)
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        var windowHeight = window.innerHeight;
        var elementVisible = 100;

        reveals.forEach(reveal => {
            var elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    // Trigger once on load with slight delay for initial layout
    setTimeout(reveal, 100);

    // Scroll Progress Bar Logic
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});
