let loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let username = document.getElementById('username').value;
  localStorage.setItem('username', username);
  window.location.href = 'index.html';
})