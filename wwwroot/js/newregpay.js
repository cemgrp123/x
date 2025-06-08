document.addEventListener('DOMContentLoaded', () => {
    // Kayıt verisini localStorage'dan al
    const registerData = JSON.parse(localStorage.getItem('registerData'));

    if (!registerData) {
        alert('Kayıt bilgisi bulunamadı. Lütfen önce kayıt olun.');
        window.location.href = 'register.html';
        return;
    }

    // Kalan gün sayısı (örnek: 30 gün)
    const dayCount = 30;
    document.getElementById('dayCount').value = dayCount;

    // Tutar (örnek: 150 TL)
    const price = 150;
    document.getElementById('price').innerText = price + ' ₺';

    const form = document.querySelector('.payment-form form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basit form doğrulama
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim().replace(/\s+/g, '');
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardName || cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Sunucu hatası veya bağlantı problemi.");
        })
        .then(data => {
            alert("Kayıt ve ödeme işlemi başarılı!");

            // Kayıt edilen öğrencinin schoolNo'sunu al ve profil sayfasına yönlendir
            const currentUserSchoolNo = data.schoolNo; // Backend'den dönen schoolNo

            if (currentUserSchoolNo) {
                localStorage.setItem("schoolNo", currentUserSchoolNo); // localStorage'a kaydet
              window.location.href = `/profil.html?schoolNo=${currentUserSchoolNo}`;


            } else {
                alert("schoolNo bilgisi bulunamadı, profil sayfasına yönlendirilemiyor.");
            }
        })
        .catch(error => {
            alert("Bir hata oluştu: " + error.message);
        });
    });
});
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