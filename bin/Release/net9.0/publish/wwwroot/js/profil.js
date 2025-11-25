
// PROFİL MODAL AÇILDIĞINDA BİLGİLERİ YÜKLE
$('#profilModal').on('show.bs.modal', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const schoolNo = urlParams.get('schoolNo');

  if (!schoolNo) {
    alert("Kullanıcı bilgisi bulunamadı.");
    return;
  }

  fetch(`/api/profile/${schoolNo}`)
    .then(response => response.json())
    .then(data => {
      $('#inputSchoolNo').val(data.schoolNo || '');
      $('#inputFullName').val(data.fullName || '');
      $('#inputClass').val(data.studentClass || '');
      $('#inputSection').val(data.section || '');
      $('#inputParentName').val(data.parentName || '');
      $('#inputPhone').val(data.parentContact || '');
      $('#inputEmail').val(data.email || '');
      $('#profileImage').attr('src', data.profilePhotoPath || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
    })
    .catch(error => alert("Veri alınamadı: " + error.message));
});

// PROFİL GÜNCELLEME FORMU
document.getElementById('profileForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const schoolNo = urlParams.get('schoolNo');

  if (!schoolNo) {
    alert("Kullanıcı bilgisi bulunamadı.");
    return;
  }

  const formData = new FormData();
  formData.append("FullName", document.getElementById('inputFullName').value);
  formData.append("StudentClass", parseInt(document.getElementById('inputClass').value) || 0);
  formData.append("Section", document.getElementById('inputSection').value);
  formData.append("ParentName", document.getElementById('inputParentName').value);
  formData.append("ParentContact", document.getElementById('inputPhone').value);
  formData.append("Email", document.getElementById('inputEmail').value);

  const fileInput = document.getElementById('upload');
  if (fileInput.files.length > 0) {
    formData.append("profilePhoto", fileInput.files[0]);
  }

fetch(`https://www.yemekhanegltp.com/api/profile/${schoolNo}`, {
    method: 'PUT',
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('Güncelleme başarısız');
      alert('Profil güncellendi!');
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert('Profil güncellenirken hata oluştu.');
    });
});

// RESİM ÖNİZLEME
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const preview = document.getElementById("preview");
    if (preview) {
      preview.src = reader.result;
      preview.style.display = "block";
    } else {
      console.warn("Önizleme için 'preview' ID'sine sahip bir <img> etiketi bulunamadı.");
    }
  };
  reader.readAsDataURL(file);
}
function logout() {
  // İsteğe bağlı: Çıkış yapmadan önce kullanıcı oturumunu temizlemek için
  // localStorage.clear(); // veya belirli öğeleri kaldırın
  // sessionStorage.clear();

  // Kullanıcıyı login.html sayfasına yönlendir
  window.location.href = 'login.html';
}

// js/profil.js dosyasındaki diğer kodlarınız...
// ... (Ödeme, bildirim, filtreleme, modal işlemleri vb.)
const params = new URLSearchParams(window.location.search);
const schoolNo = params.get('schoolNo');

fetch(`/api/profile/${schoolNo}`)
  .then(response => {
    if (!response.ok) {
      // Kullanıcı bulunamadıysa direkt yönlendir
      window.location.href = '/silindi.html';
      return;
    }
    return response.json();
  })
  .then(data => {
    if (data) {
      // Profili göster
      document.getElementById('fullName').innerText = data.fullName;
      // diğer alanları da doldur
    }
  });


// 9 ayın listesi (örnek, sen kendi aylarını buraya yaz)
// 9 ayın listesi (örnek, kendi aylarını buraya yaz)
const aylar = [
  "Eylül", "Ekim", "Kasım", "Aralık", "Ocak",
  "Şubat", "Mart", "Nisan", "Mayıs"
].map(a => a.trim());

let currentIndex = 0;

const prevBtn = document.querySelector(".nav-prev");
const nextBtn = document.querySelector(".nav-next");

// Navigasyon butonlarını güncelleme (disable/enable)
function updateNavButtons() {
  if (prevBtn) prevBtn.disabled = (currentIndex === 0);
  if (nextBtn) nextBtn.disabled = (currentIndex === aylar.length - 1);
}

