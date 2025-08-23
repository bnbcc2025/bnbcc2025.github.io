/**
 * Footer component script
 * Handles footer loading
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load footer component
  loadComponent('components/footer.html', 'footer-placeholder');

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
});