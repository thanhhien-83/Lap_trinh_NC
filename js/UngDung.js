/**
 * ================================================================
 *  ỨNG DỤNG CHÍNH (Application Entry Point)
 * ================================================================
 * 
 *  Hệ thống Quản lý Sinh viên
 *  Bài Tập Lớn — Lập trình nâng cao
 * 
 *  Đề tài: "Xây dựng phần mềm quản lý sinh viên sử dụng
 *           cấu trúc mảng động và giao diện đồ họa"
 * 
 *  Danh sách các file thuật toán:
 *    1. CauTrucMangDong.js   — Lý thuyết mảng động
 *    2. ThuatToanSapXep.js   — QuickSort, BubbleSort, so sánh
 *    3. ThuatToanTimKiem.js  — Linear Search, Binary Search, Filter
 *    4. ThuatToanThongKe.js  — GPA, xếp loại, thống kê tổng hợp
 * 
 *  Danh sách các file chức năng:
 *    5. MangDong.js           — Lớp DynamicArray (cấu trúc dữ liệu)
 *    6. SinhVien.js           — Lớp Student (đối tượng sinh viên)
 *    7. QuanLySinhVien.js     — Lớp StudentManager (CRUD + nghiệp vụ)
 *    8. DieuKhienGiaoDien.js  — Lớp UIController (giao diện)
 *    9. UngDung.js            — File này (điểm khởi đầu)
 * ================================================================
 */

// Biến toàn cục
let app = null;

/**
 * Lớp Application — Điểm khởi đầu ứng dụng
 */
class Application {

    constructor() {
        // Khởi tạo các module
        this.manager = new StudentManager();
        this.ui = new UIController(this.manager);

        console.log('═══════════════════════════════════════');
        console.log('  HỆ THỐNG QUẢN LÝ SINH VIÊN');
        console.log('  BTL Lập trình nâng cao');
        console.log('═══════════════════════════════════════');
        console.log('  Các thuật toán đã tải:');
        console.log('  ✓ ThuatToanSapXep  (QuickSort)');
        console.log('  ✓ ThuatToanTimKiem (Binary Search)');
        console.log('  ✓ ThuatToanThongKe (Thống kê)');
        console.log('  ✓ CauTrucMangDong  (Lý thuyết)');
        console.log('═══════════════════════════════════════');
    }

    /**
     * Khởi động ứng dụng
     */
    start() {
        // Khởi tạo giao diện
        this.ui.init();

        // Nếu chưa có dữ liệu → tải 30 sinh viên mẫu
        if (this.manager.getCount() === 0) {
            this.loadSampleData();
        }

        console.log(`[UngDung] Ứng dụng đã khởi động! Số sinh viên: ${this.manager.getCount()}`);
    }

    /**
     * Tải dữ liệu mẫu 30 sinh viên
     */
    loadSampleData() {
        const ketQua = this.manager.addSampleData();
        if (ketQua.success) {
            this.ui.showToast('Đã tải dữ liệu mẫu: 30 sinh viên', 'info');
            this.ui.updateHeader();
            this.ui.updateDashboard();
        }
    }

    /**
     * Reset toàn bộ dữ liệu
     */
    resetAllData() {
        if (confirm('Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu?')) {
            this.manager.clearAll();
            this.ui.updateHeader();
            this.ui.updateDashboard();
            this.ui.renderStudentTable();
            this.ui.showToast('Đã xóa tất cả dữ liệu!', 'warning');
        }
    }

    /**
     * Xuất báo cáo thống kê
     */
    exportReport() {
        const thongKe = this.manager.getStatistics();
        const danhSach = this.manager.getAllStudents();

        let baoCao = `
╔═══════════════════════════════════════════════════════════════╗
║           BÁO CÁO THỐNG KÊ SINH VIÊN                          ║
║           Ngày: ${new Date().toLocaleDateString('vi-VN')}                                  ║
╚═══════════════════════════════════════════════════════════════╝

1. TỔNG QUAN
   - Tổng số sinh viên: ${thongKe.total}
   - Điểm trung bình chung: ${thongKe.gpa.average.toFixed(2)}
   - Điểm cao nhất: ${thongKe.gpa.max.toFixed(2)}
   - Điểm thấp nhất: ${thongKe.gpa.min.toFixed(2)}

2. PHÂN BỐ XẾP LOẠI
   - Xuất sắc: ${thongKe.byRank['Xuất sắc'] || 0} sinh viên
   - Giỏi: ${thongKe.byRank['Giỏi'] || 0} sinh viên
   - Khá: ${thongKe.byRank['Khá'] || 0} sinh viên
   - Trung bình: ${thongKe.byRank['Trung bình'] || 0} sinh viên
   - Yếu: ${thongKe.byRank['Yếu'] || 0} sinh viên

3. THỐNG KÊ THEO GIỚI TÍNH
   - Nam: ${thongKe.byGender['Nam'] || 0} sinh viên
   - Nữ: ${thongKe.byGender['Nữ'] || 0} sinh viên

4. THỐNG KÊ THEO LỚP
`;

        for (const tenLop in thongKe.byClass) {
            const d = thongKe.byClass[tenLop];
            baoCao += `
   ${tenLop}:
   - Số lượng: ${d.count}
   - Điểm TB: ${d.gpaAverage.toFixed(2)}
   - Xuất sắc/Giỏi/Khá/TB/Yếu: ${d.ranks['Xuất sắc'] || 0}/${d.ranks['Giỏi'] || 0}/${d.ranks['Khá'] || 0}/${d.ranks['Trung bình'] || 0}/${d.ranks['Yếu'] || 0}
`;
        }

        baoCao += `
5. DANH SÁCH SINH VIÊN
╔══════╦════════════════════════════╦════════╦══════════╦═══════════╗
║ Mã SV║ Họ và tên                  ║ Lớp    ║ Điểm TB  ║ Xếp loại  ║
╠══════╬════════════════════════════╬════════╬══════════╬═══════════╣
`;

        danhSach.forEach(sv => {
            const gpa = sv.calculateGPA();
            const rank = sv.getRank();
            baoCao += `║ ${sv.id.padEnd(4)} ║ ${sv.name.padEnd(26)} ║ ${sv.className.padEnd(6)} ║ ${(gpa !== null ? gpa.toFixed(2) : 'N/A').padStart(8)} ║ ${rank.padEnd(9)} ║\n`;
        });

        baoCao += `╚══════╩════════════════════════════╩════════╩══════════╩═══════════╝

═══════════════════════════════════════════════════════════════════
                         KẾT THÚC BÁO CÁO
═══════════════════════════════════════════════════════════════════
`;

        // Tải file báo cáo
        const blob = new Blob([baoCao], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bao_cao_sinh_vien_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.ui.showToast('Đã xuất báo cáo thành công!', 'success');
    }
}

/**
 * Khởi tạo ứng dụng khi DOM sẵn sàng
 */
document.addEventListener('DOMContentLoaded', () => {
    app = new Application();
    app.start();
});

// Truy cập từ console
window.app = app;

/** Hàm debug */
function debug() {
    console.log('=== Thông tin Debug ===');
    console.log('Tổng sinh viên:', app.manager.getCount());
    console.log('Danh sách:', app.manager.getAllStudents());
    console.log('Thống kê:', app.manager.getStatistics());
}