// Ödeme gösterimini sıfırlama
function resetPaymentDisplay(ay) {
  document.getElementById("nextPaymentMonth").textContent = ay;
  document.getElementById("paymentAmount").textContent = "-";
  const statusElem = document.getElementById("paymentStatus");
  statusElem.textContent = "Yükleniyor...";
  statusElem.className = "badge-payment badge-loading";
  document.getElementById("paymentDate").textContent = "-";

  // Modal detayları da sıfırla
  document.getElementById("ayOdemesi").textContent = "₺0";
  document.getElementById("kantinHarcama").textContent = "₺0";
  document.getElementById("raporTutari").textContent = "₺0";
  document.getElementById("genelOdeme").textContent = "₺0";
}

// Ödeme bilgilerini fetch etme ve güncelleme
function fetchPaymentData(ay) {
  const newIndex = aylar.indexOf(ay);
  if (newIndex !== -1) currentIndex = newIndex;

  console.log("Cihaz:", navigator.userAgent);
  console.log("İstenen ay:", ay);

  resetPaymentDisplay(ay);

  fetch(`/api/student/payment-info/${encodeURIComponent(ay)}?t=${Date.now()}`, {
    cache: "no-store"
  })
    .then(response => {
      if (!response.ok) throw new Error("Veri bulunamadı");
      return response.json();
    })
    .then(data => {
      console.log("API’den gelen veri:", JSON.stringify(data, null, 2));

      if (!data) throw new Error("Veri boş");

      const tutar = Number(data.toplamUcret);
      document.getElementById("paymentAmount").textContent =
        isNaN(tutar)
          ? "-"
          : tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺";

      const statusElem = document.getElementById("paymentStatus");
      statusElem.textContent = "Beklemede";
      statusElem.className = "badge-payment badge-pending";

      if (data.sonOdemeTarihi) {
        const dateObj = new Date(data.sonOdemeTarihi);
        document.getElementById("paymentDate").textContent =
          dateObj.toLocaleDateString("tr-TR");
      } else {
        document.getElementById("paymentDate").textContent = "-";
      }

      // Modal ödeme detayları güncelle
      document.getElementById("ayOdemesi").textContent =
        data.ayOdemesi
          ? Number(data.ayOdemesi).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺"
          : "₺0";

      document.getElementById("kantinHarcama").textContent =
        data.kantinHarcama
          ? Number(data.kantinHarcama).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺"
          : "₺0";

      document.getElementById("raporTutari").textContent =
        data.raporTutari
          ? Number(data.raporTutari).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺"
          : "₺0";

      document.getElementById("genelOdeme").textContent =
        data.genelOdeme
          ? Number(data.genelOdeme).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " ₺"
          : "₺0";

      updateNavButtons();
    })
    .catch(err => {
      console.error(err);

      document.getElementById("nextPaymentMonth").textContent = "Veri Yok";
      document.getElementById("paymentAmount").textContent = "-";
      const statusElem = document.getElementById("paymentStatus");
      statusElem.textContent = "-";
      statusElem.className = "badge-payment";
      document.getElementById("paymentDate").textContent = "-";

      // Modal detayları sıfırla
      document.getElementById("ayOdemesi").textContent = "₺0";
      document.getElementById("kantinHarcama").textContent = "₺0";
      document.getElementById("raporTutari").textContent = "₺0";
      document.getElementById("genelOdeme").textContent = "₺0";

      updateNavButtons();
    });
}

// Sayfa ilk yüklenirken veriyi getir
fetchPaymentData(aylar[currentIndex]);
updateNavButtons();

// Önceki ay buton event
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      fetchPaymentData(aylar[currentIndex]);
    }
    updateNavButtons();
  });
}

// Sonraki ay buton event
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (currentIndex < aylar.length - 1) {
      currentIndex++;
      fetchPaymentData(aylar[currentIndex]);
    }
    updateNavButtons();
  });
}

// Dokunmatik kaydırma tamamen kaldırıldı

// Bootstrap Toast gösterme fonksiyonu
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

  toastElem.addEventListener("hidden.bs.toast", () => {
    toastElem.remove();
  });
}

