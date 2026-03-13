/**
 * ================================================================
 *  LỚP QUẢN LÝ SINH VIÊN (Student Manager Class)
 * ================================================================
 * 
 *  Quản lý danh sách sinh viên sử dụng cấu trúc MẢNG ĐỘNG.
 *  Cung cấp các thao tác CRUD và tìm kiếm, sắp xếp, thống kê.
 * 
 *  Thuật toán sử dụng:
 *    - Sắp xếp:  → ThuatToanSapXep.js (QuickSort + hàm so sánh)
 *    - Tìm kiếm: → ThuatToanTimKiem.js (Linear Search + Filter)
 *    - Thống kê: → ThuatToanThongKe.js (Single-pass O(n))
 *    - Mảng:     → MangDong.js (cấu trúc dữ liệu chính)
 * ================================================================
 */

class StudentManager {

    /**
     * Khởi tạo bộ quản lý sinh viên
     */
    constructor() {
        // Sử dụng Mảng Động (MangDong.js) làm cấu trúc dữ liệu chính
        this.students = new DynamicArray(20);
        this.storageKey = 'students_data';

        // Tải dữ liệu đã lưu từ LocalStorage
        this.loadFromStorage();
    }

    /* ============================================================
     *  THÊM SINH VIÊN (Create) — O(n) do kiểm tra trùng lặp
     * ============================================================
     *  Bước 1: Validate dữ liệu → SinhVien.validate()
     *  Bước 2: Kiểm tra mã SV đã tồn tại chưa → Tìm kiếm tuần tự O(n)
     *          (xem ThuatToanTimKiem.js phần 1)
     *  Bước 3: Thêm vào mảng động → push() O(1) trung bình
     *  Bước 4: Lưu LocalStorage
     * ============================================================ */
    addStudent(student) {
        // Bước 1: Validate
        const validation = student.validate();
        if (!validation.valid) {
            return { success: false, message: validation.errors.join(', ') };
        }

        // Bước 2: Kiểm tra trùng mã — sử dụng tìm kiếm tuần tự O(n)
        const daTonTai = this.students.findIndex(sv => sv.id === student.id);
        if (daTonTai !== -1) {
            return { success: false, message: `Mã sinh viên "${student.id}" đã tồn tại!` };
        }

        // Bước 3: Thêm vào mảng động — O(1) trung bình
        this.students.push(student);

        // Bước 4: Lưu
        this.saveToStorage();

        return { success: true, message: `Đã thêm sinh viên "${student.name}" thành công!` };
    }

    /* ============================================================
     *  CẬP NHẬT SINH VIÊN (Update) — O(n)
     * ============================================================ */
    updateStudent(id, duLieu) {
        const viTri = this.students.findIndex(sv => sv.id === id);

        if (viTri === -1) {
            return { success: false, message: `Không tìm thấy sinh viên với mã "${id}"!` };
        }

        const sinhVien = this.students.get(viTri);
        sinhVien.update(duLieu);

        const validation = sinhVien.validate();
        if (!validation.valid) {
            return { success: false, message: validation.errors.join(', ') };
        }

        this.saveToStorage();
        return { success: true, message: `Đã cập nhật thông tin sinh viên "${sinhVien.name}" thành công!` };
    }

    /* ============================================================
     *  XOÁ SINH VIÊN (Delete) — O(n)
     * ============================================================
     *  Sử dụng removeAt() của mảng động → dịch phần tử O(n)
     *  Xem chi tiết: CauTrucMangDong.js phần 4
     * ============================================================ */
    deleteStudent(id) {
        const viTri = this.students.findIndex(sv => sv.id === id);

        if (viTri === -1) {
            return { success: false, message: `Không tìm thấy sinh viên với mã "${id}"!` };
        }

        const sinhVienDaXoa = this.students.removeAt(viTri);
        this.saveToStorage();

        return {
            success: true,
            message: `Đã xóa sinh viên "${sinhVienDaXoa.name}" thành công!`,
            student: sinhVienDaXoa
        };
    }

    /* ============================================================
     *  ĐỌC SINH VIÊN (Read) — O(n) / O(1)
     * ============================================================ */

