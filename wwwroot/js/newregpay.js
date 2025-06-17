document.addEventListener('DOMContentLoaded', () => {
  // Kayıt verisini localStorage'dan al
  const registerData = JSON.parse(localStorage.getItem('registerData'));

  if (!registerData) {
    alert('Kayıt bilgisi bulunamadı. Lütfen önce kayıt olun.');
    window.location.href = 'register.html';
    return;
  }

  // Örnek değerler
  const dayCount = 30;
  const price = 150;

  const dayCountElem = document.getElementById('dayCount');
  const priceElem = document.getElementById('price');

  if (dayCountElem) dayCountElem.value = dayCount;
  if (priceElem) priceElem.innerText = price + ' ₺';

  const form = document.querySelector('.payment-form form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim().replace(/\s+/g, '');
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardName) {
      alert('Kart sahibinin adı boş olamaz.');
      return;
    }

    if (cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
      alert('Lütfen geçerli bir kart numarası giriniz.');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      alert('Son kullanma tarihi AA/YY formatında olmalıdır.');
      return;
    }

    if (cvv.length < 3 || cvv.length > 4 || !/^\d{3,4}$/.test(cvv)) {
      alert('Geçerli bir CVV giriniz.');
      return;
    }

    // Ödeme başarılı varsayımıyla backend'e kayıt bilgisi POST et
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
        showToast("Kayıt ve ödeme işlemi başarılı!", "success", () => {
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
});

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
