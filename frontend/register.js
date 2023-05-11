import { apiUrl, isLoggedInKey } from './config.js';

const isLoggedIn = JSON.parse(localStorage.getItem(isLoggedInKey));
if (isLoggedIn != null || isLoggedIn == true) {
  window.location.href = './productos.html';
}

const form = document.getElementById('register-form')
const message = document.getElementById('message')

form.addEventListener('submit', event => {
  event.preventDefault()

  const username = form.elements.username.value
  const email = form.elements.email.value
  const password = form.elements.password.value

  const data = new URLSearchParams();
  data.append('username', username);
  data.append('email', email);
  data.append('password', password);

  fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log(data.user)
        message.textContent = 'Registration successful'
        setTimeout(() => {
          window.location.href = './login.html'
        }, 2000) 
      } else {
        console.log(data.error)
        message.textContent = 'Registration failed'
      }
    })
    .catch(error => {
      console.error(error)
      message.textContent = 'An error occurred'
    })
})
