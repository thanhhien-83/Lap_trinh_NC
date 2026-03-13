/**
 * ================================================================
 *  THUẬT TOÁN TÌM KIẾM (Search Algorithms)
 * ================================================================
 * 
 *  File này chứa các thuật toán tìm kiếm được sử dụng trong hệ thống
 *  quản lý sinh viên.
 * 
 *  Các thuật toán có trong file:
 *    1. Tìm kiếm tuần tự (Linear Search)
 *    2. Tìm kiếm nhị phân (Binary Search)
 *    3. Tìm kiếm sinh viên theo nhiều tiêu chí
 *    4. Lọc dữ liệu (Filter)
 * ================================================================
 */

const ThuatToanTimKiem = {

    /* ============================================================
     *  1. TÌM KIẾM TUẦN TỰ (Linear Search)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Duyệt lần lượt từng phần tử trong mảng.
     *    - So sánh từng phần tử với giá trị cần tìm.
     *    - Nếu tìm thấy → trả về vị trí (index).
     *    - Nếu duyệt hết mảng mà không tìm thấy → trả về -1.
     * 
     *  Độ phức tạp:
     *    - Tốt nhất:   O(1)   — phần tử cần tìm ở đầu mảng
     *    - Trung bình:  O(n)
     *    - Xấu nhất:    O(n)   — phần tử ở cuối / không có
     *    - Bộ nhớ phụ:  O(1)
     * 
     *  Ưu điểm:
     *    → Không cần mảng đã sắp xếp.
     *    → Đơn giản, dễ cài đặt.
     *    → Phù hợp với mảng nhỏ hoặc dữ liệu không sắp xếp.
     * ============================================================ */

    /**
     * Tìm kiếm tuần tự — trả về VỊ TRÍ đầu tiên thoả mãn điều kiện
     * 
     * @param {Array}    mang      — Mảng cần tìm
     * @param {Function} dieuKien  — Hàm kiểm tra: (phần_tử) → true/false
     * @returns {number} Chỉ số của phần tử tìm thấy, hoặc -1 nếu không có
     * 
     * Ví dụ:
     *   const viTri = ThuatToanTimKiem.timTuanTu(mangSV, sv => sv.id === 'SV001');
     */
    timTuanTu(mang, dieuKien) {
        for (let i = 0; i < mang.length; i++) {
            if (dieuKien(mang[i])) {
                return i;    // ← Tìm thấy → trả về vị trí
            }
        }
        return -1;           // ← Không tìm thấy
    },

    /**
     * Tìm kiếm tuần tự — trả về PHẦN TỬ đầu tiên thoả mãn điều kiện
     * 
     * @param {Array}    mang      — Mảng cần tìm
     * @param {Function} dieuKien  — Hàm kiểm tra
     * @returns {*} Phần tử tìm thấy, hoặc undefined
     */
    timMotPhanTu(mang, dieuKien) {
        for (let i = 0; i < mang.length; i++) {
            if (dieuKien(mang[i])) {
                return mang[i];   // ← Trả về phần tử (không phải vị trí)
            }
        }
        return undefined;
    },

    /* ============================================================
     *  2. TÌM KIẾM NHỊ PHÂN (Binary Search)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - ĐK tiên quyết: mảng PHẢI ĐƯỢC SẮP XẾP trước.
     *    - Chia đôi mảng, so sánh phần tử giữa với giá trị cần tìm:
     *        + Nếu bằng   → tìm thấy
     *        + Nếu nhỏ hơn → tìm trong nửa phải
     *        + Nếu lớn hơn → tìm trong nửa trái
     *    - Lặp lại cho đến khi tìm thấy hoặc đoạn tìm kiếm rỗng.
     * 
     *  Độ phức tạp:
     *    - Tốt nhất:   O(1)       — phần tử ở giữa mảng
     *    - Trung bình:  O(log n)
     *    - Xấu nhất:    O(log n)
     *    - Bộ nhớ phụ:  O(1)       (dùng vòng lặp, không đệ quy)
     * 
     *  So sánh với tìm kiếm tuần tự:
     *    → n = 1000 phần tử:
     *        Tuần tự:   tối đa 1000 bước
     *        Nhị phân:  tối đa  10  bước (log₂1000 ≈ 10)
     *    → Nhanh hơn rất nhiều khi dữ liệu lớn.
     * 
     *  Nhược điểm:
     *    → Cần sắp xếp trước → chi phí O(n log n) để sắp xếp.
     *    → Chỉ hiệu quả khi tìm kiếm nhiều lần trên cùng dữ liệu.
     * ============================================================ */

    /**
     * Tìm kiếm nhị phân trên mảng đã sắp xếp
     * 
     * @param {Array}    mang      — Mảng ĐÃ SẮP XẾP
     * @param {*}        giaTri    — Giá trị cần tìm
     * @param {Function} hamSoSanh — Hàm so sánh: (phần_tử, giá_trị) → số
     *                                 < 0 nếu phần_tử < giá_trị
     *                                 = 0 nếu phần_tử = giá_trị
     *                                 > 0 nếu phần_tử > giá_trị
     * @returns {number} Chỉ số tìm thấy, hoặc -1
     * 
     * Ví dụ:
     *   // Tìm sinh viên có điểm TB = 8.5 trong mảng đã sắp xếp theo GPA
     *   const viTri = ThuatToanTimKiem.timNhiPhan(mangSV, 8.5,
     *       (sv, diem) => sv.calculateGPA() - diem
     *   );
     */
    timNhiPhan(mang, giaTri, hamSoSanh) {
        let trai = 0;                  // Biên trái
        let phai = mang.length - 1;    // Biên phải

        while (trai <= phai) {
            // Tính chỉ số giữa (tránh tràn số bằng cách dùng phép trừ)
            const giua = Math.floor(trai + (phai - trai) / 2);

            // So sánh phần tử giữa với giá trị cần tìm
            const ketQuaSoSanh = hamSoSanh(mang[giua], giaTri);

            if (ketQuaSoSanh === 0) {
                return giua;            // ← Tìm thấy!
            } else if (ketQuaSoSanh < 0) {
                trai = giua + 1;        // ← Tìm trong nửa PHẢI
            } else {
                phai = giua - 1;        // ← Tìm trong nửa TRÁI
            }
        }

        return -1;                      // ← Không tìm thấy
    },

    /* ============================================================
     *  3. TÌM KIẾM SINH VIÊN THEO NHIỀU TIÊU CHÍ
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Nhận chuỗi tìm kiếm từ người dùng.
     *    - Chuẩn hoá: chuyển về chữ thường, xoá khoảng trắng thừa.
     *    - Duyệt tuần tự qua từng sinh viên, kiểm tra xem chuỗi tìm
     *      có CHỨA TRONG (includes) bất kỳ trường nào:
     *        + Mã sinh viên
     *        + Họ tên
     *        + Lớp
     *    - Trường hợp đặc biệt: tìm theo xếp loại (xuất sắc, giỏi, khá…).
     * 
     *  Độ phức tạp: O(n) — duyệt hết danh sách
     *  (Tìm kiếm mờ / fuzzy search không dùng cấu trúc dữ liệu phức tạp)
     * ============================================================ */

    /**
     * Tìm kiếm sinh viên theo từ khoá (tìm trên nhiều trường)
     * 
     * @param {Array}  danhSach  — Mảng các đối tượng Student
     * @param {string} tuKhoa   — Chuỗi người dùng nhập (VD: "Nguyễn", "SV001", "CNTT01")
     * @returns {Array} Mảng các sinh viên phù hợp
     */
    timKiemSinhVien(danhSach, tuKhoa) {
        // Bước 1: Chuẩn hoá từ khoá
        const tuKhoaChuanHoa = tuKhoa.toLowerCase().trim();

        // Nếu từ khoá rỗng → trả về toàn bộ danh sách
        if (!tuKhoaChuanHoa) {
            return [...danhSach];  // Tạo bản sao để không ảnh hưởng mảng gốc
        }

        // Bước 2: Lọc — duyệt từng sinh viên
        const ketQua = [];

        for (let i = 0; i < danhSach.length; i++) {
            const sv = danhSach[i];

            // Kiểm tra từ khoá có xuất hiện trong các trường không
            const trungMaSV  = sv.id.toLowerCase().includes(tuKhoaChuanHoa);
            const trungHoTen = sv.name.toLowerCase().includes(tuKhoaChuanHoa);
            const trungLop   = sv.className.toLowerCase().includes(tuKhoaChuanHoa);

            // Kiểm tra thêm: xếp loại (rank)
            const xepLoai    = sv.getRank ? sv.getRank().toLowerCase() : '';
            const trungXepLoai = xepLoai.includes(tuKhoaChuanHoa);

            // Nếu trùng bất kỳ trường nào → thêm vào kết quả
            if (trungMaSV || trungHoTen || trungLop || trungXepLoai) {
                ketQua.push(sv);
            }
        }

        return ketQua;
    },

    /* ============================================================
     *  4. LỌC DỮ LIỆU (Filter)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Duyệt mảng, kiểm tra điều kiện cho từng phần tử.
     *    - Thu thập tất cả phần tử thoả mãn vào mảng kết quả.
     * 
     *  Độ phức tạp: O(n) — luôn duyệt hết mảng
     *  Bộ nhớ phụ: O(k) — với k là số phần tử thoả mãn
     * ============================================================ */

    /**
     * Lọc mảng theo điều kiện
     * 
     * @param {Array}    mang     — Mảng gốc
     * @param {Function} dieuKien — Hàm kiểm tra: (phần_tử) → true/false
     * @returns {Array} Mảng mới chứa các phần tử thoả mãn
     * 
     * Ví dụ:
     *   // Lọc sinh viên giỏi (GPA >= 8.0)
     *   const svGioi = ThuatToanTimKiem.locDuLieu(mangSV,
     *       sv => sv.calculateGPA() >= 8.0
     *   );
     */
    locDuLieu(mang, dieuKien) {
        const ketQua = [];

        for (let i = 0; i < mang.length; i++) {
            if (dieuKien(mang[i])) {
                ketQua.push(mang[i]);
            }
        }

        return ketQua;
    }
};

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThuatToanTimKiem;
}
