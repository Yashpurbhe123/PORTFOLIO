// Add loader to the DOM
const loader = document.createElement('div');
loader.className = 'loader';
document.body.appendChild(loader);

// Hide loader when page is fully loaded
window.addEventListener('load', () => {
    loader.classList.add('fade-out');
    setTimeout(() => {
        loader.remove();
    }, 500);
});

// Custom cursor effect
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cursorVisible = true;
let cursorEnlarged = false;

const endX = window.innerWidth / 2;
const endY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    if (cursorVisible) {
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
});

document.addEventListener('mouseenter', () => {
    cursorVisible = true;
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
});

document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    cursorDot.style.opacity = 0;
    cursorOutline.style.opacity = 0;
});

document.addEventListener('mousedown', () => {
    cursorEnlarged = true;
    cursorOutline.style.transform = `translate(${endX}px, ${endY}px) scale(0.5)`;
});

document.addEventListener('mouseup', () => {
    cursorEnlarged = false;
    cursorOutline.style.transform = `translate(${endX}px, ${endY}px) scale(1)`;
});

// Typing effect
const typingText = document.getElementById('typing-text');
const phrases = [
    'Building modern web applications',
    'Creating responsive designs',
    'Developing user-friendly interfaces',
    'Writing clean and efficient code'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}

type();

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (window.scrollY >= sectionTop - headerHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name === '' || email === '' || subject === '' || message === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If validation passes, you would typically send the form data to a server
            // For this example, we'll just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Scroll animations with Intersection Observer
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const scrollOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const element = entry.target;
            element.classList.add('animate');
            element.style.animationDelay = element.dataset.delay || '0s';
            observer.unobserve(element);
        });
    }, scrollOptions);

    // Add scroll reveal classes
    document.querySelectorAll('.skill-item, .project-item').forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.dataset.delay = `${index * 0.1}s`;
        scrollObserver.observe(element);
    });

    // Add animation classes to elements
    const addAnimationClasses = function() {
        document.querySelectorAll('.hero-content, .about-text, .section-header, .contact-info, .contact-form').forEach(element => {
            element.classList.add('fade-in');
        });
        
        document.querySelectorAll('.project-item, .skill-item').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('fade-in');
        });
    };
    
    // Call the function after a short delay to ensure DOM is fully loaded
    setTimeout(addAnimationClasses, 100);

    // Typing effect for hero section
    const typingElement = document.querySelector('.hero-content h2');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000); // Start after 1 second
    }
});

// --- TEAM SECTION SCROLL-IN ANIMATION ---
document.addEventListener('DOMContentLoaded', function() {
  const teamMembers = document.querySelectorAll('.team-member');
  const teamSection = document.querySelector('.team');
  if (!teamMembers.length || !teamSection) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  teamMembers.forEach(member => {
    member.classList.add('hide');
    observer.observe(member);
  });
});

// Add the following CSS to style.css for the animation:
// .team-member.hide { opacity: 0; transform: translateY(40px); }
// .team-member.show { opacity: 1; transform: translateY(0); transition: opacity 0.7s, transform 0.7s; }

