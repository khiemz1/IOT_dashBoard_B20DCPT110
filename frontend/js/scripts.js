// const chart = new Chart("chartInformation", {
//   type: "line",
//   data: {
//     labels: [],
//     datasets: [
//       {
//         label: "Temperature",
//         borderColor: "red",
//         backgroundColor: "red",
//         lineTension: 0,
//         data: [],
//         fill: false,
//       },
//       {
//         label: "Humidity",
//         borderColor: "blue",
//         backgroundColor: "blue",
//         lineTension: 0,
//         data: [],
//         fill: false,
//       },
//       {
//         label: "Light",
//         borderColor: "orange",
//         backgroundColor: "orange",
//         lineTension: 0,
//         data: [],
//         fill: false,
//       },
//     ],
//   },
//   options: {
//     onClick: function (event, elements) {
//       if (elements.length > 0) {
//         const datasetIndex = elements[0].datasetIndex;
//         const meta = chart.getDatasetMeta(datasetIndex);

//         meta.hidden = !meta.hidden;

//         chart.update();
//       }
//     },

//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Time",
//         },
//       },
//     },

//     onHover(event) {
//       event.target.style.cursor = "default";
//     },

//     // hover: {
//     //     onHover: (event) => {
//     //     event.target.style.cursor  = 'pointer';
//     // }
//     // },
//   },
// });

const chart = new Chart("chartInformation", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature",
        borderColor: "red",
        backgroundColor: "red",
        lineTension: 0,
        data: [],
        fill: false,
      },
      {
        label: "Humidity",
        borderColor: "blue",
        backgroundColor: "blue",
        lineTension: 0,
        data: [],
        fill: false,
      },
      {
        label: "Light",
        borderColor: "orange",
        backgroundColor: "orange",
        lineTension: 0,
        data: [],
        fill: false,
        yAxisID: "light-y-axis", // Thiết lập ID của trục y cho dataset "Light"
      },
    ],
  },
  options: {
    scales: {
      y: {
        title: {
          display: true,
          text: "Temperature & Humidity",
        },
      },
      "light-y-axis": {
        // Trục mới cho giá trị của light
        position: "right", // Đặt vị trí ở bên phải
        title: {
          display: true,
          text: "Light",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            if (label) {
              return label + ": " + context.parsed.y;
            }
            return null;
          },
        },
      },
    },
    // Các tùy chọn khác của biểu đồ...
  },
});

const chart1 = new Chart("chartInformation1", {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "WindSpeed",
        borderColor: "green",
        backgroundColor: "green",
        lineTension: 0,
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            if (label) {
              return label + ": " + context.parsed.y;
            }
            return null;
          },
        },
      },
    },
    // Các tùy chọn khác của biểu đồ...
  },
});

