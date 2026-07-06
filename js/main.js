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

// Contact form — submits to Formspree without leaving the page.
// If JS is off, the form's action posts to Formspree directly
// (visitor lands on Formspree's thank-you page instead).
const form = document.getElementById('audit-form');
const status = form.querySelector('.form__status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;

  // Clear then set after a beat so screen readers announce every submit.
  status.textContent = '';
  setTimeout(() => {
    status.textContent = 'Sending…';
  }, 100);

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    form.reset();
    status.textContent = "Your request is in. A founder replies — usually same day.";
  } catch (err) {
    status.textContent = 'Something went wrong sending your request — please email us directly: info@demandry.media';
  } finally {
    button.disabled = false;
  }
});
