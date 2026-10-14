// ---- Edit your contact details here ----
const CONFIG = {
  name: "Chahine Chahine",
  title: "Founder, KreativeBrains",
  email: "hello@example.com", // TODO: replace with your public business email
  phone: "",                  // optional, e.g. "+961 70 000 000"
  linkedin: "https://www.linkedin.com/in/chahine-chahine-5ba191276",
};

// Footer email link
document.querySelectorAll("[data-email]").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
});

// Sticky nav border
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobile-menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("is-open", !open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  })
);

// Project tabs (with arrow-key support)
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    next.focus();
    selectTab(next);
  });
});

// KPI count-up
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const dur = 1400;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

// Reveal on scroll
const revealables = document.querySelectorAll(".section__head, .card, .steps li, .model, .about, .contact");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  revealables.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// Lead form -> opens the visitor's email client with a pre-filled message
const form = document.getElementById("lead-form");
const status = form.querySelector(".form__status");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const need = form.elements.need.value;
  form.elements.name.setAttribute("aria-invalid", String(!name));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  form.elements.email.setAttribute("aria-invalid", String(!emailOk));
  if (!name || !emailOk) {
    status.textContent = "Please add your name and a valid email.";
    status.className = "form__status is-error";
    return;
  }
  const subject = encodeURIComponent(`Intro call: ${need}`);
  const body = encodeURIComponent(`Hi Chahine,\n\nI'm ${name} (${email}). We're interested in: ${need}.\n\nBest time to talk:\n`);
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  status.textContent = "Thanks! Your email app should open. If not, find me on LinkedIn.";
  status.className = "form__status is-ok";
});

// Downloadable contact card (vCard) — handy at the booth
document.getElementById("vcard").addEventListener("click", () => {
  const [first, ...rest] = CONFIG.name.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${CONFIG.name}`,
    `TITLE:${CONFIG.title}`,
    `EMAIL;TYPE=WORK:${CONFIG.email}`,
    CONFIG.phone && `TEL;TYPE=CELL:${CONFIG.phone}`,
    `URL:${location.origin}${location.pathname}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${CONFIG.linkedin}`,
    "END:VCARD",
  ].filter(Boolean);
  const blob = new Blob([lines.join("\r\n")], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "chahine-chahine.vcf";
  a.click();
  URL.revokeObjectURL(a.href);
});
