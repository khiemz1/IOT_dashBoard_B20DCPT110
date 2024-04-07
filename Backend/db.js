const express = require("express");
const app = express();
const moment = require("moment-timezone");
const mysql = require("mysql");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

app.use(express.json());
var database;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS API project",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000/",
      },
    ],
  },

  apis: ["D:\\Documents\\IOT\\web\\IoT\\Backend\\db.js"],
};
app.listen(4000, () => {
  console.log(`Server đang chạy trên cổng 4000`);
});
const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
var mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "27082002",
  database: "iot",
};
var mysqlConnection = mysql.createConnection(mysqlConfig);
// Kết nối đến cơ sở dữ liệu MySQL
mysqlConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         temperature:
 *           type: number
 *         humidity:
 *           type: number
 *         light:
 *           type: number
 *         Date_time:
 *           type: string
 *           format: date-time
 * /dash_board:
 *   get:
 *     summary: Get latest sensor data
 *     description: Retrieve the latest sensor data from the database.
 *     tags:
 *       - Dash board
 *     responses:
 *       200:
 *         description: Success. Returns the latest sensor data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       500:
 *         description: Internal Server Error. Failed to retrieve data from the database.
 */

app.get("/dash_board", (req, res) => {
  // Thực hiện truy vấn cơ sở dữ liệu để lấy dữ liệu mới nhất
  mysqlConnection.query(
    "SELECT * FROM sensor_data ORDER BY Date_time DESC LIMIT 1",
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      results.forEach((result) => {
        result.Date_time = moment(result.Date_time)
          .tz("Asia/Ho_Chi_Minh")
          .format();
      });
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    }
  );
});

/**
 * @swagger
 * /data_sensor/{page}:
 *   get:
 *     summary: Retrieve sensor data with pagination
 *     description: This API endpoint retrieves sensor data from the database with pagination.
 *     tags:
 *       - Data Sensor
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       500:
 *         description: Internal Server Error
 */

// Định nghĩa API để lấy dữ liệu từ cơ sở dữ liệu với phân trang
app.get("/data_sensor/:page", (req, res) => {
  const { page } = req.params;
  const limit = 10; // Số lượng kết quả mỗi trang
  const offset = (page - 1) * limit; // Số lượng bỏ qua (offset) dữ liệu

  // Thực hiện truy vấn cơ sở dữ liệu với phân trang
  mysqlConnection.query(
    "SELECT * FROM sensor_data LIMIT ? OFFSET ?",
    [limit, offset],
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      results.forEach((result) => {
        result.Date_time = moment(result.Date_time)
          .tz("Asia/Ho_Chi_Minh")
          .format();
      });
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    }
  );
});

/**
 * @swagger
 * /order/{subject}/{order}/{page}:
 *   get:
 *     summary: Retrieve sensor data sorted by a specified field with pagination
 *     description: This API endpoint retrieves sensor data from the database, sorts it based on the specified field and order, and implements pagination.
 *     tags:
 *       - Data Sensor
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         description: The field by which to sort the sensor data (e.g., temperature, humidity, light)
 *         schema:
 *           type: string
 *       - in: path
 *         name: order
 *         required: true
 *         description: The sorting order (up or down)
 *         schema:
 *           type: string
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sensor data sorted successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Bad request. Invalid sorting order provided.
 *       500:
 *         description: Internal Server Error
 */
app.get("/order/:subject/:order/:page", (req, res) => {
  const { subject, order, page } = req.params;
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const offset = (page - 1) * itemsPerPage; // Vị trí bắt đầu của trang hiện tại

  let orderByClause;

  // Xác định cách sắp xếp dựa trên tham số "subject" và "order"
  switch (order) {
    case "up":
      orderByClause = `ORDER BY ${subject} ASC`;
      break;
    case "down":
      orderByClause = `ORDER BY ${subject} DESC`;
      break;
    default:
      // Nếu tham số không hợp lệ, trả về lỗi
      return res.status(400).json({ error: "Invalid order parameter" });
  }

  // Thực hiện truy vấn cơ sở dữ liệu với cách sắp xếp tương ứng và phân trang
  const query = `SELECT * FROM sensor_data ${orderByClause} LIMIT ${itemsPerPage} OFFSET ${offset}`;

  mysqlConnection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    results.forEach((result) => {
      result.Date_time = moment(result.Date_time)
        .tz("Asia/Ho_Chi_Minh")
        .format();
    });
    // Trả về kết quả dưới dạng JSON
    res.json(results);
  });
});

