import { apiUrl, isLoggedInKey, userEmailKey } from './config.js';

const isLoggedIn = JSON.parse(localStorage.getItem(isLoggedInKey));
console.log(isLoggedIn)
if (isLoggedIn != null || isLoggedIn == true) {
  window.location.href = './productos.html';
}

const form = document.getElementById('login-form')
const message = document.getElementById('message')

form.addEventListener('submit', event => {
  event.preventDefault()

  const email = form.elements.email.value
  const password = form.elements.password.value

  const data = new URLSearchParams();
  data.append('email', email);
  data.append('password', password);

  fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  })
    .then(response => response.json())
    .then(data => {
        console.log(data)
      if (data.ok) {
        message.textContent = 'Login successful'
        localStorage.setItem(isLoggedInKey, true);
        localStorage.setItem(userEmailKey, data.user.email);
        setTimeout(() => {
          window.location.href = './productos.html'
        }, 2000) 
      } else {
        message.textContent = 'Login failed'
      }
    })
    .catch(error => {
      console.error(error)
      message.textContent = 'An error occurred'
    })
})
