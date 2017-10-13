var searchDepth = 100;

function getTextNodesWithPriceSymbol(node) {
  var dollarSignRegex = /\$/m;
  var priceFormatRegex = /\$[1-9][0-9]*(\.[0-9]{2})?|\$0?\.[0-9][0-9]/i;
  var textNodes = [];
  var TEXT_NODE = 3;
  var TEXT_LIMIT = 100;

  if (searchDepth > 0) {
    function _getTextNodesWithPriceSymbol(node) {
      // Only check text nodes with a fairly short length and verify they have a dollar sign in them
      if (
        node.nodeType == TEXT_NODE &&
        node.textContent.length < TEXT_LIMIT &&
        dollarSignRegex.test(node.textContent)
      ) {
        // && node.textContent.length < TEXT_LIMIT && dollarSignRegex.test(node.textContent)) {
        // The parent node is a non-text DOM node that contains a dollar sign
        // Allows for finding prices like <div>$<span>90</span>.99</div>
        // Will fail when the dollar sign is more deeply nested, like <div><strong>$</strong><span>90</span>.99</div>
        var element = node.parentNode;

        var priceText = element.textContent;

        // Verify text in the node with the dollar sign contains a valid price
        if (priceFormatRegex.test(priceText)) {
          var priceNode = {};
          priceNode.element = element;
          priceText = priceText.replace(",", "");

          var priceMatchArray = priceFormatRegex.exec(priceText);
          priceNode.price = priceMatchArray[0];

          var weight = 1000;

          var rect = element.getBoundingClientRect();
          var styles = window.getComputedStyle(element);
          var fontWeight = styles.getPropertyValue("font-weight");
          var fontSize = styles.getPropertyValue("font-size");

          // Node is "visible" (above fold in x and y) and not struck through (generally a sign that a price is "slashed" and not the real price)
          if (
            rect.bottom <= document.documentElement.clientHeight &&
            rect.right <= document.documentElement.clientWidth &&
            styles
              .getPropertyValue("text-decoration")
              .indexOf("line-through") === -1
          ) {
            // Larger font sizes count more towards this being the main price for the page
            if (fontSize) {
              weight += parseInt(fontSize, 10) * 10;
            }

            // Bolder fonts count more
            if (fontWeight === "normal") {
              weight += 400;
            } else if (fontWeight === "bold") {
              weight += 700;
            } else if (fontWeight) {
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
          _getTextNodesWithPriceSymbol(node.childNodes[i]);
        }
      }

      priceNode = null;
      element = null;
      weight = null;
    }

    searchDepth--;

    _getTextNodesWithPriceSymbol(node);
  }

  return textNodes;
}

export default getTextNodesWithPriceSymbol;
