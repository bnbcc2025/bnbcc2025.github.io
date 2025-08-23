/**
 * Main application script for the website.
 * Version: 5.3.3
 * Handles page-specific animations and interactive components.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // INITIALIZATION SEQUENCE
  // ===================================================================
  initializePage();

  function initializePage() {
    initializeVacuumAnimation();
    initializeStatsCounters();
    initializeClientCounter();
    initializeHowItWorksAnimation();
    initializeFaq();
  }

  // ===================================================================
  // VACUUM ANIMATION
  // ===================================================================
  function initializeVacuumAnimation() {
    const hero = document.getElementById('hero');
    const vacuum = document.getElementById('vacuum');
    const dusts = document.querySelectorAll('.dust');

    if (!hero || !vacuum || dusts.length === 0) return;

    const vacuumSpeed = 3000;
    vacuum.style.transition = `transform ${vacuumSpeed}ms ease-in-out`;

    const getRandomPosition = () => {
      const heroRect = hero.getBoundingClientRect();
      const x = Math.floor(Math.random() * (heroRect.width - vacuum.offsetWidth));
      const y = Math.floor(Math.random() * (heroRect.height * 0.7 - vacuum.offsetHeight));
      return { x, y };
    };

    dusts.forEach(dust => {
      const { x, y } = getRandomPosition();
      dust.style.transform = `rotate(${Math.random() * 360}deg) translate(${x}px, ${y}px)`;
    });

    const moveVacuum = () => {
      const visibleDusts = Array.from(dusts).filter(d => window.getComputedStyle(d).opacity === '1');
      if (visibleDusts.length === 0) return;

      const dust = visibleDusts[Math.floor(Math.random() * visibleDusts.length)];
      const dustRect = dust.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      const targetX = dustRect.left - heroRect.left + dustRect.width / 2 - vacuum.offsetWidth / 2;
      const targetY = dustRect.top - heroRect.top - vacuum.offsetHeight + dustRect.height / 2;

      vacuum.style.transform = `translate(${targetX}px, ${targetY}px)`;

      setTimeout(() => {
        dust.style.opacity = 0;
        setTimeout(() => {
          const { x, y } = getRandomPosition();
          dust.style.transform = `rotate(${Math.random() * 360}deg) translate(${x}px, ${y}px)`;
          dust.style.opacity = 1;
        }, 500);
      }, vacuumSpeed);
    };

    const vacuumInterval = setInterval(moveVacuum, vacuumSpeed + 200);
    window.addEventListener('beforeunload', () => clearInterval(vacuumInterval));
  }

  // ===================================================================
  // INTERACTIVE COMPONENTS
  // ===================================================================
  function initializeStatsCounters() {
    const statsSection = document.querySelector("#facts");
    if (!statsSection) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      let count = 0;
      const increment = Math.ceil(target / 200); // 200 steps

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          el.innerText = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.innerText = count.toLocaleString();
        }
      }, 10);
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsSection.classList.add('is-visible');
          statsSection.querySelectorAll(".stat-number").forEach(animateCounter);
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  function initializeClientCounter() {
    const counterElement = document.getElementById("client-count");
    if (!counterElement) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(counterElement.dataset.target, 10);
          let count = 0;
          const increment = Math.ceil(target / 200);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counterElement.innerText = target.toLocaleString();
              clearInterval(timer);
            } else {
              counterElement.innerText = count.toLocaleString();
            }
          }, 10);
          observer.unobserve(counterElement);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counterElement);
  }

  function initializeHowItWorksAnimation() {
    const steps = document.querySelectorAll(".hiw-step");
    if (steps.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    steps.forEach(step => observer.observe(step));
  }

  function initializeFaq() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    if (faqQuestions.length === 0) return;

    let isMobile = window.innerWidth < 992;

    function toggleQuestion(q) {
      const targetAnswer = document.querySelector(q.dataset.target);
      if (!targetAnswer) return;

      // Close all first
      document.querySelectorAll(".faq-question.active, .faq-answer.active")
        .forEach(el => el.classList.remove("active"));

      // Open clicked question
      q.classList.add("active");
      targetAnswer.classList.add("active");
    }

    faqQuestions.forEach(q => {
      q.addEventListener("click", () => toggleQuestion(q));
    });

    // Update mobile/desktop behavior on resize
    window.addEventListener("resize", () => {
      isMobile = window.innerWidth < 992;
    });
  }

});