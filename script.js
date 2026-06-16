// Ngwenda Company Limited - Complete JavaScript with Search & Filter

// ===== PRODUCT INQUIRY TRACKING SYSTEM =====

// Initialize inquiries array from localStorage
let productInquiries = JSON.parse(localStorage.getItem('ngwendaProductInquiries')) || [];

// Save inquiries to localStorage
function saveInquiries() {
  localStorage.setItem('ngwendaProductInquiries', JSON.stringify(productInquiries));
}

// ===== ENHANCED INQUIRY MODAL WITH TRACKING =====
function showInquiryModal(productName, productPrice = '', productCategory = '') {
  // Create modal dynamically
  const modalHtml = `
    <div class="modal fade inquiry-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content inquiry-modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-envelope"></i> Inquire About ${productName}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="selected-product-badge">
              <i class="fas fa-motorcycle"></i>
              <span>You are inquiring about: <strong>${productName}</strong></span>
              ${productPrice ? `<span class="product-price-badge">${productPrice}</span>` : ''}
            </div>
            <form id="inquiryForm">
              <div class="mb-3">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-control inquiry-input" id="inquiryName" placeholder="Enter your full name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email Address *</label>
                <input type="email" class="form-control inquiry-input" id="inquiryEmail" placeholder="you@example.com" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-control inquiry-input" id="inquiryPhone" placeholder="+255 XXX XXX XXX" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Preferred Contact Method</label>
                <select class="form-control inquiry-input" id="inquiryContactMethod">
                  <option value="Phone">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Message (Optional)</label>
                <textarea class="form-control inquiry-input" rows="3" id="inquiryMessage" placeholder="Any specific questions about this product?"></textarea>
              </div>
              <input type="hidden" id="inquiryProduct" value="${productName}">
              <input type="hidden" id="inquiryCategory" value="${productCategory}">
              <button type="submit" class="btn btn-warning w-100 submit-inquiry">
                <i class="fas fa-paper-plane"></i> Send Inquiry
              </button>
            </form>
            <div id="inquiryFeedback" class="mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing modal if any
  const existingModal = document.querySelector('.inquiry-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Show modal
  const modalElement = document.querySelector('.inquiry-modal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Handle form submission
  const inquiryForm = document.getElementById('inquiryForm');
  const inquiryFeedback = document.getElementById('inquiryFeedback');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('inquiryName').value.trim();
      const email = document.getElementById('inquiryEmail').value.trim();
      const phone = document.getElementById('inquiryPhone').value.trim();
      const contactMethod = document.getElementById('inquiryContactMethod').value;
      const message = document.getElementById('inquiryMessage').value.trim();
      const product = document.getElementById('inquiryProduct').value;
      const category = document.getElementById('inquiryCategory').value;

      // Validation
      if (!name || !email || !phone) {
        inquiryFeedback.innerHTML = '<div class="alert alert-danger">❌ Please fill in all required fields.</div>';
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        inquiryFeedback.innerHTML = '<div class="alert alert-danger">❌ Please enter a valid email address.</div>';
        return;
      }

      if (phone.length < 10) {
        inquiryFeedback.innerHTML = '<div class="alert alert-danger">❌ Please enter a valid phone number.</div>';
        return;
      }

      // Create inquiry object
      const inquiry = {
        id: Date.now(),
        productName: product,
        productCategory: category,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        contactMethod: contactMethod,
        message: message || "No additional message",
        timestamp: new Date().toISOString(),
        status: "pending",
        read: false
      };

      // Save to localStorage
      productInquiries.unshift(inquiry);
      saveInquiries();

      // Send email notification using EmailJS (you'll need to set up)
      sendEmailNotification(inquiry);

      // Success message
      inquiryFeedback.innerHTML = `
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i> 
          Thank you ${name}! Your inquiry about ${product} has been received.<br>
          <small>A sales agent will contact you within 24 hours via ${contactMethod}.</small>
        </div>
      `;
      
      // Reset form
      inquiryForm.reset();
      
      // Close modal after 3 seconds
      setTimeout(() => {
        modal.hide();
        inquiryFeedback.innerHTML = '';
      }, 3000);
    });
  }

  // Remove modal from DOM after hidden
  modalElement.addEventListener('hidden.bs.modal', function() {
    modalElement.remove();
  });
}

// ===== EMAIL NOTIFICATION FUNCTION (Using EmailJS) =====
// You need to sign up at https://www.emailjs.com/ for this to work
function sendEmailNotification(inquiry) {
  // Check if EmailJS is loaded
  if (typeof emailjs !== 'undefined') {
    // Initialize EmailJS with your public key
    // emailjs.init("YOUR_PUBLIC_KEY");
    
    const templateParams = {
      to_email: "info@ngwenda.co.tz",
      to_name: "Ngwenda Sales Team",
      customer_name: inquiry.customerName,
      customer_email: inquiry.customerEmail,
      customer_phone: inquiry.customerPhone,
      product_name: inquiry.productName,
      product_category: inquiry.productCategory,
      contact_method: inquiry.contactMethod,
      message: inquiry.message,
      inquiry_id: inquiry.id,
      inquiry_date: new Date(inquiry.timestamp).toLocaleString()
    };
    
    // Send email
    // emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    //   .then(function(response) {
    //     console.log("Email sent successfully!", response);
    //   }, function(error) {
    //     console.log("Email failed to send:", error);
    //   });
  } else {
    console.log("EmailJS not configured. Inquiry saved to localStorage only.");
  }
}

// ===== ADMIN FUNCTION: VIEW ALL INQUIRIES =====
function viewAllInquiries() {
  const inquiries = JSON.parse(localStorage.getItem('ngwendaProductInquiries')) || [];
  
  if (inquiries.length === 0) {
    alert("No inquiries yet. Customers will appear here when they inquire about products.");
    return;
  }
  
  let inquiryList = "📋 PRODUCT INQUIRIES\n";
  inquiryList += "=".repeat(50) + "\n\n";
  
  inquiries.forEach((inq, index) => {
    inquiryList += `#${index + 1} - ${inq.productName}\n`;
    inquiryList += `   Customer: ${inq.customerName}\n`;
    inquiryList += `   Phone: ${inq.customerPhone}\n`;
    inquiryList += `   Email: ${inq.customerEmail}\n`;
    inquiryList += `   Contact via: ${inq.contactMethod}\n`;
    inquiryList += `   Time: ${new Date(inq.timestamp).toLocaleString()}\n`;
    inquiryList += `   Status: ${inq.status}\n`;
    inquiryList += `   Message: ${inq.message}\n`;
    inquiryList += "-".repeat(40) + "\n";
  });
  
  // Create a modal to display inquiries
  showInquiriesModal(inquiries);
}