    /** Lấy sinh viên theo mã — O(n) tìm kiếm tuần tự */
    getStudentById(id) {
        return this.students.find(sv => sv.id === id) || null;
    }

    /** Lấy tất cả sinh viên — O(n) */
    getAllStudents() {
        return this.students.toArray();
    }

    /** Lấy tổng số sinh viên — O(1) */
    getCount() {
        return this.students.size();
    }

    /* ============================================================
     *  TÌM KIẾM SINH VIÊN — O(n) Tìm kiếm tuần tự + Lọc
     * ============================================================
     *  Thuật toán: Duyệt tuần tự + lọc đa tiêu chí
     *  Chi tiết: ThuatToanTimKiem.js → phần 3, 4
     * 
     *  Các tiêu chí lọc:
     *    - keyword: từ khoá (tìm trong mã SV, tên, lớp)
     *    - field:   trường tìm kiếm (id / name / class / all)
     *    - rank:    xếp loại (Xuất sắc / Giỏi / Khá / TB / Yếu)
     *    - gender:  giới tính (Nam / Nữ)
     * ============================================================ */
    searchStudents(tieuChi = {}) {
        const { keyword, field, rank, gender } = tieuChi;

        // Sử dụng filter() của mảng động — O(n)
        let ketQua = this.students.filter(sinhVien => {

            // Lọc theo từ khoá — tìm kiếm tuần tự
            if (keyword && keyword.trim() !== '') {
                const tuKhoa = keyword.toLowerCase().trim();
                let trung = false;

                switch (field) {
                    case 'id':
                        trung = sinhVien.id.toLowerCase().includes(tuKhoa);
                        break;
                    case 'name':
                        trung = sinhVien.name.toLowerCase().includes(tuKhoa);
                        break;
                    case 'class':
                        trung = sinhVien.className.toLowerCase().includes(tuKhoa);
                        break;
                    default: // 'all' — tìm trên tất cả các trường
                        trung = sinhVien.id.toLowerCase().includes(tuKhoa) ||
                                sinhVien.name.toLowerCase().includes(tuKhoa) ||
                                sinhVien.className.toLowerCase().includes(tuKhoa);
                }

                if (!trung) return false;
            }

            // Lọc theo xếp loại
            if (rank && rank !== 'all') {
                if (sinhVien.getRank() !== rank) return false;
            }

            // Lọc theo giới tính
            if (gender && gender !== 'all') {
                if (sinhVien.gender !== gender) return false;
            }

            return true;
        });

        return ketQua.toArray();
    }

    /* ============================================================
     *  SẮP XẾP DANH SÁCH — O(n log n) QuickSort
     * ============================================================
     *  Sử dụng:
     *    - ThuatToanSapXep.taoHamSoSanh() → tạo bộ so sánh
     *    - DynamicArray.sort() → gọi QuickSort
     * 
     *  Chi tiết: ThuatToanSapXep.js → phần 1 (QuickSort), phần 3 (So sánh)
     * 
     *  Lưu ý: Clone mảng trước khi sắp xếp → không thay đổi mảng gốc
     *  Xem giải thích: CauTrucMangDong.js → phần 7 (Nhân bản)
     * ============================================================ */
    sortStudents(truong = 'id', thuTu = 'asc') {
        // Bước 1: Nhân bản mảng — O(n) — tránh thay đổi dữ liệu gốc
        const mangSapXep = this.students.clone();

        // Bước 2: Tạo hàm so sánh từ module ThuatToanSapXep
        const hamSoSanh = ThuatToanSapXep.taoHamSoSanh(truong, thuTu);

        // Bước 3: Sắp xếp bằng QuickSort — O(n log n)
        mangSapXep.sort(hamSoSanh);

        return mangSapXep.toArray();
    }

