/**
 * ================================================================
 *  LỚP SINH VIÊN (Student Class)
 * ================================================================
 * 
 *  Mô hình hoá thông tin sinh viên với đầy đủ thuộc tính và phương thức.
 * 
 *  Thuộc tính:
 *    - id:        Mã sinh viên (duy nhất)
 *    - name:      Họ và tên
 *    - dob:       Ngày sinh (YYYY-MM-DD)
 *    - gender:    Giới tính (Nam / Nữ)
 *    - className: Lớp
 *    - email:     Email
 *    - phone:     Số điện thoại
 *    - address:   Địa chỉ
 *    - scores:    { math, literature, english }
 * 
 *  Thuật toán sử dụng:
 *    - Tính điểm TB:   → xem ThuatToanThongKe.js phần 1
 *    - Xếp loại:       → xem ThuatToanThongKe.js phần 2
 *    - Kiểm tra hợp lệ → thuật toán validation
 * ================================================================
 */

class Student {

    /**
     * Khởi tạo đối tượng sinh viên
     * @param {Object} duLieu — Dữ liệu sinh viên
     */
    constructor(duLieu = {}) {
        // Thông tin cá nhân
        this.id = duLieu.id || '';
        this.name = duLieu.name || '';
        this.dob = duLieu.dob || '';
        this.gender = duLieu.gender || '';
        this.className = duLieu.className || '';
        this.email = duLieu.email || '';
        this.phone = duLieu.phone || '';
        this.address = duLieu.address || '';

        // Điểm số các môn
        this.scores = {
            math: duLieu.scores?.math ?? null,           // Điểm Toán
            literature: duLieu.scores?.literature ?? null, // Điểm Văn
            english: duLieu.scores?.english ?? null        // Điểm Anh
        };

        // Thời gian
        this.createdAt = duLieu.createdAt || new Date().toISOString();
        this.updatedAt = duLieu.updatedAt || new Date().toISOString();
    }

    /* ============================================================
     *  TÍNH ĐIỂM TRUNG BÌNH (GPA)
     * ============================================================
     *  Công thức: Điểm TB = (Toán + Văn + Anh) / Số môn có điểm
     * 
     *  Thuật toán: Tính tổng → chia số lượng → làm tròn
     *  Xem chi tiết: ThuatToanThongKe.js → phần 1
     * 
     *  Độ phức tạp: O(1) — cố định 3 môn
     * ============================================================ */
    calculateGPA() {
        const { math, literature, english } = this.scores;

        // Lọc các môn có điểm hợp lệ
        const diemHopLe = [math, literature, english].filter(
            d => d !== null && !isNaN(d)
        );

        if (diemHopLe.length === 0) return null;

        // Tính tổng → chia số môn → làm tròn 2 chữ số
        const tong = diemHopLe.reduce((acc, diem) => acc + parseFloat(diem), 0);
        const diemTB = tong / diemHopLe.length;

        return Math.round(diemTB * 100) / 100;
    }

    /* ============================================================
     *  XẾP LOẠI HỌC LỰC
     * ============================================================
     *  Thuật toán phân loại dựa trên ngưỡng (threshold):
     *    ≥ 9.0  → Xuất sắc
     *    ≥ 8.0  → Giỏi
     *    ≥ 6.5  → Khá
     *    ≥ 5.0  → Trung bình
     *    < 5.0  → Yếu
     * 
     *  Xem chi tiết: ThuatToanThongKe.js → phần 2
     *  Độ phức tạp: O(1) — tối đa 5 phép so sánh
     * ============================================================ */
    getRank() {
        const gpa = this.calculateGPA();

        if (gpa === null) return 'Chưa xếp loại';
        if (gpa >= 9.0)   return 'Xuất sắc';
        if (gpa >= 8.0)   return 'Giỏi';
        if (gpa >= 6.5)   return 'Khá';
        if (gpa >= 5.0)   return 'Trung bình';
        return 'Yếu';
    }

    /**
     * Lấy CSS class cho hiển thị xếp loại (dùng trong giao diện)
     */
    getRankClass() {
        const xepLoai = this.getRank();
        switch (xepLoai) {
            case 'Xuất sắc':
            case 'Giỏi':       return 'rank-excellent';
            case 'Khá':        return 'rank-good';
            case 'Trung bình': return 'rank-average';
            case 'Yếu':        return 'rank-below-average';
            default:            return '';
        }
    }

    /* ============================================================
     *  CÁC PHƯƠNG THỨC HIỂN THỊ
     * ============================================================ */

