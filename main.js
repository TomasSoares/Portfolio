// Remove loading screen code
// window.addEventListener('load', () => {
//     const loadingScreen = document.querySelector('.loading-screen');
//     setTimeout(() => {
//         loadingScreen.style.opacity = '0';
//         loadingScreen.style.visibility = 'hidden';
//     }, 1500);
// });

const updateScrollProgress = () => {
    const scrollIndicator = document.querySelector('.scroll-progress-indicator');
    
    if (!scrollIndicator) return;
    
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    
    const scrollPercentage = Math.round((scrollPosition / windowHeight) * 100);
    
    scrollIndicator.textContent = `${scrollPercentage}%`;
    scrollIndicator.style.opacity = '1';
    
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        scrollIndicator.style.opacity = '0.8';
    }, 1500);
};

window.addEventListener('scroll', updateScrollProgress);
document.addEventListener('DOMContentLoaded', updateScrollProgress);

const professionsArray = ["Computer Science Student", "Coder", "Driven", "Innovator", "Enthusiast", "Engineer", "Artist"];
let currentProfessionIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeText() {
    const professionElement = document.getElementById('profession');
    const currentProfession = professionsArray[currentProfessionIndex];
    
    if (currentProfession === "Driven") {
        const typingContainer = document.querySelector('.typing-text');
        if (typingContainer) {
            typingContainer.childNodes[0].nodeValue = "I'm ";
        }
    } else {
        const firstLetter = currentProfession.charAt(0).toLowerCase();
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const article = vowels.includes(firstLetter) ? 'an' : 'a';
        
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
        typingDelay = 1500;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentProfessionIndex = (currentProfessionIndex + 1) % professionsArray.length;
        typingDelay = 500;
    }
    
    setTimeout(typeText, typingDelay);
}

// Delay the start of typing animation to match other elements
document.addEventListener('DOMContentLoaded', () => {
    // Wait 700ms before starting the typing animation (600ms delay + 100ms buffer)
    setTimeout(typeText, 700);
    
    // ...existing DOMContentLoaded code...
    updateScrollProgress();
});

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
    section.classList.add('fade-in-section');
});

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
    
    const header = document.querySelector('header');
    if (scrollPosition > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

const repoContainer = document.getElementById('repoContainer');

const showLoading = () => {
    repoContainer.innerHTML = '<div class="repo-loading"><div class="dot-pulse"></div><p class="loading-text">Loading projects...</p></div>';
};

const getLanguageIcon = (language) => {
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
        'Laravel': '<i class="fab fa-laravel"></i>',
        'Batch': '<span class="language-icon">B</span>'
    };

    return languageIcons[language] || `<span class="language-icon">${language.charAt(0)}</span>`;
};

const getLanguageColor = (language) => {
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
        'Laravel': '#FF2D20',
        'Batch': '#4D4D4D'
    };
    
    return colors[language] || '#8f8f8f';
};

const fetchGitHubRepos = async () => {
    showLoading();
    
    try {
        const response = await fetch('assets/json/repos.json');
        
        if (!response.ok) {
            throw new Error('Failed to load repository data');
        }
        
        const data = await response.json();
        const repos = data.repos;
        
        repoContainer.innerHTML = '';
        
        if (repos.length === 0) {
            repoContainer.innerHTML = '<p class="no-repos">No repositories found.</p>';
            return;
        }
        
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
        
        repos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animation = 'none';
            
            const description = repo.description 
                ? (repo.description.length > 100 
                    ? repo.description.substring(0, 97) + '...' 
                    : repo.description) 
                : 'No description provided.';
            
            const hasDemo = repo.homepage && repo.homepage.trim() !== '';
            
            const languagesList = Object.keys(repo.languages).slice(0, 3);
            const languagesHTML = languagesList.length > 0 
                ? languagesList.map(lang => 
                    `<span class="tech-tag" style="background-color: ${getLanguageColor(lang)}20; color: ${getLanguageColor(lang)};">
                        ${getLanguageIcon(lang)} ${lang}
                    </span>`).join('') 
                : '<span class="tech-tag"><i class="fas fa-code"></i> No languages detected</span>';
            
            card.innerHTML = `
                <div class="project-info">
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">${description}</p>
                    <div class="project-tech">
                        ${languagesHTML}
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
            
            setTimeout(() => {
                card.style.animation = `cardAppear 0.6s ease forwards`;
            }, index * 150);
        });
    } catch (error) {
        repoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                <p style="font-size: 1.2rem; font-weight: 500; margin-bottom: 15px;">Error loading projects</p>
                <div class="error-details">
                    <p>Couldn't load project data. Please check if repos.json exists and is properly formatted.</p>
                </div>
            </div>
        `;
    }
};

// Consolidated event listeners
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    setTimeout(fetchGitHubRepos, 1000);
    
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

// Single blob parallax effect
window.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    
    const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 40;
    const blob = document.querySelector('.blob');
    const emoji = document.querySelector('.emoji');
    
    if (blob) {
        blob.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.1}deg)`;
        
        const shadowX = moveX * 0.5;
        const shadowY = moveY * 0.5;
        blob.style.boxShadow = `${shadowX}px ${shadowY}px 50px rgba(255, 127, 80, 0.3)`;
    }
    
    if (emoji) {
        emoji.style.transform = `translate(${moveX * -0.2}px, ${moveY * -0.2}px) rotate(${moveX * -0.3}deg)`;
    }
});

// Add hover effects for blob
const blob = document.querySelector('.blob');
const emoji = document.querySelector('.emoji');

if (blob && emoji) {
    blob.addEventListener('mouseenter', () => {
        emoji.style.transform = 'scale(1.2) rotate(10deg)';
        emoji.style.transition = 'transform 0.3s ease';
    });
    
    blob.addEventListener('mouseleave', () => {
        emoji.style.transform = '';
        emoji.style.transition = 'transform 0.3s ease';
    });
}

const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close mobile menu
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    mobileMenuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
    
    // Improve responsive behavior for skills and projects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.style.opacity = '0';
    });
    
    // Enhanced intersection observer for more responsive animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            if (entry.target.classList.contains('skill-item')) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, entry.target.dataset.delay || 0);
            }
            
            observer.unobserve(entry.target);
        });
    }, observerOptions);
    
    skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 50}ms`;
        item.dataset.delay = index * 50;
        appearOnScroll.observe(item);
    });
    
    // Make project cards load more responsively
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        appearOnScroll.observe(card);
    });
    
    // Make scroll performance better on mobile
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
});