/**
 * @swagger
 * /search/{type}/{value}/{page}:
 *   get:
 *     summary: Retrieve sensor data based on a specified type and value with pagination
 *     description: This API endpoint retrieves sensor data from the database based on the specified type and value, and implements pagination.
 *     tags:
 *       - Data Sensor
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of data to search for (e.g., temperature, humidity, light, day, hour)
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         description: The value to search for within the specified type
 *         schema:
 *           type: string
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: No record found with the specified type and value
 *       500:
 *         description: Internal Server Error
 */
app.get("/search/:type/:value/:page", (req, res) => {
  const { type, value, page } = req.params;
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const offset = (page - 1) * itemsPerPage; // Vị trí bắt đầu của trang hiện tại
  let query;
  let queryParams;

  // Kiểm tra subject là hour hoặc day và xây dựng câu truy vấn tương ứng
  if (type === "hour") {
    query =
      "SELECT * FROM sensor_data WHERE HOUR(Date_time) = ?  LIMIT ? OFFSET ?";
    queryParams = [value, itemsPerPage, offset];
  } else if (type === "day") {
    query =
      "SELECT * FROM sensor_data WHERE DATE(Date_time) = ?  LIMIT ? OFFSET ?";
    queryParams = [value, itemsPerPage, offset];
  } else {
    query = "SELECT * FROM sensor_data WHERE ?? = ? LIMIT ? OFFSET ?";
    queryParams = [type, value, itemsPerPage, offset];
  }

  mysqlConnection.query(query, queryParams, (error, results, fields) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (results.length === 0) {
      return res.status(404).json({
        error: "No record found with the specified subject, type, and value",
      });
    }

    results.forEach((result) => {
      result.Date_time = moment(result.Date_time)
        .tz("Asia/Ho_Chi_Minh")
        .format();
    });
    // Trả về kết quả dưới dạng JSON
    res.json(results);
  });
});

/**
 * @swagger
 * /search/{type}/{value}/{type2}/{order}/{page}:
 *   get:
 *     summary: Retrieve sensor data based on a specified type, value, type2, order, and with pagination
 *     description: This API endpoint retrieves sensor data from the database based on the specified type, value, type2, order, and implements pagination.
 *     tags:
 *       - Data Sensor
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of data to search for (e.g., temperature, humidity, light, day, hour)
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         description: The value to search for within the specified type
 *         schema:
 *           type: string
 *       - in: path
 *         name: type2
 *         required: true
 *         description: The field to sort by (e.g., temperature, humidity, light, Date_time)
 *         schema:
 *           type: string
 *       - in: path
 *         name: order
 *         required: true
 *         description: The sorting order (up for ascending, down for descending)
 *         schema:
 *           type: string
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: No record found with the specified type, value, type2, and order
 *       500:
 *         description: Internal Server Error
 */
