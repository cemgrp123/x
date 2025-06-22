// Ay isimleri, backend API için
const aylar = [
  "ocak","subat","mart","nisan","mayis","haziran",
  "temmuz","agustos","eylul","ekim","kasim","aralik"
];

// Tarihi TR formatında güzel gösterir
function formatDate(date) {
  return date.toLocaleDateString('tr-TR');
}

// Gün ismini baş harfi büyük, TR formatında döner
function getWeekdayName(date) {
  const name = date.toLocaleDateString('tr-TR', { weekday: 'long' });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function generateMenus() {
  const year = parseInt(document.getElementById('yearInput').value);
  const month = parseInt(document.getElementById('monthInput').value);

  if (isNaN(year) || isNaN(month)) {
    alert('Lütfen geçerli yıl ve ay seçin');
    return;
  }

  const ayAdi = aylar[month];

  try {
    // Backend API'den o aya ait menüleri çekiyoruz
    const response = await fetch(`/api/yemekmenusu/${ayAdi}`);
    if (!response.ok) throw new Error('Veri çekilemedi: ' + response.statusText);

    const data = await response.json();

    // Backend’den gelen veride Tarih, Yemek1, Yemek2, Yemek3 var
    // Sadece hafta içi günleri (Pazartesi-Cuma) gösterelim, tarih sıralı olsun
    const haftaIciMenuler = data
      .map(item => {
        const tarih = new Date(item.tarih || item.Tarih); // tarih alanı modelde farklı olabilir
        return { ...item, tarihObj: tarih };
      })
      .filter(item => {
        const gun = item.tarihObj.getDay();
        return gun >= 1 && gun <= 5; // Pazartesi(1) - Cuma(5)
      })
      .sort((a,b) => a.tarihObj - b.tarihObj);

    // 5 günlük hafta blokları oluştur
    const haftalar = [];
    for(let i=0; i<haftaIciMenuler.length; i+=5){
      const hafta = haftaIciMenuler.slice(i, i+5);
      // 5 güne tamamla (null ile)
      while(hafta.length < 5) hafta.push(null);
      haftalar.push(hafta);
    }

    // Tablo gövdesini temizle
    const tbody = document.getElementById('menuBody');
    tbody.innerHTML = '';

    // Haftaları tabloya ekle
    haftalar.forEach((hafta, index) => {
      const tr = document.createElement('tr');

      // Hafta numarası hücresi
      const haftaTd = document.createElement('td');
      haftaTd.className = 'week-label';
      haftaTd.textContent = `${index + 1}. Hafta`;
      tr.appendChild(haftaTd);

      hafta.forEach(item => {
        const td = document.createElement('td');

        if (item) {
          td.innerHTML = `
            <div class="date">${formatDate(item.tarihObj)}<br>${getWeekdayName(item.tarihObj)}</div>
            <div class="menu-item ana">${item.Yemek1 || item.yemek1 || ''}</div>
            <div class="menu-item garnitur">${item.Yemek2 || item.yemek2 || ''}</div>
            <div class="menu-item ekstra">${item.Yemek3 || item.yemek3 || ''}</div>
          `;
        } else {
          td.innerHTML = '&nbsp;'; // Boş hücre
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

  } catch(err) {
    alert('Menü verisi alınamadı: ' + err.message);
  }
}

// Sayfa yüklendiğinde inputları ayarla ve menüyü oluştur
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const yearInput = document.getElementById('yearInput');
  const monthInput = document.getElementById('monthInput');

  if (yearInput) yearInput.value = currentYear;
  if (monthInput) monthInput.value = currentMonth;

  // Otomatik menü oluştur
  generateMenus();

  // Input değişince menüyü tekrar oluştur
  yearInput.addEventListener('change', generateMenus);
  monthInput.addEventListener('change', generateMenus);
});
