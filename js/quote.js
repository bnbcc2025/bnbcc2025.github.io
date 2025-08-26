/**
 * Reusable script for the multi-step quote form.
 * Version: 1.1.0
 * Loads the quote component and handles its functionality.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // COMPONENT LOADER
  // ===================================================================

  /**
   * Fetches HTML content from a URL and injects it into a placeholder element.
   * @param {string} url - The URL of the component to load.
   * @param {string} placeholderId - The ID of the element to inject the HTML into.
   * @returns {Promise<boolean>} - True if loading and injection were successful, false otherwise.
   */
  async function loadComponent(url, placeholderId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);

      const html = await response.text();
      const placeholder = document.getElementById(placeholderId);

      if (placeholder) {
        placeholder.innerHTML = html;
        return true; // Component loaded successfully
      } else {
        console.warn(`Placeholder with ID '${placeholderId}' not found. Skipping component.`);
        return false;
      }
    } catch (err) {
      console.error('Error loading component:', err);
      return false;
    }
  }

  // ===================================================================
  // INITIALIZATION
  // ===================================================================

  /**
   * Main initialization function that loads the form and then sets up its interactive features.
   */
  async function initializeQuoteForm() {
    // Step 1: Load the quote form HTML into its placeholder
    const loaded = await loadComponent('components/quote.html', 'quote-placeholder');

    // Step 2: If the component loaded successfully, initialize all the form's JavaScript
    if (loaded && document.getElementById("multiStepForm")) {
      initializeMultiStepForm();
      initializeGeoapifyAutocomplete();
      populateServicesDropdown();
    }
  }

  // Call the main initialization function to start the process
  initializeQuoteForm();

  // ===================================================================
  // SERVICE DROPDOWN POPULATION
  // ===================================================================
  function populateServicesDropdown() {
    const services = [
      { value: "bond_cleaning", label: "Bond Cleaning" },
      { value: "carpet_cleaning", label: "Carpet Cleaning" },
      { value: "commercial_cleaning", label: "Commercial Cleaning" }
    ];
    const serviceSelect = document.getElementById('serviceType');

    if (serviceSelect) {
      // Clear existing options before adding new ones
      serviceSelect.innerHTML = '<option value="" selected disabled>Select a service...</option>';
      services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.value;
        option.textContent = service.label;
        serviceSelect.appendChild(option);
      });
    }
  }

  // ===================================================================
  // FORM VALIDATION
  // ===================================================================
  function validateFormStep(stepIndex) {
    const form = document.getElementById("multiStepForm");
    const steps = form.querySelectorAll(".form-step");
    if (!steps[stepIndex]) return true;

    const inputs = steps[stepIndex].querySelectorAll("input[required], select[required], textarea[required]");
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();
      const name = input.name;

      // Clear previous errors
      input.classList.remove("is-invalid");
      const existingError = input.parentNode.querySelector(".invalid-feedback");
      if (existingError) existingError.remove();

      // Validation checks
      if (!value) {
        showError(input, "This field is required.");
        isValid = false;
      } else if ((name === "firstName" || name === "lastName") && /^\d+$/.test(value)) {
        showError(input, "Name cannot be only numbers.");
        isValid = false;
      } else if (name === "emailAddress" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(input, "Please enter a valid email address.");
        isValid = false;
      } else if (name === "phoneNumber" && !/^(\+?61|0)[2-478](\s?\d){8}$/.test(value.replace(/\s+/g, ""))) {
        showError(input, "Please enter a valid Australian phone number.");
        isValid = false;
      } else if (name === "propertyAddress" && !/\b\d{4}\b/.test(value)) {
        showError(input, "Address must include a 4-digit postcode.");
        isValid = false;
      }
    });

    return isValid;
  }

  function showError(input, message) {
    input.classList.add("is-invalid");
    const error = document.createElement("div");
    error.className = "invalid-feedback";
    error.innerText = message;
    // Insert after the input field for proper Bootstrap styling
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  // ===================================================================
  // MULTI-STEP FORM LOGIC
  // ===================================================================
  function initializeMultiStepForm() {
    const form = document.getElementById("multiStepForm");
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

      prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
      nextBtn.style.display = currentStep < steps.length - 1 ? 'block' : 'none';
      submitBtn.style.display = currentStep === steps.length - 1 ? 'block' : 'none';

      if (navigation) {
        navigation.style.justifyContent = currentStep > 0 ? 'space-between' : 'flex-end';
      }

      progressSteps.forEach((step, idx) => step.classList.toggle("active", idx <= currentStep));
      if (progress) {
        const activeSteps = document.querySelectorAll(".progress-step.active").length;
        const totalSteps = progressSteps.length;
        progress.style.width = ((activeSteps - 1) / (totalSteps - 1)) * 100 + "%";
      }
    };

    const populateReview = () => {
      const formData = new FormData(form);
      let html = "";
      const labels = {
        firstName: 'First Name', lastName: 'Last Name',
        emailAddress: 'Email', phoneNumber: 'Phone',
        serviceType: 'Service', propertyAddress: 'Address',
        messageContent: 'Message'
      };

      const unitValue = document.getElementById('unit').value.trim();
      const propertyAddressValue = document.getElementById('address-autocomplete').value.trim();

      let fullAddress = propertyAddressValue;

      if (unitValue) {
        fullAddress = `${unitValue} ${propertyAddressValue}`;
      }

      for (const [key, value] of formData.entries()) {
        if (labels[key] && value) {

          if (key === 'propertyAddress' && fullAddress) {
            html += `<p class="mb-2"><strong>${labels[key]}:</strong> ${fullAddress}</p>`;
          } else if (labels[key] && value && key !== 'unit') {
            html += `<p class="mb-2"><strong>${labels[key]}:</strong> ${value.replace(/\n/g, '<br>')}</p>`;
          }
        }
      }
      reviewDetails.innerHTML = html;
    };

    nextBtn.addEventListener("click", () => {
      if (validateFormStep(currentStep)) {
        currentStep++;
        if (currentStep === steps.length - 1) {
          populateReview();
        }
        updateForm();
      }
    });

    prevBtn.addEventListener("click", () => {
      currentStep--;
      updateForm();
    });

    form.addEventListener("submit", (e) => {
      // Only allow submission on the last step
      if (currentStep < steps.length - 1) {
        e.preventDefault();
        // If current step is valid, go to next step
        if (validateFormStep(currentStep)) {
          currentStep++;
          if (currentStep === steps.length - 1) {
            populateReview();
          }
          updateForm();
        }
        // Otherwise, stay on current step and show errors
        return;
      }
      // On last step, validate before submitting
      if (validateFormStep(currentStep)) {
        // Get the address values
        const unitValue = document.getElementById('unit').value.trim();
        const propertyAddressInput = document.getElementById('address-autocomplete');

        // If a unit value exists, prepend it to the address field's value
        if (unitValue) {
          propertyAddressInput.value = `${unitValue} ${propertyAddressInput.value.trim()}`;
        }

        // Set the unit field's value to be empty so it doesn't get sent as a separate field
        document.getElementById('unit').value = '';

        // The form will now submit with the updated propertyAddress value
      } else {
        e.preventDefault();
        return;
      }
      gtag_report_conversion();
      // Let the browser submit the form to the iframe (no fetch, no CORS)
      // Success message will be handled on iframe load
    });

    const iframe = document.getElementById('hidden_iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        // Show success message and reset form
        const formContainer = document.querySelector('.form-container');
        formContainer.style.minHeight = `${formContainer.offsetHeight}px`;
        form.style.display = 'none';
        document.querySelector('.progressbar').style.display = 'none';
        successMessage.style.display = 'block';

        setTimeout(() => {
          successMessage.style.display = 'none';
          document.querySelector('.progressbar').style.display = 'flex';
          form.style.display = 'block';
          form.reset();
          currentStep = 0;
          updateForm();
          formContainer.style.minHeight = '';
        }, 5000);
      });
    }

    updateForm();
  }

  // ===================================================================
  // GEOAPIFY AUTOCOMPLETE
  // ===================================================================
  function initializeGeoapifyAutocomplete() {
    const addressInput = document.getElementById('address-autocomplete');
    if (!addressInput) return;

    const apiKey = "bf5f3467e02143a2b0c3143112957865";
    let debounceTimeout;

    const fetchSuggestions = async (text) => {
      if (text.length < 3) return; // Don't search for very short strings
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}&filter=countrycode:au`;
      try {
        const response = await fetch(url);
        const result = await response.json();
        displaySuggestions(result.features);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    };

    const displaySuggestions = (suggestions) => {
      closeAllLists();
      if (!suggestions || suggestions.length === 0) return;

      const list = document.createElement("div");
      list.setAttribute("class", "autocomplete-items");
      addressInput.parentNode.appendChild(list);

      suggestions.forEach(feature => {
        if (feature.properties.formatted) {
          const item = document.createElement("div");
          item.innerHTML = feature.properties.formatted.replace(new RegExp(addressInput.value, "gi"), "<strong>$&</strong>");
          item.addEventListener("click", function () {
            addressInput.value = feature.properties.formatted;
            closeAllLists();
          });
          list.appendChild(item);
        }
      });
    };

    const closeAllLists = () => {
      const lists = document.getElementsByClassName("autocomplete-items");
      Array.from(lists).forEach(list => list.parentNode.removeChild(list));
    };

    addressInput.addEventListener("input", function () {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => fetchSuggestions(this.value), 350);
    });

    document.addEventListener("click", (e) => {
      if (e.target !== addressInput) {
        closeAllLists();
      }
    });
  }
});