// ===== DISPLAY INQUIRIES IN A MODAL =====
function showInquiriesModal(inquiries) {
  const modalHtml = `
    <div class="modal fade admin-inquiries-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content admin-modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-users"></i> Customer Inquiries (${inquiries.length})
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body admin-modal-body">
            ${inquiries.length === 0 ? '<p class="text-center">No inquiries yet.</p>' : `
              <div class="inquiries-list">
                ${inquiries.map(inq => `
                  <div class="inquiry-item ${inq.read ? '' : 'unread'}" data-id="${inq.id}">
                    <div class="inquiry-header">
                      <strong><i class="fas fa-motorcycle"></i> ${inq.productName}</strong>
                      <span class="inquiry-status ${inq.status}">${inq.status}</span>
                    </div>
                    <div class="inquiry-details">
                      <p><i class="fas fa-user"></i> <strong>${inq.customerName}</strong></p>
                      <p><i class="fas fa-phone"></i> ${inq.customerPhone}</p>
                      <p><i class="fas fa-envelope"></i> ${inq.customerEmail}</p>
                      <p><i class="fas fa-comment"></i> ${inq.contactMethod}</p>
                      <p><i class="fas fa-calendar"></i> ${new Date(inq.timestamp).toLocaleString()}</p>
                      ${inq.message ? `<p><i class="fas fa-quote-left"></i> ${inq.message}</p>` : ''}
                    </div>
                    <div class="inquiry-actions">
                      <button class="btn-mark-read" onclick="markAsRead(${inq.id})">
                        <i class="fas fa-check-circle"></i> Mark as Read
                      </button>
                      <button class="btn-contact-customer" onclick="contactCustomer('${inq.customerPhone}', '${inq.customerName}', '${inq.productName}')">
                        <i class="fas fa-phone-alt"></i> Contact
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
          <div class="modal-footer">
            <button class="btn-export-inquiries" onclick="exportInquiriesToCSV()">
              <i class="fas fa-download"></i> Export to CSV
            </button>
            <button class="btn-clear-all" onclick="clearAllInquiries()">
              <i class="fas fa-trash"></i> Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const existingModal = document.querySelector('.admin-inquiries-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalElement = document.querySelector('.admin-inquiries-modal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
  
  modalElement.addEventListener('hidden.bs.modal', function() {
    modalElement.remove();
  });
}

// ===== MARK INQUIRY AS READ =====
function markAsRead(id) {
  const inquiries = JSON.parse(localStorage.getItem('ngwendaProductInquiries')) || [];
  const index = inquiries.findIndex(i => i.id === id);
  if (index !== -1) {
    inquiries[index].read = true;
    inquiries[index].status = "read";
    localStorage.setItem('ngwendaProductInquiries', JSON.stringify(inquiries));
    
    // Refresh modal
    const modal = document.querySelector('.admin-inquiries-modal .btn-close');
    if (modal) modal.click();
    setTimeout(() => viewAllInquiries(), 200);
  }
}

// ===== CONTACT CUSTOMER =====
function contactCustomer(phone, name, product) {
  // Open WhatsApp or Phone dialer
  if (confirm(`Contact ${name} about ${product}?\n\nClick OK to open phone dialer.`)) {
    window.location.href = `tel:${phone}`;
  }
}

// ===== EXPORT INQUIRIES TO CSV =====
function exportInquiriesToCSV() {
  const inquiries = JSON.parse(localStorage.getItem('ngwendaProductInquiries')) || [];
  
  if (inquiries.length === 0) {
    alert("No inquiries to export.");
    return;
  }
  
  const headers = ["ID", "Product", "Customer Name", "Email", "Phone", "Contact Method", "Message", "Date", "Status"];
  const csvRows = [headers];
  
  inquiries.forEach(inq => {
    csvRows.push([
      inq.id,
      inq.productName,
      inq.customerName,
      inq.customerEmail,
      inq.customerPhone,
      inq.contactMethod,
      `"${inq.message.replace(/"/g, '""')}"`,
      new Date(inq.timestamp).toLocaleString(),
      inq.status
    ]);
  });
  
  const csvContent = csvRows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ngwenda_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== CLEAR ALL INQUIRIES =====
