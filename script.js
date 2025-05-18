// DOM Elements
const body = document.body;
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');
const themeToggle = document.querySelector('.theme-toggle');
const keyboardHint = document.querySelector('.keyboard-hint');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const aboutContainer = document.querySelector('.about-container');
const contactForm = document.getElementById('contact-form');

// Initialize
let currentSection = 0;
let isThemeToggleVisible = false;

// Function to update active section
function updateActiveSection() {
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const isVisible = (
      rect.top <= window.innerHeight / 2 && 
      rect.bottom >= window.innerHeight / 2
    );
    
    if (isVisible) {
      currentSection = index;
      section.classList.add('active');
      
      // Update navigation
      navItems.forEach(item => item.classList.remove('active'));
      const activeNavItem = document.querySelector(`[href="#${section.id}"]`);
      if (activeNavItem) activeNavItem.classList.add('active');
      
      // Trigger animations for the about section when it comes into view
      if (section.id === 'about' && aboutContainer) {
        aboutContainer.classList.add('in-view');
      }
    } else if (!section.classList.contains('active')) {
      section.classList.add('active');
    }
  });
}

// Custom cursor
function updateCursor(e) {
  if (cursorDot && cursorOutline) {
    const x = e.clientX;
    const y = e.clientY;
    
    cursorDot.style.transform = `translate(${x}px, ${y}px)`;
    
    // Add a slight delay for the outline for a more fluid effect
    setTimeout(() => {
      cursorOutline.style.transform = `translate(${x}px, ${y}px)`;
    }, 50);
  }
}

// Handle links and buttons hover for cursor
function handleCursorHover() {
  const interactiveElements = document.querySelectorAll('a, button, .theme-toggle, .project-card, .contact-item');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// Toggle theme
function toggleTheme() {
  body.classList.toggle('light-mode');
  localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load saved theme
function loadSavedTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'light') {
    body.classList.add('light-mode');
  }
}

// Toggle keyboard hint
function toggleKeyboardHint() {
  keyboardHint.classList.toggle('visible');
}

// Handle keyboard navigation
function handleKeyboardNav(e) {
  let key = e.key.toLowerCase();
  
  // Handle question mark to toggle keyboard hint
  if (key === '?' || key === '/') {
    toggleKeyboardHint();
    return;
  }
  
  // Handle theme toggle with T key
  if (key === 't') {
    toggleTheme();
    return;
  }
  
  // Navigation keys
  const navKeys = {
    'h': '#home',
    'p': '#projects',
    'a': '#about',
    'c': '#contact'
  };
  
  if (navKeys[key]) {
    e.preventDefault();
    const target = document.querySelector(navKeys[key]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Form handling
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const formDataObj = Object.fromEntries(formData);
  
  // You would typically send this data to a server
  console.log('Form submitted:', formDataObj);
  
  // Show success feedback
  const submitButton = contactForm.querySelector('.submit-button');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<span class="button-text">Message Sent!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
  submitButton.style.backgroundColor = 'var(--primary)';
  
  // Reset form
  contactForm.reset();
  
  // Reset button after 3 seconds
  setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.style.backgroundColor = '';
  }, 3000);
}

// Terminal typing effect
function setupTerminalEffect() {
  const terminalOutput = document.querySelector('.output.typing');
  if (!terminalOutput) return;
  
  const text = terminalOutput.textContent;
  terminalOutput.textContent = '';
  
  let i = 0;
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      terminalOutput.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      
      // Add cursor after typing
      const cursor = document.createElement('span');
      cursor.classList.add('cursor');
      terminalOutput.parentNode.appendChild(cursor);
    }
  }, 50);
}

// Glitch effect
function setupGlitchEffect() {
  const glitchElement = document.querySelector('.glitch');
  if (!glitchElement) return;
  
  const text = glitchElement.textContent;
  glitchElement.setAttribute('data-text', text);
}

// Initialize all features
function init() {
  loadSavedTheme();
  updateActiveSection();
  setupTerminalEffect();
  setupGlitchEffect();
  
  // Event listeners
  window.addEventListener('scroll', updateActiveSection);
  window.addEventListener('mousemove', updateCursor);
  window.addEventListener('keydown', handleKeyboardNav);
  themeToggle.addEventListener('click', toggleTheme);
  contactForm.addEventListener('submit', handleFormSubmit);
  
  // Setup cursor interactions after a small delay to ensure elements are ready
  setTimeout(handleCursorHover, 500);
  
  // Remove loading state
  setTimeout(() => {
    body.classList.add('loaded');
  }, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);