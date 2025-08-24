fetch('/api/ogrenciler/ozet')
  .then(response => response.json())
  .then(data => {
    // Sayıya göre kartı güncelle
    document.getElementById('toplamOgrenci').innerText = data.length;

    // (İsteğe bağlı) Konsolda verileri inceleyebilirsin
    console.table(data);
  })
  .catch(error => {
    console.error('Öğrenci özet verileri alınamadı:', error);
  });
function showStudentList(type) {
  const modalEl = document.getElementById('studentListModal');
  const modal = new bootstrap.Modal(modalEl);
  const listEl = document.getElementById('studentList');
  const searchInput = document.getElementById('studentSearchInput');
  const titleEl = document.getElementById('studentListModalLabel');

  const titleMap = {
    'toplam': 'Tüm Öğrenciler',
    'gecis': 'Geçiş Yapan Öğrenciler',
    'kalan': 'Kalan Öğrenciler',
    'raporlu': 'Raporlu Öğrenciler',
    'raporbugun': 'Bugünkü Rapor İstekleri'
  };

  titleEl.innerHTML = `<i class="fas fa-users me-2"></i>${titleMap[type] || 'Öğrenci Listesi'}`;
  searchInput.value = '';
  searchInput.oninput = null;
  listEl.innerHTML = `<li class="list-group-item text-center">Yükleniyor...</li>`;

  // GEÇİŞ YAPANLAR HTML'DEN OKUNUR
  if (type === 'gecis') {
    const gecisRows = document.querySelectorAll('#gecisListesi tr');
    document.getElementById('gecisYapan').textContent = gecisRows.length;

    if (gecisRows.length === 0) {
      listEl.innerHTML = `<li class="list-group-item text-center text-muted">Geçiş yapan öğrenci yok</li>`;
    } else {
      let students = [];
      gecisRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        students.push({
          fullName: cells[1]?.innerText.trim(),
          schoolNo: cells[0]?.innerText.trim(),
          studentClass: cells[2]?.innerText.trim(),
          section: cells[3]?.innerText.trim()
        });
      });

      function renderList(list) {
        if (list.length === 0) {
          listEl.innerHTML = `<li class="list-group-item text-center text-muted">Aramaya uygun öğrenci bulunamadı</li>`;
          return;
        }
        listEl.innerHTML = list.map(ogr => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${ogr.fullName} (${ogr.schoolNo})
            <span class="badge bg-primary rounded-pill">${ogr.studentClass}-${ogr.section}</span>
          </li>
        `).join('');
      }

      renderList(students);

      searchInput.oninput = () => {
        const term = searchInput.value.toLowerCase();
        const filtered = students.filter(ogr =>
          `${ogr.fullName} ${ogr.schoolNo} ${ogr.studentClass} ${ogr.section}`.toLowerCase().includes(term)
        );
        renderList(filtered);
      };
    }

    modal.show();
    return;
  }

  // BUGÜNKÜ RAPOR İSTEKLERİ
  if (type === 'raporbugun') {
    titleEl.innerHTML = `<i class="fas fa-user-clock me-2"></i>${titleMap[type]}`;
    listEl.innerHTML = `<li class="list-group-item text-center">Yükleniyor...</li>`;

    fetch('/api/raporistekleri')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          listEl.innerHTML = `<li class="list-group-item text-center text-muted">Hiç rapor isteği yok</li>`;
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const bugunIstekler = data.filter(item => item.tarih?.startsWith(today));

        if (bugunIstekler.length === 0) {
          listEl.innerHTML = `<li class="list-group-item text-center text-muted">Bugün için rapor isteği bulunamadı</li>`;
          return;
        }

        function renderList(list) {
          if (list.length === 0) {
            listEl.innerHTML = `<li class="list-group-item text-center text-muted">Aramaya uygun öğrenci bulunamadı</li>`;
            return;
          }

          listEl.innerHTML = list.map(item => `
            <li class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>${item.adSoyad}</strong> (${item.okulNo})<br>
                  <small class="text-muted">${item.raporNedeni}</small>
                </div>
                <span class="badge bg-warning rounded-pill">${item.sinif}-${item.sube}</span>
              </div>
            </li>
          `).join('');
        }

        renderList(bugunIstekler);

        searchInput.oninput = () => {
          const term = searchInput.value.toLowerCase();
          const filtered = bugunIstekler.filter(item =>
            `${item.adSoyad} ${item.okulNo} ${item.sinif} ${item.sube} ${item.raporNedeni}`.toLowerCase().includes(term)
          );
          renderList(filtered);
        };

        modal.show();
      })
      .catch(() => {
        listEl.innerHTML = `<li class="list-group-item text-center text-danger">Veri alınırken hata oluştu</li>`;
      });

    return;
  }

  // DİĞER TÜRLER API'DAN ÇEKİLİR
  fetch('/api/ogrenciler')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        listEl.innerHTML = `<li class="list-group-item text-center text-muted">Öğrenci bulunamadı</li>`;
        return;
      }

      let filteredData;

      if (type === 'kalan') {
        const gecisRows = document.querySelectorAll('#gecisListesi tr');
        const gecenOkulNumaralari = new Set();
        gecisRows.forEach(row => {
          const no = row.cells[0]?.innerText.trim();
          if (no) gecenOkulNumaralari.add(no);
        });

        filteredData = data.filter(ogr => !gecenOkulNumaralari.has(String(ogr.schoolNo)));
        document.getElementById('cikisYapan').textContent = filteredData.length;
      } else if (type === 'raporlu') {
        filteredData = data.filter(ogr => ogr.status === 'raporlu');
      } else {
        filteredData = data;
      }

      if (filteredData.length === 0) {
        listEl.innerHTML = `<li class="list-group-item text-center text-muted">Bu kategoride öğrenci bulunamadı</li>`;
        return;
      }

      let currentList = filteredData;

      function renderList(list) {
        if (list.length === 0) {
          listEl.innerHTML = `<li class="list-group-item text-center text-muted">Aramaya uygun öğrenci bulunamadı</li>`;
          return;
        }
        listEl.innerHTML = list.map(ogr => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${ogr.fullName} (${ogr.schoolNo})
            <span class="badge bg-${type === 'kalan' ? 'danger' : 'primary'} rounded-pill">${ogr.studentClass}-${ogr.section}</span>
          </li>
        `).join('');
      }

      renderList(currentList);

      searchInput.oninput = () => {
        const term = searchInput.value.toLowerCase();
        const searched = currentList.filter(ogr =>
          `${ogr.fullName} ${ogr.schoolNo} ${ogr.studentClass} ${ogr.section}`.toLowerCase().includes(term)
        );
        renderList(searched);
      };

      modal.show();
    })
    .catch(() => {
      listEl.innerHTML = `<li class="list-group-item text-center text-danger">Veri alınırken hata oluştu</li>`;
    });
}