function clearAllInquiries() {
  if (confirm("⚠️ WARNING: This will delete ALL customer inquiries. This action cannot be undone.\n\nAre you sure?")) {
    localStorage.removeItem('ngwendaProductInquiries');
    productInquiries = [];
    alert("All inquiries have been cleared.");
    // Close modal if open
    const modal = document.querySelector('.admin-inquiries-modal .btn-close');
    if (modal) modal.click();
  }
}

// ===== ADD ADMIN BUTTON TO PAGE =====
function addAdminButton() {
  const adminButtonHtml = `
    <div class="admin-fab">
      <button class="admin-fab-button" onclick="viewAllInquiries()" title="View Customer Inquiries">
        <i class="fas fa-headset"></i>
        <span class="inquiry-badge" id="inquiryBadge">0</span>
      </button>
    </div>
  `;
  
  if (!document.querySelector('.admin-fab')) {
    document.body.insertAdjacentHTML('beforeend', adminButtonHtml);
    updateInquiryBadge();
  }
}

// ===== UPDATE INQUIRY BADGE COUNT =====
function updateInquiryBadge() {
  const inquiries = JSON.parse(localStorage.getItem('ngwendaProductInquiries')) || [];
  const unreadCount = inquiries.filter(i => !i.read).length;
  const badge = document.getElementById('inquiryBadge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

// ===== UPDATE PRODUCT BUTTONS TO USE TRACKING =====
function initializeProductButtons() {
  // Update all inquire buttons to use the enhanced modal
  document.querySelectorAll('.inquire-btn-advanced, .btn-inquire, .inquire-btn').forEach(btn => {
    const productName = btn.getAttribute('data-product');
    if (productName) {
      // Remove old event listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Try to get product price and category from the card
        let productPrice = '';
        let productCategory = '';
        const card = this.closest('.product-card-advanced, .product-card');
        if (card) {
          const priceEl = card.querySelector('.price-tag');
          if (priceEl) productPrice = priceEl.textContent;
          
          const categoryEl = card.querySelector('.category-tag');
          if (categoryEl) productCategory = categoryEl.textContent;
        }
        
        showInquiryModal(productName, productPrice, productCategory);
      });
    }
  });
  
  // Update view details buttons
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    const productName = btn.getAttribute('data-product');
    if (productName) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showProductDetails(productName);
      });
    }
  });
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize product buttons
  initializeProductButtons();
  
  // Add admin button
  addAdminButton();
  
  // Update badge periodically
  setInterval(updateInquiryBadge, 5000);
  
  console.log('Product tracking system initialized');
});

  // ===== STATISTICS COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateNumbers() {
    if (animated) return;
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const step = Math.ceil(target / (duration / 16)); // 60fps
      let current = 0;
      
      const updateNumber = () => {
        current += step;
        if (current >= target) {
          stat.innerText = target.toLocaleString();
          return;
        }
        stat.innerText = current.toLocaleString();
        requestAnimationFrame(updateNumber);
      };
      
      updateNumber();
    });
    
    animated = true;
  }

  // Intersection Observer for counter animation
  const parallaxSection = document.getElementById('why-choose-us');
  if (parallaxSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(parallaxSection);
  }

  // ===== FAQ ACCORDION TOGGLE =====
