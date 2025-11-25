// Ay ve yıl
let now = new Date();
let currentMonth = now.getMonth(); // 0 = Ocak, 11 = Aralık
let currentYear = now.getFullYear();

let menuData = {};  // artık localStorage yok, sadece bellekte tutulacak
let activeCell = null;

const toastSuccess = new bootstrap.Toast(document.getElementById('successToast'));
const toastError = new bootstrap.Toast(document.getElementById('errorToast'));

document.addEventListener('DOMContentLoaded', () => {
  createCalendar();
  setupEventListeners();
  loadFoodList();
});

// Takvim oluşturma (hafta içi günleri)
function createCalendar() {
  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let workDays = [];
  for(let day=1; day<=daysInMonth; day++){
    const date = new Date(currentYear, currentMonth, day);
    const dayName = date.toLocaleDateString('tr-TR',{weekday:'short'});
    if(dayName !== 'Cmt' && dayName !== 'Paz') {
      workDays.push({ day, dayName, fullDate: formatDate(date) });
    }
  }

  for(let i=0; i<workDays.length; i+=5){
    if(i>0){
      let sep = document.createElement('div');
      sep.className = "week-separator d-flex align-items-center";
      sep.textContent = `${i/5+1}. Hafta`;
      container.appendChild(sep);
    }

    const row = document.createElement('div');
    row.className = "row";

    workDays.slice(i,i+5).forEach(({day,dayName,fullDate})=>{
      const col = document.createElement('div');
      col.className = "col-md-15 col-sm-4";

      const cell = document.createElement('div');
      cell.className = "day-cell";
      cell.dataset.date = fullDate;

      cell.innerHTML = `
        <div class="day-header">
          <span class="day-number">${day}</span>
          <span class="day-name">${dayName}</span>
        </div>
      `;

      const meals = menuData[fullDate] || [];
      const mealsContainer = document.createElement('div');
      mealsContainer.className = "meals-container";

      if(meals.length === 0){
        const emptyState = document.createElement('div');
        emptyState.className = "empty-state";
        emptyState.textContent = "Yemek eklemek için tıklayın";
        mealsContainer.appendChild(emptyState);
      } else {
        meals.forEach((meal,index) => {
          const mealItem = document.createElement('div');
          mealItem.className = "meal-item";
          mealItem.innerHTML = `
            ${meal}
            <span class="delete-meal" onclick="deleteMeal('${fullDate}',${index},event)">
              <i class="bi bi-trash"></i>
            </span>`;
          mealsContainer.appendChild(mealItem);
        });
      }

      cell.appendChild(mealsContainer);

      // Aktif hücre seçimi
      cell.addEventListener('click', () => {
        document.querySelectorAll('.day-cell').forEach(c=>c.classList.remove('active'));
        cell.classList.add('active');
        activeCell = cell;
      });

      col.appendChild(cell);
      row.appendChild(col);
    });

    container.appendChild(row);
  }
}

function setupEventListeners(){
  document.querySelectorAll('.food-item').forEach(item=>{
    item.addEventListener('click', function(){
      const mealName = this.textContent.trim();
      if(!addMealToNextAvailableDay(mealName)){
        // Hata gösteriliyor zaten
      }
    });
  });

  document.getElementById('addFoodBtn').addEventListener('click', ()=>{
    const input = document.getElementById('newFoodInput');
    const mealName = input.value.trim();
    if(mealName === ''){
      showToast('error','Lütfen bir yemek adı girin');
      return;
    }
    const foodList = document.getElementById('foodList');
    const newFoodItem = document.createElement('div');
    newFoodItem.className = "food-item";
    newFoodItem.innerHTML = `<i class="bi bi-plus-circle"></i> ${mealName}`;
    foodList.appendChild(newFoodItem);

    newFoodItem.addEventListener('click', function(){
      const mealNameNew = this.textContent.trim();
      if(!addMealToNextAvailableDay(mealNameNew)){
        // hata gösteriliyor
      }
    });

    saveFoodList(mealName);
    input.value = '';
    showToast('success','Yemek listeye eklendi');
  });

  document.getElementById('clearMenuBtn').addEventListener('click', ()=>{
    if(confirm('Menüyü tamamen temizlemek istediğinize emin misiniz?')){
      menuData = {};
      createCalendar();
      showToast('success','Menü tamamen temizlendi');
    }
  });

  const monthSelect = document.getElementById('monthSelect');
  if(monthSelect){
    monthSelect.value = currentMonth;
    monthSelect.addEventListener('change', ()=>{
      currentMonth = parseInt(monthSelect.value,10);
      createCalendar();
    });
  }

  const yearInput = document.getElementById('yearInput');
  if(yearInput){
    yearInput.value = currentYear;
    yearInput.addEventListener('change', ()=>{
      currentYear = parseInt(yearInput.value,10);
      createCalendar();
    });
  }
}