app.get("/search/:type/:value/:type2/:order/:page", (req, res) => {
  const { type, value, type2, order, page } = req.params;
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const offset = (page - 1) * itemsPerPage; // Vị trí bắt đầu của trang hiện tại
  let query;
  let queryParams;

  // Xây dựng câu truy vấn tùy thuộc vào giá trị của type
  if (type === "hour") {
    query = "SELECT * FROM sensor_data WHERE HOUR(Date_time) = ?";
    queryParams = [value];
  } else if (type === "day") {
    query = "SELECT * FROM sensor_data WHERE DATE(Date_time) = ?";
    queryParams = [value];
  } else {
    query = "SELECT * FROM sensor_data WHERE ?? = ?";
    queryParams = [type, value];
  }

  // Thêm phần order by vào câu truy vấn dựa trên type2 và order
  query += ` ORDER BY ${type2} ${order.toUpperCase()} LIMIT ? OFFSET ?`;
  queryParams.push(itemsPerPage, offset);

  mysqlConnection.query(query, queryParams, (error, results, fields) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Kiểm tra xem có bản ghi nào được tìm thấy không
    if (results.length === 0) {
      return res.status(404).json({
        error:
          "No record found with the specified type, value, type2, and order",
      });
    }

    results.forEach((result) => {
      result.Date_time = moment(result.Date_time)
        .tz("Asia/Ho_Chi_Minh")
        .format();
    });
    // Trả về kết quả dưới dạng JSON
    res.json(results);
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         action:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deviceID:
 *           type: string
 *
 * /action_history/{page}:
 *   get:
 *     summary: Get paginated device action history
 *     description: Retrieve device action history paginated by page number
 *     tags:
 *       - Action History
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of device actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActionHistory'
 *       400:
 *         description: Bad request. Missing required fields or invalid data
 *       500:
 *         description: Internal Server Error
 */
app.get("/action_history/:page", (req, res) => {
  const page = req.params.page;
  const limit = 10; // Số lượng bản ghi trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

  // Thực hiện truy vấn cơ sở dữ liệu
  mysqlConnection.query(
    "SELECT * FROM action_history LIMIT ? OFFSET ?",
    [limit, offset],
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      results.forEach((result) => {
        result.updatedAt = moment(result.updatedAt)
          .tz("Asia/Ho_Chi_Minh")
          .format();
      });

      // Trả về kết quả dưới dạng JSON
      res.json(results);
    }
  );
});

/**
 * @swagger
 * /action_history/search/{field}/{value}/{page}:
 *   get:
 *     summary: Retrieve action history with pagination based on hour or day
 *     description: Retrieve action history from the database with pagination based on hour or day.
 *     tags:
 *       - Action History
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         description: The field to search by (hour or day)
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         description: The value to search by (e.g., specific hour or day)
 *         schema:
 *           type: string
 *       - in: path
 *         name: page
 *         required: true
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Action history retrieved successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceAction'
 *       400:
 *         description: Bad request. Invalid search field provided.
 *       500:
 *         description: Internal Server Error
 */

app.get("/action_history/search/:field/:value/:page", (req, res) => {
  const { field, value, page } = req.params;
  const limit = 10; // Số lượng bản ghi trên mỗi trang
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

  // Kiểm tra trường field để xác định loại truy vấn cần thực hiện
  let query;
  let values;
  if (field === "hour") {
    query =
      "SELECT * FROM action_history WHERE HOUR(updatedAt) = ? LIMIT ? OFFSET ?";
  } else if (field === "day") {
    const formattedDate = value.split("-").reverse().join("-");
    query =
      "SELECT * FROM action_history WHERE DATE(updatedAt) = ? LIMIT ? OFFSET ?";
    values = [formattedDate, limit, offset];
  } else if (field === "deviceID") {
    query = "SELECT * FROM action_history WHERE deviceID = ? LIMIT ? OFFSET ?";
  } else if (field === "action") {
    query = "SELECT * FROM action_history WHERE action = ? LIMIT ? OFFSET ?";
  } else {
    console.error("Invalid search field:", field);
    res
      .status(400)
      .json({ error: "Bad request. Invalid search field provided." });
    return;
  }

  // Thực hiện truy vấn cơ sở dữ liệu
  mysqlConnection.query(
    query,
    [value, limit, offset],
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      results.forEach((result) => {
        result.updatedAt = moment(result.updatedAt)
          .tz("Asia/Ho_Chi_Minh")
          .format();
      });
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    }
  );
});
