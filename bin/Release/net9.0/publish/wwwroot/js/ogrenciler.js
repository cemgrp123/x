
//////////////////////////////////////////////////////////// Burası Tamam Elleme
//Kullanılan Hak sıfırla
document.getElementById("resetHakButton").addEventListener("click", function () {
  if (confirm("Tüm öğrencilerin kullanılan haklarını sıfırlamak istediğinize emin misiniz?")) {
    fetch("/api/student/kullanilanhak/sifirla", {
      method: "POST"
    })
      .then(res => res.ok ? location.reload() : alert("Sıfırlama işlemi başarısız oldu."))
      .catch(err => console.error(err));
  }
});

//Rapor Hakkı Arttır-Azalt
function raporHakArtir(schoolNo) {
  fetch(`/api/student/${schoolNo}/raporhak/artir`, {
    method: 'POST'
  })
    .then(res => res.ok ? location.reload() : alert("Artırma işlemi başarısız"))
    .catch(err => console.error(err));
}

function raporHakAzalt(schoolNo) {
  fetch(`/api/student/${schoolNo}/raporhak/azalt`, {
    method: 'POST'
  })
    .then(res => res.ok ? location.reload() : alert("Azaltma işlemi başarısız"))
    .catch(err => console.error(err));
}


/////////////////////////////////////////////////////////
function duzenleModalAc(schoolNo) {
  fetch(`/api/student/${schoolNo}`)
    .then(res => res.json())
    .then(data => {
      // Öğrenci bilgilerini modal'a doldur
      document.getElementById('duzenleOkulNo').value = data.schoolNo;
      document.getElementById('duzenleAdSoyad').value = data.fullName;
      document.getElementById('duzenleSinif').value = data.studentClass;
      document.getElementById('duzenleSube').value = data.section;
      document.getElementById('duzenleVeli').value = data.parentName;
      document.getElementById('duzenleVeliTel').value = data.parentContact;
    });

  fetch(`/api/kantindurumlari/${schoolNo}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('duzenleAylikHak').value = data.aylikHak;
      document.getElementById('duzenleKullanilanHak').value = data.kullanilanHak;
      document.getElementById('duzenleRaporHak').value = data.raporHak;
    });

  // Modal açma (zaten data-bs-toggle modal var ama ek güvence)
  const myModal = new bootstrap.Modal(document.getElementById('duzenleModal'));
  myModal.show();
}
document.getElementById('duzenleForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const okulNo = document.getElementById('duzenleOkulNo').value;

  const guncelVeri = {
    fullName: document.getElementById('duzenleAdSoyad').value,
    studentClass: parseInt(document.getElementById('duzenleSinif').value),
    section: document.getElementById('duzenleSube').value,
    parentName: document.getElementById('duzenleVeli').value,
    parentContact: document.getElementById('duzenleVeliTel').value,
    aylikHak: parseInt(document.getElementById('duzenleAylikHak').value),
    kullanilanHak: parseInt(document.getElementById('duzenleKullanilanHak').value),
    raporHak: parseInt(document.getElementById('duzenleRaporHak').value)
  };

  fetch(`/api/student/guncelle-hepsi/${okulNo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(guncelVeri)
  })
    .then(res => {
      if (!res.ok) throw new Error("Güncelleme başarısız");
      return res.json();
    })
    .then(() => {
      alert("Güncelleme başarılı!");
      bootstrap.Modal.getInstance(document.getElementById('duzenleModal')).hide();
      // Listeyi yenileyebilirsin burada
    })
    .catch(err => {
      console.error(err);
      alert("Hata oluştu: " + err.message);
    });
});


//TÜM KANTİN HARCAMALARINI SIFIRLA
document.getElementById('modalSifirlaBtn').addEventListener('click', function () {
  if (!confirm('Tüm kantin harcamalarını silmek istediğinize emin misiniz?')) return;

  fetch('/api/KantinHarcama/Temizle', {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Temizleme işlemi başarısız.');
      alert('Tüm kantin harcamaları başarıyla temizlendi.');
      // İstersen modalı kapat veya listeyi güncelle
    })
    .catch(err => {
      alert(err.message);
    });
});
///Arama Kutusu
document.addEventListener('DOMContentLoaded', function () {
  const aramaKutusu = document.getElementById('aramaKutusu');
  const tbody = document.getElementById('ogrenciListesi');

  aramaKutusu.addEventListener('input', function () {
    const filtre = aramaKutusu.value.toLowerCase();

    // Tablodaki tüm satırları al
    const satirlar = tbody.getElementsByTagName('tr');

    for (let i = 0; i < satirlar.length; i++) {
      const satir = satirlar[i];

      // Satırdaki tüm hücreleri al
      const hucreler = satir.getElementsByTagName('td');
      let satirMetni = '';

      // Satırdaki tüm hücrelerin metinlerini birleştir
      for (let j = 0; j < hucreler.length; j++) {
        satirMetni += hucreler[j].textContent.toLowerCase() + ' ';
      }

      // Eğer satır metni arama kriterini içeriyorsa göster, yoksa gizle
      if (satirMetni.indexOf(filtre) > -1) {
        satir.style.display = '';
      } else {
        satir.style.display = 'none';
      }
    }
  });
});
// Global değişken: şu anki okul numarası
let currentSchoolNo = null;

