import { productInfo } from "../data/products.js";
import { cart, removeFromCart, updateSavedQuantity, newSavedQuantity, delivery, updateDelivery} from "./cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function DisplayOrder(){
  let cartHTML = '';

  cart.forEach((cartItem)=> {
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
    
  cartHTML +=  `<div class="cart-item-container js-cart-item-${cartProduct.id}">
  <div class="delivery-date">
    Delivery date: ${dateString}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${cartProduct.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${cartProduct.name}
      </div>
      <div class="product-price">
        ₹${cartProduct.cost}
      </div>
      <div class="product-quantity">
        <span class="quantity-area">
          Quantity: <span class="quantity-label js-quantity-label-${cartProduct.id}">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-link" data-product-id="${cartProduct.id}">
          Update
        </span>
        <input class="quantity-input js-quantity-input-${cartProduct.id}"></input>
        <span class="save-quantity-link link-primary js-save-link" data-product-id="${cartProduct.id}">Save</span>
        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartProduct.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
        ${deliveryOptions(cartProduct.id, cartItem)}
    </div>
  </div>
  </div>`;
  });

  let totalQuantity = 0;
  document.querySelector('.js-order-summary').innerHTML = cartHTML;

  function deliveryOptions(productId, cartItem){
    let deliveryHTML = '';
    
    delivery.forEach((option)=> {
    const today = dayjs();
    const deliveryDate = today.add(option.days,'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = option.price === 0 ? 'FREE' : `₹${option.price}`;
    let deliveryID = cartItem.deliveryId;
    const isChecked = option.id === deliveryID;

    deliveryHTML +=
      `<div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-id="${option.id}">
        <input type="radio"
        ${isChecked ? 'checked': ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>`;
    });

    return deliveryHTML;
  }

  function deleteProduct(){
  let quantity;
  document.querySelectorAll('.js-delete-link').forEach((link)=>{
      link.addEventListener('click', ()=>{
        const productId = link.dataset.productId;
        removeFromCart(productId);
        totalQuantity--;
        updateCartQuantity(); 
        quantity = localStorage.setItem('cartQuantity',totalQuantity);
        const deletedProduct = document.querySelector(`.js-cart-item-${productId}`);
        deletedProduct.remove();  
        DisplayPayment();
        localStorage.setItem('cart',JSON.stringify(cart));
      });
  });
  }

  function updateProduct(){
    document.querySelectorAll('.js-update-link').forEach((link)=>{
      link.addEventListener('click',()=>{
        const updatedId = link.dataset.productId;
        document.querySelector(`.js-cart-item-${updatedId}`).classList.add('is-editing-quantity');
        DisplayPayment();
      });
    });
  }

  function saveProduct(){
    document.querySelectorAll('.js-save-link').forEach((link)=>{
      link.addEventListener('click',()=>{
        const savedId = link.dataset.productId;
        let savedQuantity = Number(document.querySelector(`.js-quantity-input-${savedId}`).value);
        document.querySelector(`.js-cart-item-${savedId}`).classList.remove('is-editing-quantity');
        let newQuantity = updateSavedQuantity(savedId,savedQuantity);
        document.querySelector(`.js-quantity-label-${savedId}`).innerHTML = newQuantity;
        let temp = (totalQuantity-1)+newQuantity;
        totalQuantity = temp;
        document.querySelector('.js-checkout-header').innerHTML = `Checkout(${temp} items)`; 
        document.querySelector('.js-payment-summary-row').innerHTML = `Items (${temp}):`; 
        console.log(updateSavedQuantity(savedId,totalQuantity));
        localStorage.setItem('cart',JSON.stringify(cart));
      });
      
    });
  }

  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', ()=>{
      const {productId, deliveryId} = element.dataset;
      updateDelivery(productId,deliveryId);
      DisplayOrder();
      DisplayPayment();
    });
  });

  updateProduct();
  deleteProduct();

  cart.forEach((item)=> totalQuantity += item.quantity);

  updateCartQuantity();
  saveProduct();

  function updateCartQuantity(){
    document.querySelector('.js-checkout-header').innerHTML = `Checkout (${totalQuantity} items)`;
    //document.querySelector('.js-payment-summary-row').innerHTML = `Items (${totalQuantity}):`; 
  }
}

export function DisplayPayment(){
  let total = 0;
  let shipping = 0;
  let quantity = 0;
  cart.forEach((cartItem) => {
    
    let cartProduct;
    let deliveryOption;
    const productId = cartItem.productId;
    const deliveryID = cartItem.deliveryId;

    productInfo.forEach((product)=>{
        if(product.id === productId)
            cartProduct = product;    
    });

    delivery.forEach((option)=>{
      if(option.id === deliveryID){
        deliveryOption = option;
      }
    });
    quantity += cartItem.quantity;
    total += cartProduct.cost * cartItem.quantity;
    shipping += deliveryOption.price;
  });

  const totalCost = Number(total+shipping);
  const tax = Number(0.1 * totalCost).toFixed(2);
  const grandTotal = Number(totalCost) + Number(tax);
  
  const paymentHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row js-payment-summary-row">
      <div>Items (${quantity}):</div>
      <div class="payment-summary-money">₹${total}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">₹${shipping}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">₹${totalCost}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">₹${tax}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">₹${grandTotal}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>`;

    document.querySelector('.js-payment-summary').innerHTML = paymentHTML;
    document.querySelector('.js-place-order-button').addEventListener('click', ()=>{
      alert('Order Placed Succesfully');
    });
}

DisplayPayment();
DisplayOrder();