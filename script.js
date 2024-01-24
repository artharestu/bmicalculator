let username = localStorage.getItem('username');
document.addEventListener('DOMContentLoaded', () => {
  if (!username) {
    window.location.href = 'login.html';
  }
  document.getElementById('welcome').innerText = `Welcome, ${username}!`;
  renderData();
})

let formBMI = document.getElementById('bmi-form');
formBMI.addEventListener('submit', (e) => {
  e.preventDefault();

  let weights = document.getElementById('berat-badan').value;
  let heights = document.getElementById('tinggi-badan').value;
  let date = new Date().getTime();
  let bmi = (weights / (heights / 100 * heights / 100)).toFixed(2);
  let tanggal = new Date(date)
  let id = tanggal.getDate().toString() + tanggal.getMonth().toString() + tanggal.getFullYear().toString();
  let data = localStorage.getItem('data');

  if (data !== null && findDataToday(id, JSON.parse(data))) {
    document.getElementById("notif").innerHTML =
      "<small>Data BMI hari ini sudah ada! Anda hanya diperbolehkan menginputkan 1 kali per hari.</small>";
  } else if (
    weights === "" || heights === "" ||
    weights <= 30 || heights <= 100 ||
    weights >= 200 || heights >= 250) {
    document.getElementById("notif").innerHTML =
      "<small>BB harus diisi diantara 30-200 kg dan TB harus diisi diantara 100-250 cm</small>";
  } else {
    if (data === null) {
      localStorage.setItem('data', JSON.stringify([{
        id,
        date,
        weights,
        heights,
        bmi,
        status: 'Obese'
      }]))
    } else {
      let dataArr = JSON.parse(data);
      dataArr.push({
        id,
        date,
        weights,
        heights,
        bmi,
        status: 'Obese'
      })
      localStorage.setItem('data', JSON.stringify(dataArr))
    }
    renderData();
  }
  document.getElementById('berat-badan').value = "";
  document.getElementById('tinggi-badan').value = "";
})

let logout = document.getElementById('logout-btn');
logout.addEventListener('click', () => {
  localStorage.removeItem('username');
  window.location.href = 'login.html';
})

function renderData() {
  let data = localStorage.getItem('data');
  let dataNotFound = document.getElementById('data-not-found');
  let bmiTable = document.getElementById('bmi-table');
  if (data === null) {
    dataNotFound.classList.remove('d-none');
    bmiTable.classList.add('d-none');
  } else {
    dataNotFound.classList.add('d-none');
    bmiTable.classList.remove('d-none');
    let dataArr = JSON.parse(data);
    let tableBody = document.getElementById('bmi-table-body');
    tableBody.innerHTML = "";
    for (let i = 0; i < dataArr.length; i++) {
      let tanggal = new Date(dataArr[i].date);
      tableBody.innerHTML += `
        <tr>
          <td>${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()}</td>
          <td>${dataArr[i].weights} kg</td>
          <td>${dataArr[i].heights} cm</td>
          <td>${dataArr[i].bmi}</td>
          <td>${dataArr[i].status}</td>
          <td>
            <button class="btn btn-outline-info btn-sm"><i class="bi bi-repeat"></i></button>
            <button class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>            
          </td>
        </tr>
      `;

    }
  }
}

function findDataToday(id, data) {
  let status = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      status = true;
      break;
    }
  }
  return status;
}