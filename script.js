/**
 * Electrical Engineering Consulting Website
 * JavaScript for mobile navigation, utility functions, and page-specific features
 */

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    setCurrentYear();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize projects page functionality if on projects page
    if (document.querySelector('.project-category')) {
        initProjectsPage();
    }
    
    // Initialize testimonials page functionality if on testimonials page
    // Note: Most testimonials functionality is already in the testimonials.html
    // This is just for any additional initialization needed
    if (document.querySelector('.testimonials-grid')) {
        // Any additional testimonials page initialization can go here
        console.log('Testimonials page loaded');
        
        // We could add specific testimonials page functionality here
        // For example, if we wanted to add filtering or sorting
    }
});

/**
 * Set the current year in the footer copyright notice
 */
function setCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                
                // Reset icon to bars
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset icon to bars
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    // Select all links with hashes
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or links to a different page
            if (href === '#' || href.includes('.html')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * PROJECTS PAGE ENHANCEMENTS
 * Expandable project category system with dynamic project rendering
 */

/**
 * Initialize projects page functionality
 */
function initProjectsPage() {
    // Initialize project toggles
    initProjectToggles();
    
    // Preload project data for all categories
    // This ensures data is available when toggles are clicked
    if (typeof projectData !== 'undefined') {
        console.log('Project data loaded successfully:', Object.keys(projectData).length, 'categories available');
    } else {
        console.warn('Project data not found. Make sure projectData is defined.');
    }
}

/**
 * Initialize toggle buttons for project categories
 */
function initProjectToggles() {
    const toggleButtons = document.querySelectorAll('.view-projects-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            const targetId = this.getAttribute('aria-controls');
            const targetContainer = document.getElementById(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle expanded state
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Update button text
            const btnText = this.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isExpanded ? 'View Related Projects' : 'Hide Projects';
            }
            
            // Toggle container visibility with smooth transition
            if (targetContainer) {
                if (isExpanded) {
                    // Collapse
                    targetContainer.classList.remove('expanded');
                    setTimeout(() => {
                        targetContainer.setAttribute('aria-hidden', 'true');
                    }, 300); // Match CSS transition duration
                } else {
                    // Expand - load projects if not already loaded
                    if (targetContainer.children.length === 0) {
                        loadProjectsForCategory(category, targetContainer);
                    }
                    targetContainer.setAttribute('aria-hidden', 'false');
                    // Small delay to ensure display property changes before expansion
                    setTimeout(() => {
                        targetContainer.classList.add('expanded');
                    }, 10);
                }
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Load and render projects for a specific category
 * @param {string} category - The category identifier
 * @param {HTMLElement} container - The container to render projects into
 */
function loadProjectsForCategory(category, container) {
    // Clear any existing content
    container.innerHTML = '';
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'projects-loading';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading projects...';
    container.appendChild(loadingIndicator);
    
    // Simulate network delay for better UX (remove in production)
    setTimeout(() => {
        // Check if project data exists
        if (typeof projectData === 'undefined' || !projectData[category]) {
            showNoProjectsMessage(container, category);
            return;
        }
        
        const projects = projectData[category];
        
        if (!projects || projects.length === 0) {
            showNoProjectsMessage(container, category);
            return;
        }
        
        // Remove loading indicator
        container.removeChild(loadingIndicator);
        
        // Create projects grid
        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';
        projectsGrid.setAttribute('role', 'list');
        projectsGrid.setAttribute('aria-label', `Projects in ${category} category`);
        
        // Create and append project cards
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Add grid to container
        container.appendChild(projectsGrid);
        
        // Log for debugging
        console.log(`Loaded ${projects.length} projects for category: ${category}`);
        
    }, 300); // Simulated loading delay
}

/**
 * Create a project card element
 * @param {Object} project - Project data object
 * @returns {HTMLElement} - The project card element
 */
function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('role', 'listitem');
    
    // Create image section
    const imageSection = document.createElement('div');
    imageSection.className = 'project-card-image';
    
    // In a real implementation, you would use actual images
    // For now, we'll use a placeholder with an icon
    if (project.image && project.image.startsWith('assets/')) {
        // Real image would be loaded here
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.alt || project.name;
        img.loading = 'lazy';
        imageSection.appendChild(img);
    } else {
        // Placeholder icon
        const placeholder = document.createElement('div');
        placeholder.className = 'project-card-image-placeholder';
        placeholder.innerHTML = '<i class="fas fa-lightbulb"></i>';
        placeholder.setAttribute('aria-hidden', 'true');
        imageSection.appendChild(placeholder);
    }
    
    // Create content section
    const contentSection = document.createElement('div');
    contentSection.className = 'project-card-content';
    
    // Project title
    const title = document.createElement('h3');
    title.className = 'project-card-title';
    title.textContent = project.name;
    
    // Project description
    const description = document.createElement('p');
    description.className = 'project-card-description';
    description.textContent = project.description;
    
    // Role and responsibilities section
    const roleSection = document.createElement('div');
    roleSection.className = 'project-card-role';
    
    const roleTitle = document.createElement('h4');
    roleTitle.textContent = 'Role & Responsibilities';
    
    const roleDescription = document.createElement('p');
    roleDescription.textContent = project.role;
    
    roleSection.appendChild(roleTitle);
    roleSection.appendChild(roleDescription);
    
    // Assemble content
    contentSection.appendChild(title);
    contentSection.appendChild(description);
    contentSection.appendChild(roleSection);
    
    // Add tags if they exist
    if (project.tags && project.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'project-card-tags';
        
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'project-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        contentSection.appendChild(tagsContainer);
    }
    
    // Assemble the card
    card.appendChild(imageSection);
    card.appendChild(contentSection);
    
    return card;
}

/**
 * Show a message when no projects are available for a category
 * @param {HTMLElement} container - The container to show the message in
 * @param {string} category - The category name
 */
function showNoProjectsMessage(container, category) {
    container.innerHTML = '';
    
    const message = document.createElement('div');
    message.className = 'no-projects';
    message.innerHTML = `
        <p><i class="fas fa-info-circle"></i></p>
        <p>No project examples available for this category at the moment.</p>
        <p>Please check back later or <a href="contact.html">contact us</a> for specific examples.</p>
    `;
    
    container.appendChild(message);
}

/**
 * Form validation helper function
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        // Skip hidden fields
        if (field.type === 'hidden') return;
        
        // Trim whitespace from input values
        const value = field.value.trim();
        
        if (!value) {
            markFieldInvalid(field, 'This field is required.');
            isValid = false;
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                markFieldInvalid(field, 'Please enter a valid email address.');
                isValid = false;
            } else {
                markFieldValid(field);
            }
        } else {
            markFieldValid(field);
        }
    });
    
    return isValid;
}

/**
 * Mark a form field as invalid
 * @param {HTMLElement} field - The form field element
 * @param {string} message - The error message to display
 */
function markFieldInvalid(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Mark a form field as valid
 * @param {HTMLElement} field - The form field element
 */
function markFieldValid(field) {
    field.classList.add('valid');
    field.classList.remove('invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Show a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, warning)
 * @param {number} duration - How long to show the message in milliseconds
 */
function showNotification(message, type = 'success', duration = 5000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = 'var(--radius-md)';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '400px';
    notification.style.boxShadow = 'var(--shadow-lg)';
    
    // Style based on type
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--error-color)';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'var(--warning-color)';
        notification.style.color = 'white';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}