// === Stunning Team Modal Glassmorphic Redesign ===
const teamDetails = {
    "Yash Purbhe": {
      name: "Yash Purbhe",
      role: "ML & DL Developer",
      tagline: "Passionate ML Developer building AI-powered systems and data-driven solutions.",
      contact: {
        email: "yashpurbhe123@gmail.com",
        phone: "+91 86573 52891",
        location: "Kalyan, India"
      },
      experience: [
        {
          title: "ML Intern",
          company: "Prodigy InfoTech",
          period: "Jul 2024 – Aug 2024",
          description: "Developed regression and clustering models, and built hand gesture recognition using computer vision."
        },
        {
          title: "ML Intern",
          company: "YBI Foundation",
          period: "Jun 2024 – Jul 2024",
          description: "Built credit card fraud detection, home price prediction, and heart disease prediction systems."
        }
      ],
      education: [
        {
          degree: "B.E. in Computer Science Engineering (AIML)",
          school: "Saraswati College of Engineering, Kharghar",
          period: "Sep 2022 – Present"
        }
      ],
      certifications: [
        "Python For Data-science – NPTEL",
        "Machine Learning Course – Udemy",
        "Data Analysis With Python – IBM",
        "Big Data – IBM",
        "Python skills assessment – Scaler Topics",
        "Google Cloud Skill Boost – 20+ Course & Lab Badges"
      ],
      skills: [
        "Python", "SQL", "Scikit-learn", "TensorFlow", "Keras", "Pandas", "NumPy", 
        "ANN", "CNN", "Data Visualization", "Streamlit", "Flask"
      ],
      image: "Images/Yash.png",
      linkedin: "https://linkedin.com/in/yashpurbhe",
      github: "https://github.com/Yashpurbhe123"
    },
    "Dipshree Vartak": {
      name: "Dipshree Vartak",
      role: "ML Developer",
      tagline: "Transforming complex data into intelligent, actionable machine learning solutions.",
      contact: {
        email: "dipshreeavartak@gmail.com",
        phone: "+91 73035 32127",
        location: "Thane, India"
      },
      experience: [
        {
          title: "ML Intern",
          company: "Prodigy InfoTech",
          period: "Jul 2024 – Aug 2024",
          description: "Built regression models, clustering for retail segmentation, and hand gesture recognition."
        },
        {
          title: "ML Intern",
          company: "YBI Foundation",
          period: "Jun 2024 – Jul 2024",
          description: "Developed models for fraud detection, home price prediction, and heart disease prediction."
        }
      ],
      education: [
        {
          degree: "B.E. in Computer Science Engineering (AIML)",
          school: "Saraswati College of Engineering, Kharghar",
          period: "Sep 2022 – Present"
        }
      ],
      certifications: [
        "Python For Data-science – NPTEL",
        "Machine Learning Course – Udemy",
        "Data Analysis With Python – IBM",
        "Big Data – IBM",
        "Google Cloud Skill Boost – 11+ Course & Lab Badges",
        "Python skills assessment – Scaler Topics"
      ],
      skills: [
        "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", 
        "Excel", "Power BI", "Matplotlib", "Plotly", 
        "HTML", "CSS", "Streamlit", "Flask"
      ],
      image: "Images/Dipshree.png",
      linkedin: "https://www.linkedin.com/in/dipshree-vartak-62b9a1305",
      github: "https://github.com/DipshreeVartak"
    },
    "Aditya Kokate": {
      name: "Aditya Kokate",
      role: "MERN Stack Developer",
      tagline: "Motivated MERN Stack Developer building dynamic and responsive web applications.",
      contact: {
        email: "aditya.kokate47@gmail.com",
        phone: "+91 93099 47011",
        location: "Nagothane, Maharashtra, India"
      },
      experience: [
        {
          title: "Web Development Intern",
          company: "NxtWave's CCBP 4.0 Academy",
          period: "2024 – Present",
          description: "Learning and building full-stack applications using HTML, CSS, JavaScript, React, Node.js, and MongoDB."
        },
        {
          title: "Web Developer Intern",
          company: "Prodigy InfoTech",
          period: "2024",
          description: "Executed multiple projects with focus on responsiveness and performance."
        },
        {
          title: "Web Developer Intern",
          company: "ACMEGRADE",
          period: "2024",
          description: "Built and delivered minor and major projects, applying advanced web development skills."
        }
      ],
      education: [
        {
          degree: "B.E. in Computer Science Engineering (AIML)",
          school: "Saraswati College of Engineering",
          period: "2022 – Present"
        },
        {
          degree: "Higher Secondary Education",
          school: "Reliance Foundation School",
          period: "2017 – 2022"
        }
      ],
      certifications: [
        "Dynamic Web Application (Nxtwave)",
        "Static Web Application (Nxtwave)",
        "Responsible Web Application (Nxtwave)",
        "Data Analytics (Nxtwave)",
        "Introduction to Databases (Nxtwave)",
        "Programming Foundations (Nxtwave)",
        "Java Programming Masterclass (Udemy)",
        "Python for Data Science – NPTEL",
        "Python Advanced Bootcamp (Udemy)",
      ],      
      skills: [
        "MongoDB", "Express.js", "React.js", "Node.js",
        "HTML & CSS (Bootstrap)", "JavaScript", "Python"
      ],
      image: "Images/Aditya.jpg",
      linkedin: "https://www.linkedin.com/in/adityakokate/",
      github: "https://github.com/ADITYAKOKATE"
    }
  };
  
