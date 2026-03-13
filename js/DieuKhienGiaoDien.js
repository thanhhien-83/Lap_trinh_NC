/**
 * ================================================================
 *  LỚP ĐIỀU KHIỂN GIAO DIỆN (UI Controller Class)
 * ================================================================
 * 
 *  Quản lý tất cả thao tác với giao diện người dùng:
 *    - Điều hướng giữa các trang
 *    - Xử lý form thêm/sửa sinh viên
 *    - Hiển thị bảng danh sách + phân trang
 *    - Tìm kiếm, sắp xếp
 *    - Vẽ biểu đồ thống kê (Chart.js)
 *    - Modal, toast notification
 * ================================================================
 */

class UIController {

    /**
     * Khởi tạo UI Controller
     * @param {StudentManager} quanLy — Bộ quản lý sinh viên
     */
    constructor(quanLy) {
        this.manager = quanLy;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.editingStudentId = null;

        // Biểu đồ Chart.js
        this.rankChart = null;
        this.classChart = null;

        // Gắn sự kiện
        this.initEventListeners();
    }

    /* ============================================================
     *  KHỞI TẠO SỰ KIỆN
     * ============================================================ */
    initEventListeners() {
        // Điều hướng
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Form thêm sinh viên
        document.getElementById('studentForm').addEventListener('submit', (e) => this.handleAddStudent(e));

        // Sắp xếp
        document.getElementById('sortBtn').addEventListener('click', () => this.handleSort());

        // Tìm kiếm
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('resetSearchBtn').addEventListener('click', () => this.resetSearch());
        document.getElementById('searchKeyword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Xuất dữ liệu
        document.getElementById('exportBtn').addEventListener('click', () => this.handleExport());

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.closeModal();
        });

        // Phím tắt
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    /* ============================================================
     *  ĐIỀU HƯỚNG
     * ============================================================ */
    handleNavigation(e) {
        const btn = e.currentTarget;
        const sectionId = btn.dataset.section;

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        switch (sectionId) {
            case 'dashboard':    this.updateDashboard(); break;
            case 'student-list': this.renderStudentTable(); break;
            case 'statistics':   this.updateStatistics(); break;
        }
    }

    /* ============================================================
     *  THÊM SINH VIÊN
     * ============================================================ */
    handleAddStudent(e) {
        e.preventDefault();

        const duLieu = {
            id: document.getElementById('studentId').value.trim(),
            name: document.getElementById('studentName').value.trim(),
            dob: document.getElementById('studentDob').value,
            gender: document.getElementById('studentGender').value,
            className: document.getElementById('studentClass').value.trim(),
            email: document.getElementById('studentEmail').value.trim(),
            phone: document.getElementById('studentPhone').value.trim(),
            address: document.getElementById('studentAddress').value.trim(),
            scores: {
                math: document.getElementById('scoreMath').value ? parseFloat(document.getElementById('scoreMath').value) : null,
                literature: document.getElementById('scoreLiterature').value ? parseFloat(document.getElementById('scoreLiterature').value) : null,
                english: document.getElementById('scoreEnglish').value ? parseFloat(document.getElementById('scoreEnglish').value) : null
            }
        };

        const sinhVien = new Student(duLieu);
        const ketQua = this.manager.addStudent(sinhVien);

        if (ketQua.success) {
            this.showToast(ketQua.message, 'success');
            document.getElementById('studentForm').reset();
            this.updateHeader();
            this.updateDashboard();
        } else {
            this.showToast(ketQua.message, 'error');
        }
    }

    /* ============================================================
     *  SẮP XẾP — sử dụng ThuatToanSapXep.js
     * ============================================================ */
    handleSort() {
        const truong = document.getElementById('sortBy').value;
        const thuTu = document.getElementById('sortOrder').value;
        this.renderStudentTable(truong, thuTu);
        this.showToast('Đã sắp xếp danh sách!', 'info');
    }

    /* ============================================================
     *  TÌM KIẾM — sử dụng ThuatToanTimKiem.js
     * ============================================================ */
    handleSearch() {
        const tieuChi = {
            keyword: document.getElementById('searchKeyword').value,
            field: document.getElementById('searchField').value,
            rank: document.getElementById('searchRank').value,
            gender: document.getElementById('searchGender').value
        };

        const ketQua = this.manager.searchStudents(tieuChi);
        this.renderSearchResults(ketQua);
    }

