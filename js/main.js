// DemandRY Media — interactions

// Signal JS availability: CSS only hides .reveal elements under .js,
// so the page stays fully visible if this file never runs.
document.documentElement.classList.add('js');

// Sticky nav: solid shadow after 80px scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 80);
}, { passive: true });

// Fade-up on section entry
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// FAQ: native <details> handles open/close and keyboard access;
// JS only keeps a single item open at a time.
document.querySelectorAll('details.faq__item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('details.faq__item[open]').forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// Contact form — no backend yet: opens the visitor's email client
// pre-filled to info@demandry.media. Swap for a real form endpoint
// (Formspree/Netlify) before launch; mailto is the fallback path.
const form = document.getElementById('audit-form');
const status = form.querySelector('.form__status');
form.addEventListener('submit', e => {
  e.preventDefault();
  const val = id => (document.getElementById(id)?.value || '').trim();
  const name = val('f-name');
  const email = val('f-email');
  const company = val('f-company');
  const phone = val('f-phone');
  const message = val('f-message');

  const subject = encodeURIComponent(`Free Demand Audit request — ${company || name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nBusiness: ${company}\nPhone: ${phone || '—'}\n\n${message}`
  );
  window.location.href = `mailto:info@demandry.media?subject=${subject}&body=${body}`;

  // Clear then set after a beat so screen readers announce every submit.
  status.textContent = '';
  setTimeout(() => {
    status.textContent = 'Your email app should open now — just hit send. Or write us directly: info@demandry.media';
  }, 100);
});