function toggleFaq(element) {
  const faqItem = element.closest('.faq-item');
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items (optional - for single open at a time)
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current item
  faqItem.classList.toggle('active');
}

// ===== Add smooth carousel initialization =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize testimonial carousel with auto-slide
  const testimonialCarousel = document.querySelector('#testimonialCarousel');
  if (testimonialCarousel) {
    new bootstrap.Carousel(testimonialCarousel, {
      interval: 5000,
      wrap: true,
      touch: true
    });
  }
});

// ===== FOOTER FUNCTIONALITY =====

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletterForm');
const newsletterFeedback = document.getElementById('newsletterFeedback');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value.trim();
    
    if (!email) {
      newsletterFeedback.innerHTML = '<span style="color: #ffc107;">Please enter your email address</span>';
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      newsletterFeedback.innerHTML = '<span style="color: #ffc107;">Please enter a valid email address</span>';
      return;
    }
    
    newsletterFeedback.innerHTML = '<span style="color: #00c853;">✓ Successfully subscribed! Thank you.</span>';
    this.reset();
    
    setTimeout(() => {
      newsletterFeedback.innerHTML = '';
    }, 5000);
  });
}

// Customer Service Animation Click Handler
const customerService = document.querySelector('.customer-service-animation');
if (customerService) {
  customerService.addEventListener('click', function() {
    // Scroll to contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show chat prompt (optional)
    alert('💬 Our customer support team is ready to assist you!\n\nYou can reach us via:\n📞 Phone: +255 123 456 789\n📧 Email: info@ngwenda.co.tz\n\nOr fill out the contact form and we\'ll respond within 24 hours.');
  });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animate footer elements on scroll
const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
      footerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.footer-section, .footer-brand').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  footerObserver.observe(el);
});

// ===== STATISTICS COUNTER ANIMATION =====
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    let current = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    
    const updateCounter = () => {
      current += step;
      if (current >= target) {
        stat.innerText = target.toLocaleString();
        return;
      }
      stat.innerText = current.toLocaleString();
      requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
  });
}

// Trigger counter when section is in view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const whyChooseSection = document.querySelector('#why-choose-us');
if (whyChooseSection) {
  statsObserver.observe(whyChooseSection);
}