// Butona tıklanınca çağrılır, modal açılır ve harcamalar yüklenir
function kantinModalAc(schoolNo) {
  openKantinModal(schoolNo);
}

// Modal açma ve harcamaları listeleme fonksiyonu
function openKantinModal(schoolNo) {
  currentSchoolNo = schoolNo;
  const kantinModal = new bootstrap.Modal(document.getElementById('kantinModal'));
  kantinModal.show();

  fetch(`/api/KantinHarcama/${schoolNo}`)
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('kantinList');
      list.innerHTML = '';
      let toplam = 0;

      data.forEach(harcama => {
        toplam += harcama.tutar;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
          <div>
            <strong>${new Date(harcama.tarih).toLocaleDateString()}</strong> - ${harcama.urun}
          </div>
          <div>
            ${harcama.tutar.toFixed(2)} ₺
            <button class="btn btn-sm btn-danger ms-2" onclick="deleteHarcama(${harcama.id})">&times;</button>
          </div>
        `;

        list.appendChild(li);
      });

      document.getElementById('toplamTutar').textContent = toplam.toFixed(2);
    })
    .catch(err => {
      console.error('Harcamalar yüklenirken hata:', err);
    });
}

// Yeni harcama ekleme formunun submit işlemi
document.getElementById('kantinForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!currentSchoolNo) {
    alert('Öğrenci seçili değil!');
    return;
  }

  const tarih = document.getElementById('tarih').value;
  const urun = document.getElementById('urun').value.trim();
  const tutar = parseFloat(document.getElementById('tutar').value);

  if (!tarih || !urun || isNaN(tutar) || tutar <= 0) {
    alert('Lütfen geçerli tarih, ürün ve tutar girin.');
    return;
  }

  const yeniHarcama = {
    schoolNo: currentSchoolNo,
    tarih: tarih,
    urun: urun,
    tutar: tutar
  };

  fetch('/api/KantinHarcama', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(yeniHarcama)
  })
    .then(response => {
      if (!response.ok) throw new Error('Kayıt eklenemedi.');
      return response.json();
    })
    .then(data => {
      this.reset();
      openKantinModal(currentSchoolNo);  // Güncellenmiş listeyi tekrar yükle
    })
    .catch(err => {
      alert(err.message);
    });
});

// Harcama silme fonksiyonu
function deleteHarcama(id) {
  if (!confirm('Bu harcamayı silmek istediğinize emin misiniz?')) return;

  fetch(`/api/KantinHarcama/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Silme işlemi başarısız.');
      openKantinModal(currentSchoolNo);  // Listeyi yenile
    })
    .catch(err => {
      alert(err.message);
    });
}

// Aylık Hak Tanımla
function aylikHakGuncelle() {
  const hak = parseInt(document.getElementById("aylikHakInput").value);

  if (isNaN(hak)) {
    alert("Lütfen geçerli bir sayı girin.");
    return;
  }

  // Host ortamı için göreli path kullanıyoruz
  fetch("/api/ogrenciler/tumOgrencilereAylikHak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    // Backend'de model bekliyorsa obje olarak gönderiyoruz
    body: JSON.stringify({ aylikHak: hak })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Güncelleme başarısız.");
    }
    return response.json();
  })
  .then(data => {
    alert(data.message || "Başarılı.");
    // Tabloyu yeniden yükle
    ogrenciTablosunuYenile();
  })
  .catch(err => {
    alert("Hata: " + err.message);
  });
}

// Mevcut tabloyu yenileyen fonksiyon
function ogrenciTablosunuYenile() {
  fetch("/api/ogrenciler")
    .then(response => response.json())
    .then(data => {
      const tablo = document.getElementById("ogrenciListesi");
      tablo.innerHTML = "";
      data.forEach(ogr => {
        const satir = `<tr>
          <td>${ogr.schoolNo}</td>
          <td>${ogr.fullName}</td>
          <td>${ogr.studentClass}</td>
          <td>${ogr.section}</td>
          <td>${ogr.parentName}</td>
          <td>${ogr.parentContact}</td>
          <td>${ogr.aylikHak}</td>
          <td>${ogr.kullanilanHak}</td>
          <td>${ogr.raporHak}</td>
          <td>${ogr.odenecekTutar}</td>
        </tr>`;
        tablo.innerHTML += satir;
      });
    });
}


