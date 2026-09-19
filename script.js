/* ===========================================================
   Elvis Barber Co. — main site script
   Sections: preloader, navbar, scroll reveal, counters,
   gallery filter + lightbox, booking form, testimonials,
   FAQ accordion, newsletter, back-to-top
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNavbar();
  initScrollReveal();
  initCounters();
  initGallery();
  initBookingForm();
  initTestimonials();
  initFAQ();
  initNewsletter();
  initBackToTop();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hide"), 400);
  });
  // Fallback in case 'load' fires very late (slow connections)
  setTimeout(() => preloader.classList.add("hide"), 2500);
}

/* ---------- Sticky navbar + mobile menu ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggle.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1600;
  let start = null;

  function step(timestamp) {
    if (start === null) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }
  requestAnimationFrame(step);
}

/* ---------- Gallery: filter + lightbox ---------- */
function initGallery() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  let visibleItems = Array.from(items);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      items.forEach((item) => {
        const match = filter === "All" || item.dataset.cat === filter;
        item.classList.toggle("filtered-out", !match);
      });
      visibleItems = Array.from(items).filter(
        (item) => !item.classList.contains("filtered-out")
      );
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCat = document.getElementById("lightboxCat");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (!item) return;
    lightboxImg.src = item.dataset.img;
    lightboxImg.alt = item.dataset.caption;
    lightboxCat.textContent = item.dataset.cat;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function move(dir) {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      visibleItems = Array.from(items).filter(
        (el) => !el.classList.contains("filtered-out")
      );
      const idxInVisible = visibleItems.indexOf(item);
      openLightbox(idxInVisible === -1 ? 0 : idxInVisible);
    });
  });

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => move(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });
}

/* ---------- Booking form ---------- */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  const successPanel = document.getElementById("bookingSuccess");
  const submitBtn = document.getElementById("bookingSubmit");
  const bookAnother = document.getElementById("bookAnother");
  const formError = document.getElementById("bookingFormError");

  const fields = {
    name: { input: document.getElementById("fullName"), error: document.getElementById("err-name") },
    phone: { input: document.getElementById("phone"), error: document.getElementById("err-phone") },
    email: { input: document.getElementById("email"), error: document.getElementById("err-email") },
    service: { input: document.getElementById("service"), error: document.getElementById("err-service") },
    date: { input: document.getElementById("date"), error: document.getElementById("err-date") },
    time: { input: document.getElementById("time"), error: document.getElementById("err-time") },
  };

  function validate() {
    let valid = true;
    const values = {
      name: fields.name.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      email: fields.email.input.value.trim(),
      service: fields.service.input.value,
      date: fields.date.input.value,
      time: fields.time.input.value,
    };

    const rules = {
      name: values.name.length >= 2 ? "" : "Enter your full name",
      phone: values.phone.length >= 7 ? "" : "Enter a valid phone number",
      email: /^\S+@\S+\.\S+$/.test(values.email) ? "" : "Enter a valid email",
      service: values.service ? "" : "Choose a service",
      date: values.date ? "" : "Pick a date",
      time: values.time ? "" : "Pick a time",
    };

    Object.keys(rules).forEach((key) => {
      const message = rules[key];
      fields[key].error.textContent = message;
      fields[key].input.closest(".form-group").classList.toggle("invalid", !!message);
      if (message) valid = false;
    });

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    formError.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.errors?.[0]?.message || "Unable to send your booking request.");
      }

      submitBtn.disabled = false;
      submitBtn.textContent = "Book Appointment";
      form.reset();
      form.style.display = "none";
      successPanel.classList.add("show");
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Book Appointment";
      formError.textContent = error.message;
    }
  });

  bookAnother.addEventListener("click", () => {
    successPanel.classList.remove("show");
    form.style.display = "block";
  });
}

/* ---------- Testimonials slider ---------- */
function initTestimonials() {
  const cards = document.querySelectorAll(".testimonial-card");
  const dotsWrap = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  let index = 0;
  let autoplay;

  // Render star ratings
  cards.forEach((card) => {
    const rating = parseInt(card.dataset.rating, 10);
    const starsWrap = card.querySelector(".t-stars");
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.textContent = "★";
      if (i >= rating) star.classList.add("empty");
      starsWrap.appendChild(star);
    }
  });

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll("button");

  function goTo(i) {
    cards[index].classList.remove("active");
    dots[index].classList.remove("active");
    index = (i + cards.length) % cards.length;
    cards[index].classList.add("active");
    dots[index].classList.add("active");
    restartAutoplay();
  }

  function restartAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(index + 1), 5000);
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  restartAutoplay();
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

/* ---------- Newsletter ---------- */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const success = document.getElementById("newsletterSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("hide");
    success.classList.add("show");
    form.reset();
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
