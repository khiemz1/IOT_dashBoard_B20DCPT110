var mqtt = require("mqtt");
var mysql = require("mysql");
const cors = require("cors");

var mqttOptions = {
  host: "localhost",
  port: 3000,
  protocol: "mqtt",
  username: "tvk",
  password: "123",
};

var mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "27082002",
  database: "iot",
};

// Initialize MQTT client
var mqttClient = mqtt.connect(mqttOptions);

// Initialize MySQL connection
var mysqlConnection = mysql.createConnection(mysqlConfig);

// MQTT connect event
mqttClient.on("connect", function () {
  console.log("Connected to MQTT broker");
  // Subscribe to the topic where sensor data is published
  mqttClient.subscribe("sensor");
  mqttClient.subscribe("led");
  mqttClient.subscribe("fan");
  mqttClient.subscribe("device/status");
});

mqttClient.on("message", (topic, message) => {
  console.log("Nhận được dữ liệu từ topic:", topic);
  console.log("Nội dung:", message.toString());

  try {
    if (topic === "sensor") {
      const data = JSON.parse(message);
      var query =
        "INSERT INTO sensor_data (Date_time, temperature, humidity, light) VALUES (NOW(), ?, ?, ?)";

      const values = [data.temperature, data.humidity, data.light];

      mysqlConnection.query(query, values, (err, results, fields) => {
        if (err) {
          console.error("Lỗi khi thêm dữ liệu vào MySQL:", err);
          return;
        }
        console.log("Dữ liệu đã được lưu vào MySQL");
      });
    }
    if (topic === "led" || topic === "fan") {
      var device;
      if (topic === "led") {
        device = "LED";
      } else if (topic === "fan") {
        device = "FAN";
      } else {
        console.log("Unknown topic:", topic);
        return;
      }

      var action = message.toString();
      saveDeviceAction(device, action);
    }
  } catch (error) {
    console.error("Lỗi khi xử lý dữ liệu:", error);
  }
});

function saveDeviceAction(device, action) {
  var query =
    "INSERT INTO action_history (action,updatedAt, deviceID) VALUES (?, NOW(), ?)";
  var values = [action, device];

  mysqlConnection.query(query, values, (err, results, fields) => {
    if (err) {
      console.error("Error saving device action to MySQL:", err);
      return;
    }
    console.log("Device action saved to MySQL");
  });
}

mysqlConnection.connect(function (error) {
  if (error) {
    console.error("Error connecting to MySQL:", error);
  } else {
    console.log("Connected to MySQL database");
  }
});
module.exports = {
  mysqlConnection: mysqlConnection,
  mqttClient: mqttClient,
};
