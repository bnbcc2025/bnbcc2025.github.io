/**
 * Main application script for the website.
 * Version: 5.3.0 (Geoapify autocomplete + fixed multi-step form)
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // INITIALIZATION SEQUENCE
  // ===================================================================
  const services = [
    { value: "bond_cleaning", label: "Bond Cleaning" },
    { value: "carpet_cleaning", label: "Carpet Cleaning" },
    { value: "commercial_cleaning", label: "Commercial Cleaning" }
  ];
  const serviceSelect = document.getElementById('serviceType');
  services.forEach(service => {
    const option = document.createElement('option');
    option.value = service.value;
    option.textContent = service.label;
    serviceSelect.appendChild(option);
  });

  async function initializePage() {
    await loadAllComponents();

    initializeNavbarScroll();
    initializeNavbarAutoClose();
    initializeNavbarTogglerIcon();
    initializeStatsCounters();
    initializeClientCounter();
    initializeHowItWorksAnimation();
    initializeFaq();
    initializeMultiStepForm();
  }

  // ===================================================================
  // COMPONENT LOADING
  // ===================================================================
  async function loadComponent(url, placeholderId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      const html = await response.text();
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) placeholder.innerHTML = html;
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAllComponents() {
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || true;
    const loadPromises = [
      loadComponent(isHomePage ? 'components/navbar.html' : 'components/navbar.html', 'navbar-placeholder'),
      loadComponent('components/footer.html', 'footer-placeholder')
    ];
    if (isHomePage) {
      loadPromises.push(loadComponent('components/hero.html', 'hero-placeholder'));
    }
    await Promise.all(loadPromises);
  }

  function initializeNavbarAutoClose() {
  const navbarCollapse = document.getElementById("main-nav");
  if (!navbarCollapse) return;

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (navbarCollapse.classList.contains("show") &&
        !navbarCollapse.contains(e.target) &&
        !e.target.closest(".navbar-toggler")) {
      bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
    }
  });

  // Close on scroll
  window.addEventListener("scroll", () => {
    if (navbarCollapse.classList.contains("show")) {
      bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
    }
  }, { passive: true });
}
function initializeNavbarTogglerIcon() {
  const navbarCollapse = document.getElementById("main-nav");
  const toggler = document.getElementById("navbarToggler");
  if (!navbarCollapse || !toggler) return;

  navbarCollapse.addEventListener("show.bs.collapse", () => {
    toggler.querySelector(".navbar-toggler-icon").classList.add("d-none");
    toggler.querySelector(".close-icon").classList.remove("d-none");
  });

  navbarCollapse.addEventListener("hide.bs.collapse", () => {
    toggler.querySelector(".navbar-toggler-icon").classList.remove("d-none");
    toggler.querySelector(".close-icon").classList.add("d-none");
  });
}


  // ===================================================================
  // INTERACTIVE COMPONENT INITIALIZERS
  // ===================================================================
  function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function initializeStatsCounters() {
    const statsSection = document.querySelector("#facts");
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsSection.classList.add('is-visible');
          const numberElements = statsSection.querySelectorAll(".stat-number");
          numberElements.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            let count = 0;
            const duration = 2000;
            const stepTime = 10;
            const totalSteps = duration / stepTime;
            const increment = Math.ceil(target / totalSteps);

            const timer = setInterval(() => {
              count += increment;
              if (count >= target) {
                el.innerText = target.toLocaleString();
                clearInterval(timer);
              } else {
                el.innerText = count.toLocaleString();
              }
            }, stepTime);
          });
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
          const duration = 2000;
          const stepTime = 10;
          const totalSteps = duration / stepTime;
          const increment = Math.ceil(target / totalSteps);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counterElement.innerText = target.toLocaleString();
              clearInterval(timer);
            } else {
              counterElement.innerText = count.toLocaleString();
            }
          }, stepTime);
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
    const isMobile = window.innerWidth < 992;

    if (isMobile) {
      faqQuestions.forEach(q => {
        const answer = document.querySelector(q.dataset.target);
        if (answer) q.insertAdjacentElement('afterend', answer);
      });
    }

    faqQuestions.forEach(q => {
      q.addEventListener('click', () => {
        const targetAnswer = document.querySelector(q.dataset.target);
        if (isMobile) {
          q.classList.toggle('active');
          if (targetAnswer) targetAnswer.classList.toggle('active');
        } else {
          document.querySelectorAll('.faq-question.active, .faq-answer.active').forEach(el => el.classList.remove('active'));
          q.classList.add('active');
          if (targetAnswer) targetAnswer.classList.add('active');
        }
      });
    });
  }

  function validateFormStep(stepIndex) {
    const form = document.getElementById("multiStepForm");
    const steps = form.querySelectorAll(".form-step");
    const inputs = steps[stepIndex].querySelectorAll("input, select, textarea");
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();
      const name = input.name;

      // Clear previous errors
      input.classList.remove("is-invalid");
      const existingError = input.parentNode.querySelector(".invalid-feedback");
      if (existingError) existingError.remove();

      // Required check
      if (input.required && !value) {
        showError(input, "This field is required");
        isValid = false;
        return;
      }

      // First & Last Name: cannot be numeric only
      if ((name === "firstName" || name === "lastName") && /^\d+$/.test(value)) {
        showError(input, "Name cannot be only numbers");
        isValid = false;
        return;
      }

      // Email validation
      if (name === "emailAddress" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(input, "Enter a valid email address");
          isValid = false;
          return;
        }
      }

      // Phone validation (Australian)
      if (name === "phoneNumber" && value) {
        const phoneRegex = /^(\+?61|0)[2-478](\s?\d){8}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
          showError(input, "Enter a valid Australian phone number");
          isValid = false;
          return;
        }
      }

      // Address must contain postcode (numbers at end)
      if (name === "propertyAddress" && value) {
        const postcodeRegex = /\b\d{4}\b/; // Australian postcode
        if (!postcodeRegex.test(value)) {
          showError(input, "Address must include a 4-digit postcode");
          isValid = false;
          return;
        }
      }

      // Select validation
      if (input.tagName.toLowerCase() === "select" && input.required && !value) {
        showError(input, "Please select an option");
        isValid = false;
        return;
      }
    });

    return isValid;
  }

  function showError(input, message) {
    input.classList.add("is-invalid");
    const error = document.createElement("div");
    error.className = "invalid-feedback";
    error.innerText = message;
    input.parentNode.appendChild(error);
  }

  // ===================================================================
  // MULTI-STEP FORM
  // ===================================================================
  function initializeMultiStepForm() {
    const form = document.getElementById("multiStepForm");
    if (!form) return;

    const steps = form.querySelectorAll(".form-step");
    const prevBtn = form.querySelector(".btn-prev");
    const nextBtn = form.querySelector(".btn-next");
    const submitBtn = form.querySelector(".btn-submit");
    const navigation = form.querySelector(".form-navigation");
    const reviewDetails = document.getElementById("review-details");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progress = document.getElementById("progress");
    const successMessage = document.getElementById("formSuccessMessage");
    let currentStep = 0;

    const updateForm = () => {
      steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));

      if (currentStep === 0) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        navigation.style.justifyContent = 'flex-end';
      } else if (currentStep === steps.length - 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        navigation.style.justifyContent = 'space-between';
      } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        navigation.style.justifyContent = 'space-between';
      }

      progressSteps.forEach((step, idx) => step.classList.toggle("active", idx <= currentStep));
      const activeProgress = document.querySelectorAll(".progress-step.active");
      if (progress) progress.style.width = ((activeProgress.length - 1) / (progressSteps.length - 1)) * 100 + "%";
    };

    const populateReview = () => {
      const formData = new FormData(form);
      let html = "";
      const labels = { firstName: 'First Name', lastName: 'Last Name', emailAddress: 'Email', phoneNumber: 'Phone', serviceType: 'Service', propertyAddress: 'Address', messageContent: 'Message' };
      for (const [key, value] of formData.entries()) {
        if (labels[key] && value) html += `<p><strong>${labels[key]}:</strong> ${value}</p>`;
      }
      reviewDetails.innerHTML = html;
    };

    nextBtn.addEventListener("click", () => {
      if (!validateFormStep(currentStep)) return;
      if (currentStep < steps.length - 1) {
        currentStep++;
        if (currentStep === steps.length - 1) populateReview();
        updateForm();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateForm();
      }
    });

    if (form && successMessage) {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent full page reload
        if (!validateFormStep(currentStep)) return;
        const phoneInput = document.getElementById("phoneNumber");
        if (phoneInput) {
          let digits = phoneInput.value.replace(/\D/g, ""); // Remove all non-digit characters
          if (digits.startsWith("61")) digits = digits.slice(2); // Remove country code
          if (!digits.startsWith("0")) digits = "0" + digits;    // Ensure it starts with 0
          digits = digits.slice(0, 9); // limit to 9 digits
          phoneInput.value = digits[0] + " " + digits.slice(1, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7, 9);
        }


        const formData = new FormData(form);
        let reviewHtml = '<ul>';
        for (let [key, value] of formData.entries()) {
          if (key !== 'website') reviewHtml += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        reviewHtml += '</ul>';
        reviewDetails.innerHTML = reviewHtml;

        // Send data via iframe
        const hiddenIframe = document.getElementById('hidden_iframe');
        form.target = 'hidden_iframe';
        form.submit(); // safe now because we prevent default and it's posting to iframe

        // Show success immediately or after a short delay
        setTimeout(() => {
          const progressBar = document.querySelector('.progressbar');
          if (progressBar) progressBar.style.display = 'none';
          form.style.display = 'none';
          successMessage.style.display = 'block';

          // Optional: scroll to success
          window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });

          // Reset form after 4 seconds
          setTimeout(() => {
            successMessage.style.display = 'none';
            form.style.display = 'block';
            if (progressBar) progressBar.style.display = 'flex';
            form.reset();
            currentStep = 0;
            reviewDetails.innerHTML = '';
            updateForm();
          }, 4000);
        }, 300); // short delay to ensure iframe submission starts

        // Google Ads conversion
        if (typeof gtag_report_conversion === 'function') {
          gtag_report_conversion('Quote Request');
        }
      });

    }

    updateForm();
  }

  // ===================================================================
  // GEOAPIFY AUTOCOMPLETE
  // ===================================================================
  const addressInput = document.getElementById('address-autocomplete');
  if (addressInput) {
    const apiKey = "bf5f3467e02143a2b0c3143112957865";
    let currentFocus;
    let debounceTimeout;

    addressInput.addEventListener("input", function () {
      const inputValue = this.value;
      closeAllLists();
      if (!inputValue) return false;
      currentFocus = -1;

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => fetchSuggestions(inputValue), 300);
    });

    async function fetchSuggestions(text) {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
      try {
        const response = await fetch(url);
        const result = await response.json();
        displaySuggestions(result.features);
      } catch (error) {
        console.log('error', error);
      }
    }

    function displaySuggestions(suggestions) {
      closeAllLists();
      if (!suggestions || suggestions.length === 0) return;

      const autocompleteList = document.createElement("DIV");
      autocompleteList.setAttribute("class", "autocomplete-items");
      addressInput.parentNode.appendChild(autocompleteList);

      suggestions.forEach(feature => {
        const suggestionItem = document.createElement("DIV");
        suggestionItem.innerHTML = `<strong>${feature.properties.address_line1}</strong>, ${feature.properties.address_line2}`;
        suggestionItem.dataset.fullAddress = feature.properties.formatted;
        suggestionItem.addEventListener("click", function () {
          addressInput.value = this.dataset.fullAddress;
          closeAllLists();
        });
        autocompleteList.appendChild(suggestionItem);
      });
    }

    addressInput.addEventListener("keydown", function (e) {
      let list = this.parentNode.querySelector(".autocomplete-items");
      if (list) list = list.getElementsByTagName("div");
      if (!list) return;

      if (e.keyCode == 40) { currentFocus++; addActive(list); }
      else if (e.keyCode == 38) { currentFocus--; addActive(list); }
      else if (e.keyCode == 13) { e.preventDefault(); if (currentFocus > -1) list[currentFocus].click(); }
    });

    function addActive(list) {
      if (!list) return false;
      removeActive(list);
      if (currentFocus >= list.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (list.length - 1);
      list[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(list) {
      for (let i = 0; i < list.length; i++) list[i].classList.remove("autocomplete-active");
    }

    function closeAllLists(elmnt) {
      const lists = document.getElementsByClassName("autocomplete-items");
      for (let i = 0; i < lists.length; i++) {
        if (elmnt != lists[i] && elmnt != addressInput) lists[i].parentNode.removeChild(lists[i]);
      }
    }

    document.addEventListener("click", e => closeAllLists(e.target));
  }

  // --- START THE APP ---
  initializePage();
});
