/**
 * ================================================================
 *  THUẬT TOÁN SẮP XẾP (Sorting Algorithms)
 * ================================================================
 * 
 *  File này chứa các thuật toán sắp xếp được sử dụng trong hệ thống
 *  quản lý sinh viên. Mỗi thuật toán đều có giải thích chi tiết
 *  về nguyên lý hoạt động và đánh giá độ phức tạp.
 * 
 *  Các thuật toán có trong file:
 *    1. QuickSort  — sắp xếp nhanh
 *    2. BubbleSort — sắp xếp nổi bọt (minh hoạ)
 *    3. So sánh sinh viên theo nhiều tiêu chí
 * ================================================================
 */

const ThuatToanSapXep = {

    /* ============================================================
     *  1. QUICKSORT — SẮP XẾP NHANH
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Chọn một phần tử làm "chốt" (pivot).
     *    - Phân hoạch mảng thành 2 phần:
     *        + Phần bên trái: các phần tử ≤ pivot
     *        + Phần bên phải: các phần tử > pivot
     *    - Đệ quy sắp xếp từng phần.
     * 
     *  Độ phức tạp:
     *    - Trung bình : O(n log n)
     *    - Xấu nhất   : O(n²)  (khi mảng đã sắp xếp sẵn và chọn pivot không tốt)
     *    - Bộ nhớ phụ  : O(log n)  (ngăn xếp đệ quy)
     * 
     *  Tại sao chọn QuickSort?
     *    → Nhanh trong thực tế, tốn ít bộ nhớ phụ, phù hợp sắp xếp
     *      danh sách sinh viên với số lượng vừa phải (hàng chục → hàng nghìn).
     * ============================================================ */

    /**
     * Hàm chính — Sắp xếp mảng bằng QuickSort
     * @param {Array}    mang     — Mảng cần sắp xếp
     * @param {Function} hamSoSanh — Hàm so sánh (a, b) → số âm / 0 / số dương
     */
    quickSort(mang, hamSoSanh) {
        if (!mang || mang.length <= 1) return;
        this._quickSortDeQuy(mang, 0, mang.length - 1, hamSoSanh);
    },

    /**
     * Bước đệ quy của QuickSort
     * @param {Array}    mang      — Mảng
     * @param {number}   viTriDau  — Chỉ số bắt đầu
     * @param {number}   viTriCuoi — Chỉ số kết thúc
     * @param {Function} hamSoSanh — Hàm so sánh
     */
    _quickSortDeQuy(mang, viTriDau, viTriCuoi, hamSoSanh) {
        // Điều kiện dừng: đoạn mảng chỉ còn 0 hoặc 1 phần tử
        if (viTriDau >= viTriCuoi) return;

        // Bước 1: Phân hoạch — tìm vị trí đúng của pivot
        const viTriChot = this._phanHoach(mang, viTriDau, viTriCuoi, hamSoSanh);

        // Bước 2: Đệ quy sắp xếp nửa trái
        this._quickSortDeQuy(mang, viTriDau, viTriChot - 1, hamSoSanh);

        // Bước 3: Đệ quy sắp xếp nửa phải
        this._quickSortDeQuy(mang, viTriChot + 1, viTriCuoi, hamSoSanh);
    },

    /**
     * Phân hoạch mảng (Partition)
     * 
     *  Cách hoạt động:
     *    - Chọn phần tử cuối làm pivot
     *    - Duyệt từ trái sang phải:
     *        + Nếu phần tử ≤ pivot → đưa về bên trái
     *        + Nếu phần tử > pivot → giữ nguyên bên phải
     *    - Cuối cùng đặt pivot vào đúng vị trí
     * 
     * @param {Array}    mang      — Mảng
     * @param {number}   viTriDau  — Chỉ số bắt đầu
     * @param {number}   viTriCuoi — Chỉ số kết thúc (cũng là vị trí pivot)
     * @param {Function} hamSoSanh — Hàm so sánh
     * @returns {number} Vị trí cuối cùng của pivot sau phân hoạch
     */
    _phanHoach(mang, viTriDau, viTriCuoi, hamSoSanh) {
        const chot = mang[viTriCuoi];    // Chọn phần tử cuối làm chốt
        let i = viTriDau - 1;             // Biên của vùng ≤ chốt

        for (let j = viTriDau; j < viTriCuoi; j++) {
            // Nếu phần tử hiện tại ≤ chốt → hoán đổi vào vùng bên trái
            if (hamSoSanh(mang[j], chot) <= 0) {
                i++;
                this._hoanDoi(mang, i, j);
            }
        }

        // Đặt chốt vào đúng vị trí
        this._hoanDoi(mang, i + 1, viTriCuoi);
        return i + 1;
    },

    /**
     * Hoán đổi hai phần tử trong mảng
     * @param {Array}  mang — Mảng
     * @param {number} i    — Vị trí thứ nhất
     * @param {number} j    — Vị trí thứ hai
     */
    _hoanDoi(mang, i, j) {
        const tam = mang[i];
        mang[i] = mang[j];
        mang[j] = tam;
    },

    /* ============================================================
     *  2. BUBBLESORT — SẮP XẾP NỔI BỌT (để minh hoạ / so sánh)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Duyệt mảng nhiều lần, mỗi lần so sánh 2 phần tử
     *      liền kề và hoán đổi nếu sai thứ tự.
     *    - Sau mỗi vòng lặp, phần tử lớn nhất "nổi" lên cuối.
     * 
     *  Độ phức tạp:
     *    - Trung bình : O(n²)
     *    - Tốt nhất   : O(n)  (nếu mảng đã sắp xếp + có cờ dừng sớm)
     *    - Bộ nhớ phụ  : O(1)
     * 
     *  Nhận xét:
     *    → Chậm hơn QuickSort nhưng dễ hiểu, dễ cài đặt.
     *    → Chỉ phù hợp với mảng nhỏ hoặc dùng để minh hoạ thuật toán.
     * ============================================================ */

    /**
     * Sắp xếp nổi bọt
     * @param {Array}    mang      — Mảng cần sắp xếp
     * @param {Function} hamSoSanh — Hàm so sánh
     */
    bubbleSort(mang, hamSoSanh) {
        const n = mang.length;

        for (let i = 0; i < n - 1; i++) {
            let daDoi = false;   // Cờ kiểm tra: nếu không có hoán đổi → mảng đã sắp xếp

            for (let j = 0; j < n - i - 1; j++) {
                // So sánh 2 phần tử liền kề
                if (hamSoSanh(mang[j], mang[j + 1]) > 0) {
                    this._hoanDoi(mang, j, j + 1);
                    daDoi = true;
                }
            }

            // Tối ưu: nếu không có hoán đổi nào → dừng sớm
            if (!daDoi) break;
        }
    },

    /* ============================================================
     *  3. CÁC HÀM SO SÁNH SINH VIÊN
     * ============================================================
     *  Các hàm tạo bộ so sánh (comparator) để sắp xếp sinh viên
     *  theo nhiều tiêu chí: mã SV, tên, điểm TB, lớp.
     * ============================================================ */

    /**
     * Tạo hàm so sánh sinh viên theo tiêu chí
     * 
     * @param {string} truong   — Trường sắp xếp: 'id' | 'name' | 'gpa' | 'class'
     * @param {string} thuTu    — Thứ tự: 'asc' (tăng dần) | 'desc' (giảm dần)
     * @returns {Function} Hàm so sánh (a, b) → số
     * 
     * Ví dụ sử dụng:
     *   const hamSS = ThuatToanSapXep.taoHamSoSanh('gpa', 'desc');
     *   ThuatToanSapXep.quickSort(danhSach, hamSS);
     *   // → Sắp xếp sinh viên theo điểm TB giảm dần
     */
    taoHamSoSanh(truong = 'id', thuTu = 'asc') {
        return (a, b) => {
            let giaTriA, giaTriB;

            switch (truong) {
                case 'id':
                    // So sánh mã sinh viên (chuỗi, không phân biệt hoa/thường)
                    giaTriA = a.id.toLowerCase();
                    giaTriB = b.id.toLowerCase();
                    break;

                case 'name':
                    // So sánh theo TÊN (phần cuối cùng của họ tên)
                    // VD: "Nguyễn Văn An" → lấy "An" để so sánh
                    giaTriA = a.name.split(' ').pop().toLowerCase();
                    giaTriB = b.name.split(' ').pop().toLowerCase();
                    break;

                case 'gpa':
                    // So sánh theo điểm trung bình
                    giaTriA = a.calculateGPA() || 0;
                    giaTriB = b.calculateGPA() || 0;
                    break;

                case 'class':
                    // So sánh theo tên lớp
                    giaTriA = a.className.toLowerCase();
                    giaTriB = b.className.toLowerCase();
                    break;

                default:
                    giaTriA = a.id;
                    giaTriB = b.id;
            }

            // Thực hiện so sánh
            let ketQua = 0;
            if (typeof giaTriA === 'string') {
                // Dùng localeCompare hỗ trợ tiếng Việt
                ketQua = giaTriA.localeCompare(giaTriB, 'vi');
            } else {
                ketQua = giaTriA - giaTriB;
            }

            // Đảo ngược nếu sắp xếp giảm dần
            return thuTu === 'desc' ? -ketQua : ketQua;
        };
    }
};

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThuatToanSapXep;
}
