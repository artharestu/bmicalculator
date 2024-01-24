let username = localStorage.getItem('username');
document.addEventListener('DOMContentLoaded', () => {
  console.log(username);
  if (!username) {
    window.location.href = 'login.html';
  }

  document.getElementById('welcome').innerText = `Selamat Datang ${username}!`;
})

let formBMI = document.getElementById('bmi-form');
formBMI.addEventListener('submit', (e) => {
  e.preventDefault();
  let beratBadan = document.getElementById('berat-badan').value;
  let tinggiBadan = document.getElementById('tinggi-badan').value;

  console.log(beratBadan, tinggiBadan);
  let bmi = beratBadan / (tinggiBadan / 100 * tinggiBadan / 100);
  console.log(bmi.toFixed(2));

  let bmiResult = document.getElementById('bmi-result');
  bmiResult.innerHTML += `<p>Hasil BMI ${username}: ${bmi.toFixed(2)} tanggal ${new Date().toLocaleDateString()}</p>`
})