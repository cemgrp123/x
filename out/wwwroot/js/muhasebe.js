// Günlük Gelir ve Gider
function formatTRY(value) {
    return '₺' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function loadIncomes() {
    const response = await fetch('/api/GunlukGelir');
    if (!response.ok) {
        alert('Gelir verisi alınamadı!');
        return;
    }
    const gelirler = await response.json();

    const tbody = document.getElementById('incomeList');
    tbody.innerHTML = '';

    gelirler.forEach(gelir => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(gelir.tarih).toLocaleDateString()}</td>
            <td>${gelir.aciklama}</td>
            <td>${formatTRY(gelir.tutar)}</td>
            <td><i class="bi bi-trash delete-btn" style="cursor:pointer" onclick="deleteIncome(${gelir.id})"></i></td>
        `;
        tbody.appendChild(tr);
    });
}

async function addIncome() {
    const tarih = document.getElementById('dateInput1').value;
    const aciklama = document.getElementById('descInput1').value;
    const tutar = parseFloat(document.getElementById('amountInput1').value);

    if (!tarih || !aciklama || isNaN(tutar)) {
        alert('Lütfen tüm alanları doğru doldurun.');
        return;
    }

    const yeniGelir = { tarih, aciklama, tutar };

    const response = await fetch('/api/GunlukGelir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yeniGelir)
    });

    if (response.ok) {
        document.getElementById('dateInput1').value = '';
        document.getElementById('descInput1').value = '';
        document.getElementById('amountInput1').value = '';
        loadIncomes();
    } else {
        alert('Gelir eklenirken hata oluştu.');
    }
}

async function deleteIncome(id) {
    if (!confirm('Bu geliri silmek istediğinize emin misiniz?')) return;

    const response = await fetch(`/api/GunlukGelir/${id}`, { method: 'DELETE' });

    if (response.ok) {
        loadIncomes();
    } else {
        alert('Silme işlemi sırasında hata oluştu.');
    }
}

async function loadExpenses() {
    const response = await fetch('/api/GunlukGider');
    if (!response.ok) {
        alert('Gider verisi alınamadı!');
        return;
    }
    const giderler = await response.json();

    const tbody = document.getElementById('expenseList');
    tbody.innerHTML = '';

    giderler.forEach(gider => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(gider.tarih).toLocaleDateString()}</td>
            <td>${gider.aciklama}</td>
            <td>${formatTRY(gider.tutar)}</td>
            <td><i class="bi bi-trash delete-btn" style="cursor:pointer" onclick="deleteExpense(${gider.id})"></i></td>
        `;
        tbody.appendChild(tr);
    });
}

async function addExpense() {
    const tarih = document.getElementById('dateInput2').value;
    const aciklama = document.getElementById('descInput2').value;
    const tutar = parseFloat(document.getElementById('amountInput2').value);

    if (!tarih || !aciklama || isNaN(tutar)) {
        alert('Lütfen tüm alanları doğru doldurun.');
        return;
    }

    const yeniGider = { tarih, aciklama, tutar };

    const response = await fetch('/api/GunlukGider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yeniGider)
    });

    if (response.ok) {
        document.getElementById('dateInput2').value = '';
        document.getElementById('descInput2').value = '';
        document.getElementById('amountInput2').value = '';
        loadExpenses();
    } else {
        alert('Gider eklenirken hata oluştu.');
    }
}

async function deleteExpense(id) {
    if (!confirm('Bu gideri silmek istediğinize emin misiniz?')) return;

    const response = await fetch(`/api/GunlukGider/${id}`, { method: 'DELETE' });

    if (response.ok) {
        loadExpenses();
    } else {
        alert('Silme işlemi sırasında hata oluştu.');
    }
}

