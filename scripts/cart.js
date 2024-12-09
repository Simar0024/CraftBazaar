export let cart = JSON.parse(localStorage.getItem('cart')) || [];
export let newSavedQuantity = JSON.parse(localStorage.getItem('newQuantity')) || 0;

export const delivery = [{
  id: '1',
  days: 7,
  price: 0 
},{
  id: '2',
  days: 3,
  price: 250
},{
  id: '3',
  days: 1,
  price: 500
}];

export function addToCart(productId){      
    let temp;  
    let quantity = document.querySelector(`.js-quantity-selector-${productId}`).value;
    quantity = Number(quantity);

    cart.forEach((cartItem) => {
      if(productId === cartItem.productId)
        temp = cartItem;
      });
    
    if(temp)
        temp.quantity+=quantity;
    else{ 
        cart.push({
          productId,
          quantity,
          deliveryId: '1'}
        );
    }
    localStorage.setItem('cart',JSON.stringify(cart));
    console.log(cart);
}

export function removeFromCart(productId){
    const newCart = [];

    cart.forEach((cartItem) =>{
        if(cartItem.productId !== productId)
            newCart.push(cartItem);
    });

    cart = newCart;
    console.log(cart);
    localStorage.setItem('cart',JSON.stringify(cart));
}

export function updateQuantity(){
  
  let totalQuantity = 0;
    cart.forEach((item)=> totalQuantity += item.quantity);
    document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;
    localStorage.setItem('cartQuantity',totalQuantity);
}

export function updateSavedQuantity(productId,savedQuantity){
  cart.forEach((cartItem)=>{ 
    if(productId === cartItem.productId){
    cartItem.quantity = savedQuantity;
    localStorage.setItem('newQuantity',cartItem.quantity);
  }
  });
  return savedQuantity;
}

export function updateDelivery(productId,deliveryId){
   let temp;
   cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      temp = cartItem;
    }  
    });
    temp.deliveryId = deliveryId;
    localStorage.setItem('cart',JSON.stringify(cart));
}