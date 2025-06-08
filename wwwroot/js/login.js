document.addEventListener('DOMContentLoaded', () => {
  // Elementleri seç
  const loginBtn = document.getElementById('loginBtn');
  const passwordContainer = document.getElementById('passwordContainer');
  const schoolIdInput = document.getElementById('schoolIdInput');
  const passwordInput = document.getElementById('passwordInput');
  const dotsContainer = document.getElementById('dots');
  const submitBtn = document.getElementById('submitBtn');

  // Eğer "Şifremi Unuttum" gibi bölümler eklenecekse, onları da ekle (senin kodda vardı ama HTML’de yok)
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');
  const resetSchoolIdInput = document.getElementById('resetSchoolIdInput');
  const sendResetLinkBtn = document.getElementById('sendResetLinkBtn');
  const backToLoginLink = document.getElementById('backToLoginLink');

  // İlk durum: sadece loginBtn görünsün, şifre girişi gizli
  passwordContainer.style.display = 'none';
  if (forgotPasswordContainer) forgotPasswordContainer.style.display = 'none';

  // loginBtn click event
  loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('shrink');
    setTimeout(() => {
      loginBtn.style.display = 'none';
      passwordContainer.style.display = 'block';
      schoolIdInput.focus();
      submitBtn.style.display = 'none';
    }, 400);
  });

  // Şifre inputu nokta doluluklarını güncelleyen fonksiyon
  function updateDots(value) {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx < value.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  // Şifre input değiştiğinde sadece rakam kabul et, noktaları güncelle
  passwordInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    updateDots(e.target.value);

    if (e.target.value.length === 6) {
      submitBtn.style.display = 'block';
    } else {
      submitBtn.style.display = 'none';
    }
  });

  // Submit butonuna basıldığında şifre uzunluğu kontrolü ve alert
  submitBtn.addEventListener('click', () => {
    if (passwordInput.value.length === 6) {
      
      // Burada backend çağrısı ve yönlendirme yapılabilir
    } else {
      alert('Lütfen 6 haneli şifrenizi girin.');
      passwordInput.focus();
    }
  });

  // Okul numarası inputuna Enter basılınca şifre inputuna geç
  schoolIdInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (schoolIdInput.value.length === 4) {
        passwordInput.focus();
      }
    }
  });

  // Şifre inputunda Enter basınca submit butonuna tıkla
  passwordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (submitBtn.style.display !== 'none') {
        submitBtn.click();
      }
    }
  });

  // Eğer profil bilgileri localStorage'da varsa göster
  const profile = JSON.parse(localStorage.getItem("loggedOutProfile"));
  if (profile) {
    const profileIcon = document.querySelector(".profile-icon");
    const heading = document.querySelector("h2");
    if (profileIcon) profileIcon.textContent = getInitials(profile.fullName);
    if (heading) heading.textContent = profile.fullName;
    // Profil fotoğrafı varsa buraya ekleyebilirsin
    // document.querySelector("#profileImage").src = profile.photo;

    // Okul numarasını şifreyle giriş için sakla
    localStorage.setItem("pendingLoginSchoolNo", profile.schoolNo);
  }

  // İsimden baş harf al
  function getInitials(name) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }

  // Burada unutulan şifre veya diğer ek özellikler varsa onları da benzer şekilde ekleyebilirsin
});
document.getElementById('submitBtn').addEventListener('click', async () => {
  const username = document.getElementById('schoolIdInput').value.trim();   // 4 haneli okul no
  const password = document.getElementById('passwordInput').value.trim();   // 6 haneli şifre

  if (username.length !== 4 || password.length !== 6) {
    alert("Lütfen 4 haneli okul numarası ve 6 haneli şifre giriniz.");
    return;
  }

  try {
    const response = await fetch('http://localhost:5128/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.text();
      alert(errorData);
      return;
    }

    const data = await response.json();

    // Doğruysa profil sayfasına yönlendir
    window.location.href = `http://localhost:5128/profil.html?schoolNo=${data.schoolNo}`;
  } catch (error) {
    console.error("Giriş hatası:", error);
    showToast("Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.");
  }
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