    /* ============================================================
     *  THỐNG KÊ TỔNG HỢP — O(n) Single-pass
     * ============================================================
     *  Thuật toán: Duyệt MỘT LẦN DUY NHẤT, cập nhật đồng thời:
     *    - Đếm theo xếp loại (phân loại)
     *    - Đếm theo giới tính
     *    - Đếm theo lớp + điểm TB theo lớp
     *    - Tìm max, min, trung bình
     * 
     *  Chi tiết: ThuatToanThongKe.js → phần 3 (Thống kê tổng hợp)
     * 
     *  Ưu điểm: Chỉ duyệt 1 lần nhưng lấy được tất cả thông tin
     *  Hiệu quả hơn nhiều so với duyệt riêng cho từng chỉ số.
     * ============================================================ */
    getStatistics() {
        const thongKe = {
            total: this.students.size(),
            byRank: {
                'Xuất sắc': 0, 'Giỏi': 0, 'Khá': 0,
                'Trung bình': 0, 'Yếu': 0, 'Chưa xếp loại': 0
            },
            byGender: { 'Nam': 0, 'Nữ': 0 },
            byClass: {},
            gpa: { sum: 0, count: 0, max: 0, min: 10, average: 0 }
        };

        // ─── DUYỆT MỘT LẦN DUY NHẤT — O(n) ─────────────────
        this.students.forEach(sinhVien => {
            const xepLoai = sinhVien.getRank();

            // Đếm theo xếp loại
            thongKe.byRank[xepLoai] = (thongKe.byRank[xepLoai] || 0) + 1;

            // Đếm theo giới tính
            thongKe.byGender[sinhVien.gender] = (thongKe.byGender[sinhVien.gender] || 0) + 1;

            // Đếm theo lớp + thống kê điểm per lớp
            if (!thongKe.byClass[sinhVien.className]) {
                thongKe.byClass[sinhVien.className] = {
                    count: 0, gpaSum: 0, gpaCount: 0,
                    ranks: { 'Xuất sắc': 0, 'Giỏi': 0, 'Khá': 0, 'Trung bình': 0, 'Yếu': 0 }
                };
            }
            thongKe.byClass[sinhVien.className].count++;
            thongKe.byClass[sinhVien.className].ranks[xepLoai]++;

            // Thống kê điểm
            const diemTB = sinhVien.calculateGPA();
            if (diemTB !== null) {
                thongKe.gpa.sum += diemTB;
                thongKe.gpa.count++;
                thongKe.gpa.max = Math.max(thongKe.gpa.max, diemTB);
                thongKe.gpa.min = Math.min(thongKe.gpa.min, diemTB);

                thongKe.byClass[sinhVien.className].gpaSum += diemTB;
                thongKe.byClass[sinhVien.className].gpaCount++;
            }
        });

        // Tính điểm trung bình chung
        if (thongKe.gpa.count > 0) {
            thongKe.gpa.average = Math.round((thongKe.gpa.sum / thongKe.gpa.count) * 100) / 100;
        } else {
            thongKe.gpa.min = 0;
        }

        // Tính điểm TB theo lớp
        for (const tenLop in thongKe.byClass) {
            const duLieuLop = thongKe.byClass[tenLop];
            duLieuLop.gpaAverage = duLieuLop.gpaCount > 0
                ? Math.round((duLieuLop.gpaSum / duLieuLop.gpaCount) * 100) / 100
                : 0;
        }

        return thongKe;
    }

    /* ============================================================
     *  SINH VIÊN GẦN ĐÂY — O(n log n)
     * ============================================================ */
    getRecentStudents(soLuong = 5) {
        const mangSapXep = this.students.clone();
        mangSapXep.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const ketQua = [];
        for (let i = 0; i < Math.min(soLuong, mangSapXep.size()); i++) {
            ketQua.push(mangSapXep.get(i));
        }
        return ketQua;
    }

    /* ============================================================
     *  LƯU / TẢI DỮ LIỆU (LocalStorage)
     * ============================================================ */

    /** Lưu vào LocalStorage */
    saveToStorage() {
        try {
            const duLieu = this.students.toArray().map(sv => sv.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(duLieu));
            console.log('[QuảnLýSV] Đã lưu dữ liệu vào LocalStorage');
        } catch (loi) {
            console.error('[QuảnLýSV] Lỗi khi lưu:', loi);
        }
    }