// window.alert override
window.alert = function (message) {
  showToast(message, "danger");
};
//////////////////////////////////////////////////////////////////////

// Modal açma fonksiyonu, schoolNo parametresi ile çağrılacak

// URL'den schoolNo parametresini alır
function getSchoolNoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('schoolNo');
}

// Modal açma ve fetch fonksiyonu (aynı)
function openProfileModal(schoolNo) {
  const shoppingList = document.getElementById('shoppingList');
  shoppingList.innerHTML = '';

  let totalAmount = 0;

  fetch(`/api/KantinHarcama/${schoolNo}`)
    .then(response => {
      if (!response.ok) throw new Error('Veri alınamadı');
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        shoppingList.innerHTML = '<li class="list-group-item">Hiç harcama bulunamadı.</li>';
        document.getElementById('totalAmount').textContent = '0 TL';
        return;
      }

      data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center shopping-item';

        const urunSpan = document.createElement('span');
        urunSpan.textContent = item.Urun || item.urun || 'Ürün yok';

        const tutarSpan = document.createElement('span');
        const tutar = item.Tutar || item.tutar || 0;
        tutarSpan.textContent = Number(tutar).toFixed(2) + ' TL';

        const tarihDiv = document.createElement('div');
        tarihDiv.className = 'date';
        const tarih = item.Tarih || item.tarih || '';
        tarihDiv.textContent = tarih.slice(0, 10);

        li.appendChild(urunSpan);
        li.appendChild(tutarSpan);
        li.appendChild(tarihDiv);

        shoppingList.appendChild(li);

        totalAmount += Number(tutar);
      });

      document.getElementById('totalAmount').textContent = totalAmount.toFixed(2) + ' TL';
    })
    .catch(error => {
      shoppingList.innerHTML = `<li class="list-group-item text-danger">Harcama bilgileri alınamadı: ${error.message}</li>`;
      document.getElementById('totalAmount').textContent = '0 TL';
    })
    .finally(() => {
      const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
      profileModal.show();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const schoolNo = getSchoolNoFromUrl();

  if (!schoolNo) {
    alert('SchoolNo URL parametresi yok!');
    return;
  }

  const openModalBtn = document.getElementById('openModalBtn');
  // Butona URL'den gelen schoolNo değerini data attribute olarak ver (opsiyonel)
  openModalBtn.setAttribute('data-school-no', schoolNo);

  openModalBtn.addEventListener('click', () => {
    openProfileModal(schoolNo);
  });
});
/////////////////////////////////////////////////////////////////

(function () {
  const schoolNo = new URLSearchParams(window.location.search).get("schoolNo");
  if (!schoolNo) return;

  fetch(`/api/profile/${schoolNo}/durum`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("aylikHak").textContent = data.aylikHak ?? 0;
      document.getElementById("girisSayisi").textContent = data.kullanilanHak ?? 0;
      document.getElementById("raporSayisi").textContent = data.raporHak ?? 0;
    })
    .catch(err => console.error(err));
})();
//////////////////////////////////////////



// DOM Elementleri
// DOM Elementleri
const floatingBtn = document.querySelector('.floating-btn');
const welcomeMessage = document.querySelector('.welcome-message');
const modalOverlay = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');
const reportForm = document.getElementById('reportForm');
const toastMessage = document.getElementById('toastMessage');
const studentIllnessRadio = document.getElementById('studentIllness');

// Sayfa yüklendiğinde açılış mesajını göster
document.addEventListener('DOMContentLoaded', () => {
  // Mesajı göster
  setTimeout(() => {
    welcomeMessage.classList.add('show');

    // 5 saniye sonra mesajı gizle
    setTimeout(() => {
      welcomeMessage.classList.remove('show');
    }, 5000);
  }, 500); // 0.5 saniye gecikmeyle göster
});

// Floating butona tıklandığında modalı aç
floatingBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  // Bugünün tarihini varsayılan olarak ayarla
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('reportDate').value = today;

  // Mesajı kapat
  welcomeMessage.classList.remove('show');
});

