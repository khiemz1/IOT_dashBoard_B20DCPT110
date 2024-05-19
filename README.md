# IOT Dashboard

## Mô tả
Project cung cấp web hiển thị ra các thông tin nhận về từ cảm biến và thực hiện bật tắt thiết bị.
## Chuẩn bị
Phần cứng: node MCU esp8266, cảm biến dht11, quang trở, đèn led
Các ngôn ngữ lập trình sử dụng:
- frontend: html, css, js
- backend: node js
- broker: mosquitto
- phần mềm sử dụng: vscode, Arduino IDE
### Note 
Cần đảm bảo trên thiết bị đã cài đặt sẵn các phần mềm yêu cầu (hoặc phần mềm tương tự), và thực hiện lắp đặt hoàn thiện phần cứng
## Cách cài đặt 
### Bước 1: Clone dự án 
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/5a7bc568-c173-451d-98ea-d816e73cc33d)
có thể tải về và giải nén hoặc sử dụng đường link :

```
git clone https://github.com/trantrungkien02/IOT](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110.git
```
### Bước 2: Cài đặt các thư viện cần thiết
Thực hiện trỏ đến folder chứa project
vd: 
```
cd IOT
```
- Mở terminal và thực hiện lệnh để cài thư viện
```
npm install -y
```
- Sau đó trỏ đến folder Backend
```
cd Backend
```
- Cài đặt các thư viện cần thiết: 
```
npm install express mysql mqtt doten nodemon moment-timezone
```
### Bước 3: Điều chỉnh code để phù hợp với máy
Sửa đoạn code thiết lập kết nối trong file db.js ở folder Backend.
Ví dụ:
```
var mqttOptions = {
  host: "localhost",
  port: mqtt port,
  protocol: "mqtt",
  username: "mqtt userName",
  password: "mqtt password",
};

var mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "your password",
  database: "your database name",
};
```
### Bước 4: Chạy project
Trỏ đến Backend

```
cd Backend
```
- Chạy backend
  ``` node db.js ```
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/7fc3f28e-1395-4e0f-8899-24a26c78826d)

- Chạy frontend
  Mở file index.html và ấn vào Go Live ![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/9b31100d-5fbf-41ba-b88e-a958ac0385d8)
## Kết quả
- Để xem api truy cập:
```http://localhost:4000/api-docs/#/```
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/f677204a-2c89-4a0f-bb6a-756086694612)
- giao diện:
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/b780420b-112a-4fd9-93b4-1ad681859e0c)
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/ccfa19b5-2c6d-4e42-86e9-17a2cb4f2722)
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/a4d8622c-e25d-43ce-bf4e-fcbb18a87ec2)
![image](https://github.com/khiemz1/IOT_dashBoard_B20DCPT110/assets/160468928/bafd63e3-49f8-42f0-8e43-068e4d323069)


