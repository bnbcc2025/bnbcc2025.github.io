/**
 * Header component script
 * Handles navbar loading and functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load navbar component
  loadComponent('components/navbar.html', 'navbar-placeholder')
    .then(() => {
      // Initialize navbar functionality after component is loaded
      initializeNavbarScroll();
      initializeNavbarAutoClose();
      initializeNavbarTogglerIcon();
    });

  // Component loading function
  async function loadComponent(url, placeholderId) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      const html = await response.text();
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        placeholder.innerHTML = html;
        return true;
      } else {
        console.warn(`Placeholder with ID '${placeholderId}' not found. Skipping component.`);
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // Navbar functionality
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

  function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});

