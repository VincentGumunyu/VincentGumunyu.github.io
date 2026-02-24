/* =============================================
   PORTFOLIO JAVASCRIPT
   Peter Vincent Gumunyu — Data Scientist
   ============================================= */

// ─── TYPED TEXT ANIMATION ───
const typedPhrases = [
  "Data Scientist",
  "ML Engineer",
  "Predictive Analyst",
  "AI Solutions Builder",
  "Flask Developer",
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById("typed-text");

function typeLoop() {
  const phrase = typedPhrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % typedPhrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 55 : 85);
}
typeLoop();

// ─── PARTICLE CANVAS ───
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.color = Math.random() > 0.5 ? "79,142,247" : "108,92,231";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  updateActiveNav();
});

// ─── HAMBURGER ───
const hamburger = document.getElementById("hamburger-btn");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ─── ACTIVE NAV LINK ───
function updateActiveNav() {
  const sections = ["home", "about", "skills", "projects", "contact"];
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const section = document.getElementById(id);
    const navEl = document.getElementById("nav-" + id);
    if (!section || !navEl) return;
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    navEl.classList.toggle("active", scrollY >= top && scrollY < bottom);
  });
}

// ─── STAT COUNTER ANIMATION ───
const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  const heroSection = document.getElementById("home");
  const rect = heroSection.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    statsAnimated = true;
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 40);
    });
  }
}
window.addEventListener("scroll", animateStats);
setTimeout(animateStats, 500);

// ─── PROFICIENCY BARS ANIMATION ───
let barsAnimated = false;
function animateBars() {
  if (barsAnimated) return;
  const skillsSection = document.getElementById("skills");
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    barsAnimated = true;
    document.querySelectorAll(".prof-bar-item").forEach((item, i) => {
      const fill = item.querySelector(".prof-fill");
      const level = item.dataset.level;
      setTimeout(() => {
        fill.style.width = level + "%";
      }, i * 150);
    });
  }
}
window.addEventListener("scroll", animateBars);

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll(".project-card, .skill-category, .highlight-item, .contact-card, .prof-bar-item, .social-card").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});


// ─── PROFILE IMAGE FALLBACK ───

// If user places their photo in assets/profile.jpg, this will display it.
// Otherwise show an initials avatar placeholder.
document.querySelectorAll(".profile-img, #about-photo").forEach(img => {
  img.addEventListener("error", function () {
    this.style.display = "none";
    const wrapper = this.closest(".profile-image-wrapper, .about-img-frame");
    if (wrapper && !wrapper.querySelector(".avatar-placeholder")) {
      const avatar = document.createElement("div");
      avatar.className = "avatar-placeholder";
      avatar.style.cssText = `
        width:100%; height:100%; display:flex; align-items:center; justify-content:center;
        background: linear-gradient(135deg, #4f8ef7 0%, #6c5ce7 100%);
        font-size:5rem; font-weight:900; color:#fff; font-family:Inter,sans-serif;
        letter-spacing:-2px;
      `;
      avatar.textContent = "PVG";
      wrapper.prepend(avatar);
    }
  });
});

// ─── SMOOTH SCROLL NAV ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

console.log("%c👋 Peter Vincent Gumunyu | Data Scientist Portfolio", "color:#4f8ef7;font-size:16px;font-weight:bold;");
console.log("%c🤖 Machine Learning · 📊 Data Science · 🐍 Python", "color:#6c5ce7;font-size:13px;");
