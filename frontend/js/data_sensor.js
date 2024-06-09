let totalPage = 0;
let page = 1;
let link = "http://localhost:4000/data_sensor/";
let searchToken = 0;
let type;
let type2;
let value;
let order = "default";
$(document).ready(function () {
  getData();
  $(".search input").keypress(function (event) {
    link = "http://localhost:4000/data_sensor/";
    page = 1;
    // Kiểm tra xem phím được ấn có phải là Enter không (mã ASCII của phím Enter là 13)
    var search = document.getElementById("search_input").value;
    var selectElement = document.getElementById("type");
    var selectedIndex = selectElement.selectedIndex;
    var selectedOptionName =
      selectElement.options[selectedIndex].getAttribute("name");
    if (event.which === 13) {
      if (search === "") {
        alert("Hãy nhập thông tin bạn muốn tìm kiếm");
        return;
      } else if (
        selectedOptionName === "light" ||
        selectedOptionName === "humidity"
      ) {
        // Kiểm tra nếu search không phải là số nguyên
        if (!Number.isInteger(parseInt(search))) {
          alert("Cường độ sáng và độ ẩm phải là số nguyên");
          return;
        }
      } else if (selectedOptionName === "temperature") {
        // Kiểm tra nếu search không phải là số chứa dấu thập phân
        if (!/^\d*\.?\d*$/.test(search)) {
          alert("Nhiệt độ không được chứa kí tự chữ cái!!!");
          return;
        }
      } else if (selectedOptionName === "day") {
        // Kiểm tra định dạng ngày tháng
        var dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
        if (!dateRegex.test(search)) {
          alert("Search phải theo định dạng ngày-tháng-năm (dd-mm-yyyy)");
          return;
        } else {
          var parts = search.split("-");
          var day = parseInt(parts[0]);
          var month = parseInt(parts[1]);
          var year = parseInt(parts[2]);

          if (
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1000 ||
            year > 2024
          ) {
            alert("Ngày tháng năm không hợp lệ");
            return;
          } else {
            var formattedDate = moment(search, "DD-MM-YYYY", true).format(
              "YYYY-MM-DD"
            );
            if (
              !formattedDate ||
              !moment(formattedDate, "YYYY-MM-DD", true).isValid()
            ) {
              alert("Định dạng ngày không hợp lệ");
              return;
            } else {
              search = formattedDate;
              console.log(search);
            }
          }
        }
      } else if (selectedOptionName === "hour") {
        // Kiểm tra định dạng giờ
        if (!/^\d{1,2}$/.test(search) || parseInt(search) > 24) {
          alert("Search phải là số từ 0 đến 24");
          return;
        }
      } else if (selectedOptionName === "") {
        alert("Hãy chọn một trường dữ liệu bạn muốn tìm");
        return;
      }
      searchToken = 1;
      type = selectedOptionName;
      value = search;
      link += "search/" + type + "/" + value + "/";
      console.log(link);
      getData();
    }
  });
});

// Hàm sort
function sort(sort_type) {
  console.log(sort_type);
  var order_default = 0;
  if (order === "default") {
    order = "up";
  } else if (order === "up") {
    order = "down";
  } else {
    sort_type = "ID";
    order = "down";
    order_default = 1;
  }
  if (searchToken === 0) {
    link = "http://localhost:4000/data_sensor/";
    link += "order/" + sort_type + "/" + order + "/";
    page = 1;
    getData();
  } else if (searchToken === 1) {
    link = "http://localhost:4000/data_sensor/";
    link += "search/" + type + "/" + value + "/";
    link += sort_type + "/" + order + "/";
    page = 1;
    getData();
  }
  if (order_default === 1) {
    order = "default";
    order_default === 0;
  }
}
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

