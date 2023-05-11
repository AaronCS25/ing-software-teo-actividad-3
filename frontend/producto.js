import { apiUrl, isLoggedInKey, userEmailKey } from './config.js';

const isLoggedIn = JSON.parse(localStorage.getItem(isLoggedInKey));
if (isLoggedIn == null || isLoggedIn != true) {
  window.location.href = './login.html';
}

const backButton = document.getElementById('back-button');

const quantityInput = document.getElementById('quantity');
const decreaseButton = document.getElementById('decrease-button');
const increaseButton = document.getElementById('increase-button');

let cart = JSON.parse(localStorage.getItem('cart')) || {};
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');



backButton.addEventListener('click', () => {
    window.location.href = './productos.html';
  });
  
  fetch(`${apiUrl}/item/${productId}`)
  .then(response => response.json())
  .then(product => {
    document.getElementById('title').textContent = product.name;
    document.getElementById('img').src = apiUrl + '/' + product.img_path;
    document.getElementById('price').textContent = `Price: ${product.price}`;
    document.getElementById('stock').textContent = `Stock: ${product.stock}`;

    const maxStock = product.stock;

    let productcart = {
      id: productId, 
      name: product.name,
      price: product.price, 
      img_path: product.img_path, 
      stock: product.stock,
      quantity: 0
    };
    quantityInput.value = cart[productId]? parseInt(cart[productId].quantity):0 || 0;

    decreaseButton.addEventListener('click', () => {
        if (quantityInput.value >= 1) {
            quantityInput.value--;
            productcart.quantity = parseInt(quantityInput.value);
             cart[productId] = productcart;
            if (cart[productId].quantity == 0) {
                delete cart[productId];
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });

    increaseButton.addEventListener('click', () => {   
        if (quantityInput.value < maxStock) {
            quantityInput.value++;
            productcart.quantity = parseInt(quantityInput.value);
            cart[productId] = productcart;
            localStorage.setItem('cart', JSON.stringify(cart)); 
        }
    });

    quantityInput.addEventListener('input', () => {
        if (quantityInput.value == '' || quantityInput.value == null || quantityInput.value == undefined) {
            quantityInput.value = 0;
        } else
        if (quantityInput.value < 0) {
            quantityInput.value = 0;
        } else if (quantityInput.value > maxStock) {
            quantityInput.value = maxStock;
        }
        quantityInput.value = parseInt(quantityInput.value);
        productcart.quantity = parseInt(quantityInput.value);
        cart[productId] = productcart;
        localStorage.setItem('cart', JSON.stringify(cart));
         if (cart[productId].quantity == 0) {
            delete cart[productId];
        } 
        localStorage.setItem('cart', JSON.stringify(cart));
    }
);
  })
    .catch(error => {
      console.log(error);
    });
  
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', logout);
    
    function logout() {
      localStorage.removeItem(userEmailKey);
      localStorage.removeItem(isLoggedInKey);
      localStorage.removeItem('cart');
      
      window.location.href = './login.html';
    }