//// sql ile veri cekme
document.addEventListener('DOMContentLoaded', function () {
  const tbody = document.getElementById('ogrenciListesi');

  function loadOgrenciler() {
    fetch('/api/ogrenciler')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Burada isActive değerlerine bak
        tbody.innerHTML = ''; // Tabloyu temizle

        data.forEach(ogrenci => {
         const isActive = Boolean(Number(ogrenci.isActive));

  const tr = document.createElement('tr');

          tr.innerHTML = `
            <td class="text-center">${ogrenci.schoolNo}</td>
            <td class="text-center">${ogrenci.fullName}</td>
            <td class="text-center">${ogrenci.studentClass}</td>
            <td class="text-center">${ogrenci.section}</td>
            <td class="text-center">${ogrenci.parentName || 'N/A'}</td>
            <td class="text-center">${ogrenci.parentContact || 'N/A'}</td>
            <td class="text-center">${ogrenci.aylikHak || 0}</td>
            <td class="text-center">${ogrenci.kullanilanHak || 0}</td>
            
            <td class="text-center" style="font-size: 0.8rem;">
              <button 
                class="btn btn-primary" 
                style="font-size: 0.7rem; padding: 0 6px; height: 25px;" 
                onclick="raporHakArtir('${ogrenci.schoolNo}')">+</button>
              <span style="margin: 0 6px;">${ogrenci.raporHak || 0}</span>
              <button 
                class="btn btn-danger" 
                style="font-size: 0.7rem; padding: 0 6px; height: 25px;" 
                onclick="raporHakAzalt('${ogrenci.schoolNo}')">-</button>
            </td>
          <td class="text-center">${ogrenci.odenecekTutar || 0}</td>

            <td class="text-center">
              <button class="btn btn-danger btn-sm sil-btn">🗑️</button>
            </td>
            <td class="text-center">
              <button class="btn btn-info btn-sm" onclick="kantinModalAc('${ogrenci.schoolNo}')">Kantin</button>
            </td>
            <td class="text-center">
              <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#duzenleModal" onclick="duzenleModalAc('${ogrenci.schoolNo}')">Düzenle</button>
            </td>
              <td class="text-center">
     <button class="btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'} toggle-active-btn" 
        data-schoolno="${ogrenci.SchoolNo || ogrenci.schoolNo}">
        ${isActive ? 'Pasif Yap' : 'Aktif Et'}
      </button>
  </td>
          `;

          tbody.appendChild(tr);
        });
      })
      .catch(error => {
        console.error('Öğrenci verileri alınamadı:', error);
      });

  }

  // İlk yüklemede çağır
  loadOgrenciler();
  // Toggle aktiflik (DOM yüklendikten sonra)
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('toggle-active-btn')) {
    const button = e.target;
    const schoolNo = button.dataset.schoolno;

    fetch(`/api/student/activate/${schoolNo}`, {
      method: 'PUT'
    })
      .then(res => {
        if (!res.ok) throw new Error('Durum güncellenemedi');
        return res.json();
      })
      .then(() => {
        loadOgrenciler();
      })
      .catch(err => {
        alert('Hata: ' + err.message);
      });
  }
});



  // Sil butonları için event delegation
  tbody.addEventListener('click', async function (event) {
    if (event.target.classList.contains('sil-btn')) {
      const button = event.target;
      const row = button.closest('tr');
      if (!row) return;

      // Okul numarasını ilk sütundan alıyoruz
      const schoolNo = row.querySelector('td').textContent.trim();

      if (!confirm(`${schoolNo} okul numaralı öğrenciyi silmek istediğinizden emin misiniz?`)) {
        return;
      }

      try {
        // Burada URL'de controller adını backend'ine göre ayarla
        // Backend'in controller adı StudentsController ise:
        const response = await fetch(`/api/student/${schoolNo}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Öğrenci silinemedi!');
        }

        // Başarılıysa sadece o satırı kaldır
        row.remove();

        alert('Öğrenci başarıyla silindi.');
      } catch (error) {
        alert('Hata oluştu: ' + error.message);
      }
    }
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
window.alert = function (message) {
  showToast(message, "danger");
};
// Sayfadaki tüm backdrop elementlerini seç ve kaldır
document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());


document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');

  // Scroll efekti için event listener
  window.addEventListener('scroll', function () {
    if (window.scrollY > 70) { // 100px'den sonra daralma başlasın
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Dropdown menüler için hover efekti (isteğe bağlı)
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function () {
      this.querySelector('.dropdown-toggle').click();
    });

    dropdown.addEventListener('mouseleave', function () {
      this.querySelector('.dropdown-toggle').click();
    });
  });
});









