let username = localStorage.getItem("username");
document.addEventListener("DOMContentLoaded", () => {
  if (!username) {
    window.location.href = "login.html";
  }
  document.getElementById("welcome").innerText = `Welcome, ${username}!`;
  renderData();
});

let formBMI = document.getElementById("bmi-form");
formBMI.addEventListener("submit", (e) => {
  e.preventDefault();

  let weights = document.getElementById("berat-badan").value;
  let heights = document.getElementById("tinggi-badan").value;
  let bmi = (weights / (((heights / 100) * heights) / 100)).toFixed(2);
  let data = localStorage.getItem("data");

  let inputDate = document.getElementById("date").value;
  let date = new Date(inputDate).getTime();
  let tanggal = new Date(date);
  // console.log(tanggal);
  let id = tanggal.getDate().toString() + tanggal.getMonth().toString() + tanggal.getFullYear().toString();

  /** Ini adalah mebuat data JSON */

  if (data !== null && findDataToday(id, JSON.parse(data))) {
    document.getElementById("notif").innerHTML = `<small>Data at ${tanggal.getDate()}/${tanggal.getMonth() + 1}/${tanggal.getFullYear()} already exist!</small>`;
  } else if (weights === "" || heights === "" || weights <= 30 || heights <= 75 || weights >= 400 || heights >= 250) {
    document.getElementById("notif").innerHTML = "<small>BB 30-400 kg dan TB 75-250 cm</small>";
  } else {
    if (data === null) {
      localStorage.setItem(
        "data",
        JSON.stringify([
          {
            id,
            date,
            weights,
            heights,
            bmi,
            status: "Obese",
          },
        ])
      );
    } else {
      let dataArr = JSON.parse(data);
      dataArr.push({
        id,
        date,
        weights,
        heights,
        bmi,
        status: "Obese",
      });
      localStorage.setItem("data", JSON.stringify(dataArr));
    }
    renderData();
    document.getElementById("notif").innerHTML = "";
  }
  document.getElementById("berat-badan").value = "";
  document.getElementById("tinggi-badan").value = "";
  document.getElementById("date").value = "";
});

/** Slesai Pembuatan Data JSON */

let logout = document.getElementById("logout-btn");
logout.addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("data");
  window.location.href = "login.html";
});

function updateModal(id) {
  let data = localStorage.getItem("data");
  let arrData = JSON.parse(data);
  // console.log(arrData);
  // console.log(arrData[0].id);

  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i].id === id) {
      document.getElementById(`berat-aja`).value = arrData[i].weights;
    }
  }
}

function closeModal() {}

function renderData() {
  let data = localStorage.getItem("data");
  let dataNotFound = document.getElementById("data-not-found");
  let bmiTable = document.getElementById("bmi-table");
  if (data === null || JSON.parse(data).length === 0) {
    dataNotFound.classList.remove("d-none");
    bmiTable.classList.add("d-none");
  } else {
    dataNotFound.classList.add("d-none");
    bmiTable.classList.remove("d-none");
    let dataArr = JSON.parse(data);
    let tableBody = document.getElementById("bmi-table-body");
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
            <button onclick="updateModal('${dataArr[i].id}')"  type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Update</button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteData('${dataArr[i].id}')">
              <i class="bi bi-trash"></i>
            </button>            
          </td>
        </tr>
      `;
    }
  }
}
function deleteData(id) {
  let data = localStorage.getItem("data");
  let dataArr = JSON.parse(data);
  let result = [];
  for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i].id !== id) {
      result.push(dataArr[i]);
    }
  }
  localStorage.setItem("data", JSON.stringify(result));
  renderData();
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

function sortByDate() {
  let data = localStorage.getItem("data");
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
  localStorage.setItem("data", JSON.stringify(dataArr));
  renderData();
}