function renderTeamModal(details) {
  const modal = document.getElementById('team-modal');
  // Map member names to resume filenames
  const resumeMap = {
    'Yash Purbhe': 'YASH PURBHE.pdf',
    'Dipshree Vartak': 'DIPSHREE VARTAK.pdf',
    'Aditya Kokate': 'RESUME.pdf'
  };
  const resumeFile = resumeMap[details.name] || '#';
  modal.innerHTML = `
    <div class="team-modal-content">
      <span class="team-modal-close">&times;</span>
      <div class="team-modal-body">
        <div class="team-modal-profile">
          <img src="${details.image}" alt="${details.name}" class="team-modal-img" />
          <div>
            <h2 class="team-modal-name">${details.name}</h2>
            <h4 class="team-modal-role">${details.role}</h4>
            <p class="team-modal-tagline">${details.tagline}</p>
            <a href="resumes/${resumeFile}" class="btn resume-btn" download>
              <i class="fas fa-download"></i> Download Resume
            </a>
          </div>
        </div>
        <div class="team-modal-contact">
          <span><i class="fas fa-envelope"></i> ${details.contact.email}</span>
          <span><i class="fas fa-phone"></i> ${details.contact.phone}</span>
          <span><i class="fas fa-map-marker-alt"></i> ${details.contact.location}</span>
        </div>
        <div class="team-modal-sections">
          <div class="team-modal-section">
            <div class="team-modal-section-title">Experience</div>
            <ul class="team-modal-section-list">
              ${details.experience.map(exp => `<li><strong>${exp.title}</strong> at ${exp.company} <span style='color:#6c63ff;'>(${exp.period})</span><br><span style='color:#666;'>${exp.description}</span></li>`).join('')}
            </ul>
          </div>
          <div class="team-modal-section">
            <div class="team-modal-section-title">Education</div>
            <ul class="team-modal-section-list">
              ${details.education.map(edu => `<li><strong>${edu.degree}</strong>, ${edu.school} <span style='color:#6c63ff;'>(${edu.period})</span></li>`).join('')}
            </ul>
          </div>
          <div class="team-modal-section">
            <div class="team-modal-section-title">Certifications</div>
            <ul class="team-modal-section-list">
              ${details.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
          </div>
          <div class="team-modal-section">
            <div class="team-modal-section-title">Skills</div>
            <div class="team-modal-skills">
              ${details.skills.map(skill => `<span class="team-modal-skill">${skill}</span>`).join('')}
            </div>
          </div>
          <div class="team-modal-social">
            <a href="${details.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
            <a href="${details.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  // Close logic
  modal.querySelector('.team-modal-close').onclick = closeTeamModal;
  modal.onclick = (e) => { if (e.target === modal) closeTeamModal(); };

  // Animate sections sequentially
  const sections = modal.querySelectorAll('.team-modal-section');
  sections.forEach((section, idx) => {
    section.style.animationDelay = `${0.2 + idx * 0.2}s`;
    section.classList.add('animated-section');
  });
}function closeTeamModal() {
  const modal = document.getElementById('team-modal');
  modal.classList.remove('active');
  modal.querySelector('.team-modal-content').style.animation = 'modalOut 0.4s forwards';
  setTimeout(() => { 
    modal.style.display = 'none'; 
    modal.innerHTML = ''; 
  }, 400);
}
document.querySelectorAll('.team-member').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const name = card.querySelector('h4').textContent.trim();
    const details = teamDetails[name];
    if (details) {
      const modal = document.getElementById('team-modal');
      modal.style.display = 'flex';
      renderTeamModal(details);
    }
  });
});

// Dynamically render Achievements section from teamDetails
(function () {
  // Map certificate names to image files for each member
  const achievementImages = {
    'Yash Purbhe': {
      'Big Data – IBM': 'Achievements/Yash/Big data.png',
      'Data Analysis With Python – IBM': 'Achievements/Yash/Data Analytics.png',
      'Machine Learning Course – Udemy': 'Achievements/Yash/Machine Learning Udemy.jpg',
      'Python For Data-science – NPTEL': 'Achievements/Yash/Python for Data Science.jpg',
    },
    'Dipshree Vartak': {
      'Big Data – IBM': 'Achievements/Dipshree/Big data.png',
      'Data Analysis With Python – IBM': 'Achievements/Dipshree/Data Analysis.png',
      'Python For Data-science – NPTEL': 'Achievements/Dipshree/Python nptel.png',
      'Machine Learning Course – Udemy': 'Achievements/Dipshree/Machine Learning Udemy.png'
    },
    'Aditya Kokate': {
      'Dynamic Web Application (Nxtwave)': 'Achievements/Aditya/DYNAMIC WEB APPLICATION CERTIFICATE.png',
      'Responsible Web Application (Nxtwave)': 'Achievements/Aditya/Responsive Web.png',
      'Introduction to Databases (Nxtwave)': 'Achievements/Aditya/INTRODUCTION TO DATABASES.png',
      'Programming Foundations (Nxtwave)': 'Achievements/Aditya/PROGRAMMING FOUNDATIONS.png',
      'Python for Data Science – NPTEL': 'Achievements/Aditya/Python Nptel.png',
    }
  };
  const teamDetails = window.teamDetails || {
    "Yash Purbhe": {
      certifications: [
        "Python For Data-science – NPTEL",
        "Machine Learning Course – Udemy",
        "Data Analysis With Python – IBM",
        "Big Data – IBM"
      ],
      image: "Images/Yash.png",
      name: "Yash Purbhe"
    },
    "Dipshree Vartak": {
      certifications: [
        "Python For Data-science – NPTEL",
        "Machine Learning Course – Udemy",
        "Data Analysis With Python – IBM",
        "Big Data – IBM"
      ],
      image: "Images/Dipshree.png",
      name: "Dipshree Vartak"
    },
    "Aditya Kokate": {
      certifications: [
        "Dynamic Web Application (Nxtwave)",
        "Responsible Web Application (Nxtwave)",
        "Introduction to Databases (Nxtwave)",
        "Programming Foundations (Nxtwave)",
        "Python for Data Science – NPTEL"
      ],
      image: "Images/Aditya.jpg",
      name: "Aditya Kokate"
    }
  };

  function renderAchievements(filter = 'all') {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    let html = '';
    Object.values(teamDetails).forEach(member => {
      if (filter !== 'all' && member.name !== filter) return;
      (member.certifications || []).forEach(cert => {
        // Try to get the real image, fallback to a placeholder if not found
        let certImg =
          achievementImages[member.name] && achievementImages[member.name][cert]
            ? achievementImages[member.name][cert]
            : 'https://img.freepik.com/free-vector/certificate-template_23-2147858277.jpg';
        html += `
          <div class="achievement-item">
            <div class="achievement-image">
              <img src="${certImg}" alt="Certificate for ${cert}" />
              <div class="achievement-avatar">
                <img src="${member.image}" alt="${member.name}" title="${member.name}" />
              </div>
            </div>
            <div class="achievement-info">
              <h3>${cert}</h3>
              <div class="achievement-tags">
                <span>${member.name}</span>
              </div>
            </div>
          </div>
        `;
      });
    });
    grid.innerHTML = html;

    // Add click event listeners to achievement cards for modal popup
    setTimeout(() => {
      document.querySelectorAll('.achievement-item').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
          const img = card.querySelector('.achievement-image img');
          const certImg = img ? img.src : '';
          const certTitle = card.querySelector('.achievement-info h3')?.textContent || '';
          const certOwner = card.querySelector('.achievement-tags span')?.textContent || '';
          // Show modal
          const modal = document.getElementById('certificate-modal');
          const modalImg = document.getElementById('certificate-modal-img');
          const modalCaption = document.getElementById('certificate-modal-caption');
          if (modal && modalImg && modalCaption) {
            modalImg.src = certImg;
            modalImg.alt = certTitle;
            modalCaption.innerHTML = `<strong>${certTitle}</strong><br><span>${certOwner}</span>`;
            modal.style.display = 'flex';
          }
        });
      });
      // Close modal logic
      const modal = document.getElementById('certificate-modal');
      const closeBtn = document.querySelector('.certificate-modal-close');
      if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
      }
      // Close when clicking outside modal content
      if (modal) {
        modal.onclick = (e) => {
          if (e.target === modal) modal.style.display = 'none';
        };
      }
    }, 100);
  }

  // Initial render (all achievements)
  renderAchievements('all');

  // Filter button logic
  const filterBtns = document.querySelectorAll('.achievement-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      renderAchievements(filter);
    });
  });
})();
