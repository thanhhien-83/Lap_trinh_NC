/**
 * ================================================================
 *  LỚP MẢNG ĐỘNG (Dynamic Array Class)
 * ================================================================
 * 
 *  Triển khai cấu trúc dữ liệu MẢNG ĐỘNG — nền tảng của đề tài BTL:
 *  "Xây dựng phần mềm quản lý sinh viên sử dụng cấu trúc mảng động
 *   và giao diện đồ họa"
 * 
 *  Mảng động tự động mở rộng khi đầy (gấp đôi dung lượng).
 *  Chi tiết lý thuyết → xem file CauTrucMangDong.js
 * 
 *  Các thuật toán sử dụng:
 *    - Sắp xếp:   → gọi ThuatToanSapXep.js   (QuickSort)
 *    - Tìm kiếm:  → gọi ThuatToanTimKiem.js   (Linear / Binary Search)
 * 
 *  Bảng độ phức tạp:
 *    ┌──────────────────┬──────────┬──────────────┐
 *    │  Thao tác         │ TB       │ Xấu nhất     │
 *    ├──────────────────┼──────────┼──────────────┤
 *    │ push              │ O(1)*    │ O(n)          │
 *    │ pop               │ O(1)     │ O(1)          │
 *    │ get / set         │ O(1)     │ O(1)          │
 *    │ insertAt          │ O(n)     │ O(n)          │
 *    │ removeAt          │ O(n)     │ O(n)          │
 *    │ findIndex / find  │ O(n)     │ O(n)          │
 *    │ sort (QuickSort)  │ O(nlogn) │ O(n²)         │
 *    │ binarySearch      │ O(logn)  │ O(logn)       │
 *    └──────────────────┴──────────┴──────────────┘
 *    * phân tích khấu hao (amortized)
 * ================================================================
 */

class DynamicArray {

    /**
     * Khởi tạo mảng động
     * @param {number} dungLuongBanDau — Dung lượng ban đầu (mặc định 10)
     * 
     * Ba thuộc tính chính:
     *   - data:     mảng lưu trữ thực tế
     *   - length:   số phần tử đang sử dụng
     *   - capacity: dung lượng tối đa hiện tại
     */
    constructor(dungLuongBanDau = 10) {
        this.data = new Array(dungLuongBanDau);
        this.length = 0;
        this.capacity = dungLuongBanDau;
    }

    /* ============================================================
     *  MỞ RỘNG MẢNG (_resize)
     * ============================================================
     *  Khi mảng đầy (length >= capacity):
     *    1. Tạo mảng mới dung lượng GẤP ĐÔI
     *    2. Copy n phần tử sang mảng mới → O(n)
     *    3. Gán mảng mới thay mảng cũ
     * 
     *  Tại sao gấp đôi?
     *    → Phân tích khấu hao: push trung bình O(1)
     *    → Xem chi tiết: CauTrucMangDong.js → phần 2
     * ============================================================ */
    _resize() {
        const dungLuongMoi = this.capacity * 2;
        const mangMoi = new Array(dungLuongMoi);

        // Copy dữ liệu sang mảng mới — O(n)
        for (let i = 0; i < this.length; i++) {
            mangMoi[i] = this.data[i];
        }

        this.data = mangMoi;
        this.capacity = dungLuongMoi;

        console.log(`[MảngĐộng] Đã mở rộng: ${this.capacity / 2} → ${this.capacity}`);
    }

    /* ============================================================
     *  THÊM PHẦN TỬ VÀO CUỐI (push) — O(1) trung bình
     * ============================================================ */
    push(phanTu) {
        if (this.length >= this.capacity) {
            this._resize();
        }
        this.data[this.length] = phanTu;
        this.length++;
        return this.length;
    }

    /* ============================================================
     *  LẤY VÀ XOÁ PHẦN TỬ CUỐI (pop) — O(1)
     * ============================================================ */
    pop() {
        if (this.length === 0) return undefined;

        const phanTu = this.data[this.length - 1];
        this.data[this.length - 1] = undefined;
        this.length--;
        return phanTu;
    }

