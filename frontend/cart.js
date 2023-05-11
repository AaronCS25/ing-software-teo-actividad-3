import { apiUrl, isLoggedInKey, userEmailKey } from './config.js';

const isLoggedIn = JSON.parse(localStorage.getItem(isLoggedInKey));
if (isLoggedIn == null || isLoggedIn != true) {
  window.location.href = './login.html';
}

const backButton = document.getElementById('back-button');

backButton.addEventListener('click', () => {
  window.location.href = './productos.html';
});

const cartList = document.getElementById('cart-list');
const payButton = document.getElementById('pay-button');

let totalPrice = 0;

const cart = JSON.parse(localStorage.getItem('cart')) || {};

for (const productId in cart) {
  if (cart.hasOwnProperty(productId)) {
    const product = cart[productId];
    const li = document.createElement('li');
    const img = document.createElement('img');
    const name = document.createElement('p');
    const price = document.createElement('p');
    const stock = document.createElement('p');

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1;
    quantityInput.max = product.stock;
    quantityInput.value = parseInt(product.quantity);

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';

    const deleteButton = document.createElement('button');
    const itemTotal = document.createElement('span');


    decreaseButton.addEventListener('click', () => {
      if (quantityInput.value > 1) {
          quantityInput.value--;
          cart[productId].quantity = parseInt(quantityInput.value);

          localStorage.setItem('cart', JSON.stringify(cart));

          itemTotal.textContent = `Total: $${product.price * parseInt(quantityInput.value)}`;
          let newTotalPrice = 0;
          for (const productId in cart) {
              if (cart.hasOwnProperty(productId)) {
                  const product = cart[productId];
                  newTotalPrice += product.price * product.quantity;
              }
          }
          document.getElementById('total-price').textContent = `Total Price: $${newTotalPrice}`;
      }
      console.log(cart)
  });

  increaseButton.addEventListener('click', () => {   
    if (quantityInput.value < product.stock) {
        quantityInput.value++;
        cart[productId].quantity = parseInt(quantityInput.value);

        localStorage.setItem('cart', JSON.stringify(cart)); 

        itemTotal.textContent = `Total: $${product.price * parseInt(quantityInput.value)}`;
        let newTotalPrice = 0;
        for (const productId in cart) {
            if (cart.hasOwnProperty(productId)) {
                const product = cart[productId];
                newTotalPrice += product.price * product.quantity;
            }
        }
        document.getElementById('total-price').textContent = `Total Price: $${newTotalPrice}`;
    }
    console.log(cart)
  });

  quantityInput.addEventListener('input', () => {
    if (quantityInput.value == '' || quantityInput.value == null || quantityInput.value == undefined) {
        quantityInput.value = 1;
    } else
    if (quantityInput.value < 1) {
        quantityInput.value = 1;
    } else if (quantityInput.value > product.stock) {
        quantityInput.value = product.stock;
    }
    quantityInput.value = parseInt(quantityInput.value);
    cart[productId].quantity = parseInt(quantityInput.value);
    localStorage.setItem('cart', JSON.stringify(cart));

    itemTotal.textContent = `Total: $${product.price * parseInt(quantityInput.value)}`;

    let newTotalPrice = 0;
    for (const productId in cart) {
        if (cart.hasOwnProperty(productId)) {
            const product = cart[productId];
            newTotalPrice += product.price * product.quantity;
        }
    }
    document.getElementById('total-price').textContent = `Total Price: $${newTotalPrice}`;

    console.log(cart)
    });


    img.src =  apiUrl + '/' + product.img_path;
    name.textContent = `Name: ${product.name}`;
    price.textContent = `Price: ${product.price}`;
    stock.textContent = `Stock: ${product.stock}`;
    deleteButton.textContent = 'Delete';

    itemTotal.className = 'item-total';
    itemTotal.textContent = `Total: $${product.price * product.quantity}`;

    li.appendChild(img);
    li.appendChild(name);
    li.appendChild(stock);
    li.appendChild(price);
    li.appendChild(decreaseButton);
    li.appendChild(quantityInput);
    li.appendChild(increaseButton);
    li.appendChild(deleteButton);
    li.appendChild(itemTotal);

    cartList.appendChild(li);
    totalPrice += product.price * product.quantity;

    deleteButton.addEventListener('click', () => {
      delete cart[productId];
      localStorage.setItem('cart', JSON.stringify(cart));
      li.remove();
      let newTotalPrice = 0;
      for (const productId in cart) {
          if (cart.hasOwnProperty(productId)) {
              const product = cart[productId];
              newTotalPrice += product.price * product.quantity;
          }
      }
      document.getElementById('total-price').textContent = `Total Price: $${newTotalPrice}`;
    });
  }
}

document.getElementById('total-price').textContent = `Total Price: $${totalPrice}`;

payButton.addEventListener('click', () => {
  for (const productId in cart) {
    if (cart.hasOwnProperty(productId)) {
      const product = cart[productId];
      const data = new URLSearchParams();
      data.append('user_id', localStorage.getItem(userEmailKey));
      data.append('item_id', product.id);
      data.append('amount', product.quantity);

      fetch(`${apiUrl}/compra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      });
    }
  }
  alert('Payment successful!');
  localStorage.removeItem('cart');
  window.location.href = './productos.html';
});


const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', logout);

function logout() {
  localStorage.removeItem(userEmailKey);
  localStorage.removeItem(isLoggedInKey);
  localStorage.removeItem('cart');
  
  window.location.href = './login.html';
}