    resetSearch() {
        document.getElementById('searchKeyword').value = '';
        document.getElementById('searchField').value = 'all';
        document.getElementById('searchRank').value = 'all';
        document.getElementById('searchGender').value = 'all';

        document.getElementById('searchResultBody').innerHTML = `
            <tr><td colspan="9" class="no-data">Nhập thông tin để tìm kiếm</td></tr>
        `;
        document.getElementById('searchCount').textContent = '0';
    }

    /* ============================================================
     *  XUẤT DỮ LIỆU
     * ============================================================ */
    handleExport() {
        const jsonData = this.manager.exportToJSON();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `students_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Đã xuất dữ liệu thành công!', 'success');
    }

    /* ============================================================
     *  CẬP NHẬT HEADER & DASHBOARD
     * ============================================================ */
    updateHeader() {
        document.getElementById('totalStudents').textContent = `Tổng số: ${this.manager.getCount()} sinh viên`;
    }

    updateDashboard() {
        const thongKe = this.manager.getStatistics();

        document.getElementById('dashTotalStudents').textContent = thongKe.total;
        document.getElementById('dashExcellent').textContent = thongKe.byRank['Xuất sắc'] || 0;
        document.getElementById('dashGood').textContent = thongKe.byRank['Giỏi'] || 0;
        document.getElementById('dashAverage').textContent = thongKe.byRank['Khá'] || 0;
        document.getElementById('dashWeak').textContent =
            (thongKe.byRank['Trung bình'] || 0) + (thongKe.byRank['Yếu'] || 0);

        // Sinh viên gần đây
        const ganDay = this.manager.getRecentStudents(5);
        const container = document.getElementById('recentStudents');

        if (ganDay.length === 0) {
            container.innerHTML = '<p class="no-data">Chưa có sinh viên nào</p>';
        } else {
            container.innerHTML = ganDay.map(sv => `
                <div class="recent-item">
                    <div class="recent-item-info">
                        <div class="recent-item-avatar">${sv.getInitials()}</div>
                        <div class="recent-item-details">
                            <h4>${sv.name}</h4>
                            <p>${sv.id} - ${sv.className}</p>
                        </div>
                    </div>
                    <span class="recent-item-gpa">${sv.calculateGPA() !== null ? sv.calculateGPA().toFixed(2) : 'N/A'}</span>
                </div>
            `).join('');
        }
    }

    /* ============================================================
     *  BẢNG DANH SÁCH SINH VIÊN + PHÂN TRANG
     * ============================================================ */
    renderStudentTable(sortBy = 'id', sortOrder = 'asc') {
        const students = this.manager.sortStudents(sortBy, sortOrder);
        const tbody = document.getElementById('studentTableBody');

        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="no-data">Chưa có sinh viên nào</td></tr>`;
            this.renderPagination(0);
            return;
        }

        const totalPages = Math.ceil(students.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = 1;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, students.length);
        const pageStudents = students.slice(startIndex, endIndex);

        tbody.innerHTML = pageStudents.map((sv, index) => {
            const gpa = sv.calculateGPA();
            const rank = sv.getRank();
            const rankClass = sv.getRankClass();

            return `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td><strong>${sv.id}</strong></td>
                    <td>${sv.name}</td>
                    <td>${sv.getFormattedDob()}</td>
                    <td>${sv.gender}</td>
                    <td>${sv.className}</td>
                    <td><strong>${gpa !== null ? gpa.toFixed(2) : 'N/A'}</strong></td>
                    <td><span class="rank-badge ${rankClass}">${rank}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" onclick="app.ui.viewStudent('${sv.id}')" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="app.ui.editStudent('${sv.id}')" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="app.ui.confirmDelete('${sv.id}')" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }

        let html = `<button ${this.currentPage === 1 ? 'disabled' : ''} onclick="app.ui.goToPage(${this.currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                html += `<button class="${i === this.currentPage ? 'active' : ''}" onclick="app.ui.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += '<button disabled>...</button>';
            }
        }