// Kapat butonuna tıklandığında modalı kapat
closeBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Modal dışına tıklandığında kapat
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// Toast mesajı göster
function showToast(message, type = 'success', duration = 3000) {
  toastMessage.innerHTML = type === 'success'
    ? `<i class="fas fa-check-circle"></i> ${message}`
    : `<i class="fas fa-exclamation-circle"></i> ${message}`;

  toastMessage.className = `toast ${type === 'success' ? '' : 'warning'}`;
  toastMessage.classList.add('show');

  setTimeout(() => {
    toastMessage.classList.remove('show');
  }, duration);
}

// Form gönderildiğinde
reportForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Öğrenci Rahatsızlık seçildiyse "Geçmiş Olsun" mesajı göster
  if (studentIllnessRadio.checked) {
    showToast("Geçmiş Olsun! Sağlığınıza dikkat edin.", 'warning', 4000);

    // 4 saniye sonra onay mesajını göster
    setTimeout(() => {
      showToast("Raporunuz onaya gönderilmiştir");
    }, 4000);
  } else {
    showToast("Raporunuz onaya gönderilmiştir");
  }

  // Form verilerini topla
  const formData = {
    date: document.getElementById('reportDate').value,
    reason: document.querySelector('input[name="reportReason"]:checked').value
  };

  // Burada form verilerini işleyebilirsiniz (API'ye gönderme vs.)
  console.log('Form Gönderildi:', formData);

  // Formu temizle ve modalı kapat
  setTimeout(() => {
    reportForm.reset();
    modalOverlay.classList.remove('active');
  }, 1000);
});

// Floating buton hover animasyonu
floatingBtn.addEventListener('mouseenter', () => {
  floatingBtn.style.transform = 'scale(1.1) rotate(90deg)';
});

floatingBtn.addEventListener('mouseleave', () => {
  floatingBtn.style.transform = 'scale(1) rotate(0)';
});
/////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  // URL'den schoolNo parametresini al
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const schoolNo = getQueryParam('schoolNo');

  if (!schoolNo) {
    alert('Okul numarası bulunamadı.');
    return;
  }

  // Öğrenci bilgisini API'den çek
fetch(`https://www.yemekhanegltp.com/api/ogrenciler/${schoolNo}`)
    .then(res => {
      if (!res.ok) throw new Error('Öğrenci bulunamadı');
      return res.json();
    })
    .then(student => {
      // Global olarak sakla
      window.studentInfo = student;

      // İstersen öğrenci bilgilerini formda göstermek için buraya yazabilirsin
      // Örnek:
      // document.getElementById('inputFullName').value = student.adSoyad;
      // document.getElementById('inputClass').value = student.sinif;
      // document.getElementById('inputSection').value = student.sube;
      // Ama senin formda sadece tarih ve rapor nedeni var, o yüzden gerek yok
    })
    .catch(err => alert('Öğrenci bilgisi alınamadı: ' + err.message));

  // Form submit işlemi
  document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const tarihInput = document.getElementById('reportDate').value;
    const raporNedeniInput = document.querySelector('input[name="reportReason"]:checked');

    if (!tarihInput) {
      alert('Lütfen tarih seçin.');
      return;
    }
    if (!raporNedeniInput) {
      alert('Lütfen rapor nedenini seçin.');
      return;
    }
    if (!window.studentInfo) {
      alert('Öğrenci bilgisi alınamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }

    const raporData = {
      OkulNo: window.studentInfo.okulNo,
      AdSoyad: window.studentInfo.adSoyad,
      Sinif: Number(window.studentInfo.sinif),
      Sube: window.studentInfo.sube,
      Tarih: tarihInput,
      RaporNedeni: raporNedeniInput.value
    };

fetch('https://www.yemekhanegltp.com/api/RaporIstekleri', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(raporData)
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          let msg = error.message || 'Bilinmeyen hata';
          if (error.errors) {
            msg += '\n' + error.errors.join('\n');
          }
          throw new Error(msg);
        }
        return res.json();
      })
      .then(data => alert(data.message))
      .catch(err => alert('Hata: ' + err.message));
  });
});
//////////////////////////////////////////////////////////

 
 function getOkulNo() {
  const params = new URLSearchParams(window.location.search);
  return params.get("okulNo") || params.get("schoolNo");
}

