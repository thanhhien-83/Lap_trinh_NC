# Hệ Thống Quản Lý Sinh Viên

Đây là bài tập lớn môn Lập trình nâng cao với đề tài xây dựng phần mềm quản lý sinh viên sử dụng cấu trúc mảng động và giao diện web bằng HTML, CSS, JavaScript.

Ứng dụng tập trung vào hai phần chính:

- Mô phỏng và áp dụng cấu trúc dữ liệu mảng động trong quản lý danh sách sinh viên.
- Triển khai các chức năng nghiệp vụ như thêm, sửa, xóa, tìm kiếm, sắp xếp, thống kê và xuất dữ liệu.

## Mục tiêu đề tài

- Xây dựng ứng dụng quản lý sinh viên có giao diện trực quan, dễ thao tác.
- Áp dụng cấu trúc dữ liệu mảng động thay cho cách lưu trữ đơn giản thông thường.
- Minh họa việc sử dụng các thuật toán sắp xếp, tìm kiếm và thống kê trong bài toán quản lý thực tế.
- Lưu trữ dữ liệu ngay trên trình duyệt bằng LocalStorage.

## Chức năng chính

- Thêm sinh viên mới với đầy đủ thông tin cá nhân, liên hệ và điểm số.
- Kiểm tra dữ liệu đầu vào và kiểm tra trùng mã sinh viên.
- Hiển thị danh sách sinh viên theo bảng, có phân trang.
- Tìm kiếm theo mã sinh viên, họ tên, lớp, giới tính và xếp loại.
- Sắp xếp danh sách theo nhiều tiêu chí bằng thuật toán QuickSort.
- Thống kê số lượng sinh viên theo xếp loại, giới tính, lớp và điểm trung bình.
- Hiển thị dashboard tổng quan và danh sách sinh viên thêm gần đây.
- Xuất dữ liệu sinh viên ra file JSON.
- Xuất báo cáo thống kê dạng TXT trực tiếp từ trình duyệt.
- Tự động nạp dữ liệu mẫu khi hệ thống chưa có dữ liệu.

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript thuần
- LocalStorage
- Font Awesome
- Google Fonts
- Chart.js

## Cấu trúc thư mục

```text
.
|-- index.html
|-- README.md
|-- css/
|   `-- styles.css
`-- js/
	|-- CauTrucMangDong.js
	|-- DieuKhienGiaoDien.js
	|-- MangDong.js
	|-- QuanLySinhVien.js
	|-- SinhVien.js
	|-- ThuatToanSapXep.js
	|-- ThuatToanThongKe.js
	|-- ThuatToanTimKiem.js
	`-- UngDung.js
```

## Kiến trúc mã nguồn

### 1. Tầng dữ liệu

- `MangDong.js`: cài đặt cấu trúc dữ liệu mảng động, hỗ trợ thêm, xóa, truy cập, nhân bản, sắp xếp và tìm kiếm.
- `SinhVien.js`: định nghĩa lớp đối tượng sinh viên, xử lý validate, tính điểm trung bình, xếp loại và chuẩn hóa dữ liệu hiển thị.

### 2. Tầng nghiệp vụ

- `QuanLySinhVien.js`: quản lý toàn bộ danh sách sinh viên, xử lý CRUD, tìm kiếm, sắp xếp, thống kê, lưu và tải dữ liệu từ LocalStorage.

### 3. Tầng thuật toán

- `ThuatToanSapXep.js`: cài đặt QuickSort, BubbleSort và hàm so sánh theo trường dữ liệu.
- `ThuatToanTimKiem.js`: cài đặt tìm kiếm tuần tự, tìm kiếm nhị phân và lọc theo nhiều điều kiện.
- `ThuatToanThongKe.js`: xử lý thống kê tổng hợp theo hướng duyệt một lần.
- `CauTrucMangDong.js`: mô tả lý thuyết, đặc điểm và độ phức tạp của mảng động.

### 4. Tầng giao diện

- `DieuKhienGiaoDien.js`: điều phối sự kiện người dùng, render bảng, dashboard, modal, tìm kiếm, phân trang và biểu đồ.
- `UngDung.js`: điểm khởi động ứng dụng, nạp dữ liệu mẫu và điều phối các module.
- `index.html`: bố cục giao diện chính.
- `css/styles.css`: định nghĩa giao diện và hiệu ứng hiển thị.

## Thuật toán và độ phức tạp

- Thêm sinh viên: trung bình $O(1)$ khi thêm vào cuối mảng, kết hợp kiểm tra trùng mã $O(n)$.
- Xóa sinh viên: $O(n)$ do cần dịch chuyển phần tử.
- Tìm kiếm tuyến tính: $O(n)$.
- Tìm kiếm nhị phân: $O(\log n)$ khi dữ liệu phù hợp điều kiện áp dụng.
- Sắp xếp QuickSort: trung bình $O(n \log n)$.
- Thống kê tổng hợp: $O(n)$ nhờ duyệt một lần.

## Cách chạy dự án

Vì đây là ứng dụng frontend thuần, bạn có thể chạy rất nhanh theo một trong hai cách:

### Cách 1: mở trực tiếp

- Mở file `index.html` bằng trình duyệt.

### Cách 2: dùng Live Server trong VS Code

- Mở thư mục dự án trong VS Code.
- Cài extension Live Server nếu cần.
- Chuột phải vào `index.html` và chọn Open with Live Server.

## Dữ liệu lưu trữ

- Dữ liệu sinh viên được lưu trong LocalStorage của trình duyệt.
- Khi tải lại trang, danh sách sinh viên vẫn được giữ nguyên.
- Nếu chưa có dữ liệu, hệ thống sẽ tự động nạp bộ dữ liệu mẫu.

## Một số màn hình/chức năng nổi bật

- Tổng quan hệ thống với các thẻ thống kê nhanh.
- Form thêm sinh viên chia theo nhóm thông tin rõ ràng.
- Danh sách sinh viên có phân trang và thao tác quản lý.
- Khu vực tìm kiếm nhiều điều kiện.
- Trang thống kê hỗ trợ trực quan hóa dữ liệu.

## Ý nghĩa học thuật của đề tài

Dự án không chỉ là một ứng dụng CRUD đơn giản mà còn nhấn mạnh phần triển khai cấu trúc dữ liệu và thuật toán trong bối cảnh thực tế. Đây là điểm chính của bài tập lớn: kết hợp giữa lý thuyết mảng động, kỹ thuật lập trình hướng đối tượng và xây dựng giao diện người dùng trực quan.

## Hướng phát triển

- Thêm chức năng nhập dữ liệu từ file CSV hoặc Excel.
- Kết nối backend và cơ sở dữ liệu để dùng nhiều thiết bị.
- Bổ sung phân quyền người dùng.
- Tối ưu thêm khả năng tìm kiếm và lọc nâng cao.
- Mở rộng báo cáo và chức năng in ấn.

## Tác giả

Bài tập lớn môn Lập trình nâng cao.