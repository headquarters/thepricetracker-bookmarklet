import PriceTracker from './PriceTracker.html';


var _PriceTracker = new PriceTracker({
  target: document.querySelector( 'main' ),
  data: {
    title: document.title
  }
});

export default _PriceTracker;