    /* ============================================================
     *  TRUY CẬP PHẦN TỬ (get) — O(1)
     *  → Ưu điểm lớn nhất của mảng so với danh sách liên kết
     * ============================================================ */
    get(viTri) {
        if (viTri < 0 || viTri >= this.length) return undefined;
        return this.data[viTri];
    }

    /* ============================================================
     *  GÁN GIÁ TRỊ (set) — O(1)
     * ============================================================ */
    set(viTri, phanTu) {
        if (viTri < 0 || viTri >= this.length) return false;
        this.data[viTri] = phanTu;
        return true;
    }

    /* ============================================================
     *  CHÈN PHẦN TỬ TẠI VỊ TRÍ (insertAt) — O(n)
     * ============================================================
     *  Phải dịch các phần tử từ viTri đến cuối RA SAU 1 ô
     *  ⚠ Dịch TỪ CUỐI về đầu để không ghi đè!
     *  Xem minh hoạ: CauTrucMangDong.js → phần 5
     * ============================================================ */
    insertAt(viTri, phanTu) {
        if (viTri < 0 || viTri > this.length) return false;
        if (this.length >= this.capacity) this._resize();

        // Dịch phần tử ra sau (từ cuối → vị trí chèn)
        for (let i = this.length; i > viTri; i--) {
            this.data[i] = this.data[i - 1];
        }

        this.data[viTri] = phanTu;
        this.length++;
        return true;
    }

    /* ============================================================
     *  XOÁ PHẦN TỬ TẠI VỊ TRÍ (removeAt) — O(n)
     * ============================================================
     *  Phải dịch các phần tử sau viTri LÊN TRƯỚC 1 ô
     *  Xem minh hoạ: CauTrucMangDong.js → phần 4
     * ============================================================ */
    removeAt(viTri) {
        if (viTri < 0 || viTri >= this.length) return undefined;

        const phanTuDaXoa = this.data[viTri];

        // Dịch phần tử lên trước (từ vị trí xoá → cuối)
        for (let i = viTri; i < this.length - 1; i++) {
            this.data[i] = this.data[i + 1];
        }

        this.data[this.length - 1] = undefined;
        this.length--;
        return phanTuDaXoa;
    }

    /* ============================================================
     *  TÌM VỊ TRÍ PHẦN TỬ — Tìm kiếm tuần tự O(n)
     * ============================================================
     *  Thuật toán: ThuatToanTimKiem.js → phần 1 (Linear Search)
     * ============================================================ */
    findIndex(dieuKien) {
        // Tìm kiếm tuần tự — duyệt từng phần tử
        for (let i = 0; i < this.length; i++) {
            if (dieuKien(this.data[i], i)) {
                return i;   // Tìm thấy → trả về vị trí
            }
        }
        return -1;          // Không tìm thấy
    }

    /* ============================================================
     *  TÌM PHẦN TỬ — Tìm kiếm tuần tự O(n)
     * ============================================================ */
    find(dieuKien) {
        const viTri = this.findIndex(dieuKien);
        return viTri !== -1 ? this.data[viTri] : undefined;
    }

    /* ============================================================
     *  LỌC PHẦN TỬ (filter) — O(n)
     * ============================================================
     *  Thuật toán: ThuatToanTimKiem.js → phần 4 (Lọc dữ liệu)
     * ============================================================ */
    filter(dieuKien) {
        const ketQua = new DynamicArray();
        for (let i = 0; i < this.length; i++) {
            if (dieuKien(this.data[i], i)) {
                ketQua.push(this.data[i]);
            }
        }
        return ketQua;
    }

    /* ============================================================
     *  BIẾN ĐỔI (map) — O(n)
     * ============================================================ */
    map(hamBienDoi) {
        const ketQua = new DynamicArray(this.length);
        for (let i = 0; i < this.length; i++) {
            ketQua.push(hamBienDoi(this.data[i], i));
        }
        return ketQua;
    }

