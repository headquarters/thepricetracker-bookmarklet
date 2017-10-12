const expect = require('chai').expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const getPriceNodes = require('../src/price-node');

describe('The price-node module', () => {
  
  it('returns an empty array when no prices were found', () => {
    const dom = new JSDOM(`<!DOCTYPE html><p>No prices here</p>`);
    global.window = dom.window;
    global.document = dom.window.document;

    expect(getPriceNodes(document.body)).to.eql([]);
  });

  it('finds a single price with simple HTML', () => {
    const dom = new JSDOM(`<!DOCTYPE html><p style="font-size:14px;">$9.99</p>`);
    global.window = dom.window;
    global.document = dom.window.document;

    const prices = getPriceNodes(document.body);

    expect(prices).to.have.lengthOf(1);
    expect(prices[0].weight).to.equal(1140);
    expect(prices[0].price).to.equal('$9.99');
    expect(prices[0].element).to.be.a('HTMLParagraphElement');
  });

  it('finds multiple prices with simple HTML', () => {
    const dom = new JSDOM(`<!DOCTYPE html><p style="font-size:14px;">$9.99</p><p>$100.00</p>`);
    global.window = dom.window;
    global.document = dom.window.document;

    const prices = getPriceNodes(document.body);

    expect(prices).to.have.lengthOf(2);
    expect(prices[0].price).to.equal('$9.99');
    expect(prices[1].price).to.equal('$100.00');
  });

  it('finds a price in complex HTML', () => {
    const dom = new JSDOM(`<!DOCTYPE html><div class="price">$<p style="font-size:14px;">9.99</p></div>`);
    global.window = dom.window;
    global.document = dom.window.document;

    const prices = getPriceNodes(document.body);

    expect(prices).to.have.lengthOf(1);
    expect(prices[0].price).to.equal('$9.99');
    expect(prices[0].element.className).to.equal('price');
  });  
});