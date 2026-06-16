// ===== ABOUT US PAGE FUNCTIONALITY =====

// Initialize AOS animations
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Contact functions for different divisions
function contactPrinting() {
  // Scroll to contact section on homepage
  window.location.href = 'index.html#contact';
  setTimeout(() => {
    // Optional: Pre-fill subject
    const subject = document.querySelector('#contactSubject');
    if (subject) subject.value = 'Printing Services Inquiry';
  }, 500);
}

function contactBus() {
  window.location.href = 'index.html#contact';
  setTimeout(() => {
    const subject = document.querySelector('#contactSubject');
    if (subject) subject.value = 'Bus Services Booking Inquiry';
  }, 500);
}

function contactClothing() {
  window.location.href = 'index.html#contact';
  setTimeout(() => {
    const subject = document.querySelector('#contactSubject');
    if (subject) subject.value = 'Bundukutu Pamba Kali Clothing Inquiry';
  }, 500);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '#contact') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Sticky navigation background change on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(0,0,0,0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = 'rgba(0,0,0,0.9)';
    }
  }
});

console.log('About Us page loaded - Ngwenda Company Limited');