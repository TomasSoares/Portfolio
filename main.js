// Custom cursor functionality
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.width = '15px';
    cursor.style.height = '15px';
});

document.addEventListener('mouseup', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
});

// Add hover effects to all clickable elements
const clickables = document.querySelectorAll('a, button, .theme-toggle, input, textarea');

clickables.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.backgroundColor = 'rgba(255, 127, 80, 0.2)'; // Changed from rgba(108, 92, 231, 0.2)
        cursor.style.border = 'none';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.border = '2px solid var(--primary-color)';
    });
});

// Loading screen animation
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Typing animation
const professionsArray = ["Computer Science Student", "Coder", "Passionate", "Innovator", "Enthusiast"];
let currentProfessionIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeText() {
    const professionElement = document.getElementById('profession');
    const currentProfession = professionsArray[currentProfessionIndex];
    
    if (isDeleting) {
        professionElement.textContent = currentProfession.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingDelay = 50;
    } else {
        professionElement.textContent = currentProfession.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingDelay = 150;
    }
    
    if (!isDeleting && currentCharIndex === currentProfession.length) {
        isDeleting = true;
        typingDelay = 1500; // Pause at the end
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentProfessionIndex = (currentProfessionIndex + 1) % professionsArray.length;
        typingDelay = 500; // Pause before typing the next word
    }
    
    setTimeout(typeText, typingDelay);
}

// Start the typing animation
document.addEventListener('DOMContentLoaded', typeText);

// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Change the icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save preference in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-toggle i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Scroll animations with Intersection Observer
const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Remove this since we no longer have skill bars
            // if (entry.target.id === 'about') {
            //    document.querySelectorAll('.skill-level').forEach(skill => {
            //        skill.style.transform = 'scaleX(1)';
            //    });
            // }
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
    section.classList.add('fade-in-section');
});