function formatTarih(dateStr) {
  if (!dateStr) return "-";
  // "DD.MM.YYYY" formatında tarihi Türkçe olarak dön
  const parts = dateStr.split(".");
  if (parts.length !== 3) return "-";

  const day = parts[0].padStart(2, "0");
  const monthIndex = parseInt(parts[1], 10) - 1; // 0 bazlı ay
  const year = parts[2];

  const aylar = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  if (monthIndex < 0 || monthIndex > 11) return "-";

  return `${day} ${aylar[monthIndex]} ${year}`;
}

function formatSaat(zamanStr) {
  if (!zamanStr) return "-";
  const parts = zamanStr.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return zamanStr;
}

function loadGecisler() {
  const okulNo = getOkulNo();
  if (!okulNo) {
    alert("Okul numarası URL'de belirtilmemiş!");
    return;
  }

  fetch(`/api/OgrenciGecmis/${okulNo}/gecisler`)
    .then(res => res.json())
    .then(gecisler => {
      const container = document.getElementById("yemekhaneListesi");
      container.innerHTML = "";

      if (gecisler.length === 0) {
        container.innerHTML = `<p>Giriş bulunamadı.</p>`;
        return;
      }

      gecisler.forEach(g => {
        container.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4" data-type="giris">
          <div class="card card-entry">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-success text-white">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <div class="fw-semibold">Giriş - ${formatTarih(g.tarih)}</div>
                <small class="text-muted">Saat: ${formatSaat(g.zaman)}</small>
              </div>
            </div>
          </div>
        </div>`;
      });
    });
}




function loadRaporlar() {
  const okulNo = getOkulNo();
  if (!okulNo) {
    alert("Okul numarası URL'de belirtilmemiş!");
    return;
  }
function formatTarih(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "-";

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parts[2];

  const aylar = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  if (monthIndex < 0 || monthIndex > 11) return "-";

  return `${day.padStart(2, "0")} ${aylar[monthIndex]} ${year}`;
}

  console.log("Raporlar yükleniyor, okulNo:", okulNo);

  fetch(`/api/OgrenciGecmis/${okulNo}/raporlar`)
    .then(res => {
      console.log("Raporlar API response status:", res.status);
      if (!res.ok) throw new Error("Raporlar yüklenemedi");
      return res.json();
    })
    .then(raporlar => {
      console.log("Raporlar verisi:", raporlar);

      const container = document.getElementById("yemekhaneListesiRapor");
      if (!container) {
        console.error("yemekhaneListesiRapor div bulunamadı!");
        return;
      }

      container.innerHTML = "";

      if (raporlar.length === 0) {
        container.innerHTML = "<p>Rapor bulunamadı.</p>";
        return;
      }

      raporlar.forEach(r => {
        container.innerHTML += `
          <div class="col-12 col-md-6 col-lg-4" data-type="rapor">
            <div class="card card-entry">
              <div class="d-flex align-items-center">
                <div class="icon-container bg-danger text-white">
                  <i class="bi bi-x-circle-fill"></i>
                </div>
                <div>
                  <div class="fw-semibold">Rapor - ${formatTarih(r.Tarih || r.tarih)}</div>
                  <small class="text-muted">Tüm Gün</small>
                </div>
              </div>
            </div>
          </div>`;
      });
    })
    .catch(e => {
      console.error("Raporlar yüklenirken hata:", e);
    });
}

window.addEventListener("DOMContentLoaded", () => {
  loadGecisler();
  loadRaporlar();
});

////////////////////////////////////////menü
const menuDate = document.getElementById("menuDate");
const menuContent = document.getElementById("menuContent");
const prevDay = document.getElementById("prevDay");
const nextDay = document.getElementById("nextDay");

// Başlangıç tarihi (bugün)
let currentDate = new Date();

// Tarihi "25 HAZİRAN 2025" formatında gösteren fonksiyon
function formatFullTurkishDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString('tr-TR', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Türüne göre emoji döndüren fonksiyon
function getEmojiForType(type) {
  return "🍽️";
}


// Backend'den verilen tarihe ait menüyü çek ve göster
async function fetchMenuByDate(date) {
  try {
    const isoDate = date.toISOString().slice(0, 10);
    const res = await fetch(`/api/yemekmenusu/gun?date=${isoDate}`);
    if (!res.ok) throw new Error("Menü bulunamadı");
    const data = await res.json();

    menuDate.textContent = formatFullTurkishDate(new Date(data.date));
    menuContent.innerHTML = `
      <ul class="list-group list-group-flush w-100 text-center">
        ${data.items.map(item => `
          <li class="list-group-item fs-5 py-3">
            ${getEmojiForType(item.type)} ${item.name}
          </li>`).join('')}
      </ul>`;
  } catch (error) {
    menuDate.textContent = formatFullTurkishDate(date);
    menuContent.innerHTML = `<p class="text-danger">Menü bulunamadı.</p>`;
  }
}

// Hafta sonu mu kontrolü (0=Pazar, 6=Cumartesi)
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Haftasonunu atlayarak önceki aktif güne git
function moveToPreviousActiveDay() {
  do {
    currentDate.setDate(currentDate.getDate() - 1);
  } while (isWeekend(currentDate));
  fetchMenuByDate(currentDate);
}

// Haftasonunu atlayarak sonraki aktif güne git
function moveToNextActiveDay() {
  do {
    currentDate.setDate(currentDate.getDate() + 1);
  } while (isWeekend(currentDate));
  fetchMenuByDate(currentDate);
}

prevDay.addEventListener("click", moveToPreviousActiveDay);
nextDay.addEventListener("click", moveToNextActiveDay);

// Modal açılınca bugünün menüsünü getir
document.getElementById("menuModal").addEventListener("shown.bs.modal", () => {
  // Eğer bugün hafta sonuysa, ilk aktif günü (Pazartesi) göster
  while (isWeekend(currentDate)) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  fetchMenuByDate(currentDate);
});
//////////////////////////////////////////////////////////BURAYI UNUTMA ÖDEME DETAYI BURADAAA
// Başlangıç sabitleri
let yil = 2025;
let ay = 9;

// Fonksiyon: Veri çek ve güncelle
function updatePaymentModalData(schoolNo, yil, ay) {
  fetch(`/api/OgrenciOzet?schoolNo=${schoolNo}&yil=${yil}&ay=${ay}`)
    .then(res => {
      if (!res.ok) throw new Error("Veri alınamadı");
      return res.json();
    })
    .then(data => {
      // Nullable değerler için kontrol yapıyoruz
      const aylikUcret = data.aylikUcret ?? 0;
      const oncekiAyKantinHarcamasi = data.oncekiAyKantinHarcamasi ?? 0;
      const hesaplananGenelOdeme = data.hesaplananGenelOdeme ?? 0;
     const oncekiAyRaporHakkiTutari = data.oncekiAyRaporHakkiTutari ?? 0;


      document.getElementById('ayOdemesi').innerText = `₺${aylikUcret.toFixed(2)}`;
      document.getElementById('kantinHarcama').innerText = `₺${oncekiAyKantinHarcamasi.toFixed(2)}`;
      document.getElementById('genelOdeme').innerText = `₺${hesaplananGenelOdeme.toFixed(2)}`;
  document.getElementById('raporTutari').innerText = `₺${oncekiAyRaporHakkiTutari.toFixed(2)}`;
    })
    .catch(err => {
      alert(err.message);
      console.error(err);
    });
}

// Başlangıç verisi çekme
if (typeof schoolNo !== 'undefined' && schoolNo) {
  updatePaymentModalData(schoolNo, yil, ay);
} else {
  console.warn("schoolNo değişkeni bulunamadı");
}

// Önceki ay butonu
document.querySelector('.nav-prev').addEventListener('click', () => {
  ay--;
  if (ay < 1) {
    ay = 12;
    yil--;
  }
  updatePaymentModalData(schoolNo, yil, ay);
});

// Sonraki ay butonu
document.querySelector('.nav-next').addEventListener('click', () => {
  ay++;
  if (ay > 12) {
    ay = 1;
    yil++;
  }
  updatePaymentModalData(schoolNo, yil, ay);
});



// Modal açılmadan önce veya modal açıldıktan hemen sonra çağır

/////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const schoolNo = urlParams.get('schoolNo');

  if (!schoolNo) {
    alert('Okul numarası bulunamadı');
    window.location.href = 'login.html';
    return;
  }

  fetch(`/api/ogrenciler/${schoolNo}`)  // ✅ Doğru kullanım
    .then(res => res.json())
    .then(ogrenci => {
      console.log("Gelen öğrenci:", ogrenci); // 👈 burası çok faydalı
      if (!ogrenci.isActive) {
        window.location.href = 'OdemeKontrol.html';
        return;
      }

      // Öğrenci bilgilerini sayfaya yaz
      document.getElementById('fullName').innerText = ogrenci.fullName;
    })
    .catch(err => {
      alert('Hata: ' + err.message);
    });
});
///////////////////////////////////////////////////////////////////

// URL'den schoolNo parametresini alma fonksiyonu
// URL'den schoolNo parametresini alma fonksiyonu
function getSchoolNoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('schoolNo') || ""; // Yoksa boş string döner
}



if (!schoolNo) {
  alert("Okul numarası bulunamadı!");
} else {
  // Küçük harfli api için ay kodları ve kullanıcıya gösterilecek Türkçe ay isimleri
  const ayKodlari = ["eylul", "ekim", "kasim", "aralik", "ocak", "subat", "mart", "nisan", "mayis"];
  const ayAdlari = ["Eylül", "Ekim", "Kasım", "Aralık", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs"];

  let ayIndex = 0;

  // Tarihten sadece yıl, ay, gün bilgisi alır, saat vs kaldırır
  function sadeceTarih(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function fetchOdemeBilgisi() {
    const ay = ayKodlari[ayIndex];
    fetch(`/api/odemeler/${schoolNo}/${ay}`)
      .then(response => {
        if (!response.ok) throw new Error("Ödeme bilgisi alınamadı");
        return response.json();
      })
      .then(data => {
        document.getElementById("nextPaymentMonth").textContent = ayAdlari[ayIndex];

        document.getElementById("paymentAmount").textContent =
          data.tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";

        const statusElem = document.getElementById("paymentStatus");
        const sonOdemeTarihi = new Date(data.sonOdemeTarihi);
        const bugun = new Date();

        const sonOdemeTarihiSadece = sadeceTarih(sonOdemeTarihi);
        const bugunSadece = sadeceTarih(bugun);

        if (data.odendiMi) {
          statusElem.textContent = "Ödendi";
          statusElem.className = "badge-payment badge-paid";
        } else if (sonOdemeTarihiSadece < bugunSadece) {
          statusElem.textContent = "Gecikmiş";
          statusElem.className = "badge-payment badge-overdue";
        } else {
          statusElem.textContent = "Beklemede";
          statusElem.className = "badge-payment badge-pending";
        }

        document.getElementById("paymentDate").textContent = sonOdemeTarihi.toLocaleDateString("tr-TR");
      })
      .catch(err => {
        console.error(err);
        alert("Ödeme bilgisi alınamadı.");
      });
  }

  // İlk veri yükleme
  fetchOdemeBilgisi();

  // Ay değişimi için buton olayları
  document.querySelector(".nav-next").addEventListener("click", () => {
    if (ayIndex < ayKodlari.length - 1) {
      ayIndex++;
      fetchOdemeBilgisi();
    }
  });

  document.querySelector(".nav-prev").addEventListener("click", () => {
    if (ayIndex > 0) {
      ayIndex--;
      fetchOdemeBilgisi();
    }
  });
}
 document.getElementById('copyIbanBtn').addEventListener('click', function() {
    const ibanInput = document.getElementById('ibanInput');
    ibanInput.select();
    ibanInput.setSelectionRange(0, 99999); // mobil için

    navigator.clipboard.writeText(ibanInput.value).then(() => {
      const successMsg = document.getElementById('copySuccess');
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 2000);
    }).catch(() => {
      alert('Kopyalama başarısız oldu, lütfen manuel kopyalayın.');
    });
  });









