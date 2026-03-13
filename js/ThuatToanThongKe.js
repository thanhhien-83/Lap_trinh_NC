/**
 * ================================================================
 *  THUẬT TOÁN THỐNG KÊ (Statistics Algorithms)
 * ================================================================
 * 
 *  File này chứa các thuật toán thống kê và tính toán được sử dụng
 *  trong hệ thống quản lý sinh viên.
 * 
 *  Các thuật toán có trong file:
 *    1. Tính điểm trung bình (GPA)
 *    2. Xếp loại học lực
 *    3. Thống kê tổng hợp (min, max, trung bình, phân loại)
 *    4. Đếm và phân nhóm
 * ================================================================
 */

const ThuatToanThongKe = {

    /* ============================================================
     *  1. TÍNH ĐIỂM TRUNG BÌNH (GPA Calculation)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Cộng tất cả các điểm thành phần.
     *    - Chia cho số lượng môn → ra điểm trung bình.
     * 
     *  Công thức:
     *    Điểm TB = (Toán + Lý + Hoá) / 3
     * 
     *  Độ phức tạp: O(1) — chỉ tính trên 3 giá trị cố định
     * ============================================================ */

    /**
     * Tính điểm trung bình của một sinh viên
     * 
     * @param {Object} sinhVien — Đối tượng sinh viên có các trường: math, physics, chemistry
     * @returns {number} Điểm trung bình làm tròn 2 chữ số thập phân
     * 
     * Ví dụ:
     *   const diemTB = ThuatToanThongKe.tinhDiemTrungBinh(sv);
     *   // sv.math = 8, sv.physics = 7, sv.chemistry = 9
     *   // → diemTB = 8.00
     */
    tinhDiemTrungBinh(sinhVien) {
        const toan = sinhVien.math || 0;
        const ly   = sinhVien.physics || 0;
        const hoa  = sinhVien.chemistry || 0;

        // Tính trung bình cộng
        const diemTB = (toan + ly + hoa) / 3;

        // Làm tròn 2 chữ số thập phân
        return Math.round(diemTB * 100) / 100;
    },

    /* ============================================================
     *  2. XẾP LOẠI HỌC LỰC (Academic Ranking)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Dùng cấu trúc rẽ nhánh (if-else) để xếp loại dựa trên GPA:
     *        + GPA >= 9.0  → Xuất sắc
     *        + GPA >= 8.0  → Giỏi
     *        + GPA >= 6.5  → Khá
     *        + GPA >= 5.0  → Trung bình
     *        + GPA  < 5.0  → Yếu
     * 
     *  Thuật toán:
     *    → Đây là thuật toán phân loại đơn giản dựa trên ngưỡng (threshold).
     *    → Các ngưỡng được sắp xếp giảm dần để tối ưu:
     *       kiểm tra điều kiện cao nhất trước.
     * 
     *  Độ phức tạp: O(1) — tối đa 5 phép so sánh
     * ============================================================ */

    /**
     * Xếp loại học lực dựa trên điểm trung bình
     * 
     * @param {number} diemTB — Điểm trung bình (0 → 10)
     * @returns {Object} { xepLoai: string, mauSac: string }
     * 
     * Ví dụ:
     *   const kq = ThuatToanThongKe.xepLoaiHocLuc(8.5);
     *   // → { xepLoai: 'Giỏi', mauSac: 'good' }
     */
    xepLoaiHocLuc(diemTB) {
        if (diemTB >= 9.0) {
            return { xepLoai: 'Xuất sắc', mauSac: 'excellent' };
        } else if (diemTB >= 8.0) {
            return { xepLoai: 'Giỏi', mauSac: 'good' };
        } else if (diemTB >= 6.5) {
            return { xepLoai: 'Khá', mauSac: 'average' };
        } else if (diemTB >= 5.0) {
            return { xepLoai: 'Trung bình', mauSac: 'below-average' };
        } else {
            return { xepLoai: 'Yếu', mauSac: 'weak' };
        }
    },

    /* ============================================================
     *  3. THỐNG KÊ TỔNG HỢP (Aggregate Statistics)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Duyệt mảng sinh viên MỘT LẦN DUY NHẤT (single pass).
     *    - Trong mỗi bước, cập nhật đồng thời:
     *        + Tổng điểm (để tính trung bình)
     *        + Điểm cao nhất (max)
     *        + Điểm thấp nhất (min)
     *        + Đếm số lượng mỗi xếp loại
     *        + Đếm số lượng mỗi lớp
     * 
     *  Độ phức tạp:
     *    - Thời gian: O(n)  — duyệt mảng 1 lần
     *    - Bộ nhớ:    O(k)  — với k = số nhóm phân loại (rất nhỏ)
     * 
     *  Ưu điểm:
     *    → Chỉ duyệt 1 lần nhưng thu thập được nhiều thông tin.
     *    → Hiệu quả hơn so với duyệt nhiều lần (1 lần cho max,
     *      1 lần cho min, 1 lần cho trung bình…).
     * ============================================================ */

    /**
     * Thống kê tổng hợp toàn bộ danh sách sinh viên
     * 
     * @param {Array} danhSach — Mảng các đối tượng Student
     * @returns {Object} Kết quả thống kê chi tiết
     * 
     * Kết quả trả về gồm:
     *   - tongSoSV:        Tổng số sinh viên
     *   - diemTBChung:     Điểm trung bình cả lớp
     *   - diemCaoNhat:     Điểm cao nhất
     *   - diemThapNhat:    Điểm thấp nhất
     *   - svDiemCaoNhat:   Sinh viên có điểm cao nhất
     *   - svDiemThapNhat:  Sinh viên có điểm thấp nhất
     *   - phanLoai:        { xuatSac, gioi, kha, trungBinh, yeu }
     *   - theoLop:         { "CNTT01": 10, "CNTT02": 12, ... }
     */
    thongKeTongHop(danhSach) {
        // Khởi tạo các biến thống kê
        const ketQua = {
            tongSoSV: danhSach.length,
            diemTBChung: 0,
            diemCaoNhat: -Infinity,
            diemThapNhat: Infinity,
            svDiemCaoNhat: null,
            svDiemThapNhat: null,

            // Đếm theo xếp loại
            phanLoai: {
                xuatSac: 0,     // >= 9.0
                gioi: 0,        // >= 8.0
                kha: 0,         // >= 6.5
                trungBinh: 0,   // >= 5.0
                yeu: 0          //  < 5.0
            },

            // Đếm theo lớp
            theoLop: {}
        };

        // Nếu danh sách rỗng → trả ngay
        if (danhSach.length === 0) {
            ketQua.diemCaoNhat = 0;
            ketQua.diemThapNhat = 0;
            return ketQua;
        }

        // ─── DUYỆT MỘT LẦN DUY NHẤT ─────────────────────────
        let tongDiem = 0;

        for (let i = 0; i < danhSach.length; i++) {
            const sv = danhSach[i];
            const diemTB = sv.calculateGPA ? sv.calculateGPA() : this.tinhDiemTrungBinh(sv);

            // Cộng dồn tổng điểm (để tính trung bình sau)
            tongDiem += diemTB;

            // Cập nhật điểm cao nhất
            if (diemTB > ketQua.diemCaoNhat) {
                ketQua.diemCaoNhat = diemTB;
                ketQua.svDiemCaoNhat = sv;
            }

            // Cập nhật điểm thấp nhất
            if (diemTB < ketQua.diemThapNhat) {
                ketQua.diemThapNhat = diemTB;
                ketQua.svDiemThapNhat = sv;
            }

            // Phân loại theo học lực
            if (diemTB >= 9.0)      ketQua.phanLoai.xuatSac++;
            else if (diemTB >= 8.0) ketQua.phanLoai.gioi++;
            else if (diemTB >= 6.5) ketQua.phanLoai.kha++;
            else if (diemTB >= 5.0) ketQua.phanLoai.trungBinh++;
            else                     ketQua.phanLoai.yeu++;

            // Đếm theo lớp
            const tenLop = sv.className || 'Không xác định';
            if (!ketQua.theoLop[tenLop]) {
                ketQua.theoLop[tenLop] = 0;
            }
            ketQua.theoLop[tenLop]++;
        }

        // Tính điểm trung bình chung
        ketQua.diemTBChung = Math.round((tongDiem / danhSach.length) * 100) / 100;

        // Làm tròn điểm cao nhất / thấp nhất
        ketQua.diemCaoNhat = Math.round(ketQua.diemCaoNhat * 100) / 100;
        ketQua.diemThapNhat = Math.round(ketQua.diemThapNhat * 100) / 100;

        return ketQua;
    },

    /* ============================================================
     *  4. ĐẾM VÀ PHÂN NHÓM (Counting & Grouping)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Sử dụng bảng băm (hash map / object) để đếm.
     *    - Duyệt mảng, với mỗi phần tử → tăng bộ đếm tương ứng.
     * 
     *  Đây là biến thể của thuật toán "Counting Sort" phần đếm,
     *  ứng dụng trong thống kê phân nhóm.
     * 
     *  Độ phức tạp:
     *    - Thời gian: O(n)
     *    - Bộ nhớ:    O(k) với k = số nhóm
     * ============================================================ */

    /**
     * Đếm số phần tử theo nhóm
     * 
     * @param {Array}    mang      — Mảng dữ liệu
     * @param {Function} layNhom   — Hàm lấy tên nhóm từ phần tử: (phần_tử) → chuỗi
     * @returns {Object} { "NhómA": 5, "NhómB": 3, ... }
     * 
     * Ví dụ:
     *   // Đếm số sinh viên theo lớp
     *   const theoLop = ThuatToanThongKe.demTheoNhom(mangSV, sv => sv.className);
     *   // → { "CNTT01": 10, "CNTT02": 12, "CNTT03": 8 }
     */
    demTheoNhom(mang, layNhom) {
        const boDem = {};

        for (let i = 0; i < mang.length; i++) {
            const tenNhom = layNhom(mang[i]);

            if (!boDem[tenNhom]) {
                boDem[tenNhom] = 0;
            }
            boDem[tenNhom]++;
        }

        return boDem;
    },

    /**
     * Tính giá trị trung bình của một trường trong mảng
     * 
     * @param {Array}    mang     — Mảng dữ liệu
     * @param {Function} layGiaTri — Hàm lấy giá trị số: (phần_tử) → số
     * @returns {number} Giá trị trung bình
     * 
     * Ví dụ:
     *   const tbToan = ThuatToanThongKe.tinhTrungBinh(mangSV, sv => sv.math);
     */
    tinhTrungBinh(mang, layGiaTri) {
        if (mang.length === 0) return 0;

        let tong = 0;
        for (let i = 0; i < mang.length; i++) {
            tong += layGiaTri(mang[i]);
        }

        return Math.round((tong / mang.length) * 100) / 100;
    },

    /**
     * Tìm giá trị lớn nhất
     * 
     * @param {Array}    mang      — Mảng dữ liệu
     * @param {Function} layGiaTri — Hàm lấy giá trị số
     * @returns {Object} { giaTri: number, phanTu: * }
     */
    timGiaTriLonNhat(mang, layGiaTri) {
        if (mang.length === 0) return { giaTri: 0, phanTu: null };

        let max = layGiaTri(mang[0]);
        let phanTuMax = mang[0];

        for (let i = 1; i < mang.length; i++) {
            const gt = layGiaTri(mang[i]);
            if (gt > max) {
                max = gt;
                phanTuMax = mang[i];
            }
        }

        return { giaTri: max, phanTu: phanTuMax };
    },

    /**
     * Tìm giá trị nhỏ nhất
     * 
     * @param {Array}    mang      — Mảng dữ liệu
     * @param {Function} layGiaTri — Hàm lấy giá trị số
     * @returns {Object} { giaTri: number, phanTu: * }
     */
    timGiaTriNhoNhat(mang, layGiaTri) {
        if (mang.length === 0) return { giaTri: 0, phanTu: null };

        let min = layGiaTri(mang[0]);
        let phanTuMin = mang[0];

        for (let i = 1; i < mang.length; i++) {
            const gt = layGiaTri(mang[i]);
            if (gt < min) {
                min = gt;
                phanTuMin = mang[i];
            }
        }

        return { giaTri: min, phanTu: phanTuMin };
    }
};

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThuatToanThongKe;
}
