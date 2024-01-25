/*
Fungsi untuk menyimpan data username ke localStorage
*/

let loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let username = document.getElementById('username').value;
  localStorage.setItem('username', username);
  window.location.href = 'index.html';
})

/*
Fungsi untuk mengarahkan ke halaman index jika sudah ada username.
*/
document.addEventListener('DOMContentLoaded', () => {
  let username = localStorage.getItem('username');
  if (username) {
    window.location.href = 'index.html';
  }
})