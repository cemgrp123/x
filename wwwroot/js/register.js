// Elementler
const profileInput = document.getElementById('profilePhotoInput');
const avatarPreview = document.getElementById('avatarPreview');
const uploadButton = document.getElementById('uploadButton');

let profilePhotoBase64 = null; // Profil fotoğrafının base64 hali

// Default avatar icon
avatarPreview.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/847/847969.png')";
avatarPreview.style.backgroundSize = 'cover';
avatarPreview.style.backgroundPosition = 'center';

// Avatar veya butona tıklayınca dosya seçici açılsın
avatarPreview.addEventListener('click', () => profileInput.click());
uploadButton.addEventListener('click', () => profileInput.click());

// Klavyeden Enter veya Space ile avatar'a erişilebilirlik
avatarPreview.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    profileInput.click();
  }
});

// Dosya seçilince preview göster ve base64 kaydet
profileInput.addEventListener('change', () => {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
      profilePhotoBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    avatarPreview.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/847/847969.png')";
    profilePhotoBase64 = null;
  }
});

// Toast gösterme fonksiyonu
function showToast(message, type = "info", callback = null) {
  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="min-width:250px;">
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
    if (typeof callback === "function") {
      callback();
    }
  });
}

// Form submit event
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Alanları al
  const schoolNo = document.getElementById('schoolNo').value.trim();
  const fullName = document.getElementById('fullName').value.trim();
  const studentClass = document.getElementById('studentClass').value;
  const section = document.getElementById('section').value;
  const parentName = document.getElementById('parentName').value.trim();
  const parentContact = document.getElementById('parentContact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const passwordConfirm = document.getElementById('passwordConfirm').value.trim();

  // Regex kuralları
  const schoolNoRegex = /^\d{4}$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  // Validasyonlar
  if (!schoolNoRegex.test(schoolNo)) {
    showToast('Okul No tam olarak 4 rakamdan oluşmalıdır.', 'danger', () => {
      document.getElementById('schoolNo').focus();
    });
    return;
  }
  if (!fullName || !studentClass || !section || !parentName || !email) {
    showToast('Lütfen tüm zorunlu alanları doldurun.', 'danger');
    return;
  }
  if (!phoneRegex.test(parentContact)) {
    showToast('Geçerli bir telefon numarası giriniz.', 'danger', () => {
      document.getElementById('parentContact').focus();
    });
    return;
  }
  if (password.length < 6) {
    showToast('Şifre en az 6 karakter olmalı.', 'danger', () => {
      document.getElementById('password').focus();
    });
    return;
  }
  if (password !== passwordConfirm) {
    showToast('Şifreler eşleşmiyor.', 'danger', () => {
      document.getElementById('passwordConfirm').focus();
    });
    return;
  }

  // Profil fotoğrafı varsa FileReader ile oku, yoksa null gönder
  if (profileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveDataAndRedirect(e.target.result);
    };
    reader.readAsDataURL(profileInput.files[0]);
  } else {
    saveDataAndRedirect(null);
  }

  // Kayıt işlemi ve yönlendirme fonksiyonu
  function saveDataAndRedirect(profilePhotoBase64) {
    const registerData = {
      SchoolNo: schoolNo,
      FullName: fullName,
      StudentClass: parseInt(studentClass),
      Section: section,
      ParentName: parentName,
      ParentContact: parentContact,
      Email: email,
      PasswordHash: password,
      ProfilePhotoPath: profilePhotoBase64
    };

    localStorage.setItem('registerData', JSON.stringify(registerData));

    showToast('Kayıt bilgileri kaydedildi. Ödeme sayfasına yönlendiriliyorsunuz...', 'success', () => {
      window.location.href = 'newregpay.html';
    });
  }
});