    /** Tải từ LocalStorage */
    loadFromStorage() {
        try {
            const duLieu = localStorage.getItem(this.storageKey);
            if (duLieu) {
                const danhSach = JSON.parse(duLieu);
                danhSach.forEach(sv => {
                    this.students.push(new Student(sv));
                });
                console.log(`[QuảnLýSV] Đã tải ${danhSach.length} sinh viên từ LocalStorage`);
            }
        } catch (loi) {
            console.error('[QuảnLýSV] Lỗi khi tải:', loi);
        }
    }

    /** Xuất ra JSON */
    exportToJSON() {
        const duLieu = this.students.toArray().map(sv => sv.toJSON());
        return JSON.stringify(duLieu, null, 2);
    }

    /** Nhập từ JSON */
    importFromJSON(chuoiJSON) {
        try {
            const duLieu = JSON.parse(chuoiJSON);

            if (!Array.isArray(duLieu)) {
                return { success: false, message: 'Dữ liệu không hợp lệ! Cần một mảng các sinh viên.', count: 0 };
            }

            let soNhap = 0;
            let dsLoi = [];

            duLieu.forEach((item, i) => {
                const sinhVien = new Student(item);
                const ketQua = this.addStudent(sinhVien);
                if (ketQua.success) soNhap++;
                else dsLoi.push(`Sinh viên #${i + 1}: ${ketQua.message}`);
            });

            if (soNhap > 0) {
                return {
                    success: true,
                    message: `Đã nhập ${soNhap}/${duLieu.length} sinh viên thành công!` +
                             (dsLoi.length > 0 ? `\nLỗi: ${dsLoi.join('; ')}` : ''),
                    count: soNhap
                };
            }
            return { success: false, message: 'Không thể nhập bất kỳ sinh viên nào! ' + dsLoi.join('; '), count: 0 };
        } catch (loi) {
            return { success: false, message: `Lỗi phân tích JSON: ${loi.message}`, count: 0 };
        }
    }

    /** Xoá tất cả dữ liệu */
    clearAll() {
        this.students.clear();
        localStorage.removeItem(this.storageKey);
        console.log('[QuảnLýSV] Đã xoá tất cả dữ liệu');
    }