function updateChart() {
  $.ajax({
    url: "http://localhost:4000/dash_board",
    type: "GET",
    dataType: "json",
    success: function (data) {
      var latestData = data[0];
      var temp = latestData.temperature;
      var humid = latestData.humidity;
      var light = latestData.light;
      var windspeed = latestData.windSpeed;
      console.log(windspeed);
      // Thêm dữ liệu vào biểu đồ và cập nhật biểu đồ
      if (chart.data.labels.length > 20) {
        chart.data.datasets.forEach((dataset) => {
          dataset.data.shift();
        });
        chart.data.labels.shift();
      }
      if (chart1.data.labels.length > 20) {
        chart1.data.datasets.forEach((dataset) => {
          dataset.data.shift();
        });
        chart1.data.labels.shift();
      }

      chart.data.datasets[0].data.push(temp);
      chart.data.datasets[1].data.push(humid);
      chart.data.datasets[2].data.push(light);
      chart.data.labels.push(new Date().toLocaleTimeString());

      chart1.data.datasets[0].data.push(windspeed);
      chart1.data.labels.push(new Date().toLocaleTimeString());

      // đổi màu độ ẩm
      const humidityColor = document.getElementById("humidityColor");
      const maxHeighthumidity = humidityColor.offsetHeight;
      const percentageHeighthumidity = (humid / 100) * maxHeighthumidity;

      humidityColor.style.background = `linear-gradient(to top, rgb(134, 209, 223), rgb(2, 209, 200) ${percentageHeighthumidity}%)`;

      // đổi màu temp
      const tempColor = document.getElementById("tempColor");
      const maxHeighttemp = tempColor.offsetHeight;
      const percentageHeighttemp = (humid / 100) * maxHeighttemp;

      tempColor.style.background = `linear-gradient(to top, #FFFF00, #FF0000 ${percentageHeighttemp}%)`;

      // đổi màu light
      const lightColor = document.getElementById("lightColor");
      const maxHeighttemplight = lightColor.offsetHeight;
      const percentageHeightlight = (humid / 100) * maxHeighttemplight;

      lightColor.style.background = `linear-gradient(to top, #FFCC00, #FFFF33 ${percentageHeightlight}%)`;

      //đổi màu windspeed
      const windspeedColor = document.getElementById("windspeedColor");
      const maxHeightwindspeed = windspeedColor.offsetHeight;
      const percentageHeightwindspeed = (humid / 100) * maxHeightwindspeed;

      windspeedColor.style.background = `linear-gradient(to top, #33CC33, #66CC99 ${percentageHeightwindspeed}%)`;

      document.getElementById("temperatureValue").innerText = temp + "°C";
      document.getElementById("temperatureValue").style.color = "red";
      document.getElementById("humidityValue").innerText = humid + "%";
      document.getElementById("humidityValue").style.color = "blue";
      document.getElementById("lightValue").innerText = light + " LUX";
      document.getElementById("lightValue").style.color = "yellow";
      document.getElementById("windSpeedValue").innerText = windspeed + " m/s";
      document.getElementById("windSpeedValue").style.color = "green";

      chart.update();
      chart1.update();
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        // Xử lý khi không tìm thấy dữ liệu API
      } else {
        console.error("Error:", error);
      }
    },
  });
}

setInterval(updateChart, 3000);

document
  .getElementById("light_bulb")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định để checkbox không thay đổi trạng thái
  });
function lightBulb() {
  var light = document.getElementById("light_bulb");
  var lightImg = document.getElementById("light-img");
  if (light.checked) {
    // lightImg.src = "img/light-bulb-on.png";
    pub_led("on");
  } else {
    // lightImg.src = "img/light-bulb-off.png";
    pub_led("off");
  }
}

document.getElementById("toggle").addEventListener("click", function (event) {
  event.preventDefault(); // Ngăn chặn hành động mặc định để checkbox không thay đổi trạng thái
});
function fanButton() {
  var fan = document.getElementById("toggle");
  var fanImg = document.getElementById("fan-img");
  if (fan.checked) {
    // fanImg.src = "img/fanoff.png";
    pub_fan("off");
  } else {
    // fanImg.src = "img/fanon.gif";
    pub_fan("on");
  }
}

setInterval(checkDeviceStatus, 100);
// Biến toàn cục để lưu trạng thái hiện tại của LED và FAN
let currentLEDStatus = null;
let currentFANStatus = null;

function checkDeviceStatus() {
  fetch("http://localhost:4000/dash_board/check_status")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch device status");
      }
      return response.json();
    })
    .then((data) => {
      // Cập nhật trạng thái của LED nếu có sự thay đổi
      if (data.LED !== currentLEDStatus) {
        currentLEDStatus = data.LED;
        if (data.LED === "on") {
          document.getElementById("light_bulb").checked = true;
          document.getElementById("light-img").src = "img/light-bulb-on.png";
        } else {
          document.getElementById("light_bulb").checked = false;
          document.getElementById("light-img").src = "img/light-bulb-off.png";
        }
      }

      // Cập nhật trạng thái của FAN nếu có sự thay đổi
      if (data.FAN !== currentFANStatus) {
        currentFANStatus = data.FAN;
        if (data.FAN === "on") {
          document.getElementById("toggle").checked = true;
          document.getElementById("fan-img").src = "img/fanon.gif";
        } else {
          document.getElementById("toggle").checked = false;
          document.getElementById("fan-img").src = "img/fanoff.png";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Gọi hàm để kiểm tra trạng thái của thiết bị
  checkDeviceStatus();
});

function pub_led(action) {
  fetch(`http://localhost:4000/dash_board/led_control/${action}`, {
    // Thay đổi địa chỉ URL của API và port thành 4000
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: action }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to publish message");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function pub_fan(action) {
  fetch(`http://localhost:4000/dash_board/fan_control/${action}`, {
    // Thay đổi địa chỉ URL của API và port thành 4000
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: action }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to publish message");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
