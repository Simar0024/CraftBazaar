import { cart, addToCart, updateQuantity } from "./cart.js";
import { productInfo } from "../data/products.js";

let productInfoHTML = '';
document.querySelector('.js-cart-quantity').innerHTML = JSON.parse(localStorage.getItem('cartQuantity'));

productInfo.forEach((product) =>{
    productInfoHTML  += `<div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.reviews}
      </div>
    </div>

    <div class="product-price">
      ₹${product.cost}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart-${product.id}">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart-btn" data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>`
});

document.querySelector('.displayProductInfo').innerHTML = productInfoHTML;

let timeId;

document.querySelectorAll('.js-add-to-cart-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const {productId} = button.dataset;
    addToCart(productId);
    displayAdded(productId);
    updateQuantity();
  });
});

function displayAdded(productId){
  
  const displayAdded = document.querySelector(`.js-added-to-cart-${productId}`);
  displayAdded.classList.add('display-added-msg');
  
  if(displayAdded.value === productId)
    clearTimeout(timeId);

  timeId = setTimeout(() => {
    const displayAdded = document.querySelector(`.js-added-to-cart-${productId}`);
    displayAdded.classList.remove('display-added-msg');
  },2000);
}