// Add a CSS class for the animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in-section.in-view {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Active navigation link highlighting based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Header background opacity based on scroll
    const header = document.querySelector('header');
    if (scrollPosition > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// GitHub repository fetching
const repoContainer = document.getElementById('repoContainer');

// Add loading animation
const showLoading = () => {
    repoContainer.innerHTML = '<div class="repo-loading"><div class="dot-pulse"></div><p class="loading-text">Loading projects...</p></div>';
};

// Function to fetch GitHub repositories
const fetchGitHubRepos = async () => {
    // Hardcoded username
    const username = 'TomasSoares';
    
    // Show loading animation
    showLoading();
    
    try {
        console.log(`Fetching repositories for ${username}...`);
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        console.log(`Response status: ${response.status}`);
        console.log(`Repositories found: ${repos.length}`);
        
        if (response.status !== 200) {
            throw new Error(repos.message || 'Error fetching repositories');
        }
        
        // Clear container
        repoContainer.innerHTML = '';
        
        if (repos.length === 0) {
            repoContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
            return;
        }
        
        // Create a style element for card animation
        if (!document.getElementById('card-animation-style')) {
            const cardStyle = document.createElement('style');
            cardStyle.id = 'card-animation-style';
            cardStyle.textContent = `
                @keyframes cardAppear {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `;
            document.head.appendChild(cardStyle);
        }
        
        // Process and display each repository with staggered animations
        repos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animation = 'none'; // Reset animation
            
            console.log(`Processing repo: ${repo.name}`);
            
            // Truncate description if too long
            const description = repo.description 
                ? (repo.description.length > 100 
                    ? repo.description.substring(0, 97) + '...' 
                    : repo.description) 
                : 'No description provided.';
            
            // Create basic card structure while waiting for languages
            card.innerHTML = `
                <div class="project-info">
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">${description}</p>
                    <div class="project-tech">
                        <span class="tech-tag">Loading languages...</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> View on GitHub
                        </a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            `;
            
            repoContainer.appendChild(card);
            
            // Add staggered animation to cards
            setTimeout(() => {
                card.style.animation = `cardAppear 0.6s ease forwards`;
            }, index * 150);
            
            // Get repo languages
            fetch(repo.languages_url)
                .then(response => response.json())
                .then(languages => {
                    const languagesList = Object.keys(languages).slice(0, 3);
                    console.log(`Languages for ${repo.name}: ${languagesList.join(', ')}`);
                    
                    // Update the languages section
                    const techDiv = card.querySelector('.project-tech');
                    techDiv.innerHTML = languagesList.length > 0 
                        ? languagesList.map(lang => `<span class="tech-tag">${lang}</span>`).join('') 
                        : '<span class="tech-tag">No languages detected</span>';
                })
                .catch(err => {
                    console.error(`Error fetching languages for ${repo.name}:`, err);
                    const techDiv = card.querySelector('.project-tech');
                    techDiv.innerHTML = '<span class="tech-tag">Error loading languages</span>';
                });
        });
    } catch (error) {
        console.error('Error fetching repositories:', error);
        repoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error: ${error.message}</p>
                <p class="error-details">Please refresh the page to try again.</p>
            </div>
        `;
    }
};

// Load repositories when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-toggle i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    console.log('DOM content loaded, fetching repositories...');
    // Fetch repositories with a short delay to let the page render
    setTimeout(fetchGitHubRepos, 1000);
});

// Contact form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // This would normally connect to a backend service
    // For demonstration, show a success message
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Message received!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
    
    submitButton.textContent = originalText;
    contactForm.reset();
});

// Parallax effect for blob in hero section
const blob = document.querySelector('.blob');
window.addEventListener('mousemove', (e) => {
    // Only apply parallax on devices that are likely not touch devices
    if (window.innerWidth > 768) {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Input animation for form fields
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add a CSS class for the form input animation
const inputStyle = document.createElement('style');
inputStyle.textContent = `
    .form-group.focused .input-animation {
        width: 100%;
    }
`;
document.head.appendChild(inputStyle);

// Skills carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const skillsTrack = document.querySelector('.skills-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const skillItems = document.querySelectorAll('.skill-item');
    
    let position = 0;
    const itemWidth = 130; // Width of each item including margin
    const visibleItems = Math.floor(skillsTrack.parentElement.offsetWidth / itemWidth);
    
    // Initialize auto-scrolling
    skillsTrack.classList.add('auto-scroll');
    
    // Stop auto-scrolling when controls are used
    const stopAutoScroll = () => {
        skillsTrack.classList.remove('auto-scroll');
    };
    
    // Move to next slide
    const moveNext = () => {
        stopAutoScroll();
        if (position > -(skillItems.length - visibleItems) * itemWidth) {
            position -= itemWidth;
            skillsTrack.style.transform = `translateX(${position}px)`;
        } else {
            // If at the end, quickly reset to start for infinite effect
            position = 0;
            skillsTrack.style.transition = 'none';
            skillsTrack.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                skillsTrack.style.transition = 'transform 0.5s ease';
            }, 50);
        }
        updateActiveItems();
    };
    
    // Move to previous slide
    const movePrev = () => {
        stopAutoScroll();
        if (position < 0) {
            position += itemWidth;
            skillsTrack.style.transform = `translateX(${position}px)`;
        } else {
            // If at the start, quickly jump to end for infinite effect
            position = -(skillItems.length - visibleItems) * itemWidth;
            skillsTrack.style.transition = 'none';
            skillsTrack.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                skillsTrack.style.transition = 'transform 0.5s ease';
            }, 50);
        }
        updateActiveItems();
    };
    
    // Update which items are active based on position
    const updateActiveItems = () => {
        const activeIndex = Math.abs(Math.round(position / itemWidth));
        
        skillItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index >= activeIndex && index < activeIndex + visibleItems) {
                item.classList.add('active');
            }
        });
    };
    
    // Event listeners for buttons
    nextBtn.addEventListener('click', moveNext);
    prevBtn.addEventListener('click', movePrev);
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    skillsTrack.addEventListener('touchstart', (e) => {
        stopAutoScroll();
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    skillsTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        skillsTrack.style.transform = `translateX(${position - diff}px)`;
    });
    
    skillsTrack.addEventListener('touchend', (e) => {
        isDragging = false;
        const currentX = e.changedTouches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) { // Minimum drag distance
            if (diff > 0) {
                moveNext();
            } else {
                movePrev();
            }
        } else {
            // Return to original position if not dragged enough
            skillsTrack.style.transform = `translateX(${position}px)`;
        }
    });
    
    // Mouse drag support
    skillsTrack.addEventListener('mousedown', (e) => {
        stopAutoScroll();
        e.preventDefault();
        startX = e.clientX;
        isDragging = true;
        skillsTrack.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = startX - currentX;
        skillsTrack.style.transform = `translateX(${position - diff}px)`;
    });
    
    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        skillsTrack.style.cursor = 'grab';
        const currentX = e.clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                moveNext();
            } else {
                movePrev();
            }
        } else {
            // Return to original position if not dragged enough
            skillsTrack.style.transform = `translateX(${position}px)`;
        }
    });
    
    // Initialize active items
    updateActiveItems();
    
    // Pause animation on hover
    skillsTrack.addEventListener('mouseenter', () => {
        if (skillsTrack.classList.contains('auto-scroll')) {
            skillsTrack.style.animationPlayState = 'paused';
        }
    });
    
    skillsTrack.addEventListener('mouseleave', () => {
        if (skillsTrack.classList.contains('auto-scroll')) {
            skillsTrack.style.animationPlayState = 'running';
        }
    });
    
    // Reset carousel on window resize
    window.addEventListener('resize', () => {
        position = 0;
        skillsTrack.style.transform = `translateX(${position}px)`;
        updateActiveItems();
    });
    
    // Update skills carousel sizing on window resize
    const updateCarouselForScreenSize = () => {
        const skillsTrack = document.querySelector('.skills-track');
        const skillItems = document.querySelectorAll('.skill-item');
        const container = document.querySelector('.skills-carousel');
        
        if (!skillsTrack || skillItems.length === 0 || !container) return;
        
        // Get actual container width
        const containerWidth = container.offsetWidth;
        
        // Adjust item width based on screen size
        let itemWidth = 130; // Default size
        let marginSize = 15; // Default margin
        
        if (window.innerWidth <= 768) {
            itemWidth = 90;
            marginSize = 10;
        }
        
        if (window.innerWidth <= 576) {
            itemWidth = 80;
            marginSize = 8;
        }
        
        if (window.innerWidth <= 360) {
            itemWidth = 70;
            marginSize = 5;
        }
        
        // Update item styling dynamically
        skillItems.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
            item.style.maxWidth = `${itemWidth}px`;
            item.style.margin = `0 ${marginSize}px`;
        });
        
        // Calculate visible items based on actual container width
        const totalItemWidth = itemWidth + (marginSize * 2);
        const visibleItems = Math.floor(containerWidth / totalItemWidth);
        
        // Reset position
        position = 0;
        skillsTrack.style.transform = `translateX(${position}px)`;
        
        // Update active items
        updateActiveItems();
    };
    
    // Call on load and on resize
    updateCarouselForScreenSize();
    window.addEventListener('resize', updateCarouselForScreenSize);
});

// Disable custom cursor on mobile devices
document.addEventListener('DOMContentLoaded', () => {
    // Check if device is likely a touch device
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };
    
    if (isTouchDevice() || window.innerWidth <= 768) {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'none';
    }
});
