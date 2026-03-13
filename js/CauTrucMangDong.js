/**
 * ================================================================
 *  CẤU TRÚC DỮ LIỆU MẢNG ĐỘNG (Dynamic Array Data Structure)
 * ================================================================
 * 
 *  File này giải thích chi tiết cấu trúc dữ liệu MẢNG ĐỘNG
 *  được sử dụng làm nền tảng cho hệ thống quản lý sinh viên.
 * 
 *  MỤC LỤC:
 *    1. Mảng động là gì?
 *    2. Cấp phát lại bộ nhớ (_resize / moRongMang)
 *    3. Thêm phần tử (push / themPhanTu)
 *    4. Xoá phần tử (removeAt / xoaTaiViTri)
 *    5. Chèn phần tử (insertAt / chenTaiViTri)
 *    6. Truy cập phần tử (get/set)
 *    7. Nhân bản mảng (clone / nhanBan)
 * 
 *  Đề tài BTL:
 *    "Xây dựng phần mềm quản lý sinh viên sử dụng cấu trúc
 *     mảng động và giao diện đồ họa"
 * ================================================================
 */

/* ================================================================
 *  1. MẢNG ĐỘNG LÀ GÌ?
 * ================================================================
 * 
 *  Mảng tĩnh (static array):
 *    → Kích thước cố định, không thể thay đổi sau khi tạo.
 *    → VD: int arr[100]; — luôn chiếm 100 ô nhớ.
 *    → Vấn đề: Nếu cần nhiều hơn 100 → tràn mảng.
 *              Nếu chỉ dùng 10 → lãng phí 90 ô nhớ.
 * 
 *  Mảng động (dynamic array):
 *    → Tự động mở rộng khi đầy.
 *    → Khởi tạo với dung lượng nhỏ (VD: 10).
 *    → Khi thêm phần tử mà đầy → tạo mảng mới GẤP ĐÔI dung lượng,
 *      copy dữ liệu cũ sang, rồi tiếp tục thêm.
 * 
 *  Minh hoạ:
 *    Ban đầu:  capacity = 4, length = 0
 *    [_][_][_][_]
 * 
 *    Thêm 3 phần tử:  length = 3
 *    [A][B][C][_]
 * 
 *    Thêm phần tử thứ 4:  length = 4 (ĐẦY!)
 *    [A][B][C][D]
 * 
 *    Thêm phần tử thứ 5 → cần resize:
 *    Tạo mảng mới capacity = 8, copy dữ liệu:
 *    [A][B][C][D][E][_][_][_]
 * 
 *  Chi phí resize: O(n) — nhưng xảy ra HIẾM
 *  → Phân tích khấu hao (amortized analysis): push = O(1) trung bình
 * ================================================================ */

