import PriceTracker from "./PriceTracker.html";
import getTextNodesWithPriceSymbol from './price-node';

var target = document.createElement("div");
document.body.appendChild(target);

var priceNodeCollection = getTextNodesWithPriceSymbol(document.body);

priceNodeCollection.sort(function(a, b) {
  return b.weight - a.weight;
});

var price = null;
var discountedPrice = 0;
var targetPriceNode = null;
var originalStyle = {};

if (priceNodeCollection.length > 0) {
  targetPriceNode = priceNodeCollection[0].element;
  originalStyle = targetPriceNode.style;
  targetPriceNode.style.backgroundColor = "#ffff9b";
  targetPriceNode.style.zIndex = 20000;
  targetPriceNode.style.position = "relative";

  price = priceNodeCollection[0].price;

  var priceFloat = parseFloat(priceNodeCollection[0].price.replace("$", ""));

  discountedPrice = Math.floor(priceFloat - Math.ceil(priceFloat * 0.1));
}
// move into component to display different message when price is not found on page
// else {
//     var $button = $panel.find('#price-tracker-actions button');
//     $button.text('Close');
//     $button.before('<div class="error">No prices were found on this page.</div>');
// }

console.log(priceNodeCollection);

function getPath(_node) {
  if (!_node) {
    throw "Requires one node";
  }

  var path;
  var node = _node;

  while (node) {
    var name = node.localName;

    if (!name) {
      break;
    }

    name = name.toLowerCase();

    if (node.id) {
      // As soon as an id is found, there's no need to specify more.
      return name + "#" + node.id + (path ? ">" + path : "");
    } else if (node.className) {
      name += "." + node.className.split(/\s+/).join(".");
    }

    // This should stop at the body because parentElement is null for document.body.documentElement,
    // whereas parentNode would return an element
    var parent = node.parentElement;

    if (!parent) {
      return path;
    }

    var siblings = [];
    var siblingsIndex = 0;

    console.log(parent.children);
    for (var i = 0; i < parent.children.length; ++i) {
      var item = parent.children[i];

      // Selectors match, need to disambiguate based on nth-child index
      if (
        item.localName.toLowerCase() +
          "." +
          item.className.split(/\s+/).join(".") ===
        name
      ) {
        siblingsIndex++;
      }
      // We hit the target node, we know its index now
      if (item === node) {
        break;
      }
    }

    if (siblingsIndex > 1) {
      name += ":nth-child(" + (siblingsIndex + 1) + ")";
    }

    path = name + (path ? ">" + path : "");

    node = parent;
  }

  return path;
}

var cssSelector = null;

if (targetPriceNode) {
  cssSelector = getPath(targetPriceNode);
}

var _PriceTracker = new PriceTracker({
  target: target,
  data: {
    title: document.title,
    price: price,
    discountedPrice: discountedPrice,
    priceNode: targetPriceNode,
    originalStyle: originalStyle,
    url: encodeURIComponent(window.location.href),
    cssSelector: cssSelector
  }
});

export default _PriceTracker;