    /* ============================================================
     *  DUYỆT (forEach) — O(n)
     * ============================================================ */
    forEach(hamXuLy) {
        for (let i = 0; i < this.length; i++) {
            hamXuLy(this.data[i], i);
        }
    }

    /* ============================================================
     *  SẮP XẾP — QuickSort O(n log n)
     * ============================================================
     *  Sử dụng thuật toán QuickSort từ ThuatToanSapXep.js
     *  Chi tiết: ThuatToanSapXep.js → phần 1
     * 
     *  Nguyên lý:
     *    1. Chọn phần tử chốt (pivot)
     *    2. Phân hoạch: nhỏ hơn ← chốt → lớn hơn
     *    3. Đệ quy sắp xếp 2 nửa
     * ============================================================ */
    sort(hamSoSanh = (a, b) => a - b) {
        if (this.length <= 1) return;

        // Gọi thuật toán QuickSort từ module ThuatToanSapXep
        ThuatToanSapXep._quickSortDeQuy(this.data, 0, this.length - 1, hamSoSanh);
    }

    /* ============================================================
     *  TÌM KIẾM NHỊ PHÂN — O(log n)
     * ============================================================
     *  ĐK tiên quyết: mảng PHẢI được sắp xếp trước!
     *  Sử dụng thuật toán từ ThuatToanTimKiem.js → phần 2
     * 
     *  So sánh:
     *    n = 1000 → Tuần tự: 1000 bước, Nhị phân: 10 bước
     * ============================================================ */
    binarySearch(giaTri, hamSoSanh = (a, b) => a - b) {
        // Trích mảng hoạt động (loại bỏ phần undefined)
        const mangHoatDong = this.toArray();

        // Gọi thuật toán tìm kiếm nhị phân từ module ThuatToanTimKiem
        return ThuatToanTimKiem.timNhiPhan(mangHoatDong, giaTri, hamSoSanh);
    }

    /* ============================================================
     *  CÁC THAO TÁC TIỆN ÍCH
     * ============================================================ */

    /** Xoá tất cả phần tử — O(n) */
    clear() {
        for (let i = 0; i < this.length; i++) {
            this.data[i] = undefined;
        }
        this.length = 0;
    }

    /** Kiểm tra mảng rỗng — O(1) */
    isEmpty() {
        return this.length === 0;
    }

    /** Lấy số phần tử — O(1) */
    size() {
        return this.length;
    }

    /** Chuyển sang mảng JavaScript thuần — O(n) */
    toArray() {
        const ketQua = [];
        for (let i = 0; i < this.length; i++) {
            ketQua.push(this.data[i]);
        }
        return ketQua;
    }

    /**
     * Reduce — gom giá trị O(n)
     * Thuật toán: ThuatToanThongKe.js → tính tổng, trung bình
     */
    reduce(hamGom, giaTriBanDau) {
        let ketQua = giaTriBanDau;
        let batDauTu = 0;

        if (giaTriBanDau === undefined) {
            ketQua = this.data[0];
            batDauTu = 1;
        }

        for (let i = batDauTu; i < this.length; i++) {
            ketQua = hamGom(ketQua, this.data[i], i);
        }

        return ketQua;
    }

    /**
     * Nhân bản mảng — O(n)
     * Xem giải thích: CauTrucMangDong.js → phần 7
     */
    clone() {
        const banSao = new DynamicArray(this.capacity);
        for (let i = 0; i < this.length; i++) {
            banSao.push(this.data[i]);
        }
        return banSao;
    }

    /** In thông tin mảng (debug) */
    print() {
        console.log('=== Mảng Động ===');
        console.log(`Số phần tử: ${this.length}`);
        console.log(`Dung lượng: ${this.capacity}`);
        console.log('Dữ liệu:', this.toArray());
    }
}

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicArray;
}