    /* ============================================================
     *  DỮ LIỆU MẪU — 30 SINH VIÊN
     * ============================================================ */
    addSampleData() {
        const danhSachMau = [
            new Student({ id: 'SV001', name: 'Nguyễn Văn An', dob: '2003-05-15', gender: 'Nam', className: 'CNTT01', email: 'an.nv@student.edu.vn', phone: '0901234567', address: 'Hà Nội', scores: { math: 9.0, literature: 8.5, english: 9.0 } }),
            new Student({ id: 'SV002', name: 'Trần Thị Bình', dob: '2003-08-22', gender: 'Nữ', className: 'CNTT01', email: 'binh.tt@student.edu.vn', phone: '0912345678', address: 'Hải Phòng', scores: { math: 8.5, literature: 9.0, english: 8.0 } }),
            new Student({ id: 'SV003', name: 'Lê Hoàng Cường', dob: '2002-12-10', gender: 'Nam', className: 'CNTT02', email: 'cuong.lh@student.edu.vn', phone: '0923456789', address: 'Đà Nẵng', scores: { math: 7.5, literature: 7.0, english: 8.0 } }),
            new Student({ id: 'SV004', name: 'Phạm Thị Dung', dob: '2003-03-28', gender: 'Nữ', className: 'CNTT02', email: 'dung.pt@student.edu.vn', phone: '0934567890', address: 'TP.HCM', scores: { math: 9.5, literature: 9.0, english: 9.5 } }),
            new Student({ id: 'SV005', name: 'Hoàng Văn Em', dob: '2003-07-05', gender: 'Nam', className: 'CNTT01', email: 'em.hv@student.edu.vn', phone: '0945678901', address: 'Cần Thơ', scores: { math: 6.0, literature: 6.5, english: 5.5 } }),
            new Student({ id: 'SV006', name: 'Võ Thị Phương', dob: '2002-11-18', gender: 'Nữ', className: 'CNTT03', email: 'phuong.vt@student.edu.vn', phone: '0956789012', address: 'Huế', scores: { math: 8.0, literature: 8.5, english: 7.5 } }),
            new Student({ id: 'SV007', name: 'Đỗ Minh Quang', dob: '2003-01-30', gender: 'Nam', className: 'CNTT03', email: 'quang.dm@student.edu.vn', phone: '0967890123', address: 'Bình Dương', scores: { math: 5.0, literature: 4.5, english: 5.0 } }),
            new Student({ id: 'SV008', name: 'Bùi Thanh Hương', dob: '2003-09-12', gender: 'Nữ', className: 'CNTT01', email: 'huong.bt@student.edu.vn', phone: '0978901234', address: 'Nghệ An', scores: { math: 7.0, literature: 8.0, english: 7.0 } }),
            new Student({ id: 'SV009', name: 'Ngô Văn Kiên', dob: '2002-06-25', gender: 'Nam', className: 'CNTT02', email: 'kien.nv@student.edu.vn', phone: '0989012345', address: 'Quảng Ninh', scores: { math: 9.0, literature: 8.0, english: 8.5 } }),
            new Student({ id: 'SV010', name: 'Trịnh Thị Lan', dob: '2003-04-08', gender: 'Nữ', className: 'CNTT03', email: 'lan.tt@student.edu.vn', phone: '0990123456', address: 'Thanh Hóa', scores: { math: 6.5, literature: 7.0, english: 6.0 } }),
            new Student({ id: 'SV011', name: 'Đặng Văn Hùng', dob: '2002-02-14', gender: 'Nam', className: 'CNTT01', email: 'hung.dv@student.edu.vn', phone: '0901112233', address: 'Hà Nội', scores: { math: 8.0, literature: 7.5, english: 8.5 } }),
            new Student({ id: 'SV012', name: 'Lý Thị Mai', dob: '2003-06-20', gender: 'Nữ', className: 'CNTT02', email: 'mai.lt@student.edu.vn', phone: '0912223344', address: 'Bắc Ninh', scores: { math: 9.0, literature: 9.5, english: 9.0 } }),
            new Student({ id: 'SV013', name: 'Phan Quốc Tuấn', dob: '2002-10-03', gender: 'Nam', className: 'CNTT03', email: 'tuan.pq@student.edu.vn', phone: '0923334455', address: 'Vĩnh Phúc', scores: { math: 4.5, literature: 5.0, english: 4.0 } }),
            new Student({ id: 'SV014', name: 'Nguyễn Thị Hồng', dob: '2003-01-17', gender: 'Nữ', className: 'CNTT01', email: 'hong.nt@student.edu.vn', phone: '0934445566', address: 'Nam Định', scores: { math: 7.5, literature: 8.0, english: 7.0 } }),
            new Student({ id: 'SV015', name: 'Vũ Đình Toàn', dob: '2002-09-08', gender: 'Nam', className: 'CNTT02', email: 'toan.vd@student.edu.vn', phone: '0945556677', address: 'Hải Dương', scores: { math: 6.0, literature: 5.5, english: 6.5 } }),
            new Student({ id: 'SV016', name: 'Hoàng Thị Ngọc', dob: '2003-11-25', gender: 'Nữ', className: 'CNTT03', email: 'ngoc.ht@student.edu.vn', phone: '0956667788', address: 'Thái Bình', scores: { math: 8.5, literature: 9.0, english: 8.0 } }),
            new Student({ id: 'SV017', name: 'Trương Công Minh', dob: '2002-04-12', gender: 'Nam', className: 'CNTT01', email: 'minh.tc@student.edu.vn', phone: '0967778899', address: 'Lào Cai', scores: { math: 3.5, literature: 4.0, english: 3.0 } }),
            new Student({ id: 'SV018', name: 'Lê Thị Thanh Tâm', dob: '2003-07-30', gender: 'Nữ', className: 'CNTT02', email: 'tam.ltt@student.edu.vn', phone: '0978889900', address: 'Ninh Bình', scores: { math: 7.0, literature: 7.5, english: 8.0 } }),
            new Student({ id: 'SV019', name: 'Cao Văn Đức', dob: '2002-08-19', gender: 'Nam', className: 'CNTT03', email: 'duc.cv@student.edu.vn', phone: '0989990011', address: 'Phú Thọ', scores: { math: 9.5, literature: 8.5, english: 9.0 } }),
            new Student({ id: 'SV020', name: 'Mai Thị Hạnh', dob: '2003-02-05', gender: 'Nữ', className: 'CNTT01', email: 'hanh.mt@student.edu.vn', phone: '0990001122', address: 'Hưng Yên', scores: { math: 5.5, literature: 6.0, english: 5.0 } }),
            new Student({ id: 'SV021', name: 'Đinh Trọng Nghĩa', dob: '2002-12-28', gender: 'Nam', className: 'CNTT02', email: 'nghia.dt@student.edu.vn', phone: '0901223344', address: 'Bắc Giang', scores: { math: 8.0, literature: 8.5, english: 9.0 } }),
            new Student({ id: 'SV022', name: 'Tạ Thị Kim Oanh', dob: '2003-05-09', gender: 'Nữ', className: 'CNTT03', email: 'oanh.ttk@student.edu.vn', phone: '0912334455', address: 'Quảng Bình', scores: { math: 7.0, literature: 6.5, english: 7.5 } }),
            new Student({ id: 'SV023', name: 'Hà Sỹ Phú', dob: '2002-03-16', gender: 'Nam', className: 'CNTT01', email: 'phu.hs@student.edu.vn', phone: '0923445566', address: 'Sơn La', scores: { math: 10.0, literature: 9.5, english: 9.5 } }),
            new Student({ id: 'SV024', name: 'Dương Thị Quyên', dob: '2003-10-22', gender: 'Nữ', className: 'CNTT02', email: 'quyen.dt@student.edu.vn', phone: '0934556677', address: 'Lạng Sơn', scores: { math: 6.5, literature: 7.0, english: 6.0 } }),
            new Student({ id: 'SV025', name: 'Lương Văn Sơn', dob: '2002-07-07', gender: 'Nam', className: 'CNTT03', email: 'son.lv@student.edu.vn', phone: '0945667788', address: 'Tuyên Quang', scores: { math: 5.0, literature: 5.5, english: 4.5 } }),
            new Student({ id: 'SV026', name: 'Nguyễn Thị Thảo', dob: '2003-09-14', gender: 'Nữ', className: 'CNTT01', email: 'thao.nt@student.edu.vn', phone: '0956778899', address: 'Thái Nguyên', scores: { math: 8.5, literature: 8.0, english: 8.5 } }),
            new Student({ id: 'SV027', name: 'Trần Đại Uy', dob: '2002-01-23', gender: 'Nam', className: 'CNTT02', email: 'uy.td@student.edu.vn', phone: '0967889900', address: 'Yên Bái', scores: { math: 4.0, literature: 3.5, english: 4.5 } }),
            new Student({ id: 'SV028', name: 'Phạm Thị Vân', dob: '2003-04-18', gender: 'Nữ', className: 'CNTT03', email: 'van.pt@student.edu.vn', phone: '0978990011', address: 'Hà Tĩnh', scores: { math: 9.0, literature: 8.5, english: 9.5 } }),
            new Student({ id: 'SV029', name: 'Bùi Xuân Đạt', dob: '2002-11-01', gender: 'Nam', className: 'CNTT01', email: 'dat.bx@student.edu.vn', phone: '0989001122', address: 'Điện Biên', scores: { math: 7.5, literature: 7.0, english: 6.5 } }),
            new Student({ id: 'SV030', name: 'Đỗ Thị Yến', dob: '2003-08-06', gender: 'Nữ', className: 'CNTT02', email: 'yen.dt@student.edu.vn', phone: '0990112233', address: 'Kon Tum', scores: { math: 6.0, literature: 6.5, english: 7.0 } })
        ];

        let soThem = 0;
        danhSachMau.forEach(sv => {
            if (this.addStudent(sv).success) soThem++;
        });

        return { success: true, message: `Đã thêm ${soThem} sinh viên mẫu!` };
    }
}

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudentManager;
}