        html += `<button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="app.ui.goToPage(${this.currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
        pagination.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderStudentTable(
            document.getElementById('sortBy').value,
            document.getElementById('sortOrder').value
        );
    }

    /* ============================================================
     *  KẾT QUẢ TÌM KIẾM
     * ============================================================ */
    renderSearchResults(students) {
        const tbody = document.getElementById('searchResultBody');
        document.getElementById('searchCount').textContent = students.length;

        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="no-data">Không tìm thấy sinh viên phù hợp</td></tr>`;
            return;
        }

        tbody.innerHTML = students.map((sv, index) => {
            const gpa = sv.calculateGPA();
            const rank = sv.getRank();
            const rankClass = sv.getRankClass();

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${sv.id}</strong></td>
                    <td>${sv.name}</td>
                    <td>${sv.getFormattedDob()}</td>
                    <td>${sv.gender}</td>
                    <td>${sv.className}</td>
                    <td><strong>${gpa !== null ? gpa.toFixed(2) : 'N/A'}</strong></td>
                    <td><span class="rank-badge ${rankClass}">${rank}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" onclick="app.ui.viewStudent('${sv.id}')" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="app.ui.editStudent('${sv.id}')" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="app.ui.confirmDelete('${sv.id}')" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    /* ============================================================
     *  XEM CHI TIẾT SINH VIÊN
     * ============================================================ */
    viewStudent(id) {
        const sv = this.manager.getStudentById(id);
        if (!sv) { this.showToast('Không tìm thấy sinh viên!', 'error'); return; }

        const gpa = sv.calculateGPA();
        const rank = sv.getRank();
        const rankClass = sv.getRankClass();

        document.getElementById('modalTitle').innerHTML = `<i class="fas fa-user"></i> Chi tiết sinh viên`;
        document.getElementById('modalBody').innerHTML = `
            <div class="student-detail">
                <div class="detail-row"><div class="detail-label"><i class="fas fa-id-card"></i> Mã sinh viên</div><div class="detail-value"><strong>${sv.id}</strong></div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-user"></i> Họ và tên</div><div class="detail-value">${sv.name}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-calendar"></i> Ngày sinh</div><div class="detail-value">${sv.getFormattedDob()} (${sv.getAge()} tuổi)</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-venus-mars"></i> Giới tính</div><div class="detail-value">${sv.gender}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-chalkboard"></i> Lớp</div><div class="detail-value">${sv.className}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-envelope"></i> Email</div><div class="detail-value">${sv.email || 'Chưa cập nhật'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-phone"></i> Điện thoại</div><div class="detail-value">${sv.phone || 'Chưa cập nhật'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-map-marker-alt"></i> Địa chỉ</div><div class="detail-value">${sv.address || 'Chưa cập nhật'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-calculator"></i> Điểm Toán</div><div class="detail-value">${sv.scores.math !== null ? sv.scores.math : 'Chưa có'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-book"></i> Điểm Văn</div><div class="detail-value">${sv.scores.literature !== null ? sv.scores.literature : 'Chưa có'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-language"></i> Điểm Anh</div><div class="detail-value">${sv.scores.english !== null ? sv.scores.english : 'Chưa có'}</div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-graduation-cap"></i> Điểm TB</div><div class="detail-value"><strong>${gpa !== null ? gpa.toFixed(2) : 'Chưa có'}</strong></div></div>
                <div class="detail-row"><div class="detail-label"><i class="fas fa-medal"></i> Xếp loại</div><div class="detail-value"><span class="rank-badge ${rankClass}">${rank}</span></div></div>
            </div>
        `;
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="app.ui.closeModal()">Đóng</button>
            <button class="btn btn-primary" onclick="app.ui.editStudent('${sv.id}')"><i class="fas fa-edit"></i> Sửa</button>
        `;
        this.openModal();
    }

    /* ============================================================
     *  SỬA SINH VIÊN
     * ============================================================ */
    editStudent(id) {
        const sv = this.manager.getStudentById(id);
        if (!sv) { this.showToast('Không tìm thấy sinh viên!', 'error'); return; }

        this.editingStudentId = id;

        document.getElementById('modalTitle').innerHTML = `<i class="fas fa-edit"></i> Sửa thông tin sinh viên`;
        document.getElementById('modalBody').innerHTML = `
            <form id="editForm" class="edit-form">
                <div class="form-row">
                    <div class="form-group"><label><i class="fas fa-id-card"></i> Mã sinh viên</label><input type="text" value="${sv.id}" disabled></div>
                    <div class="form-group"><label><i class="fas fa-user"></i> Họ và tên *</label><input type="text" id="editName" value="${sv.name}" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label><i class="fas fa-calendar"></i> Ngày sinh *</label><input type="date" id="editDob" value="${sv.dob}" required></div>
                    <div class="form-group"><label><i class="fas fa-venus-mars"></i> Giới tính *</label>
                        <select id="editGender" required>
                            <option value="Nam" ${sv.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                            <option value="Nữ" ${sv.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label><i class="fas fa-chalkboard"></i> Lớp *</label><input type="text" id="editClass" value="${sv.className}" required></div>
                    <div class="form-group"><label><i class="fas fa-envelope"></i> Email</label><input type="email" id="editEmail" value="${sv.email || ''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label><i class="fas fa-phone"></i> Số điện thoại</label><input type="tel" id="editPhone" value="${sv.phone || ''}"></div>
                    <div class="form-group"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ</label><input type="text" id="editAddress" value="${sv.address || ''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label><i class="fas fa-calculator"></i> Điểm Toán</label><input type="number" id="editMath" value="${sv.scores.math !== null ? sv.scores.math : ''}" min="0" max="10" step="0.1"></div>
                    <div class="form-group"><label><i class="fas fa-book"></i> Điểm Văn</label><input type="number" id="editLiterature" value="${sv.scores.literature !== null ? sv.scores.literature : ''}" min="0" max="10" step="0.1"></div>
                    <div class="form-group"><label><i class="fas fa-language"></i> Điểm Anh</label><input type="number" id="editEnglish" value="${sv.scores.english !== null ? sv.scores.english : ''}" min="0" max="10" step="0.1"></div>
                </div>
            </form>
        `;
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="app.ui.closeModal()">Hủy</button>
            <button class="btn btn-primary" onclick="app.ui.saveStudent()"><i class="fas fa-save"></i> Lưu</button>
        `;
        this.openModal();
    }

    saveStudent() {
        if (!this.editingStudentId) return;

        const duLieu = {
            name: document.getElementById('editName').value.trim(),
            dob: document.getElementById('editDob').value,
            gender: document.getElementById('editGender').value,
            className: document.getElementById('editClass').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            address: document.getElementById('editAddress').value.trim(),
            scores: {
                math: document.getElementById('editMath').value ? parseFloat(document.getElementById('editMath').value) : null,
                literature: document.getElementById('editLiterature').value ? parseFloat(document.getElementById('editLiterature').value) : null,
                english: document.getElementById('editEnglish').value ? parseFloat(document.getElementById('editEnglish').value) : null
            }
        };

        const ketQua = this.manager.updateStudent(this.editingStudentId, duLieu);

        if (ketQua.success) {
            this.showToast(ketQua.message, 'success');
            this.closeModal();
            this.renderStudentTable();
            this.updateDashboard();
        } else {
            this.showToast(ketQua.message, 'error');
        }
    }

    /* ============================================================
     *  XOÁ SINH VIÊN (xác nhận)
     * ============================================================ */
    confirmDelete(id) {
        const sv = this.manager.getStudentById(id);
        if (!sv) { this.showToast('Không tìm thấy sinh viên!', 'error'); return; }

        document.getElementById('modalTitle').innerHTML = `<i class="fas fa-exclamation-triangle"></i> Xác nhận xóa`;
        document.getElementById('modalBody').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-trash-alt" style="font-size: 4rem; color: var(--danger-color); margin-bottom: 20px;"></i>
                <h3>Bạn có chắc chắn muốn xóa?</h3>
                <p style="margin-top: 15px; color: var(--text-secondary);">
                    Sinh viên: <strong>${sv.name}</strong> (${sv.id})<br>
                    Hành động này không thể hoàn tác!
                </p>
            </div>
        `;
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="app.ui.closeModal()">Hủy</button>
            <button class="btn btn-danger" onclick="app.ui.deleteStudent('${id}')"><i class="fas fa-trash"></i> Xóa</button>
        `;
        this.openModal();
    }

    deleteStudent(id) {
        const ketQua = this.manager.deleteStudent(id);

        if (ketQua.success) {
            this.showToast(ketQua.message, 'success');
            this.closeModal();
            this.renderStudentTable();
            this.updateHeader();
            this.updateDashboard();
            this.handleSearch();
        } else {
            this.showToast(ketQua.message, 'error');
        }
    }

    /* ============================================================
     *  THỐNG KÊ + BIỂU ĐỒ — sử dụng ThuatToanThongKe.js
     * ============================================================ */
    updateStatistics() {
        const thongKe = this.manager.getStatistics();

        document.getElementById('statAvgGPA').textContent = thongKe.gpa.average.toFixed(2);
        document.getElementById('statMaxGPA').textContent = thongKe.gpa.max.toFixed(2);
        document.getElementById('statMinGPA').textContent = thongKe.gpa.min.toFixed(2);

        this.renderRankChart(thongKe.byRank);
        this.renderClassChart(thongKe.byClass);
        this.renderStatsTable(thongKe.byClass);
    }

    /** Biểu đồ phân bố xếp loại (Doughnut) */
    renderRankChart(rankData) {
        const ctx = document.getElementById('rankChart').getContext('2d');
        if (this.rankChart) this.rankChart.destroy();

        const labels = ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu'];
        const data = labels.map(l => rankData[l] || 0);
        const colors = ['#06d6a0', '#118ab2', '#ffd166', '#ef476f', '#073b4c'];

        this.rankChart = new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });

        document.getElementById('rankLegend').innerHTML = labels.map((l, i) =>
            `<div class="legend-item"><span class="legend-color" style="background: ${colors[i]}"></span><span>${l}: ${data[i]}</span></div>`
        ).join('');
    }

    /** Biểu đồ theo lớp (Bar + Line) */
    renderClassChart(classData) {
        const ctx = document.getElementById('classChart').getContext('2d');
        if (this.classChart) this.classChart.destroy();

        const labels = Object.keys(classData);
        const counts = labels.map(c => classData[c].count);
        const gpas = labels.map(c => classData[c].gpaAverage);

        this.classChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Số sinh viên', data: counts, backgroundColor: 'rgba(67, 97, 238, 0.7)', borderColor: '#4361ee', borderWidth: 1, yAxisID: 'y' },
                    { label: 'Điểm TB', data: gpas, type: 'line', borderColor: '#ef476f', backgroundColor: 'rgba(239, 71, 111, 0.1)', borderWidth: 2, fill: true, tension: 0.4, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: { type: 'linear', position: 'left', title: { display: true, text: 'Số sinh viên' }, beginAtZero: true },
                    y1: { type: 'linear', position: 'right', title: { display: true, text: 'Điểm TB' }, min: 0, max: 10, grid: { drawOnChartArea: false } }
                }
            }
        });
    }

    /** Bảng thống kê theo lớp */
    renderStatsTable(classData) {
        const tbody = document.getElementById('statsTableBody');
        const classes = Object.keys(classData);

        if (classes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Chưa có dữ liệu</td></tr>';
            return;
        }

        tbody.innerHTML = classes.map(tenLop => {
            const d = classData[tenLop];
            return `
                <tr>
                    <td><strong>${tenLop}</strong></td>
                    <td>${d.count}</td>
                    <td><strong>${d.gpaAverage.toFixed(2)}</strong></td>
                    <td>${d.ranks['Xuất sắc'] || 0}</td>
                    <td>${d.ranks['Giỏi'] || 0}</td>
                    <td>${d.ranks['Khá'] || 0}</td>
                    <td>${(d.ranks['Trung bình'] || 0) + (d.ranks['Yếu'] || 0)}</td>
                </tr>
            `;
        }).join('');
    }

    /* ============================================================
     *  MODAL & TOAST
     * ============================================================ */
    openModal() {
        document.getElementById('modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('modal').classList.remove('show');
        document.body.style.overflow = '';
        this.editingStudentId = null;
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    /** Khởi tạo giao diện */
    init() {
        this.updateHeader();
        this.updateDashboard();
        console.log('[GiaoDiện] Đã khởi tạo giao diện');
    }
}

// ================================================================
//  Export
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
