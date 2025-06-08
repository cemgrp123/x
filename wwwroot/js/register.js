// Profil fotoğrafı preview ve base64 tutma için değişken
const profileInput = document.getElementById('profilePhotoInput');
const avatarPreview = document.getElementById('avatarPreview');
const uploadButton = document.getElementById('uploadButton');
let profilePhotoBase64 = null; // buraya base64 kaydedeceğiz

// Default avatar icon
avatarPreview.style.backgroundImage =
  "url('https://cdn-icons-png.flaticon.com/512/847/847969.png')";
avatarPreview.style.backgroundSize = 'cover';
avatarPreview.style.backgroundPosition = 'center';

// Click avatar or button opens file selector
avatarPreview.addEventListener('click', () => profileInput.click());
uploadButton.addEventListener('click', () => profileInput.click());

// Keyboard accessible avatar click (Enter veya Space)
avatarPreview.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    profileInput.click();
  }
});

// Preview yükle ve base64 kaydet
profileInput.addEventListener('change', () => {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
      profilePhotoBase64 = e.target.result;  // burada base64'i tutuyoruz
    };
    reader.readAsDataURL(file);
  } else {
    avatarPreview.style.backgroundImage =
      "url('https://cdn-icons-png.flaticon.com/512/847/847969.png')";
    profilePhotoBase64 = null; // boşsa null yapıyoruz
  }
});

// Form submit eventi
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Alanları al
// Doğru ID'ler
const schoolNo = document.getElementById('schoolNo').value.trim();
const fullName = document.getElementById('fullName').value.trim();
const studentClass = document.getElementById('studentClass').value;
const section = document.getElementById('section').value;
const parentName = document.getElementById('parentName').value.trim();
const parentContact = document.getElementById('parentContact').value.trim();
const email = document.getElementById('email').value.trim();
const password = document.getElementById('password').value.trim();
const passwordConfirm = document.getElementById('passwordConfirm').value.trim();


  // Regexler
  const schoolNoRegex = /^\d{4}$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  // Validasyonlar
  if (!schoolNoRegex.test(schoolNo)) {
    alert('Okul No tam olarak 4 rakamdan oluşmalıdır.');
    document.getElementById('SchoolNo').focus();
    return;
  }
  if (!fullName || !studentClass || !section || !parentName || !email) {
    alert('Lütfen tüm zorunlu alanları doldurun.');
    return;
  }
  if (!phoneRegex.test(parentContact)) {
    alert('Geçerli bir telefon numarası giriniz.');
    document.getElementById('ParentContact').focus();
    return;
  }
  if (password.length < 6) {
    alert('Şifre en az 6 karakter olmalı.');
    document.getElementById('PasswordHash').focus();
    return;
  }
  if (password !== passwordConfirm) {
    alert('Şifreler eşleşmiyor.');
    document.getElementById('PasswordConfirm').focus();
    return;
  }

  // Profil fotoğrafı base64 olarak kaydet (isteğe bağlı)
  if (profileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveDataAndRedirect(e.target.result);
    };
    reader.readAsDataURL(profileInput.files[0]);
  } else {
    saveDataAndRedirect(null);
  }

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
      ProfilePhotoPath: profilePhotoBase64 // base64 string veya null
    };

    // localStorage'a kaydet
    localStorage.setItem('registerData', JSON.stringify(registerData));

    alert('Kayıt bilgileri kaydedildi. Ödeme sayfasına yönlendiriliyorsunuz...');
    window.location.href = 'newregpay.html';
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
