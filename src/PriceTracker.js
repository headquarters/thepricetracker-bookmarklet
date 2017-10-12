import PriceTracker from './PriceTracker.html';

var target = document.createElement('div');
document.body.appendChild(target);

var searchDepth = 100;
/**
 * Returns an array of text nodes that are jQuery objects referencing
 * nodes in the DOM that have prices in them, according to priceFormatRegex
 * Reference: http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
 */
function getTextNodesWithPriceSymbol(node) {
  var dollarSignRegex = /\$/g;
  var priceFormatRegex = /\$[1-9][0-9]*(\.[0-9]{2})?|\$0?\.[0-9][0-9]/i;
  var textNodes = [], whitespace = /^\s*$/;
  var TEXT_NODE = 3;
  var TEXT_LIMIT = 100;

  if(searchDepth > 0) {
      function getTextNodesWithPriceSymbol(node) {
          // Only check text nodes with a fairly short length and verify they have a dollar sign in them
          if (node.nodeType == TEXT_NODE && node.textContent.length < TEXT_LIMIT && dollarSignRegex.test(node.textContent)) {
              // The parent node is a non-text DOM node that contains a dollar sign
              // Allows for finding prices like <div>$<span>90</span>.99</div>
              // Will fail when the dollar sign is more deeply nested, like <div><strong>$</strong><span>90</span>.99</div>
              var $element = node.parentNode;
              
              var priceText = $element.innerText;

              // Verify text in the node with the dollar sign contains a valid price            
              if (priceFormatRegex.test(priceText)) {
                  var priceNode = {};                  
                  priceNode.$element = $element;                  
                  priceText = priceText.replace(",", "");

                  var priceMatchArray = priceFormatRegex.exec(priceText);                  
                  priceNode.price = priceMatchArray[0];
                  
                  var weight = 1000; 

                  var rect = $element.getBoundingClientRect();
                  var styles = window.getComputedStyle($element);
                  var fontWeight = styles.getPropertyValue('font-weight');

                  // Node is "visible" (above fold in x and y) and not struck through (generally a sign that a price is "slashed" and not the real price)
                  if (rect.y < document.documentElement.clientHeight 
                      && rect.x < document.documentElement.clientWidth 
                      && styles.getPropertyValue("text-decoration").indexOf('line-through') === -1) {
                      // Larger font sizes count more towards this being the main price for the page
                      weight += parseInt(styles.getPropertyValue("font-size"), 10) * 10;
                    
                      // Bolder fonts count more
                      if(fontWeight === 'normal'){
                          weight += 400;
                      } else if (fontWeight === 'bold'){
                          weight += 700;
                      } else {
                          weight += parseInt(fontWeight, 10);
                      }
                      
                      // Things further towards the top of the screen count more
                      weight -= rect.top;
                      
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
          $element = null;
          weight = null;			
      }

      searchDepth--;
      getTextNodesWithPriceSymbol(node);
  }
  return textNodes;
}

var priceNodeCollection = getTextNodesWithPriceSymbol(document.body);

priceNodeCollection.sort(function(a, b){
    return b.weight - a.weight;
});

var price = null;
var discountedPrice = 0;
var targetPriceNode = null;
var originalStyle = {};

if (priceNodeCollection.length > 0){
  targetPriceNode = priceNodeCollection[0].$element;
  originalStyle = target.style;
  targetPriceNode.style.backgroundColor = '#ffff9b';    
  targetPriceNode.style.zIndex = 20000;
  targetPriceNode.style.position = 'relative';


  price = priceNodeCollection[0].price;

  var priceFloat = parseFloat(priceNodeCollection[0].price.replace('$', ''));
  
  discountedPrice = Math.floor(priceFloat - Math.ceil(priceFloat * 0.10));
} 
// move into component to display different message when price is not found on page
    // else {
    //     var $button = $panel.find('#price-tracker-actions button');
    //     $button.text('Close');            
    //     $button.before('<div class="error">No prices were found on this page.</div>');
    // }

console.log(priceNodeCollection);

var _PriceTracker = new PriceTracker({
  target: target,
  data: {
    title: document.title,
    price: price,
    discountedPrice: discountedPrice,
    priceNode: targetPriceNode,
    originalStyle: originalStyle
  }
});

export default _PriceTracker;
