var PriceTracker = (function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function init(component, options) {
	component.options = options;

	component._observers = { pre: blankObject(), post: blankObject() };
	component._handlers = blankObject();
	component._root = options._root || component;
	component._yield = options._yield;
	component._bind = options._bind;
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign({}, oldState, newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);
	dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
	this._fragment.p(changed, this._state);
	dispatchObservers(this, this._observers.post, changed, this._state, oldState);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

function _mount(target, anchor) {
	this._fragment.m(target, anchor);
}

function _unmount() {
	this._fragment.u();
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_unmount: _unmount
};

/* src/PriceTracker.html generated by Svelte v1.40.2 */
function oncreate() {

}

function ondestroy() {
  var priceNode = this.get('priceNode');
  if (priceNode) {
    priceNode.style = this.get('originalStyle');
  }     
}

function encapsulateStyles(node) {
	setAttribute(node, "svelte-2498750967", "");
}

function add_css() {
	var style = createElement("style");
	style.id = 'svelte-2498750967-style';
	style.textContent = "[svelte-2498750967]#price-tracker-panel *,[svelte-2498750967] #price-tracker-panel *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;margin:0;font-size:16px}[svelte-2498750967]#price-tracker-overlay,[svelte-2498750967] #price-tracker-overlay{content:\" \";display:block;width:100vw;height:100vh;background:black;position:absolute;left:0;top:0;opacity:0.4;z-index:10000}[svelte-2498750967]#price-tracker-panel,[svelte-2498750967] #price-tracker-panel{border:1px solid #666;background-color:#fff;font:14px/21px \"HelveticaNeue\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;color:#222;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;width:320px;position:absolute;right:40px;top:40px;z-index:999999;padding:10px;box-shadow:0 2px 10px 2px #999}[svelte-2498750967]#price-tracker-panel #price-tracker-loading,[svelte-2498750967] #price-tracker-panel #price-tracker-loading{width:340px;height:100%;background:#fff;position:absolute;left:0;top:0;text-align:center}[svelte-2498750967]#price-tracker-panel #price-tracker-title,[svelte-2498750967] #price-tracker-panel #price-tracker-title{font-size:18px;text-align:center}[svelte-2498750967]#price-tracker-panel #price-tracker-close,[svelte-2498750967] #price-tracker-panel #price-tracker-close{position:absolute;top:0px;right:0;background:lightpink;border:none;font-size:18px;line-height:1;cursor:pointer;color:#000;padding:3px 10px}[svelte-2498750967]#price-tracker-panel #price-tracker-close:hover,[svelte-2498750967] #price-tracker-panel #price-tracker-close:hover{background-color:darkred;color:white}[svelte-2498750967]#price-tracker-panel label,[svelte-2498750967] #price-tracker-panel label,[svelte-2498750967]#price-tracker-panel .label,[svelte-2498750967] #price-tracker-panel .label{font-weight:bold;color:#222;background:none;text-align:left}[svelte-2498750967]#price-tracker-panel #price-tracker-name-block input,[svelte-2498750967] #price-tracker-panel #price-tracker-name-block input{width:100%;border:1px solid gray}[svelte-2498750967]#price-tracker-panel #price-tracker-name-block textarea,[svelte-2498750967] #price-tracker-panel #price-tracker-name-block textarea{width:100%;height:60px;resize:none;border:1px solid gray}[svelte-2498750967]#price-tracker-panel #price-tracker-name-block label,[svelte-2498750967] #price-tracker-panel #price-tracker-name-block label{display:block}[svelte-2498750967]#price-tracker-panel #price-tracker-price-help,[svelte-2498750967] #price-tracker-panel #price-tracker-price-help{font-size:12px}[svelte-2498750967]#price-tracker-panel .price-tracker-row,[svelte-2498750967] #price-tracker-panel .price-tracker-row{margin-top:10px}[svelte-2498750967]#price-tracker-panel .price-tracker-direction,[svelte-2498750967] #price-tracker-panel .price-tracker-direction{display:inline-block;font-size:16px;margin:5px;cursor:pointer;text-indent:-999em}[svelte-2498750967]#price-tracker-panel .price-tracker-direction.right-direction,[svelte-2498750967] #price-tracker-panel .price-tracker-direction.right-direction{background-position:right center}[svelte-2498750967]#price-tracker-panel #price-tracker-image-block,[svelte-2498750967] #price-tracker-panel #price-tracker-image-block{margin-top:15px;text-align:center}[svelte-2498750967]#price-tracker-panel #price-tracker-image-container,[svelte-2498750967] #price-tracker-panel #price-tracker-image-container{width:100px;height:100px;overflow:hidden}[svelte-2498750967]#price-tracker-panel #price-tracker-price-block,[svelte-2498750967] #price-tracker-panel #price-tracker-price-block{width:auto;clear:both}[svelte-2498750967]#price-tracker-panel #price-tracker-notify-me input,[svelte-2498750967] #price-tracker-panel #price-tracker-notify-me input{width:60px;display:inline}[svelte-2498750967]#price-tracker-panel #price-tracker-image-numbers,[svelte-2498750967] #price-tracker-panel #price-tracker-image-numbers,[svelte-2498750967]#price-tracker-panel #price-tracker-currently-selected-price,[svelte-2498750967] #price-tracker-panel #price-tracker-currently-selected-price{display:inline-block;width:60px;text-align:center}[svelte-2498750967]#price-tracker-panel #price-tracker-actions,[svelte-2498750967] #price-tracker-panel #price-tracker-actions{text-align:right;clear:both;padding:10px 0 10px}[svelte-2498750967]#price-tracker-panel #price-tracker-actions button,[svelte-2498750967] #price-tracker-panel #price-tracker-actions button{border-style:solid;border-width:0px;cursor:pointer;font-family:\"Helvetica Neue\", \"Helvetica\", Helvetica, Arial, sans-serif;font-weight:normal;line-height:normal;margin:0 0 1.25rem;position:relative;text-decoration:none;text-align:center;-webkit-appearance:none;-webkit-border-radius:0;display:inline-block;padding-top:1rem;padding-right:2rem;padding-bottom:1.0625rem;padding-left:2rem;font-size:1rem;background-color:forestgreen;color:white;transition:background-color 300ms ease-out}[svelte-2498750967]#price-tracker-panel #price-tracker-actions button:hover,[svelte-2498750967] #price-tracker-panel #price-tracker-actions button:hover,[svelte-2498750967]#price-tracker-panel #price-tracker-actions button:focus,[svelte-2498750967] #price-tracker-panel #price-tracker-actions button:focus{background-color:darkgreen}[svelte-2498750967]#price-tracker-panel #price-tracker-actions button[disabled=\"disabled\"],[svelte-2498750967] #price-tracker-panel #price-tracker-actions button[disabled=\"disabled\"]{opacity:0.7}[svelte-2498750967]#price-tracker-panel #price-tracker-actions *,[svelte-2498750967] #price-tracker-panel #price-tracker-actions *{vertical-align:middle}[svelte-2498750967]#price-tracker-panel #price-tracker-actions img,[svelte-2498750967] #price-tracker-panel #price-tracker-actions img{margin-right:10px}[svelte-2498750967]#price-tracker-panel #price-tracker-actions p,[svelte-2498750967] #price-tracker-panel #price-tracker-actions p{text-align:left}[svelte-2498750967]#price-tracker-panel #price-tracker-help,[svelte-2498750967] #price-tracker-panel #price-tracker-help{font-size:11px}[svelte-2498750967]#price-tracker-panel .error,[svelte-2498750967] #price-tracker-panel .error{color:red;padding:8px}[svelte-2498750967]#price-tracker-panel .success,[svelte-2498750967] #price-tracker-panel .success{color:green;padding:8px}";
	appendNode(style, document.head);
}

function create_main_fragment(state, component) {
	var div, text_1, div_1, text_2, text_3, text_4, div_2;

	var current_block_type = select_block_type(state);
	var if_block = current_block_type(state, component);

	return {
		c: function create() {
			div = createElement("div");
			if_block.c();
			text_1 = createText("\n\n");
			div_1 = createElement("div");
			text_2 = createText("CSS selector: ");
			text_3 = createText(state.cssSelector);
			text_4 = createText("\n\n");
			div_2 = createElement("div");
			div_2.textContent = " ";
			this.h();
		},

		h: function hydrate() {
			encapsulateStyles(div);
			div.id = "price-tracker-panel";
			encapsulateStyles(div_1);
			encapsulateStyles(div_2);
			div_2.id = "price-tracker-overlay";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			if_block.m(div, null);
			insertNode(text_1, target, anchor);
			insertNode(div_1, target, anchor);
			appendNode(text_2, div_1);
			appendNode(text_3, div_1);
			insertNode(text_4, target, anchor);
			insertNode(div_2, target, anchor);
			component.refs.overlay = div_2;
		},

		p: function update(changed, state) {
			if (current_block_type === (current_block_type = select_block_type(state)) && if_block) {
				if_block.p(changed, state);
			} else {
				if_block.u();
				if_block.d();
				if_block = current_block_type(state, component);
				if_block.c();
				if_block.m(div, null);
			}

			if (changed.cssSelector) {
				text_3.data = state.cssSelector;
			}
		},

		u: function unmount() {
			detachNode(div);
			if_block.u();
			detachNode(text_1);
			detachNode(div_1);
			detachNode(text_4);
			detachNode(div_2);
		},

		d: function destroy$$1() {
			if_block.d();
			if (component.refs.overlay === div_2) component.refs.overlay = null;
		}
	};
}

// (2:2) {{#if price}}
function create_if_block(state, component) {
	var button, text_1, div, text_3, div_1, text_15, div_6, div_7, label, text_17, input, text_19, div_8, text_23, div_9, div_10, text_25, div_11, text_26, text_28, div_12, label_2, text_30, div_13, text_32, input_1, text_35, div_14;

	function click_handler(event) {
		component.destroy();
	}

	return {
		c: function create() {
			button = createElement("button");
			button.textContent = "×";
			text_1 = createText("\n    ");
			div = createElement("div");
			div.textContent = "Add to The Price Tracker";
			text_3 = createText("\n    ");
			div_1 = createElement("div");
			div_1.innerHTML = "<div id=\"price-tracker-image-container\"><img src=\"\" alt=\"No Image\" height=\"100\"></div>\n      <div id=\"price-tracker-previous-image\" class=\"price-tracker-direction left-direction\"><</div>\n      <div id=\"price-tracker-image-numbers\"><span id=\"price-tracker-current-image\">1</span> of\n        <span id=\"price-tracker-image-total\">1</span></div>\n      <div id=\"price-tracker-next-image\" class=\"price-tracker-direction right-direction\">></div>";
			text_15 = createText("\n    ");
			div_6 = createElement("div");
			div_7 = createElement("div");
			label = createElement("label");
			label.textContent = "Name";
			text_17 = createText("\n        ");
			input = createElement("input");
			text_19 = createText("\n      ");
			div_8 = createElement("div");
			div_8.innerHTML = "<label for=\"note\">Note</label>\n        <textarea name=\"note\"></textarea>";
			text_23 = createText(" \n      ");
			div_9 = createElement("div");
			div_10 = createElement("div");
			div_10.textContent = "Current Price";
			text_25 = createText("\n          ");
			div_11 = createElement("div");
			text_26 = createText(state.price);
			text_28 = createText("\n      ");
			div_12 = createElement("div");
			label_2 = createElement("label");
			label_2.textContent = "Target Price";
			text_30 = createText("\n        ");
			div_13 = createElement("div");
			div_13.textContent = "You are notified when price drops to or below this target";
			text_32 = createText("\n        $");
			input_1 = createElement("input");
			text_35 = createText(" \n  \n    ");
			div_14 = createElement("div");
			div_14.innerHTML = "<button type=\"button\">Track this price</button>";
			this.h();
		},

		h: function hydrate() {
			button.id = "price-tracker-close";
			button.type = "button";
			setAttribute(button, "aria-label", "Close");
			addListener(button, "click", click_handler);
			div.id = "price-tracker-title";
			div_1.id = "price-tracker-image-block";
			div_6.id = "price-tracker-name-block";
			div_7.className = "price-tracker-row";
			label.htmlFor = "price-tracker-product-name";
			input.id = "price-tracker-product-name";
			input.type = "text";
			input.value = state.title;
			input.name = "name";
			div_8.className = "price-tracker-row";
			div_9.id = "price-tracker-price-block";
			div_9.className = "price-tracker-row";
			div_10.className = "label";
			div_11.id = "price-tracker-currently-selected-price";
			div_12.id = "price-tracker-notify-me";
			div_12.className = "price-tracker-row";
			label_2.htmlFor = "price-tracker-target-price";
			label_2.className = "label";
			div_13.id = "price-tracker-price-help";
			input_1.id = "price-tracker-target-price";
			input_1.type = "text";
			input_1.value = state.discountedPrice;
			input_1.name = "target";
			div_14.id = "price-tracker-actions";
			div_14.className = "price-tracker-row";
		},

		m: function mount(target, anchor) {
			insertNode(button, target, anchor);
			insertNode(text_1, target, anchor);
			insertNode(div, target, anchor);
			insertNode(text_3, target, anchor);
			insertNode(div_1, target, anchor);
			insertNode(text_15, target, anchor);
			insertNode(div_6, target, anchor);
			appendNode(div_7, div_6);
			appendNode(label, div_7);
			appendNode(text_17, div_7);
			appendNode(input, div_7);
			appendNode(text_19, div_6);
			appendNode(div_8, div_6);
			appendNode(text_23, div_6);
			appendNode(div_9, div_6);
			appendNode(div_10, div_9);
			appendNode(text_25, div_9);
			appendNode(div_11, div_9);
			appendNode(text_26, div_11);
			appendNode(text_28, div_6);
			appendNode(div_12, div_6);
			appendNode(label_2, div_12);
			appendNode(text_30, div_12);
			appendNode(div_13, div_12);
			appendNode(text_32, div_12);
			appendNode(input_1, div_12);
			insertNode(text_35, target, anchor);
			insertNode(div_14, target, anchor);
		},

		p: function update(changed, state) {
			if (changed.title) {
				input.value = state.title;
			}

			if (changed.price) {
				text_26.data = state.price;
			}

			if (changed.discountedPrice) {
				input_1.value = state.discountedPrice;
			}
		},

		u: function unmount() {
			detachNode(button);
			detachNode(text_1);
			detachNode(div);
			detachNode(text_3);
			detachNode(div_1);
			detachNode(text_15);
			detachNode(div_6);
			detachNode(text_35);
			detachNode(div_14);
		},

		d: function destroy$$1() {
			removeListener(button, "click", click_handler);
		}
	};
}

// (39:2) {{else}}
function create_if_block_1(state, component) {
	var p, text, a, a_href_value, text_2, text_3, div, button;

	function click_handler(event) {
		component.destroy();
	}

	return {
		c: function create() {
			p = createElement("p");
			text = createText("The Price Tracker could not find any prices on this page. \n      If there are some and it missed them, feel free to report a problem \n      by emailing ");
			a = createElement("a");
			a.textContent = "issues@thepricetracker.com";
			text_2 = createText(".");
			text_3 = createText("\n    ");
			div = createElement("div");
			button = createElement("button");
			button.textContent = "Close";
			this.h();
		},

		h: function hydrate() {
			a.href = a_href_value = "mailto:issues@thepricetracker.com?subject=Problem finding prices on " + state.url;
			div.id = "price-tracker-actions";
			div.className = "price-tracker-row";
			button.type = "button";
			addListener(button, "click", click_handler);
		},

		m: function mount(target, anchor) {
			insertNode(p, target, anchor);
			appendNode(text, p);
			appendNode(a, p);
			appendNode(text_2, p);
			insertNode(text_3, target, anchor);
			insertNode(div, target, anchor);
			appendNode(button, div);
		},

		p: function update(changed, state) {
			if ((changed.url) && a_href_value !== (a_href_value = "mailto:issues@thepricetracker.com?subject=Problem finding prices on " + state.url)) {
				a.href = a_href_value;
			}
		},

		u: function unmount() {
			detachNode(p);
			detachNode(text_3);
			detachNode(div);
		},

		d: function destroy$$1() {
			removeListener(button, "click", click_handler);
		}
	};
}

function select_block_type(state) {
	if (state.price) return create_if_block;
	return create_if_block_1;
}

function PriceTracker(options) {
	init(this, options);
	this.refs = {};
	this._state = options.data || {};

	this._handlers.destroy = [ondestroy];

	if (!document.getElementById("svelte-2498750967-style")) add_css();

	var _oncreate = oncreate.bind(this);

	if (!options._root) {
		this._oncreate = [_oncreate];
	} else {
	 	this._root._oncreate.push(_oncreate);
	 }

	this._fragment = create_main_fragment(this._state, this);

	if (options.target) {
		this._fragment.c();
		this._fragment.m(options.target, options.anchor || null);

		callAll(this._oncreate);
	}
}

assign(PriceTracker.prototype, proto);

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

return _PriceTracker;

}());
