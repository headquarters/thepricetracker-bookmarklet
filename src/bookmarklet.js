var PriceTracker = window.PriceTracker || {};

PriceTracker.generateTemplate = function() {
  var title = this.escapeHtmlEntities(document.title);

  var panelHTML = '<div id="price-tracker-panel">';
      panelHTML += '<div id="price-tracker-close">&times;</div>';
      panelHTML += '<div id="price-tracker-title">Add to Price Tracker</div>';
      panelHTML += '<div id="price-tracker-image-block">';
          panelHTML += '<div id="price-tracker-image-container">';
              panelHTML += '<img src="" alt="Product Image" height="100" />';
          panelHTML += '</div>';
          panelHTML += '<div id="price-tracker-previous-image" class="price-tracker-direction left-direction"> &lt; </div>';
              panelHTML += '<div id="price-tracker-image-numbers">';
                  panelHTML += '<span id="price-tracker-current-image">1</span> of <span id="price-tracker-image-total">1</span>';
              panelHTML += '</div>'; //end #price-tracker-image-numbers
          panelHTML += '<div id="price-tracker-next-image" class="price-tracker-direction right-direction"> &gt; </div>';
      panelHTML += '</div>'; //end #price-tracker-image-block
      panelHTML += '<div id="price-tracker-name-block">';
          panelHTML += '<div class="price-tracker-row">';
              panelHTML += '<label>Name <br />';
                  panelHTML += '<input type="text" value="' + title + '" name="name"/>';
              panelHTML += '</label>';
          panelHTML += '</div>';
          panelHTML += '<div class="price-tracker-row">';
              panelHTML += '<label>Note <br />';
                  panelHTML += '<textarea></textarea name="note">';
              panelHTML += '</label>';
          panelHTML += '</div>'; 
          panelHTML += '<div id="price-tracker-price-block" class="price-tracker-row">';
              panelHTML += '<div class="label">Current Price</div>';
              //panelHTML += '<div id="price-tracker-previous-price" class="price-tracker-direction left-direction"> &lt; </div>';
              panelHTML += '<div id="price-tracker-currently-selected-price" data-priceindex="0"></div>';
              //panelHTML += '<div id="price-tracker-next-price" class="price-tracker-direction right-direction"> &gt; </div>';
          panelHTML += '</div>'; //end #price-tracker-price-block
          panelHTML += '<div id="price-tracker-notify-me"  class="price-tracker-row">';
              panelHTML += '<div class="label">Target Price</div>';
              panelHTML += 'Notify me when price drops below <br />';
              panelHTML += '$<input type="text" value="" name="target" />';
          panelHTML += '</div>'; //end #price-tracker-notify-me
      panelHTML += '</div>'; //end #price-tracker-name-block
      panelHTML += '<div id="price-tracker-actions" class="price-tracker-row">';
          panelHTML += '<button type="button">Start Tracking</button>';
      panelHTML += '</div>'; //end #price-tracker-actions
      //panelHTML += '<div id="price-tracker-help"><a href="http://thepricetracker.dev/help" target="pricetracker">Having trouble tracking a price on this page?</a></div>';
      //panelHTML += '<div id="price-tracker-loading"><img src="http://thepricetracker.dev/images/loading.gif" /><br />Loading...</div>';
    panelHTML += '</div>'; //end #price-tracker-panel

    return panelHTML;
} 

/**
 * Escape HTML entities.
 * Reference: http://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
 * @returns {String} Escaped string
 */
PriceTracker.escapeHtmlEntities = function(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

PriceTracker.load = function() {
  var template = this.generateTemplate();

  

}

PriceTracker.load();