const CauTrucMangDong = {

    /* ============================================================
     *  2. CẤP PHÁT LẠI BỘ NHỚ (Resize)
     * ============================================================
     * 
     *  Đây là thao tác QUAN TRỌNG NHẤT của mảng động.
     * 
     *  Các bước:
     *    Bước 1: Tạo mảng mới có dung lượng GẤP ĐÔI
     *    Bước 2: Copy từng phần tử từ mảng cũ sang mảng mới (O(n))
     *    Bước 3: Gán mảng mới thay cho mảng cũ
     * 
     *  Tại sao gấp đôi (hệ số 2)?
     *    → Nếu tăng thêm 1: mỗi lần push đều phải resize → O(n) mỗi lần
     *    → Nếu gấp đôi: sau k lần resize, tổng chi phí = n + n/2 + n/4 + ... ≈ 2n
     *      → Trung bình mỗi push chỉ tốn O(1) (phân tích khấu hao)
     * 
     *  Độ phức tạp: O(n) — copy n phần tử
     * ============================================================ */

    /**
     * Mô phỏng quá trình mở rộng mảng
     * 
     * @param {Array}  mangCu      — Mảng dữ liệu hiện tại
     * @param {number} dungLuongCu — Dung lượng hiện tại
     * @returns {Object} { mangMoi, dungLuongMoi }
     */
    moRongMang(mangCu, dungLuongCu) {
        // Bước 1: Tính dung lượng mới = gấp đôi
        const dungLuongMoi = dungLuongCu * 2;

        // Bước 2: Tạo mảng mới
        const mangMoi = new Array(dungLuongMoi);

        // Bước 3: Copy dữ liệu (O(n))
        for (let i = 0; i < mangCu.length; i++) {
            mangMoi[i] = mangCu[i];
        }

        console.log(`[Mảng Động] Đã mở rộng: ${dungLuongCu} → ${dungLuongMoi}`);

        return { mangMoi, dungLuongMoi };
    },

    /* ============================================================
     *  3. THÊM PHẦN TỬ VÀO CUỐI (Push)
     * ============================================================
     * 
     *  Các bước:
     *    Bước 1: Kiểm tra mảng đã đầy chưa (length >= capacity)
     *    Bước 2: Nếu đầy → gọi hàm mở rộng (resize)
     *    Bước 3: Đặt phần tử vào vị trí length
     *    Bước 4: Tăng length lên 1
     * 
     *  Độ phức tạp:
     *    - Trường hợp thường: O(1) — chỉ gán giá trị
     *    - Trường hợp resize:  O(n) — phải copy toàn bộ
     *    - Trung bình (khấu hao): O(1)
     * 
     *  Minh hoạ:
     *    Trước: [A][B][_][_]  (length=2, capacity=4)
     *    Push(C)
     *    Sau:   [A][B][C][_]  (length=3, capacity=4)
     * ============================================================ */

    /**
     * Minh hoạ thêm phần tử vào cuối mảng
     * (Thuật toán thực tế nằm trong class DynamicArray.push())
     */
    themPhanTu_MinhHoa() {
        console.log(`
        ┌─────────────────────────────────┐
        │  THUẬT TOÁN THÊM PHẦN TỬ (Push) │
        ├─────────────────────────────────┤
        │  1. Kiểm tra: length >= capacity?│
        │     → Có:  Gọi resize()          │
        │     → Không: Tiếp tục           │
        │                                  │
        │  2. data[length] = phần_tử_mới  │
        │                                  │
        │  3. length = length + 1          │
        │                                  │
        │  4. Trả về: length              │
        └─────────────────────────────────┘
        `);
    },

    /* ============================================================
     *  4. XOÁ PHẦN TỬ TẠI VỊ TRÍ (RemoveAt)
     * ============================================================
     * 
     *  Các bước:
     *    Bước 1: Kiểm tra index hợp lệ (0 ≤ index < length)
     *    Bước 2: Lưu phần tử cần xoá
     *    Bước 3: Dịch tất cả phần tử sau index lên trước 1 vị trí
     *    Bước 4: Xoá phần tử cuối (đặt = undefined)
     *    Bước 5: Giảm length đi 1
     * 
     *  Độ phức tạp: O(n) — phải dịch chuyển các phần tử
     * 
     *  Minh hoạ xoá phần tử tại index = 1:
     *    Trước: [A][B][C][D]  (length=4)
     *                ↑ xoá B
     *    Dịch:  [A][C][D][_]  (C dịch lên, D dịch lên)
     *    Sau:   [A][C][D][_]  (length=3)
     * 
     *  Tại sao O(n)?
     *    → Xoá ở đầu: phải dịch n-1 phần tử → O(n)
     *    → Xoá ở cuối: không cần dịch → O(1)
     *    → Trung bình: O(n/2) = O(n)
     * ============================================================ */

    /**
     * Mô phỏng xoá phần tử tại vị trí
     * 
     * @param {Array}  mang  — Mảng [đã cắt theo length, không phải capacity]
     * @param {number} viTri — Vị trí cần xoá (0-indexed)
     * @returns {Object} { phanTuDaXoa, mangSauXoa }
     */
    xoaTaiViTri(mang, viTri) {
        // Bước 1: Kiểm tra hợp lệ
        if (viTri < 0 || viTri >= mang.length) {
            console.log(`[Mảng Động] Lỗi: Vị trí ${viTri} không hợp lệ!`);
            return null;
        }

        // Bước 2: Lưu phần tử cần xoá
        const phanTuDaXoa = mang[viTri];

        // Bước 3: Dịch các phần tử về trước (O(n))
        for (let i = viTri; i < mang.length - 1; i++) {
            mang[i] = mang[i + 1]; // ← Phần tử sau ghi đè phần tử trước
        }

        // Bước 4: Xoá phần tử cuối
        mang.length--;

        console.log(`[Mảng Động] Đã xoá "${phanTuDaXoa}" tại vị trí ${viTri}`);
        return { phanTuDaXoa, mangSauXoa: mang };
    },

    /* ============================================================
     *  5. CHÈN PHẦN TỬ TẠI VỊ TRÍ (InsertAt)
     * ============================================================
     * 
     *  Các bước:
     *    Bước 1: Kiểm tra index hợp lệ
     *    Bước 2: Kiểm tra mảng đầy → resize nếu cần
     *    Bước 3: Dịch tất cả phần tử từ index đến cuối RA SAU 1 vị trí
     *    Bước 4: Đặt phần tử mới vào vị trí index
     *    Bước 5: Tăng length lên 1
     * 
     *  Độ phức tạp: O(n) — phải dịch chuyển phần tử
     * 
     *  Minh hoạ chèn 'X' tại index = 1:
     *    Trước: [A][B][C][_]  (length=3)
     *    Dịch:  [A][_][B][C]  (B, C dịch ra sau)
     *    Chèn:  [A][X][B][C]  (đặt X vào vị trí 1)
     *    Sau:   [A][X][B][C]  (length=4)
     * 
     *  ⚠ Lưu ý: Dịch phải đi TỪ CUỐI về đầu để không ghi đè!
     * ============================================================ */

    /**
     * Mô phỏng chèn phần tử tại vị trí
     * 
     * @param {Array}  mang    — Mảng
     * @param {number} viTri   — Vị trí chèn
     * @param {*}      phanTu  — Phần tử cần chèn
     * @returns {Array} Mảng sau khi chèn
     */
    chenTaiViTri(mang, viTri, phanTu) {
        if (viTri < 0 || viTri > mang.length) {
            console.log(`[Mảng Động] Lỗi: Vị trí chèn ${viTri} không hợp lệ!`);
            return mang;
        }

        // Dịch phần tử TỪ CUỐI về vị trí chèn (quan trọng!)
        for (let i = mang.length; i > viTri; i--) {
            mang[i] = mang[i - 1]; // ← Phần tử trước ghi vào sau
        }

        // Đặt phần tử mới
        mang[viTri] = phanTu;

        console.log(`[Mảng Động] Đã chèn "${phanTu}" tại vị trí ${viTri}`);
        return mang;
    },

    /* ============================================================
     *  6. TRUY CẬP TRỰC TIẾP (Direct Access)
     * ============================================================
     * 
     *  Ưu điểm lớn nhất của mảng: truy cập O(1) qua chỉ số.
     * 
     *  Nguyên lý:
     *    → Mảng lưu trữ phần tử liên tiếp trong bộ nhớ.
     *    → Biết địa chỉ đầu + kích thước phần tử → tính được
     *      địa chỉ bất kỳ phần tử:
     *      địa_chỉ(i) = địa_chỉ_đầu + i × kích_thước_phần_tử
     *    → Chỉ cần 1 phép tính → O(1)
     * 
     *  So sánh với danh sách liên kết (linked list):
     *    → Truy cập: O(n) — phải đi qua từng node
     *    → Chèn/xoá ở đầu: O(1) — chỉ cần thay con trỏ
     * 
     *  Bảng so sánh:
     *    ┌──────────────┬───────────┬──────────────────┐
     *    │  Thao tác     │ Mảng động │ Danh sách liên kết│
     *    ├──────────────┼───────────┼──────────────────┤
     *    │ Truy cập [i] │   O(1)    │     O(n)         │
     *    │ Thêm cuối    │   O(1)*   │     O(1)**       │
     *    │ Thêm đầu     │   O(n)    │     O(1)         │
     *    │ Xoá tại i    │   O(n)    │     O(n)         │
     *    │ Tìm kiếm     │   O(n)    │     O(n)         │
     *    └──────────────┴───────────┴──────────────────┘
     *    * khấu hao (amortized)
     *    ** nếu giữ con trỏ tail
     * ============================================================ */

    /**
     * Truy cập phần tử — O(1)
     */
    truyCapPhanTu(mang, viTri) {
        if (viTri < 0 || viTri >= mang.length) {
            return undefined;
        }
        return mang[viTri];
    },

    /**
     * Gán giá trị phần tử — O(1)
     */
    ganPhanTu(mang, viTri, giaTri) {
        if (viTri < 0 || viTri >= mang.length) {
            return false;
        }
        mang[viTri] = giaTri;
        return true;
    },

    /* ============================================================
     *  7. NHÂN BẢN MẢNG (Clone / Deep Copy)
     * ============================================================
     * 
     *  Ý tưởng:
     *    - Tạo mảng mới cùng kích thước.
     *    - Copy từng phần tử sang mảng mới.
     * 
     *  Tại sao cần nhân bản?
     *    → Khi sắp xếp, không muốn thay đổi mảng gốc.
     *    → VD: Hiển thị danh sách theo thứ tự GPA giảm dần,
     *      nhưng mảng gốc vẫn giữ thứ tự nhập liệu.
     * 
     *  Độ phức tạp: O(n) — copy n phần tử
     * ============================================================ */

    /**
     * Nhân bản mảng
     * 
     * @param {Array} mangGoc — Mảng cần nhân bản
     * @returns {Array} Mảng mới (bản sao)
     */
    nhanBanMang(mangGoc) {
        const mangMoi = new Array(mangGoc.length);

        for (let i = 0; i < mangGoc.length; i++) {
            mangMoi[i] = mangGoc[i];
        }

        return mangMoi;
    },

    /* ============================================================
     *  BẢNG TỔNG HỢP ĐỘ PHỨC TẠP
     * ============================================================
     * 
     *  ┌──────────────────┬──────────────┬──────────────────┐
     *  │  Thao tác         │ Trường hợp TB │ Trường hợp xấu  │
     *  ├──────────────────┼──────────────┼──────────────────┤
     *  │ push (thêm cuối) │ O(1)*        │ O(n) khi resize  │
     *  │ pop (xoá cuối)   │ O(1)         │ O(1)             │
     *  │ get (truy cập)   │ O(1)         │ O(1)             │
     *  │ set (gán)        │ O(1)         │ O(1)             │
     *  │ insertAt (chèn)  │ O(n)         │ O(n)             │
     *  │ removeAt (xoá)   │ O(n)         │ O(n)             │
     *  │ findIndex (tìm)  │ O(n)         │ O(n)             │
     *  │ sort (sắp xếp)   │ O(n log n)   │ O(n²)            │
     *  │ binarySearch     │ O(log n)     │ O(log n)         │
     *  │ clone (nhân bản) │ O(n)         │ O(n)             │
     *  │ resize (mở rộng) │ O(n)         │ O(n)             │
     *  └──────────────────┴──────────────┴──────────────────┘
     *  * phân tích khấu hao (amortized analysis)
     * ============================================================ */

    /**
     * In bảng tổng hợp độ phức tạp (dùng khi demo)
     */
    inBangDoPhucTap() {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║          BẢNG ĐỘ PHỨC TẠP — CẤU TRÚC MẢNG ĐỘNG        ║
╠══════════════════╦══════════════╦═══════════════════════╣
║  Thao tác         ║ Trung bình   ║ Xấu nhất            ║
╠══════════════════╬══════════════╬═══════════════════════╣
║  push (thêm)     ║   O(1)*      ║   O(n)               ║
║  pop (xoá cuối)  ║   O(1)       ║   O(1)               ║
║  get (đọc)       ║   O(1)       ║   O(1)               ║
║  set (gán)       ║   O(1)       ║   O(1)               ║
║  insertAt (chèn) ║   O(n)       ║   O(n)               ║
║  removeAt (xoá)  ║   O(n)       ║   O(n)               ║
║  findIndex (tìm) ║   O(n)       ║   O(n)               ║
║  sort (sắp xếp)  ║   O(n log n) ║   O(n²)              ║
║  binarySearch    ║   O(log n)   ║   O(log n)           ║
║  clone           ║   O(n)       ║   O(n)               ║
║  resize          ║   O(n)       ║   O(n)               ║
╠══════════════════╩══════════════╩═══════════════════════╣
║  * phân tích khấu hao (amortized analysis)              ║
╚══════════════════════════════════════════════════════════╝
        `);
    }
};

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CauTrucMangDong;
}
