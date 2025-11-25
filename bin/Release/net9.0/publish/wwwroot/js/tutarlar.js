document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('paymentForm');
  const tableBody = document.getElementById('paymentTableBody');
  const saveBtn = document.getElementById('savePaymentsBtn');

  let payments = [];

  function createRow(payment) {
    const row = document.createElement('tr');
    row.dataset.id = payment.id; // ID'yi data attribute olarak kaydet

    // Ay
    const monthTd = document.createElement('td');
    monthTd.contentEditable = true;
    monthTd.textContent = payment.month;
    row.appendChild(monthTd);

    // Gün Sayısı
    const dayTd = document.createElement('td');
    dayTd.contentEditable = true;
    dayTd.textContent = payment.dayCount;
    row.appendChild(dayTd);

    // Günlük Ücret
    const dailyTd = document.createElement('td');
    dailyTd.contentEditable = true;
    dailyTd.textContent = payment.dailyPayment;
    row.appendChild(dailyTd);

    // Toplam Ücret (otomatik hesaplanır, editable değil)
    const totalTd = document.createElement('td');
    totalTd.textContent = (payment.dayCount * payment.dailyPayment).toFixed(2);
    row.appendChild(totalTd);

    // Son Ödeme Tarihi
    const dateTd = document.createElement('td');
    dateTd.contentEditable = true;
    // Tarih ISO string'den sade haliyle
    if (payment.paymentDate) {
      dateTd.textContent = payment.paymentDate.split('T')[0];
    } else {
      dateTd.textContent = new Date().toISOString().split('T')[0];
    }
    row.appendChild(dateTd);

    // Silme butonu
    const deleteTd = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Sil';
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteTd.appendChild(deleteBtn);
    row.appendChild(deleteTd);

    deleteBtn.onclick = () => {
      if (confirm("Bu satırı silmek istediğinizden emin misiniz?")) {
        fetch(`/api/ayliktutarlar/${payment.id}`, {
          method: 'DELETE'
        })
          .then(res => {
            if (!res.ok) throw new Error("Sunucu hatası");
            row.remove();
            payments = payments.filter(p => p.id !== payment.id);
          })
          .catch(err => {
            alert("Silme başarısız: " + err.message);
          });
      }
    };

    // Toplam güncelleme (Gün sayısı veya günlük ücret değiştiğinde)
    [dayTd, dailyTd].forEach(cell => {
      cell.addEventListener('input', () => {
        const gun = parseInt(dayTd.textContent) || 0;
        const ucret = parseFloat(dailyTd.textContent) || 0;
        totalTd.textContent = (gun * ucret).toFixed(2);
      });
    });

    tableBody.appendChild(row);
  }

  // Form ile yeni satır ekleme
  form.addEventListener('submit', e => {
    e.preventDefault();

    const month = document.getElementById('month').value;
    const dayCount = parseInt(document.getElementById('dayCount').value);
    const dailyPayment = parseFloat(document.getElementById('dailyPayment').value);
    const paymentDate = document.getElementById('paymentDate').value;

    fetch('/api/ayliktutarlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ay: month,
        gunSayisi: dayCount,
        gunlukUcret: dailyPayment,
        sonOdemeTarihi: paymentDate
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Kayıt başarısız");
        return res.json();
      })
      .then(data => {
        const newPayment = {
          id: data.id,
          month,
          dayCount,
          dailyPayment,
          paymentDate
        };
        payments.push(newPayment);
        createRow(newPayment);
        form.reset();
        document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
      })
      .catch(err => {
        alert("Kayıt başarısız: " + err.message);
      });
  });

  // Sayfa açıldığında verileri getir
  async function loadPayments() {
    try {
      const res = await fetch('/api/ayliktutarlar');
      if (!res.ok) throw new Error("Veri yüklenemedi");
      const data = await res.json();
      payments = data.map(p => ({
        id: p.id,
        month: p.ay,
        dayCount: p.gunSayisi,
        dailyPayment: p.gunlukUcret,
        paymentDate: p.sonOdemeTarihi
      }));
      payments.forEach(p => createRow(p));
    } catch (err) {
      alert("Veri yüklenemedi: " + err.message);
    }
  }

  loadPayments();

  // KAYDET butonu tıklaması
  saveBtn.addEventListener('click', () => {
    const rows = [...tableBody.querySelectorAll('tr')];
    const updatedData = rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        Id: parseInt(row.dataset.id),
        Ay: cells[0].textContent.trim(),
        GunSayisi: parseInt(cells[1].textContent) || 0,
        GunlukUcret: parseFloat(cells[2].textContent) || 0,
        SonOdemeTarihi: cells[4].textContent.trim()
      };
    });

    fetch('/api/ayliktutarlar/insertmultiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Sunucu hatası");
        return res.json();
      })
      .then(res => {
        alert("Veriler kaydedildi.");
      })
      .catch(err => {
        alert("Hata: " + err.message);
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