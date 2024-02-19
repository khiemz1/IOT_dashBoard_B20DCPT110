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
      },
    ],
  },
  options: {
    onClick: function (event, elements) {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const meta = chart.getDatasetMeta(datasetIndex);

        meta.hidden = !meta.hidden;

        chart.update();
      }
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },

    onHover(event) {
      event.target.style.cursor = "default";
    },

    // hover: {
    //     onHover: (event) => {
    //     event.target.style.cursor  = 'pointer';
    // }
    // },
  },
});

function updateChart() {
  const temp = Math.floor(Math.random() * 61);
  const humid = Math.floor(Math.random() * 101);
  const light = Math.floor(Math.random() * 101);

  if (chart.data.labels.length > 20) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
    chart.data.labels.shift();
  }

  chart.data.datasets[0].data.push(temp);
  chart.data.datasets[1].data.push(humid);
  chart.data.datasets[2].data.push(light);
  chart.data.labels.push(new Date().toLocaleTimeString());

  // const humidityColor = document.getElementById("humidityColor");
  // const maxHeight = humidityColor.offsetHeight;
  // const percentageHeight = (humid / 100) * maxHeight;

  // humidityColor.style.background = `linear-gradient(to top, rgb(134, 209, 223), rgb(2, 209, 200) ${percentageHeight}%)`;

  if (temp <= 15) {
    document.getElementById("temp-img").src = "img/temperature-down.png";
  } else if (temp > 15 && temp <= 36) {
    document.getElementById("temp-img").src = "img/temperature.png";
  } else {
    document.getElementById("temp-img").src = "img/high-temperature.png";
  }
  document.getElementById("temperatureValue").innerText = temp + "°C";
  document.getElementById("temperatureValue").style.color = "red";
  document.getElementById("humidityValue").innerText = humid + "%";
  document.getElementById("humidityValue").style.color = "blue";
  document.getElementById("lightValue").innerText = light + " LUX";
  document.getElementById("lightValue").style.color = "yellow";

  chart.update();
}
setInterval(updateChart, 1000);

function lightBulb() {
  var light = document.getElementById("light_bulb");
  var lightImg = document.getElementById("light-img");
  if (light.checked) {
    lightImg.src = "img/light-bulb-on.png";
  } else {
    lightImg.src = "img/light-bulb-off.png";
  }
}

function fanButton() {
  var fan = document.getElementById("toggle");
  var fanImg = document.getElementById("fan-img");
  if (fan.checked) {
    fanImg.src = "img/fanoff.png";
  } else {
    fanImg.src = "img/fanon.gif";
  }
}
