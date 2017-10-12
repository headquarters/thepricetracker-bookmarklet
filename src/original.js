var PriceTracker = (function(){
  var self = {};
  
  //Private
  var searchDepth = 100;
  var dollarSignRegex = /\$/g;
  var priceFormatRegex = /\$[1-9][0-9]*(\.[0-9]{2})?|\$0?\.[0-9][0-9]/i;
  var currentPriceIndex;
  var priceNodeCollection = [];
  var $panel;
  var $discount;
  var title = htmlEntities(document.title);
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
  
  /**
   * Escape HTML entities.
   * Reference: http://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
   * @returns {String} Escaped string
   */
  function htmlEntities(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // TODO: ignore negative numbers
  /**
   * Returns an array of text nodes that are jQuery objects referencing
   * nodes in the DOM that have prices in them, according to priceFormatRegex
   * Reference: http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
   */
  function getTextNodesWithPriceSymbol(node) {
      var textNodes = [], whitespace = /^\s*$/;
      if(searchDepth > 0){
          function getTextNodesWithPriceSymbol(node) {
              //nodeType == 3 is a text node; check for length < 100 to weed out really long blocks of text and
              //verify it has a dollar sign in it
              if (node.nodeType == 3 && node.textContent.length < 100 && dollarSignRegex.test(node.textContent)) {
                  
                  //non-text DOM node that contains the dollar sign; allows for finding prices like <div>$<span>90</span>.99</div>
                  //will fail on <div><strong>$</strong><span>90</span>.99</div>
                  //TODO: find way to handle awkward tag soup above
                  var $element = $(node).parent();
                  
                  var priceText = $element.text();

                  //verify text in the node with the dollar sign contains a valid price
                  if(priceFormatRegex.test(priceText)){
                      
                      //non-jQuery object for containing the jQuery object itself, price, and weight
                      var priceNode = {};
                      
                      priceNode.$element = $element;
                      
                      priceText = priceText.replace(",", "");
                      
                      var priceMatchArray = priceFormatRegex.exec(priceText);
                      
                      priceNode.price = priceMatchArray[0];
                      
                      var weight = 0; 
                      
                      if($element.is(':visible') && $element.css('text-decoration') !== 'line-through'){
                          weight += 1000;
                          weight += parseInt($element.css('font-size'), 10) * 10;
                          
                      
                          if($element.css('font-weight') === 'normal'){
                              weight += 400;
                          } else if ($element.css('font-weight') === 'bold'){
                              weight += 700;
                          } else {
                              weight += parseInt($element.css('font-weight'), 10);
                          }
                          
                          var offset = $element.offset();
                          
                          //prioritize things in upper left over things in lower right
                          //weight -= offset.left;
                          weight -= offset.top;
                          
                          priceNode.weight = weight;
                          textNodes.push(priceNode);
                      }				     	
                  }  
              } else {
                  for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                      getTextNodesWithPriceSymbol(node.childNodes[i]);
                  }
              }
              
              priceNode = null;
              $node = null;
              weight = null;			
          }
  
          searchDepth--;
          getTextNodesWithPriceSymbol(node);
      }
      return textNodes;
  }
  
  //Public
  
  /**
   * Load custom jQuery build and initialize rest of bookmarklet.
   * @returns void
   */
  self.load = function(){
      var script = document.createElement("script");

      if (script.readyState) { //IE
          script.onreadystatechange = function() {
              if (script.readyState == "loaded" || script.readyState == "complete") {
                  script.onreadystatechange = null;
                  //setupPriceTracker();
                  PriceTracker.init();
              }
          };
      } else { //Others
          script.onload = function() {
              //setupPriceTracker();
              PriceTracker.init();
          };
      }
      script.src = '{{ $address }}/js/jquery-base.js';
      document.getElementsByTagName("head")[0].appendChild(script);
  };
  
  /**
   * Initialize bookmarklet, called onready when jQuery is loaded.
   * @returns void
   */
  self.init = function(){
      /*
       * Extend jQuery with getPath() method for building a CSS path
       * Inspired by: http://stackoverflow.com/a/2068381
       * Using the code from: http://paste.blixt.org/297640
       */
      //jQuery.fn.extend({
      //    getPath: function() {
      //        var path, node = this;
      //        while (node.length) {
      //            var realNode = node[0], name = realNode.localName;
      //            if (!name) break;
      //            name = name.toLowerCase();
      //    
      //            var parent = node.parent();
      //    
      //            var siblings = parent.children(name);
      //            if (siblings.length > 1) {
      //                //nth-child counts all children, not of just one type
      //                //name += ':nth-child(' + (siblings.index(realNode) + 1) + ')';
      //                name += ':nth-of-type(' + (siblings.index(realNode) + 1) + ')';
      //            }
      //    
      //            path = name + (path ? '>' + path : '');
      //            node = parent;
      //        }
      //
      //        return path;
      //    }        
      //});
      jQuery.fn.extend({
         getPath: function () {
              if (this.length != 1) throw 'Requires one element.';
          
              var path, node = this;
              while (node.length) {
                  var realNode = node[0], name = realNode.localName;
                  if (!name) break;
          
                  name = name.toLowerCase();
                  if (realNode.id) {
                      // As soon as an id is found, there's no need to specify more.
                      return name + '#' + realNode.id + (path ? '>' + path : '');
                  } else if (realNode.className) {
                      name += '.' + realNode.className.split(/\s+/).join('.');
                  }
          
                  var parent = node.parent(), siblings = parent.children(name);
                  if (siblings.length > 1) name += ':nth-child(' + (siblings.index(node) + 1) + ')';
                  path = name + (path ? '>' + path : '');
          
                  node = parent;
              }
          
              return path;
         }
      });        

      PriceTracker.setupPanel();
      
      PriceTracker.findImages();
      
      PriceTracker.bindEvents();
      
      PriceTracker.finish();
  };
  
  self.setupPanel = function(){
      //remove any existing PriceTracker panels from the DOM
      $('#price-tracker-panel').remove();
      
      $panel = $(panelHTML);
      
      $discount = $panel.find('#price-tracker-notify-me input');
      
      priceNodeCollection = getTextNodesWithPriceSymbol(document.body);
      
      priceNodeCollection.sort(function(a, b){
          return b.weight - a.weight;
      });
      
      //default node
      if(priceNodeCollection.length > 0){
          priceNodeCollection[0].$element.css('background', '#ffff9b');    
      
          // TODO: priceNodesAsText should be sorted by this point
          var $price = $panel.find('#price-tracker-currently-selected-price').data('priceindex', 0).text(priceNodeCollection[0].price);
        
          var priceFloat = parseFloat(priceNodeCollection[0].price.replace('$', ''));
          
          var discountedPrice = Math.floor(priceFloat - Math.ceil(priceFloat * 0.10));
          
          if(discountedPrice === 0){
              discountedPrice = '0.02';
          }
          
          $discount.val(discountedPrice);
      } else {
          var $button = $panel.find('#price-tracker-actions button');
          $button.text('Close');            
          $button.before('<div class="error">No prices were found on this page.</div>');
      }
  }
  
  self.findImages = function(){
      if(document.images.length > 0){
          var images = [];
          for(var i = 0; i < document.images.length; i++){
              var img = document.images[i];
              var $img = $(img);
              if($img.is(':visible')){
                  //limit images to sizes (arbitrarily) greater than 40px in width and height 
                  if(img.width > 40 && img.height > 40){
                      images.push(img);
                  }    
              }            
          }
          
          images.sort(function(image1, image2){
              var $image1 = $(image1);
              var $image2 = $(image2);
              
              var image1Offset = $image1.offset();
              var image1OffsetLeft = image1Offset.left;
              var image1OffsetTop = image1Offset.top;
              
              var image2Offset = $image2.offset();
              var image2OffsetLeft = image2Offset.left;
              var image2OffsetTop = image2Offset.top;
              
              return (image2.width + image2.height - image2OffsetLeft - image2OffsetTop) - (image1.width + image1.height - image1OffsetLeft - image1OffsetTop);
          });
          
          var $image = $panel.find('#price-tracker-image-block img');
          
          $image.attr('src', images[0].src);   
          
          $panel.find('#price-tracker-image-total').text(images.length);
          
          var $previousImage = $panel.find('#price-tracker-previous-image');
      
          var $nextImage = $panel.find('#price-tracker-next-image');
          
          $previousImage.add($nextImage).on('click.PriceTracker', function(e){
              var id = $(e.currentTarget).attr('id');
              
              var currentImageIndex = parseInt($('#price-tracker-current-image').text()) - 1;
              
              var nextImageIndex;
              var nextImageIndexVisible;
              
              if(id === "price-tracker-next-image"){
                  nextImageIndex = (currentImageIndex + 1) % images.length;
                  nextImageIndexVisible = nextImageIndex + 1;
              } else {
                  if(currentImageIndex == 0){
                      nextImageIndex = images.length - 1;
                      nextImageIndexVisible = images.length;
                  } else {
                      nextImageIndex = (currentImageIndex - 1) % images.length;
                      nextImageIndexVisible = nextImageIndex + 1;
                  }
              }
              
              $image.attr('src', images[nextImageIndex].src);
              
              $('#price-tracker-current-image').text(nextImageIndexVisible);
          });
      } else {
          $panel.find('#price-tracker-image-block').css('display', 'none');
      }  
  };
  
  self.bindEvents = function(){
      //Close
      $panel.find('#price-tracker-close').on('click.PriceTracker', function(e){
          //unbind direction arrow clicks
          $panel.find('.price-tracker-direction').unbind('click.PriceTracker');
              
          //TODO: unbind Start Tracking button click
          $panel.remove();
      });
      
      //Save
      $panel.find('#price-tracker-actions button').on('click.PriceTracker', function(e){
          var imageSrc = $('#price-tracker-image-container img').attr('src');
          var name = $('#price-tracker-name-block input').val();
          var note = $('#price-tracker-name-block textarea').val();
          var currentPrice = $('#price-tracker-currently-selected-price').text().replace('$', '');
          var targetPrice = $('#price-tracker-notify-me input').val();
          var index = $('#price-tracker-currently-selected-price').data('priceindex');
          
          var $button = $(this);
          
          var priceTextNode = priceNodeCollection[index];
          
          if (typeof priceTextNode == "undefined") {
              $panel.find('#price-tracker-close').trigger('click');
              return;
          }
          
          var cssSelector = priceTextNode.$element.getPath();
          
          var saveURL = '{{ $address }}/bookmark/save?';
          
          saveURL += 'name=' + name;
          saveURL += '&note=' + note;
          saveURL += '&current_price=' + currentPrice;
          saveURL += '&saved_price=' + currentPrice;
          saveURL += '&target_price=' + targetPrice;
          saveURL += '&css_selector=' + encodeURIComponent(cssSelector);
          saveURL += '&image_src=' + imageSrc;
          saveURL += '&full_url=' + encodeURIComponent(window.location.href);;
          
          var encodedURL = encodeURI(saveURL);
   
          $button.text("Saving...").attr('disabled', 'disabled').before('<img src="https://thepricetracker.com/images/loading.gif" alt="" />');
          
          var resultMessage = '';
          var error = false;
          
          // No REST for the Wicked: GET request here, despite the fact that we're creating an entity
          // Also expecting a 200 error, even if errors occur server-side
          // TODO: use and honor HTTP codes properly
          $.ajax({
              type: "GET",
              url: encodedURL,
              dataType: 'jsonp',
              contentType: 'application/json',
              success: function(data, txt, xhr){
                  //Done! This product\'s price is now being tracked.
                  //Woohoo! This product\'s price is now being tracked.
                  
                  $button.text("Start Tracking").prev('img').remove();
                  
                  if(data.status === "success"){
                      resultMessage = 'Success! This price is now being tracked.';
                      $button.replaceWith('<p class="success">' + resultMessage + '</p>');
                  } else {
                      //validation errors
                      var messages = data.messages;
                      
                      for(var field in messages){
                          resultMessage += messages[field] + '<br />';
                      }
                      
                      $button.removeAttr('disabled');
                      
                      if($button.next('p').length){
                          $button.next('p').replaceWith('<p class="error">' + resultMessage + '</p>');    
                      } else {
                          $button.after('<p class="error">' + resultMessage + '</p>');    
                      }
                      
                  }
              },
              
              error: function(xhr, txt, err){
                  resultMessage = 'Sorry, an error has occurred while saving. Please try again later.';
                  $button.removeAttr('disabled');
                  $button.text("Start Tracking").prev('img').remove();
                  if($button.next('p').length){
                      $button.next('p').replaceWith('<p class="error">' + resultMessage + '</p>');    
                  } else {
                      $button.after('<p class="error">' + resultMessage + '</p>');    
                  }
              }            
          });
      });
      
  }
  
  self.finish = function(){
      //attach everything to the DOM
      $(document.body).append($panel);
      
      currentPriceIndex = $('#price-tracker-currently-selected-price').data('priceindex');
      
      $panel.draggable().css({ "top": 40, "right": 100 });
  };
  
  return self;
}());

PriceTracker.load();