/* Mengambil data username dari localStorage */
let username = localStorage.getItem('username');

/* 
Ketika halaman dibuka pertama kali, dicek dulu apakah ada username atau tidak.
Jika tidak diarahkan ke halaman login.
Jika sudah ada username, tampilkan ke halaman index.
*/
document.addEventListener('DOMContentLoaded', () => {
  if (!username) {
    window.location.href = 'login.html';
  }
  document.getElementById('welcome').innerText = `Welcome, ${username}!`;
  renderData();
})

/*
Fungsi Create. Mengambil data dari form input dan menyimpannya ke localStorage.
Setelah berhasil maka tampilkan data menggunakan fungsi renderData()
Tampilkan notifikasi data berhasil ditambahkan.
*/
let formBMI = document.getElementById('bmi-form');
formBMI.addEventListener('submit', (e) => {
  e.preventDefault();

  let weights = document.getElementById('berat-badan').value;
  let heights = document.getElementById('tinggi-badan').value;
  let bmi = calcBMI(weights, heights);
  let data = localStorage.getItem('data');
  let status = statusBMI();

  let inputDate = document.getElementById('date').value;
  let date = new Date(inputDate).getTime();
  let tanggal = new Date(date)
  let id = tanggal.getDate().toString() + tanggal.getMonth().toString() + tanggal.getFullYear().toString();

  if (data !== null && findDataToday(id, JSON.parse(data))) {
    document.getElementById("notif").innerHTML =
      `<small>Data at ${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()} already exist!</small>`;
  } else if (
    weights === "" || heights === "" ||
    weights <= 30 || heights <= 75 ||
    weights >= 400 || heights >= 250) {
    document.getElementById("notif").innerHTML =
      "<small>BB 30-400 kg dan TB 75-250 cm</small>";
  } else {
    if (data === null) {
      localStorage.setItem('data', JSON.stringify([{
        id,
        date,
        weights,
        heights,
        bmi,
        status: status
      }]))
    } else {
      let dataArr = JSON.parse(data);
      dataArr.push({
        id,
        date,
        weights,
        heights,
        bmi,
        status: status
      })
      localStorage.setItem('data', JSON.stringify(dataArr))
    }
    renderData();
    document.getElementById("notif").innerHTML = "";
  }
  document.getElementById('berat-badan').value = "";
  document.getElementById('tinggi-badan').value = "";
  document.getElementById('date').value = "";

  imageStatus()
  const toastLiveExample = document.getElementById('toast-add-data')
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()
})

/*
Fungsi logout dan reset data
Menghapus data username dan semua data BMI dari localStorage
*/
let logout = document.getElementById('logout-btn');
logout.addEventListener('click', () => {
  localStorage.removeItem('username');
  localStorage.removeItem('data');
  window.location.href = 'login.html';
})

/*
Fungsi untuk menampilkan data yang akan diupdate.
Input id data yang ingin diupdate
*/
function updateModal(id) {
  let data = localStorage.getItem("data");
  let arrData = JSON.parse(data);

  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i].id === id) {
      document.getElementById(`berat`).value = arrData[i].weights;
      document.getElementById(`tinggi`).value = arrData[i].heights;
      let tanggal = new Date(arrData[i].date);
      document.getElementById('update-tanggal').innerText =
        `Update data at ${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()}`;

      document.getElementById("update-id").innerText = id;
      break;
    }
  }
}

/*
Fungsi untuk menghitung BMI
*/
function calcBMI(weight, height) {
  return (weight / (height / 100 * height / 100)).toFixed(2);
}

/*
Fungsi untuk menyimpan data yang sudah diupdate.
*/
let saveUpdate = document.getElementById("save-update");
saveUpdate.addEventListener("click", () => {
  let berat = document.getElementById("berat").value;
  let tinggi = document.getElementById("tinggi").value;
  let id = document.getElementById("update-id").innerText;
  let data = localStorage.getItem("data");
  let arrData = JSON.parse(data);
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i].id === id) {
      arrData[i].weights = berat;
      arrData[i].heights = tinggi;
      arrData[i].bmi = calcBMI(berat, tinggi);
      if (arrData[i].bmi >= 25.1) {
        arrData[i].status = "Obese"
      } else if (arrData[i].bmi >= 18.5 && arrData[i].bmi <= 25) {
        arrData[i].status = "Normal"
      } else {
        arrData[i].status = "Underweight"
      }

      localStorage.setItem("data", JSON.stringify(arrData));
      renderData();
      break;
    }
  }
})

