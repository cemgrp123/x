document.addEventListener('DOMContentLoaded', () => {
  // Kayıt verisini localStorage'dan al
  const registerData = JSON.parse(localStorage.getItem('registerData'));

  if (!registerData) {
    alert('Kayıt bilgisi bulunamadı. Lütfen önce kayıt olun.');
    window.location.href = 'register.html';
    return;
  }

  // Örnek değerler (bunları API ile değiştiriyoruz)
  // const dayCount = 30;
  // const price = 150;

  const dayCountElem = document.getElementById('dayCount');
  const priceElem = document.getElementById('price');

  if (dayCountElem) dayCountElem.value = ''; // Temizle, gerçek değer sonra gelecek
  if (priceElem) priceElem.innerText = '0 ₺';

  // Şartlar checkbox ve havale butonu
  const termsCheck = document.getElementById('termsCheck');
  const havaleBtn = document.getElementById('havaleBtn');

  if (termsCheck && havaleBtn) {
    havaleBtn.disabled = !termsCheck.checked;

    termsCheck.addEventListener('change', () => {
      if (termsCheck.checked) {
        const modal = new bootstrap.Modal(document.getElementById('termsModal'));
        modal.show();
      }
      havaleBtn.disabled = !termsCheck.checked;
    });

    havaleBtn.addEventListener('click', () => {
      // Backend'e kayıt gönder
      fetch("http://localhost:5128/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      })
        .then(response => {
          if (!response.ok) throw new Error("Sunucu hatası veya bağlantı problemi.");
          return response.json();
        })
        .then(data => {
          showToast("Kayıt işlemi başarılı! Teşekkürler.", "success", () => {
            const currentUserSchoolNo = data.schoolNo || data.SchoolNo || null;

            if (currentUserSchoolNo) {
              localStorage.setItem("schoolNo", currentUserSchoolNo);
              window.location.href = `/profil.html?schoolNo=${currentUserSchoolNo}`;
            } else {
              alert("schoolNo bilgisi bulunamadı, profil sayfasına yönlendirilemiyor.");
            }
          });
        })
        .catch(error => {
          alert("Bir hata oluştu: " + error.message);
        });
    });
  }

  // Ay isimleri
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];

  document.getElementById('currentMonthName').value = currentMonth;

  fetch(`/api/AylikTutarlar/by-ay/${currentMonth}`)
    .then(res => {
      if (!res.ok) throw new Error("Veri alınamadı");
      return res.json();
    })
    .then(data => {
      document.getElementById('totalDayCount').value = data.gunSayisi;

      const kalanGunSayisi = getRemainingActiveDays(today.getFullYear(), today.getMonth());
      document.getElementById('remainingDayCount').value = kalanGunSayisi;

      document.getElementById('dailyPrice').value = data.gunlukUcret.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + " ₺";

      const kalanTutar = kalanGunSayisi * data.gunlukUcret;
      document.getElementById('price').innerText = `${kalanTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
    })
    .catch(err => {
      alert("Aylık veri alınamadı: " + err.message);
    });

});

// Kalan aktif günleri hesaplayan fonksiyon
function getRemainingActiveDays(year, month) {
  const todayDate = new Date();
  // Bugünün tarihi (saat vs sıfırlandı)
  const currentDate = new Date(year, month, todayDate.getDate());
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let remainingDays = 0;
  for (let d = new Date(currentDate); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Pazartesi=1, Cuma=5 arasıysa
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      remainingDays++;
    }
  }
  return remainingDays;
}

// Toast fonksiyonu, callback ile yönlendirme vb. yapılabilir
function showToast(message, type = "info", callback = null) {
  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="min-width: 250px;">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  const container = document.getElementById("toast-container");
  if (!container) {
    console.warn("Toast container bulunamadı! Lütfen sayfaya <div id='toast-container' class='toast-container position-fixed top-0 end-0 p-3' style='z-index: 1080;'></div> ekleyin.");
    alert(message);
    if (callback) callback();
    return;
  }

  container.insertAdjacentHTML("beforeend", toastHtml);
  const toastElem = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElem, { delay: 3000 });
  bsToast.show();

  toastElem.addEventListener("hidden.bs.toast", () => {
    toastElem.remove();
    if (typeof callback === "function") callback();
  });
}

// window.alert override (danger tipli toast)
window.alert = function(message) {
  showToast(message, "danger");
};