window.onload = function () {
    loadIncomes();
    loadExpenses();
};
//////////////////////////////////////////////
function formatTRY(value) {
    return '₺' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function loadIncomes() {
    const response = await fetch('/api/GunlukGelir');
    const gelirler = await response.json();

    const tbody = document.getElementById('incomeList');
    tbody.innerHTML = '';

    let totalGelir = 0;

    gelirler.forEach(gelir => {
        totalGelir += gelir.tutar;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(gelir.tarih).toLocaleDateString()}</td>
            <td>${gelir.aciklama}</td>
            <td>${formatTRY(gelir.tutar)}</td>
            <td><i class="bi bi-trash delete-btn" style="cursor:pointer" onclick="deleteIncome(${gelir.id})"></i></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('amountBox3').textContent = formatTRY(totalGelir);
}

async function loadExpenses() {
    const response = await fetch('/api/GunlukGider');
    const giderler = await response.json();

    const tbody = document.getElementById('expenseList');
    tbody.innerHTML = '';

    let totalGider = 0;

    giderler.forEach(gider => {
        totalGider += gider.tutar;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(gider.tarih).toLocaleDateString()}</td>
            <td>${gider.aciklama}</td>
            <td>${formatTRY(gider.tutar)}</td>
            <td><i class="bi bi-trash delete-btn" style="cursor:pointer" onclick="deleteExpense(${gider.id})"></i></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('amountBox2').textContent = formatTRY(totalGider);
}

// Sayfa yüklendiğinde her iki fonksiyonu da çağır
window.onload = () => {
    loadIncomes();
    loadExpenses();
};

// Add this to your existing JavaScript
function updateProfitDisplay(income, expenses) {
    // Calculate profit
    const profit = income - expenses;
    document.getElementById('amountBox5').textContent = `₺${profit.toFixed(2)}`;
    
    // Calculate percentage
    const percentage = expenses > 0 ? ((profit / expenses) * 100) : (income > 0 ? 100 : 0);
    const percentageElement = document.getElementById('profitPercentage');
    
    // Update percentage display
    percentageElement.textContent = `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
    
    // Update color class
    percentageElement.parentElement.className = `profit-percentage-badge ${
        percentage >= 0 ? 'positive' : 'negative'
    }`;
}

// Example usage:
// updateProfitDisplay(15000, 10000); // Would show "+50.0%"
document.addEventListener('DOMContentLoaded', function() {
    // Örnek veriler
    const samplePayments = [
        { date: '15.05.2023', student: 'Ahmet Yılmaz (1452)', class: '9-A', amount: '₺450.00', status: 'paid' },
        { date: '14.05.2023', student: 'Ayşe Kaya (1786)', class: '10-B', amount: '₺450.00', status: 'paid' },
        { date: '13.05.2023', student: 'Mehmet Demir (1623)', class: '11-C', amount: '₺450.00', status: 'paid' }
    ];

    const sampleExpectedPayments = [
        { dueDate: '20.05.2023', student: 'Zeynep Şahin (1895)', class: '9-B', amount: '₺450.00', status: 'pending' },
        { dueDate: '18.05.2023', student: 'Can Bakan (1762)', class: '10-A', amount: '₺450.00', status: 'overdue' },
        { dueDate: '22.05.2023', student: 'Elif Nur (1943)', class: '11-D', amount: '₺450.00', status: 'pending' },
        { dueDate: '15.05.2023', student: 'Burak Koç (1657)', class: '12-C', amount: '₺450.00', status: 'overdue' }
    ];

    // Tabloları doldurma fonksiyonları
    function populatePaymentsTable(payments) {
        const tbody = document.getElementById('paymentList');
        tbody.innerHTML = '';

        payments.forEach(payment => {
            const statusClass = payment.status === 'paid' ? 'status-paid' : 
                              payment.status === 'pending' ? 'status-pending' : 'status-overdue';
            const statusText = payment.status === 'paid' ? 'Ödendi' : 
                             payment.status === 'pending' ? 'Bekliyor' : 'Gecikmiş';

            const row = `
                <tr>
                    <td>${payment.date}</td>
                    <td>${payment.student}</td>
                    <td>${payment.class}</td>
                    <td>${payment.amount}</td>
                    <td><span class="payment-status ${statusClass}">${statusText}</span></td>
                    <td>
                        <i class="bi bi-pencil-square edit-btn"></i>
                        <i class="bi bi-trash delete-btn"></i>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

   function populateExpectedPaymentsTable(payments) {
    const tbody = document.getElementById('expectedPaymentList');
    tbody.innerHTML = '';

    payments.forEach(payment => {
        const statusClass = payment.status === 'paid' ? 'status-paid' : 
                          payment.status === 'pending' ? 'status-pending' : 'status-overdue';
        const statusText = payment.status === 'paid' ? 'Ödendi' : 
                         payment.status === 'pending' ? 'Bekliyor' : 'Gecikmiş';

        // Sadece Hatırlat butonunu ekliyoruz
        const actionBtn = payment.status !== 'paid' ? 
            `<button class="btn btn-sm btn-warning" onclick="sendReminder(this)">Hatırlat</button>` : '';

        const row = `
            <tr>
                <td>${payment.dueDate}</td>
                <td>${payment.student}</td>
                <td>${payment.class}</td>
                <td>${payment.amount}</td>
                <td><span class="payment-status ${statusClass}">${statusText}</span></td>
                <td>${actionBtn}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Arama fonksiyonları
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = samplePayments.filter(payment => 
        payment.student.toLowerCase().includes(searchTerm) || 
        payment.class.toLowerCase().includes(searchTerm));
    populatePaymentsTable(filtered);
});

document.getElementById('searchExpectedInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = sampleExpectedPayments.filter(payment => 
        payment.student.toLowerCase().includes(searchTerm) || 
        payment.class.toLowerCase().includes(searchTerm));
    populateExpectedPaymentsTable(filtered);
});

// İlk yüklemede tabloları doldur
populatePaymentsTable(samplePayments);
populateExpectedPaymentsTable(sampleExpectedPayments);
});
/////////////////////////////////////////////////////////////Buraya Kadar tamam
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