/*
Fungsi untuk menampilkan data yang ada di localStorage
 */
function renderData() {
  let data = localStorage.getItem('data');
  let dataNotFound = document.getElementById('data-not-found');
  let bmiTable = document.getElementById('bmi-table');
  if (data === null || JSON.parse(data).length === 0) {
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
            <button class="btn btn-outline-info btn-sm" onclick="updateModal('${dataArr[i].id}')" 
            data-bs-toggle="modal" data-bs-target="#bmiModal">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="popUpDelete('${dataArr[i].id}')"
            data-bs-toggle="modal" data-bs-target="#notif-delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }
  }
}

/*
Fungsi untuk menyimpan id data yang ingin di hapus dalam pop up
*/
function popUpDelete(id) {
  document.getElementById("delete-id").innerHTML = id;
}

/*
Fungsi untuk menghapus data.
 */
function deleteData() {
  let id = document.getElementById("delete-id").innerHTML;
  let data = localStorage.getItem('data');
  let dataArr = JSON.parse(data);
  let result = [];
  for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i].id !== id) {
      result.push(dataArr[i]);
    }
  }
  localStorage.setItem('data', JSON.stringify(result));
  renderData();
  hideStatus();
}

/*
Fungsi untuk mencegah data duplikat berdasarkan tanggal.
Jika tanggal sama, berarti data sudah ada.
*/
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

/*
Fungsi untuk mengurutkan data berdasarkan tanggal
*/
function sortByDate() {
  let data = localStorage.getItem('data');
  let dataArr = JSON.parse(data);
  for (let i = 0; i < dataArr.length; i++) {
    for (let j = i + 1; j < dataArr.length; j++) {
      if (dataArr[i].date > dataArr[j].date) {
        let temp = dataArr[i];
        dataArr[i] = dataArr[j];
        dataArr[j] = temp;
      }
    }
  }
  localStorage.setItem('data', JSON.stringify(dataArr));
  renderData();
}

/*
Fungsi untuk mencari status BMI.
*/
function statusBMI() {
  let weights = document.getElementById('berat-badan').value;
  let heights = document.getElementById('tinggi-badan').value;
  let bmi = calcBMI(weights, heights);

  if (bmi >= 25.1) {
    return "Obesitas"
  } else if (bmi >= 18.5 && bmi <= 25) {
    return "Normal"
  } else {
    return "Kurus"
  }
}

function imageStatus() {
  let data = localStorage.getItem("data");
  let arrData = JSON.parse(data);
  let divHide = document.getElementById('hide');

  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i].status === "Obesitas") {
      document.getElementById("text-bmi-status").innerText = `BMI kamu: ${arrData[i].bmi}, kamu termasuk kedalam kategori ${arrData[i].status} `
      document.getElementById('image-status').src = "https://img.freepik.com/free-vector/obesity-problem-overweight-man-medical-consultation-diagnostics-negative-impact-obesity-humans-health-internal-organs-vector-isolated-concept-metaphor-illustration_335657-1305.jpg?w=826&t=st=1706225852~exp=1706226452~hmac=bdf09a4b2196102cfc59915a92370eb483a6ba911ee04b28aa2c9405e20fddcd"
    } else if (arrData[i].status === "Normal") {
      document.getElementById("text-bmi-status").innerText = `BMI kamu: ${arrData[i].bmi}, kamu termasuk kedalam kategori ${arrData[i].status} `
      document.getElementById('image-status').src = "https://img.freepik.com/free-vector/people-eating-healthy-exercising-regularly_53876-59882.jpg?w=996&t=st=1706225910~exp=1706226510~hmac=1c18de1c2c7d9efade68e991256804c147a1478db1d166b502ac4b341c54ef20"
    } else {
      document.getElementById("text-bmi-status").innerText = `BMI kamu: ${arrData[i].bmi}, kamu termasuk kedalam kategori ${arrData[i].status} `
      document.getElementById('image-status').src = "https://img.freepik.com/free-vector/cartoon-avocado-flat-composition-with-front-view-electronic-kitchen-scales-surrounded-by-characters-vegetables-vector-illustration_1284-81296.jpg?w=1380&t=st=1706225933~exp=1706226533~hmac=7059c2f134f374be18649b0d04a60dfe880ab35bcc1f1b96053850a35b9a7620"
    }
  }
  if (divHide.style.display === "none") {
    divHide.style.display = "block";
  }

}
function hideStatus() {
  let divHide = document.getElementById('hide');
  if (divHide.style.display === "block") {
    divHide.style.display = "none";
  }
}