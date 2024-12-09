import { cart, delivery} from "./cart.js";
import { productInfo } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
let trackingHTML = '';

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
    const deliveryDate = today.add(deliveryOption.days,'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    trackingHTML += `
    <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dateString}
        </div>

        <div class="product-info">
          ${cartProduct.name}
        </div>

        <div class="product-info">
          Quantity: ${cartItem.quantity}
        </div>

        <img class="product-image" src="${cartProduct.image}">
        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
    `;
    document.querySelector('.js-cart-quantity').innerHTML = cartItem.quantity;
});

document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
