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

// Add scroll progress indicator functionality
const updateScrollProgress = () => {
    const scrollIndicator = document.querySelector('.scroll-progress-indicator');
    
    if (!scrollIndicator) return;
    
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    
    // Calculate scroll percentage
    const scrollPercentage = Math.round((scrollPosition / windowHeight) * 100);
    
    // Update indicator text
    scrollIndicator.textContent = `${scrollPercentage}%`;
    
    // Make indicator more visible when scrolling
    scrollIndicator.style.opacity = '1';
    
    // Reset opacity after a delay
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        scrollIndicator.style.opacity = '0.8';
    }, 1500);
};

// Track scroll position
window.addEventListener('scroll', updateScrollProgress);

// Initialize scroll indicator on page load
document.addEventListener('DOMContentLoaded', updateScrollProgress);

// Typing animation with proper grammar and special case for "Driven"
const professionsArray = ["Computer Science Student", "Coder", "Driven", "Innovator", "Enthusiast", "Engineer", "Artist"];
let currentProfessionIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeText() {
    const professionElement = document.getElementById('profession');
    const currentProfession = professionsArray[currentProfessionIndex];
    
    // Special case for "Driven" which doesn't need an article
    if (currentProfession === "Driven") {
        // Update text to not include an article
        const typingContainer = document.querySelector('.typing-text');
        if (typingContainer) {
            typingContainer.childNodes[0].nodeValue = "I'm ";
        }
    } else {
        // Determine if we need "a" or "an" based on the first letter of the profession
        const firstLetter = currentProfession.charAt(0).toLowerCase();
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const article = vowels.includes(firstLetter) ? 'an' : 'a';
        
        // Update the text before the profession element
        const typingContainer = document.querySelector('.typing-text');
        if (typingContainer) {
            typingContainer.childNodes[0].nodeValue = `I'm ${article} `;
        }
    }
    
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

// Function to get appropriate icon for programming languages
const getLanguageIcon = (language) => {
    // Map common languages to their Font Awesome or custom icons
    const languageIcons = {
        'JavaScript': '<i class="fab fa-js-square"></i>',
        'TypeScript': '<i class="fab fa-js-square" style="color: #007acc;"></i>',
        'HTML': '<i class="fab fa-html5"></i>',
        'CSS': '<i class="fab fa-css3-alt"></i>',
        'Python': '<i class="fab fa-python"></i>',
        'Java': '<i class="fab fa-java"></i>',
        'PHP': '<i class="fab fa-php"></i>',
        'C#': '<i class="fab fa-microsoft"></i>',
        'C++': '<span class="language-icon">C++</span>',
        'C': '<span class="language-icon">C</span>',
        'Ruby': '<i class="fab fa-ruby"></i>',
        'Swift': '<i class="fab fa-swift"></i>',
        'Kotlin': '<span class="language-icon">K</span>',
        'Go': '<span class="language-icon">Go</span>',
        'Rust': '<span class="language-icon">Rs</span>',
        'Dart': '<span class="language-icon">Dt</span>',
        'R': '<span class="language-icon">R</span>',
        'Shell': '<i class="fas fa-terminal"></i>',
        'PowerShell': '<i class="fas fa-terminal"></i>',
        'Dockerfile': '<i class="fab fa-docker"></i>',
        'Vue': '<i class="fab fa-vuejs"></i>',
        'React': '<i class="fab fa-react"></i>',
        'Angular': '<i class="fab fa-angular"></i>',
    };

    return languageIcons[language] || `<span class="language-icon">${language.charAt(0)}</span>`;
};

// Language color mapping
const getLanguageColor = (language) => {
    // Language colors inspired by GitHub's language colors
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'PHP': '#4F5D95',
        'C#': '#178600',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Dart': '#00B4AB',
        'R': '#198CE7',
        'Shell': '#89e051',
        'PowerShell': '#012456',
        'Vue': '#41B883',
        'React': '#61DAFB',
        'Angular': '#DD0031',
    };
    
    return colors[language] || '#8f8f8f';
};