    /** Định dạng ngày sinh: DD/MM/YYYY */
    getFormattedDob() {
        if (!this.dob) return '';
        const ngay = new Date(this.dob);
        const dd = String(ngay.getDate()).padStart(2, '0');
        const mm = String(ngay.getMonth() + 1).padStart(2, '0');
        const yyyy = ngay.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    /** Tính tuổi từ ngày sinh */
    getAge() {
        if (!this.dob) return null;
        const homNay = new Date();
        const ngaySinh = new Date(this.dob);
        let tuoi = homNay.getFullYear() - ngaySinh.getFullYear();
        const chenhThang = homNay.getMonth() - ngaySinh.getMonth();
        if (chenhThang < 0 || (chenhThang === 0 && homNay.getDate() < ngaySinh.getDate())) {
            tuoi--;
        }
        return tuoi;
    }

    /** Lấy chữ cái đầu tên (cho avatar) */
    getInitials() {
        if (!this.name) return '?';
        const phan = this.name.trim().split(' ');
        if (phan.length >= 2) {
            return (phan[0][0] + phan[phan.length - 1][0]).toUpperCase();
        }
        return phan[0][0].toUpperCase();
    }

    /** Lấy tên ngắn gọn */
    getShortName() {
        if (!this.name) return '';
        const phan = this.name.trim().split(' ');
        if (phan.length >= 2) {
            return phan[phan.length - 1] + ' ' + phan[0];
        }
        return phan[0];
    }

    /* ============================================================
     *  CẬP NHẬT THÔNG TIN
     * ============================================================ */
    update(duLieuMoi) {
        if (duLieuMoi.name !== undefined) this.name = duLieuMoi.name;
        if (duLieuMoi.dob !== undefined) this.dob = duLieuMoi.dob;
        if (duLieuMoi.gender !== undefined) this.gender = duLieuMoi.gender;
        if (duLieuMoi.className !== undefined) this.className = duLieuMoi.className;
        if (duLieuMoi.email !== undefined) this.email = duLieuMoi.email;
        if (duLieuMoi.phone !== undefined) this.phone = duLieuMoi.phone;
        if (duLieuMoi.address !== undefined) this.address = duLieuMoi.address;

        if (duLieuMoi.scores) {
            if (duLieuMoi.scores.math !== undefined) this.scores.math = duLieuMoi.scores.math;
            if (duLieuMoi.scores.literature !== undefined) this.scores.literature = duLieuMoi.scores.literature;
            if (duLieuMoi.scores.english !== undefined) this.scores.english = duLieuMoi.scores.english;
        }

        this.updatedAt = new Date().toISOString();
    }

    /* ============================================================
     *  KIỂM TRA DỮ LIỆU HỢP LỆ (Validation)
     * ============================================================
     *  Thuật toán kiểm tra tuần tự từng trường:
     *    1. Mã SV không rỗng
     *    2. Họ tên không rỗng
     *    3. Ngày sinh hợp lệ (không trong tương lai)
     *    4. Giới tính: Nam hoặc Nữ
     *    5. Lớp không rỗng
     *    6. Email hợp lệ (nếu có)
     *    7. Điểm số trong khoảng [0, 10]
     * 
     *  Độ phức tạp: O(1) — số trường cố định
     * ============================================================ */
    validate() {
        const loi = [];

        if (!this.id || this.id.trim() === '')
            loi.push('Mã sinh viên không được để trống');

        if (!this.name || this.name.trim() === '')
            loi.push('Họ và tên không được để trống');

        if (!this.dob) {
            loi.push('Ngày sinh không được để trống');
        } else {
            if (new Date(this.dob) > new Date())
                loi.push('Ngày sinh không hợp lệ');
        }

        if (!this.gender || !['Nam', 'Nữ'].includes(this.gender))
            loi.push('Giới tính không hợp lệ');

        if (!this.className || this.className.trim() === '')
            loi.push('Lớp không được để trống');

        if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
            loi.push('Email không hợp lệ');

        // Kiểm tra điểm số
        const kiemTraDiem = (diem, tenMon) => {
            if (diem !== null && diem !== undefined && diem !== '') {
                const giaTri = parseFloat(diem);
                if (isNaN(giaTri) || giaTri < 0 || giaTri > 10)
                    loi.push(`Điểm ${tenMon} phải từ 0 đến 10`);
            }
        };

        kiemTraDiem(this.scores.math, 'Toán');
        kiemTraDiem(this.scores.literature, 'Văn');
        kiemTraDiem(this.scores.english, 'Anh');

        return { valid: loi.length === 0, errors: loi };
    }

    /* ============================================================
     *  CHUYỂN ĐỔI DỮ LIỆU
     * ============================================================ */

    /** Chuyển sang object thuần (để lưu LocalStorage / xuất JSON) */
    toJSON() {
        return {
            id: this.id, name: this.name, dob: this.dob,
            gender: this.gender, className: this.className,
            email: this.email, phone: this.phone, address: this.address,
            scores: { ...this.scores },
            createdAt: this.createdAt, updatedAt: this.updatedAt
        };
    }

    /** Tạo đối tượng Student từ JSON */
    static fromJSON(json) {
        return new Student(json);
    }

    /** Nhân bản sinh viên */
    clone() {
        return new Student(this.toJSON());
    }

    /** So sánh 2 sinh viên (theo mã) */
    equals(sinhVienKhac) {
        return this.id === sinhVienKhac.id;
    }

    /** In thông tin (debug) */
    print() {
        console.log(`=== Sinh viên: ${this.id} ===`);
        console.log(`Họ tên: ${this.name} | Lớp: ${this.className}`);
        console.log(`Điểm: Toán=${this.scores.math}, Văn=${this.scores.literature}, Anh=${this.scores.english}`);
        console.log(`GPA: ${this.calculateGPA()} — Xếp loại: ${this.getRank()}`);
    }
}

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Student;
}