// Gọi api
function getData() {
  // Gửi yêu cầu GET đến API endpoint
  $.ajax({
    url: link + page, // Thay đổi đường dẫn này thành API endpoint của bạn
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Xử lý dữ liệu nhận được từ API
      var html = "";
      $.each(data.results, function (index, item) {
        html += "<tr>";
        html += "<td>" + item.id + "</td>";
        html += "<td>" + item.temperature + " °C</td>";
        html += "<td>" + item.humidity + " %</td>";
        html += "<td>" + item.light + " LUX</td>";
        html += "<td>" + item.windSpeed + " m/s</td>";
        html += "<td>" + formatDate(item.Date_time) + "</td>";
        html += "</tr>";
      });
      $("#data-head").html(
        `<tr>
        <td>
          ID
          <button onclick="sort('ID')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
        <td>
          Nhiệt độ
          <button onclick="sort('temperature')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
        <td>
          Độ ẩm
          <button onclick="sort('humidity')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
        <td>
          Cường độ sáng
          <button onclick="sort('light')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
        <td>
          Tốc độ gió
          <button onclick="sort('windspeed')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
        <td>
          Ngày - Giờ
          <button onclick="sort('Date_time')">
            <img class="sort_img" src="img/sort.png" />
          </button>
        </td>
      </tr>`
      );
      // Thêm HTML vào tbody của bảng
      $("#data-body").html(html);
      totalPage = data.totalPages;
      renderPagination();
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        $("#data-head").html(
          "<tr><td colspan='5'>Không tồn tại dữ liệu</td></tr>"
        );
        $("#data-body").html("");
        totalPage = 0;
        page = 0;
        renderPagination();
      } else {
        console.error("Error:", error);
      }
    },
  });
}

// Hàm phân trang
function renderPagination() {
  var paginationHtml = "";
  if (totalPage === 0) {
    link = "http://localhost:4000/data_sensor/";
    paginationHtml +=
      '<button onclick="changePage(' + 1 + ')">' + "Trở về" + "</button>";
  } else if (totalPage < 5) {
    for (var i = 1; i <= totalPage; i++) {
      if (i === page) {
        paginationHtml +=
          '<button style="background-color: blue;" onclick="changePage(' +
          i +
          ')">' +
          i +
          "</button>";
      } else {
        paginationHtml +=
          '<button onclick="changePage(' + i + ')">' + i + "</button>";
      }
    }
  } else if (totalPage >= 5) {
    if (page >= 5) {
      paginationHtml +=
        '<button onclick="changePage(' + 1 + ')">' + 1 + "</button>";
      paginationHtml += "<button>... </button>";
    }
    for (var i = 1; i <= totalPage; i++) {
      if (page <= 3 && i <= 5) {
        if (i === page) {
          paginationHtml +=
            '<button style="background-color: blue;" onclick="changePage(' +
            i +
            ')">' +
            i +
            "</button>";
        } else {
          paginationHtml +=
            '<button onclick="changePage(' + i + ')">' + i + "</button>";
        }
      } else if (i > page - 3 && i < page + 3) {
        if (i === page) {
          paginationHtml +=
            '<button style="background-color: blue;" onclick="changePage(' +
            i +
            ')">' +
            i +
            "</button>";
        } else {
          paginationHtml +=
            '<button onclick="changePage(' + i + ')">' + i + "</button>";
        }
      }
    }
    if (page <= totalPage - 4) {
      paginationHtml += "<button>... </button>";
      paginationHtml +=
        '<button onclick="changePage(' +
        totalPage +
        ')">' +
        totalPage +
        "</button>";
    }
  }

  $("#pagination").html(paginationHtml);
}

// Hàm thay đổi trang
function changePage(pageNumber) {
  if (totalPage === 0) {
    page = pageNumber; // Cập nhật giá trị trang hiện tại
    getData(); // Gọi hàm getData với trang mới
  }
  if (pageNumber >= 1 && pageNumber <= totalPage) {
    page = pageNumber; // Cập nhật giá trị trang hiện tại
    getData(); // Gọi hàm getData với trang mới
    console.log(pageNumber);
  }
}

function refresh() {
  link = "http://localhost:4000/data_sensor/";
  page = 1;
  getData();
}

// setInterval(refresh, 5000);