// Function to fetch GitHub repositories with improved error handling
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
        
        // Handle rate limit exceeded error
        if (response.status === 403 && repos.message && repos.message.includes('rate limit')) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        
        if (response.status !== 200) {
            throw new Error(repos.message || 'Error fetching repositories');
        }
        
        console.log(`Repositories found: ${repos.length}`);
        
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
            
            // Determine if we have a homepage link for the demo button
            const hasDemo = repo.homepage && repo.homepage.trim() !== '';
            
            // Create basic card structure while waiting for languages
            card.innerHTML = `
                <div class="project-info">
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">${description}</p>
                    <div class="project-tech">
                        <span class="tech-tag">Loading languages...</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="github-link">
                            <i class="fab fa-github"></i> View Source
                        </a>
                        ${hasDemo ? `
                        <a href="${repo.homepage}" target="_blank" class="demo-link">
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
                    
                    // Update the languages section with icons
                    const techDiv = card.querySelector('.project-tech');
                    techDiv.innerHTML = languagesList.length > 0 
                        ? languagesList.map(lang => 
                            `<span class="tech-tag" style="background-color: ${getLanguageColor(lang)}20; color: ${getLanguageColor(lang)};">
                                ${getLanguageIcon(lang)} ${lang}
                            </span>`).join('') 
                        : '<span class="tech-tag"><i class="fas fa-code"></i> No languages detected</span>';
                })
                .catch(err => {
                    console.error(`Error fetching languages for ${repo.name}:`, err);
                    const techDiv = card.querySelector('.project-tech');
                    techDiv.innerHTML = '<span class="tech-tag">Error loading languages</span>';
                });
        });
    } catch (error) {
        console.error('Error fetching repositories:', error);
        
        // Create a more user-friendly error message for rate limiting
        let errorMessage = error.message;
        let helpText = 'Please refresh the page to try again.';
        
        if (error.message.includes('rate limit')) {
            errorMessage = 'GitHub API rate limit exceeded';
            helpText = `
                <p>This happens when too many requests are made from one location.</p>
                <p>You can:</p>
                <ul style="text-align: left; max-width: 400px; margin: 10px auto;">
                    <li>Wait a few minutes and try again</li>
                    <li>View projects directly on <a href="https://github.com/${username}" target="_blank" style="color: var(--primary-color);">GitHub</a></li>
                </ul>
            `;
        }
        
        repoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                <p style="font-size: 1.2rem; font-weight: 500; margin-bottom: 15px;">${errorMessage}</p>
                <div class="error-details">${helpText}</div>
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
window.addEventListener('mousemove', (e) => {
    // Only apply parallax on devices that are likely not touch devices
    if (window.innerWidth > 768) {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // Move emoji in slightly different direction for depth effect
        if (emoji) {
            emoji.style.transform = `translate(${moveX * -0.2}px, ${moveY * -0.2}px) rotate(${moveX * 0.5}deg)`;
        }
    }
});

// Improved blob interaction - when mouse hovers on blob

// Add hover effect for the emoji
if (blob) {
    blob.addEventListener('mouseenter', () => {
        if (emoji) {
            emoji.style.transform = 'scale(1.2) rotate(10deg)';
            emoji.style.transition = 'transform 0.3s ease';
        }
    });
    
    blob.addEventListener('mouseleave', () => {
        if (emoji) {
            emoji.style.transform = '';
            emoji.style.transition = 'transform 0.3s ease';
        }
    });
}

// Parallax effect for blob in hero section - modified without particles
window.addEventListener('mousemove', (e) => {
    // Only apply parallax on devices that are likely not touch devices
    if (window.innerWidth > 768) {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        if (blob) {
            blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        // Move emoji in slightly different direction for depth effect
        if (emoji) {
            emoji.style.transform = `translate(${moveX * -0.2}px, ${moveY * -0.2}px) rotate(${moveX * 0.5}deg)`;
        }
    }
});

// Remove particle generation functions and events
// Delete or comment out createParticles() function

// Enhanced parallax effect for blob - simplified without particles
window.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    
    const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 40;
    
    // Move blob with more pronounced effect
    if (blob) {
        blob.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.1}deg)`;
    }
    
    // Move emoji in opposite direction for depth effect
    if (emoji) {
        emoji.style.transform = `translate(${moveX * -0.2}px, ${moveY * -0.2}px) rotate(${moveX * -0.3}deg)`;
    }
    
    // Add subtle shadow change based on movement
    if (blob) {
        const shadowX = moveX * 0.5;
        const shadowY = moveY * 0.5;
        blob.style.boxShadow = `${shadowX}px ${shadowY}px 50px rgba(255, 127, 80, 0.3)`;
    }
});

// Modify the DOMContentLoaded event to remove createParticles call
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    console.log('DOM content loaded, fetching repositories...');
    // Fetch repositories with a short delay to let the page render
    setTimeout(fetchGitHubRepos, 1000);
    
    // Remove createParticles call and related window resize listener
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

// Completely new implementation of Skills carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all resources to load
    window.addEventListener('load', () => {
        initSkillsCarousel();
    });
    
    function initSkillsCarousel() {
        const skillsTrack = document.querySelector('.skills-track');
        if (!skillsTrack) {
            console.error("Skills track element not found");
            return;
        }
        
        console.log("Initializing skills carousel");
        
        // Clone items for smooth infinite loop
        const originalItems = Array.from(skillsTrack.querySelectorAll('.skill-item'));
        if (originalItems.length === 0) {
            console.error("No skill items found");
            return;
        }
        
        // Clear any existing clones first
        const allItems = skillsTrack.querySelectorAll('.skill-item');
        const originalItemsCount = originalItems.length;
        
        // Remove any previously cloned items (those beyond the original count)
        for (let i = allItems.length - 1; i >= originalItemsCount; i--) {
            if (allItems[i].parentNode === skillsTrack) {
                skillsTrack.removeChild(allItems[i]);
            }
        }
        
        // Clone original items and append them
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('data-cloned', 'true');
            skillsTrack.appendChild(clone);
        });
        
        // Add another set to ensure smooth looping
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('data-cloned', 'true');
            skillsTrack.appendChild(clone);
        });
        
        // Set up manual animation with requestAnimationFrame
        let scrollPosition = 0;
        let scrollSpeed = 0.5; // pixels per frame
        let isPaused = false;
        let animationId = null;
        
        // Calculate when to reset position (halfway through the duplicated content)
        const firstSetWidth = originalItems.reduce((total, item) => {
            return total + item.offsetWidth + parseInt(getComputedStyle(item).marginLeft) + 
                   parseInt(getComputedStyle(item).marginRight);
        }, 0);
        
        function step() {
            if (!isPaused) {
                scrollPosition += scrollSpeed;
                
                // Reset position when we've scrolled past the first set
                if (scrollPosition >= firstSetWidth) {
                    scrollPosition = 0;
                }
                
                skillsTrack.style.transform = `translateX(-${scrollPosition}px)`;
            }
            animationId = requestAnimationFrame(step);
        }
        
        // Start animation
        animationId = requestAnimationFrame(step);
        
        // Add pause/resume on hover
        skillsTrack.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        skillsTrack.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Add pause/resume on touch for mobile
        skillsTrack.addEventListener('touchstart', () => {
            isPaused = true;
        });
        
        skillsTrack.addEventListener('touchend', () => {
            isPaused = false;
        });
        
        // Clean up on page hide/unload
        window.addEventListener('pagehide', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            isPaused = document.hidden;
        });
        
        // Reset on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate firstSetWidth
                const updatedFirstSetWidth = Array.from(skillsTrack.querySelectorAll('.skill-item'))
                    .slice(0, originalItemsCount)
                    .reduce((total, item) => {
                        return total + item.offsetWidth + parseInt(getComputedStyle(item).marginLeft) + 
                               parseInt(getComputedStyle(item).marginRight);
                    }, 0);
                
                // Update the calculated width
                firstSetWidth = updatedFirstSetWidth;
                
                // Reset position if needed
                if (scrollPosition >= firstSetWidth) {
                    scrollPosition = 0;
                    skillsTrack.style.transform = `translateX(0)`;
                }
            }, 300);
        });
        
        console.log("Skills carousel initialized successfully");
    }
    
    // Re-initialize if About section becomes visible
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initSkillsCarousel();
                }
            });
        }, {threshold: 0.1});
        
        observer.observe(aboutSection);
    }
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

const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;