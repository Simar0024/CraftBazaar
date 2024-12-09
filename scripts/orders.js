import { cart,delivery } from "./cart.js";
import { productInfo } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

let orderHTML = '';

cart.forEach(cartItem => {
    const productId = cartItem.productId;
    let cartProduct;

    productInfo.forEach((product)=>{
        if(product.id === productId)
            cartProduct = product;    
    });

    const deliveryID = cartItem.deliveryId;
    let deliveryOption;

    delivery.forEach((option)=>{
      if(option.id === deliveryID){
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const orderDate = today.format('dddd MMMM D');
    const deliveryDate = today.add(deliveryOption.days,'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

orderHTML += `
    <div class="order-container">
        
        <div class="order-header">
        <div class="order-header-left-section">
            <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
            </div>
            <div class="order-total">
            <div class="order-header-label">Price:</div>
            <div>₹${cartProduct.cost * cartItem.quantity}</div>
            </div>
        </div>

        <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${cartProduct.id}</div>
        </div>
        </div>

        <div class="order-details-grid">
        <div class="product-image-container">
            <img src="${cartProduct.image}">
        </div>

        <div class="product-details">
            <div class="product-name">
            ${cartProduct.name}
            </div>
            <div class="product-delivery-date">
            Arriving on: ${dateString}
            </div>
            <div class="product-quantity">
            Quantity: ${cartItem.quantity}
            </div>
            <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            </button>
        </div>

        <div class="product-actions">
            <a href="tracking.html">
            <button class="track-package-button button-secondary">
                Track package
            </button>
            </a>
        </div>

    </div>
    </div>`;
    document.querySelector('.js-cart-quantity').innerHTML = cartItem.quantity;
});

document.querySelector('.js-orders-grid').innerHTML = orderHTML;