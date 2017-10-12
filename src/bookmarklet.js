var PriceTracker = window.PriceTracker || {};

/**
 * Escape HTML entities.
 * Reference: http://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
 * @returns {String} Escaped string
 */
PriceTracker.escapeHtmlEntities = function(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

PriceTracker.load = function() {
  alert(this.escapeHtmlEntities(document.title));
}

PriceTracker.load();