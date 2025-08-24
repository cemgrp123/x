// Global değişkenler
let allData = [];
let currentPage = 1;
const pageSize = 10;

// Arama fonksiyonu
function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const tbody = document.querySelector(".data-table tbody");
    const rows = tbody.getElementsByTagName("tr");
    let found = false;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length >= 2) {
            const txtValueNo = cells[0].textContent || cells[0].innerText;
            const txtValueName = cells[1].textContent || cells[1].innerText;

            if (txtValueNo.toUpperCase().includes(filter) || txtValueName.toUpperCase().includes(filter)) {
                rows[i].style.display = "";
                found = true;
            } else {
                rows[i].style.display = "none";
            }
        }
    }

    const noResults = document.getElementById("noResults");
    if (noResults) {
        noResults.style.display = !found && filter.length > 0 ? "block" : "none";
    }
}

// Backend'den veri çek
function fetchRaporlar() {
    fetch('http://localhost:5128/api/RaporIstekleri')
        .then(res => {
            if (!res.ok) throw new Error('Veriler alınamadı');
            return res.json();
        })
        .then(data => {
            allData = data;
            currentPage = 1;
            renderTable();
            renderPagination();
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Raporlar yüklenirken hata oluştu.');
        });
}

// Durum yazısı ve class'ını döndür
function getDurumTextClass(durum) {
    switch (durum) {
        case 1: return { text: 'Onaylandı', class: 'status-present' };
        case 2: return { text: 'Reddedildi', class: 'status-absent' };
        default: return { text: 'Beklemede', class: 'status-pending' };
    }
}

// Tabloyu render et
function renderTable() {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = allData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Kayıt bulunamadı.</td></tr>`;
        return;
    }

    pageData.forEach(item => {
        const { text: durumText, class: durumClass } = getDurumTextClass(item.durum);
        const tarihStr = item.tarih ? item.tarih.substring(0, 10) : '';
        const zamanStr = item.zaman ? item.zaman.substring(11, 16) : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.okulNo}</td>
            <td>${item.adSoyad}</td>
            <td>${item.sinif}</td>
            <td><span class="badge badge-primary">${item.sube}</span></td>
            <td>${tarihStr}</td>
            <td>${zamanStr}</td>
            <td><span class="status ${durumClass}">${durumText}</span></td>
            <td>${item.raporNedeni || ''}</td>
            <td>
                <div class="btn-group">
                <button class="btn btn-success btn-sm" data-id="${item.id}">Onayla</button>
                <button class="btn btn-danger btn-sm" data-id="${item.id}">Reddet</button>

                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    searchTable();
}

// Sayfalama
function renderPagination() {
    const totalPages = Math.ceil(allData.length / pageSize);
    const pageInfo = document.getElementById('pageInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (!pageInfo || !paginationControls) return;

    pageInfo.textContent = `Toplam ${allData.length} kayıt • Sayfa ${currentPage} / ${totalPages}`;
    paginationControls.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '❮';
    prevBtn.className = 'page-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination();
        }
    };
    paginationControls.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.onclick = () => {
            currentPage = i;
            renderTable();
            renderPagination();
        };
        paginationControls.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '❯';
    nextBtn.className = 'page-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
        }
    };
    paginationControls.appendChild(nextBtn);
}

// Backend'e PUT isteği gönder
function updateDataStatus(id, yeniDurum) {
    fetch(`http://localhost:5128/api/RaporIstekleri/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durum: yeniDurum })
    })
        .then(res => {
            if (!res.ok) throw new Error('Durum güncellenemedi');
            return res.json();
        })
        .then(data => {
            console.log('Güncelleme başarılı:', data);
            const item = allData.find(d => d.id == id);
            if (item) item.durum = yeniDurum;
            renderTable(); // Güncellenmiş hali tekrar render et
        })
        .catch(err => {
            alert('Durum güncellenirken hata oluştu.');
            console.error(err);
        });
}

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('.data-table tbody');
    if (tbody) {
        tbody.addEventListener('click', e => {
            const btn = e.target;
            if (btn.classList.contains('btn-success') || btn.classList.contains('btn-danger')) {
                const id = btn.getAttribute('data-id');
                const yeniDurum = btn.classList.contains('btn-success') ? 1 : 2;
                updateDataStatus(id, yeniDurum);
            }
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener('keyup', searchTable);
    }

    fetchRaporlar();
});