window.deleteMeal = function(date,index,event){
  event.stopPropagation();
  if(!menuData[date]) return;
  menuData[date].splice(index,1);
  if(menuData[date].length===0){
    delete menuData[date];
  }
  updateCalendarCell(date);
  showToast('success','Yemek başarıyla silindi');
}

function updateCalendarCell(date){
  const cell = document.querySelector(`.day-cell[data-date="${date}"]`);
  if(!cell) return;

  const mealsContainer = cell.querySelector('.meals-container');
  mealsContainer.innerHTML = '';

  const meals = menuData[date] || [];

  if(meals.length===0){
    const emptyState = document.createElement('div');
    emptyState.className = "empty-state";
    emptyState.textContent = "Yemek eklemek için tıklayın";
    mealsContainer.appendChild(emptyState);
  } else {
    meals.forEach((meal,index)=>{
      const mealItem = document.createElement('div');
      mealItem.className = "meal-item";
      mealItem.innerHTML = `
        ${meal}
        <span class="delete-meal" onclick="deleteMeal('${date}',${index},event)">
          <i class="bi bi-trash"></i>
        </span>`;
      mealsContainer.appendChild(mealItem);
    });
  }
}

function formatDate(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function showToast(type,message){
  const toast = type==='success' ? toastSuccess : toastError;
  const toastBody = document.querySelector(`#${type}Toast .toast-body`);
  toastBody.textContent = message;
  toast.show();
}

function loadFoodList(){
  const savedFoods = ['Mercimek Çorbası', 'Karnıyarık', 'Pilav', 'Makarna', 'Yoğurt', 'Meyve']; // artık localStorage’dan değil sabit

  const foodList = document.getElementById('foodList');
  foodList.innerHTML = '';

  const icons = ['bi-egg-fried', 'bi-egg', 'bi-basket', 'bi-nut', 'bi-cup-straw', 'bi-apple', 'bi-bread-slice', 'bi-cup-hot', 'bi-droplet', 'bi-egg-fill'];

  savedFoods.forEach((food,index)=>{
    const foodItem = document.createElement('div');
    foodItem.className = "food-item";
    const iconIndex = index < icons.length ? index : Math.floor(Math.random() * icons.length);
    foodItem.innerHTML = `<i class="bi ${icons[iconIndex]}"></i> ${food}`;
    foodList.appendChild(foodItem);

    foodItem.addEventListener('click',()=>{
      if(!addMealToNextAvailableDay(food)){
        // hata gösteriliyor
      }
    });
  });
}

function saveFoodList(newFood){
  // LocalStorage ile kayıt işlemi kaldırıldı, istersen burada API ile backend'e ekleme yapabilirsin
  // Şimdilik boş bırakıyorum
}

function addMealToNextAvailableDay(mealName){
  const dayCells = Array.from(document.querySelectorAll('.day-cell'));
  if(dayCells.length===0){
    showToast('error','Takvimde gün bulunamadı!');
    return false;
  }

  const sortedDays = dayCells.map(c=>c.dataset.date).sort();

  for(const date of sortedDays){
    menuData[date] = menuData[date] || [];
    if(menuData[date].length < 3 && !menuData[date].includes(mealName)){
      menuData[date].push(mealName);
      updateCalendarCell(date);
      showToast('success', `${mealName} ${date} tarihine eklendi.`);
      return true;
    }
  }

  showToast('error','Tüm günlerde yeterli alan yok veya yemek zaten eklenmiş.');
  return false;
}

function printMenuOnly(){
  const menuContainer = document.getElementById('calendarContainer');
  if(!menuContainer) return;

  const printWindow = window.open('','', 'width=800,height=600');
  printWindow.document.write('<html><head><title>Menü Yazdır</title>');
  printWindow.document.write(`
    <style>
      body { font-family: Arial, sans-serif; padding: 10px; }
      .day-cell { border: 1px solid #ccc; padding: 10px; margin-bottom: 5px; }
      .day-header { font-weight: bold; margin-bottom: 5px; }
      .meal-item { display: flex; justify-content: space-between; padding: 2px 0; }
      .week-separator { font-weight: bold; margin-top: 15px; }
    </style>
  `);
  printWindow.document.write('</head><body>');
  printWindow.document.write(menuContainer.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// API’den menüleri çek
fetch('/api/yemekmenuleri/menuler')
  .then(res => res.json())
  .then(menuList => {
    // menuList doğrudan dizi, $values gibi wrapper yok
    const list = document.getElementById('foodList');
    list.innerHTML = '';

    menuList.forEach(menuAdi => {
      const div = document.createElement('div');
      div.className = 'food-item';
      div.innerHTML = `<i class="bi bi-card-list"></i> ${menuAdi}`;

      div.addEventListener('click', () => {
        addMealToNextAvailableDay(menuAdi);
      });

      list.appendChild(div);
    });
  })
  .catch(err => console.error('Menüler alınamadı:', err));

////////////////////////////////////////////////////////////
const monthNames = [
  "ocak","subat","mart","nisan","mayis","haziran",
  "temmuz","agustos","eylul","ekim","kasim","aralik"
];

document.getElementById('saveBtn').addEventListener('click', async () => {
  const monthSelect = document.getElementById('monthSelect');
  const selectedMonthIndex = monthSelect.selectedIndex;
  const selectedMonthName = monthNames[selectedMonthIndex];

  let menuItems = [];

  const days = document.querySelectorAll('.day-cell');
  days.forEach(dayCell => {
    const tarih = dayCell.getAttribute('data-date');
    const yemekler = menuData[tarih] || [];

    let yemek1 = yemekler[0] || "";
    let yemek2 = yemekler[1] || "";
    let yemek3 = yemekler[2] || "";

    if (tarih) {
      let isoDate = new Date(tarih).toISOString();

      menuItems.push({
        Tarih: isoDate,
        Yemek1: yemek1,
        Yemek2: yemek2,
        Yemek3: yemek3
      });
    }
  });

  for (const item of menuItems) {
    const res = await fetch(`/api/yemekmenusu/${selectedMonthName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    if (!res.ok) {
      alert(`Kaydetme başarısız: ${item.Tarih}`);
      return;
    }
  }

  alert('Menü başarıyla kaydedildi!');
});

document.getElementById('deleteMonthBtn').addEventListener('click', () => {
  const monthSelect = document.getElementById('monthSelect');
  const selectedMonthIndex = monthSelect.selectedIndex;
  const selectedMonthName = monthNames[selectedMonthIndex];

  if (confirm(`${selectedMonthName} ayına ait tüm menü kayıtlarını silmek istediğinize emin misiniz?`)) {
    fetch(`/api/yemekmenusu/${selectedMonthName}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        alert('Menü kayıtları başarıyla silindi.');
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    })
    .catch(err => {
      alert('Sunucu hatası oluştu: ' + err.message);
    });
  }
});
/////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.getElementById('monthSelect');
  const selectedMonthIndex = monthSelect.selectedIndex;
  const selectedMonthName = monthNames[selectedMonthIndex];

fetch(`/api/yemekmenusu/${selectedMonthName}`)
  .then(res => res.json())
  .then(data => {
    menuData = {};
    data.forEach(item => {
      if (!item.tarih) {  // küçük t ile kontrol et
        console.warn("Tarih alanı yok veya boş:", item);
        return;
      }
      let dateKey = item.tarih.split('T')[0]; // küçük t ile eriş
      menuData[dateKey] = [];
      if(item.yemek1) menuData[dateKey].push(item.yemek1);
      if(item.yemek2) menuData[dateKey].push(item.yemek2);
      if(item.yemek3) menuData[dateKey].push(item.yemek3);
    });
    createCalendar();
  })
  .catch(err => console.error("Menü verisi alınamadı", err));
  //...
});
//////////////////////////////////////////////////////////////////////////


