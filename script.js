document.addEventListener('DOMContentLoaded', () => {

  // Loader
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1800);
  });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateBackToTop();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Fade-up on scroll
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));

  // Testimonials slider
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.t-dot');
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoSlide;

  const goTo = (index) => {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[current].classList.add('active');
  };

  document.getElementById('tPrev').addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });
  document.getElementById('tNext').addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  const startAuto = () => { autoSlide = setInterval(() => goTo(current + 1), 4500); };
  const resetAuto = () => { clearInterval(autoSlide); startAuto(); };
  startAuto();

  // Back to top
  const backToTop = document.getElementById('backToTop');
  const updateBackToTop = () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  // Contact form
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch("https://formsubmit.co/ajax/amigocreativelabs@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        form.reset();
      } else {
        throw new Error("Failed to send");
      }
    })
    .catch(error => {
      console.error(error);
      btn.innerHTML = '<i class="fas fa-times"></i> Failed to send!';
      btn.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
    })
    .finally(() => {
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  });

  // Current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const activateLink = () => {
    let fromTop = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= fromTop && sec.offsetTop + sec.offsetHeight > fromTop) {
        navAnchors.forEach(a => a.classList.remove('active-link'));
        const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });

});
