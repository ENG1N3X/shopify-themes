/**
 * imports
 */
import './css/main.scss'
import './js/theme.js'

/**
 * fix: properly render components inside sections on user insert in the theme editor
 * add the '[CLASS]' keyword to the section's wrapper classes e.g.:
 * {% schema %}
 * {
 *   "class": "shopify-section-[CLASS]"
 * }
 * {% endschema %}
 */
// eslint-disable-next-line
// Shopify.designMode && document.addEventListener('shopify:section:load', (event) => {
//   if (event.target.classList.value.includes('[CLASS]')) {
//     console.log("triggered load event")
//   }
// })