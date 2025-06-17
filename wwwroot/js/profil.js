// ÖĞRENCİ ÖDEME VE BİLDİRİM SCRIPTİ

document.addEventListener('DOMContentLoaded', () => {
  const payments = [
    { ay: "Eylül", tutar: "150 TL", durum: "Beklemede", tarih: "2024-09-30" },
    { ay: "Ekim", tutar: "180 TL", durum: "Beklemede", tarih: "2024-10-31" },
    { ay: "Kasım", tutar: "200 TL", durum: "Beklemede", tarih: "2024-11-30" },
    { ay: "Aralık", tutar: "190 TL", durum: "Beklemede", tarih: "2024-12-31" },
    { ay: "Ocak", tutar: "210 TL", durum: "Beklemede", tarih: "2025-01-31" },
    { ay: "Şubat", tutar: "170 TL", durum: "Beklemede", tarih: "2025-02-28" },
    { ay: "Mart", tutar: "220 TL", durum: "Beklemede", tarih: "2025-03-31" },
    { ay: "Nisan", tutar: "230 TL", durum: "Beklemede", tarih: "2025-04-30" },
    { ay: "Mayıs", tutar: "200 TL", durum: "Beklemede", tarih: "2025-05-15" }
  ];

  let currentIndex = 0;

  function updatePayment(index) {
    const p = payments[index];
    document.getElementById("nextPaymentMonth").textContent = p.ay;
    document.getElementById("paymentAmount").textContent = p.tutar;
    document.getElementById("paymentStatus").textContent = p.durum;
    document.getElementById("paymentDate").textContent = p.tarih;
    const statusClass = p.durum === "Ödendi" ? "badge-paid" : p.durum === "Beklemede" ? "badge-pending" : "badge-overdue";
    document.getElementById("paymentStatus").className = `badge badge-payment ${statusClass}`;
  }

  updatePayment(currentIndex);

  document.querySelector(".nav-prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + payments.length) % payments.length;
    updatePayment(currentIndex);
  });

  document.querySelector(".nav-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % payments.length;
    updatePayment(currentIndex);
  });

  // Bildirim Zili Ayarları
  const bell = document.getElementById('bell-icon');
  const message = document.getElementById('notification-message');
  const paymentStatus = "pending";
  const todayDate = new Date().getDate();

  function setNotification(status) {
    message.classList.remove('green', 'yellow', 'red', 'hidden', 'show');
    if (status === "paid") {
      bell.style.fill = "#28a745";
      message.classList.add('green');
      message.textContent = "Ödemeniz tamamlandı.";
    } else if (status === "pending") {
      if (todayDate <= 5) {
        bell.style.fill = "#f0ad4e";
        message.classList.add('yellow');
        message.textContent = "Beklemede ödemeniz var.";
      } else {
        bell.style.fill = "#d9534f";
        message.classList.add('red');
        message.textContent = "Gecikmiş ödemeniz mevcut.";
      }
    } else if (status === "overdue") {
      bell.style.fill = "#d9534f";
      message.classList.add('red');
      message.textContent = "Gecikmiş ödemeniz mevcut.";
    }
    message.classList.add('show');
    setTimeout(() => {
      message.classList.remove('show');
      message.classList.add('hidden');
    }, 3000);
  }

  setNotification(paymentStatus);

  bell.parentElement.addEventListener('click', () => {
    if (message.classList.contains('hidden')) {
      message.classList.remove('hidden');
      message.classList.add('show');
    } else {
      message.classList.remove('show');
      message.classList.add('hidden');
    }
  });

  function updateCounts() {
    const cards = document.querySelectorAll(".col-12");
    let girisSayisi = 0;
    let raporSayisi = 0;

    cards.forEach(card => {
      const type = card.getAttribute("data-type");
      if (type === "giris" && card.style.display !== "none") girisSayisi++;
      if (type === "rapor" && card.style.display !== "none") raporSayisi++;
    });

    document.getElementById("girisSayisi").textContent = girisSayisi;
    document.getElementById("raporSayisi").textContent = raporSayisi;
  }

  updateCounts();

  const aramaInput = document.getElementById("aramaInput");
  aramaInput.addEventListener('input', () => {
    const filter = aramaInput.value.toUpperCase();
    const cards = document.querySelectorAll(".col-12");

    cards.forEach(card => {
      const titleElement = card.querySelector(".fw-semibold");
      const title = titleElement ? titleElement.textContent.toUpperCase() : "";
      card.style.display = title.includes(filter) ? "" : "none";
    });

    updateCounts();
  });

  aramaInput.dispatchEvent(new Event('input'));
});

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

  fetch(`http://localhost:5128/api/profile/${schoolNo}`, {
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
  "2025-09", "2025-10", "2025-11", "2025-12",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05"
];


let currentIndex = 0;

// HTML elemanlarını seçiyoruz
const prevBtn = document.querySelector(".nav-prev");
const nextBtn = document.querySelector(".nav-next");

function fetchPaymentData(ay) {
  fetch(`/api/payment/ayliktutarlar?ay=${ay}`)
    .then(response => {
      if (!response.ok) throw new Error("Veri bulunamadı");
      return response.json();
    })
    .then(data => {
      document.getElementById("nextPaymentMonth").textContent = data.nextPaymentMonth;
      document.getElementById("paymentAmount").textContent = data.paymentAmount;
      const statusElem = document.getElementById("paymentStatus");
      statusElem.textContent = data.paymentStatus;

      // Duruma göre class değiştiriyoruz
      if (data.paymentStatus === "Beklemede") {
        statusElem.className = "badge-payment badge-pending";
      } else {
        statusElem.className = "badge-payment badge-expired";
      }

      const [yil, ay, gun] = data.paymentDate.split("-");
      const formattedDate = `${gun}.${ay}.${yil}`;
      document.getElementById("paymentDate").textContent = formattedDate;


      // Butonların aktif/pasif durumu
      if (prevBtn) prevBtn.disabled = (currentIndex === 0);
      if (nextBtn) nextBtn.disabled = (currentIndex === aylar.length - 1);
    })
    .catch(err => {
      console.error(err);
      // Hata durumunda alanları temizle veya uyarı göster
      document.getElementById("nextPaymentMonth").textContent = "Veri Yok";
      document.getElementById("paymentAmount").textContent = "-";
      const statusElem = document.getElementById("paymentStatus");
      statusElem.textContent = "-";
      statusElem.className = "badge-payment";
      document.getElementById("paymentDate").textContent = "-";

      if (prevBtn) prevBtn.disabled = (currentIndex === 0);
      if (nextBtn) nextBtn.disabled = (currentIndex === aylar.length - 1);
    });
}

// Sayfa ilk yüklendiğinde ilk ayı göster
fetchPaymentData(aylar[currentIndex]);

// Önceki ay butonu
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      fetchPaymentData(aylar[currentIndex]);
    }
  });
}

// Sonraki ay butonu
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (currentIndex < aylar.length - 1) {
      currentIndex++;
      fetchPaymentData(aylar[currentIndex]);
    }
  });
}
// Kaydırma (swipe) desteği ekle
let touchStartX = 0;
let touchEndX = 0;

// İstersen body yerine belirli bir alanı hedefleyebilirsin (örnek: ".payment-box")
const swipeArea = document.body;

swipeArea.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].screenX;
}, false);

swipeArea.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 50; // En az bu kadar kaydırma farkı olmalı

  if (touchEndX < touchStartX - swipeThreshold && currentIndex < aylar.length - 1) {
    currentIndex++;
    fetchPaymentData(aylar[currentIndex]);
  } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
    currentIndex--;
    fetchPaymentData(aylar[currentIndex]);
  }
}
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
  fetch(`http://localhost:5128/api/ogrenciler/${schoolNo}`)
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

    fetch('http://localhost:5128/api/RaporIstekleri', {
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








