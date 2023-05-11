import { apiUrl, isLoggedInKey, userEmailKey } from './config.js';

const isLoggedIn = JSON.parse(localStorage.getItem(isLoggedInKey));
if (isLoggedIn == null || isLoggedIn != true) {
  window.location.href = './login.html';
}

const userEmail = localStorage.getItem(userEmailKey);

const greeting = document.getElementById('greeting');
greeting.textContent = `Hi, ${userEmail}!`;

const itemList = document.getElementById('item-list');

fetch(`${apiUrl}/items`)
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';

      const heading = document.createElement('h2');
      heading.textContent = item.name;

      heading.addEventListener('click', () => {
        window.location.href = `./producto.html?id=${item._id}`;
      });

      const details = document.createElement('p');
      details.textContent = `Price: ${item.price}, Stock: ${item.stock}`;

      const img = document.createElement('img');
      img.src =  apiUrl + '/' + item.img_path;
      //img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9rR1G1N5pWk-480uuxVMR27caDVqEuFsa7-PcyyuzXGhNn5SBoSKp4xxTamlAfMd_pSc&usqp=CAU";
      img.alt = item.name;

      console.log('aquí >:D')

      li.appendChild(heading);
      li.appendChild(details);
      li.appendChild(img);

      itemList.appendChild(li);
    });
  })
  .catch(error => {
    console.error(error);
    itemList.innerHTML = '<p>An error occurred while fetching the items. Please try again later.</p>';
  });

  const logoutButton = document.getElementById('logout-button');

  logoutButton.addEventListener('click', logout);
  
  function logout() {
    localStorage.removeItem(userEmailKey);
    localStorage.removeItem(isLoggedInKey);
    localStorage.removeItem('cart');

    window.location.href = './login.html';
  }
