$(document).ready(function () {
  // Gửi yêu cầu GET đến API endpoint
  $.ajax({
    url: "http://localhost:4000/data_sensor/1", // Thay đổi đường dẫn này thành API endpoint của bạn
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Xử lý dữ liệu nhận được từ API
      var html = "";
      $.each(data, function (index, item) {
        html += "<tr>";
        html += "<td>" + item.id + "</td>";
        html += "<td>" + item.temperature + " °C</td>";
        html += "<td>" + item.humidity + " %</td>";
        html += "<td>" + item.light + " LUX</td>";
        html += "<td>" + formatDate(item.Date_time) + "</td>";
        html += "</tr>";
      });
      // Thêm HTML vào tbody của bảng
      $("#data-body").html(html);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
});

// Hàm chuyển đổi định dạng ngày giờ
function formatDate(dateString) {
  var date = new Date(dateString);

  // Trích xuất các thành phần của ngày giờ
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + date.getHours()).slice(-2);
  var minute = ("0" + date.getMinutes()).slice(-2);
  var second = ("0" + date.getSeconds()).slice(-2);

  // Tạo ra chuỗi định dạng mong muốn
  var formattedDate =
    hour + ":" + minute + ":" + second + " " + day + "-" + month + "-" + year;

  return formattedDate;
}