const form = document.getElementById('gecisForm');
const okulNoInput = document.getElementById('okulNo');
const gecisListesi = document.getElementById('gecisListesi');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const okulNo = parseInt(okulNoInput.value);
  if (okulNoVarMi('gecisListesi', okulNo)) {
    showToast('Bu okul numarası zaten listede var, tekrar eklenemez.');
    return; // Eklemeyi durdur
  }

  if (isNaN(okulNo) || okulNo <= 0) {
    showToast('Lütfen geçerli bir okul numarası girin.');
    return;
  }

  try {
    const response = await fetch('/api/gecis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ OkulNo: okulNo })
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.message || 'Bir hata oluştu.');
      return;
    }

    const data = await response.json();

    // Anlık tarih ve saat
    const simdi = new Date();
    const tarih = simdi.toLocaleDateString();
    const zaman = simdi.toLocaleTimeString();

    // Yeni satır oluştur
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${data.okulNo}</td>
        <td>${data.adSoyad}</td>
        <td>${data.sinif}</td>
        <td>${data.sube}</td>
        <td>${zaman}</td>
        <td>${tarih}</td>
      `;

    // Listenin en başına ekle
    gecisListesi.prepend(tr);

    okulNoInput.value = '';
    okulNoInput.focus();

  } catch (error) {
    alert('Sunucuya bağlanırken hata oluştu.');
    console.error(error);
  }

});
function okulNoVarMi(tbodyId, okulNo) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return false;

  const okulNoStr = String(okulNo).trim();

  for (let i = 0; i < tbody.rows.length; i++) {
    const mevcutNo = tbody.rows[i].cells[0]?.textContent.trim();
    if (mevcutNo === okulNoStr) {
      return true; // Bulundu, tekrar eklenemez
    }
  }
  return false; // Bulunmadı, eklenebilir
}
// Toast gösterme fonksiyonu
function showToast(message, type = "success", duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      visibility: hidden;
      min-width: 250px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 10px;
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      font-family: Arial, sans-serif;
      font-size: 14px;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  // Türüne göre arka plan rengini ayarla
  switch (type.toLowerCase()) {
    case "success":
      toast.style.backgroundColor = "#28a745"; // yeşil
      break;
    case "error":
      toast.style.backgroundColor = "#dc3545"; // kırmızı
      break;
    case "warning":
      toast.style.backgroundColor = "#fd7e14"; // turuncu
      break;
    default:
      toast.style.backgroundColor = "#333"; // varsayılan koyu gri
  }

  toast.textContent = message;
  toast.style.visibility = 'visible';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.visibility = 'hidden';
    }, 500);
  }, duration);
}

// alert'i override et, default tipi success yap
window.alert = function (message) {
  showToast(message, "success");
};

// Ekstra fonksiyonlar: error ve warning toastları için kolay kullanım
window.alertError = function (message) {
  showToast(message, "error");
};

window.alertWarning = function (message) {
  showToast(message, "warning");
};

function veriAktarildi() {
  const rows = document.querySelectorAll("#gecisListesi tr");
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 6) {
      data.push({
        okulNo: parseInt(cells[0].innerText),
        adSoyad: cells[1].innerText,
        sinif: cells[2].innerText,
        sube: cells[3].innerText,
        zaman: cells[4].innerText,
        tarih: cells[5].innerText
      });
    }
  });

  fetch("/api/gecisler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        alert("Geçişler başarıyla kaydedildi!");
      } else {
        alert("Kayıt başarısız.");
      }
    })
    .catch(err => {
      console.error("Hata:", err);
      alert("Sunucu hatası.");
    });
}
function updateKalanOgrenciSayisi() {
  const gecisRows = document.querySelectorAll('#gecisListesi tr');
  const gecisSet = new Set();
  gecisRows.forEach(row => {
    const okulNo = row.cells[0]?.innerText.trim();
    if (okulNo) gecisSet.add(okulNo);
  });

  fetch('/api/ogrenciler')
    .then(res => res.json())
    .then(data => {
      const kalanlar = data.filter(ogr => !gecisSet.has(String(ogr.schoolNo)));
      const cikisEl = document.getElementById('cikisYapan');
      if (cikisEl) cikisEl.textContent = kalanlar.length;
    })
    .catch(() => { });
}

// Sayfa yüklendiğinde çalıştır (ilk değer için)
updateKalanOgrenciSayisi();

// #gecisListesi DOM'u değiştiğinde anında güncelle
const targetNode = document.getElementById('gecisListesi');

if (targetNode) {
  const observer = new MutationObserver(mutations => {
    updateKalanOgrenciSayisi();
  });

  observer.observe(targetNode, { childList: true, subtree: true });
}

////////////////////////////////////////////////////////////

function showToast(message, type = "info") {
  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  const container = document.getElementById("toast-container");
  container.insertAdjacentHTML("beforeend", toastHtml);
  const toastElem = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElem, { delay: 3000 });
  bsToast.show();

  // Toast kapandığında DOM'dan sil
  toastElem.addEventListener("hidden.bs.toast", () => {
    toastElem.remove();
  });
}
window.alert = function(message) {
  showToast(message, "danger");
};









