// Global değişkenler
let openMenuId = null;
let searchTerm = '';
const menus = [];

// DOM elemanları
const menuList = document.getElementById('menuList');
const addMenuBtn = document.getElementById('addMenuBtn');
const menuNameInput = document.getElementById('menuName');
const searchInput = document.getElementById('searchInput');

// Menüleri API'den yükle
function loadMenusFromApi() {
  fetch('/api/yemekmenuleri')
    .then(async res => {
      if (!res.ok) throw new Error('Menüler yüklenemedi');
      return res.json();
    })
    .then(data => {
      const menuArray = Array.isArray(data) ? data : (data.$values || []);

      menus.length = 0;
      menuArray.forEach(menu => {
        const productsArray = Array.isArray(menu.urunler) ? menu.urunler : (menu.urunler?.$values || []);

        menus.push({
          id: menu.id,
          menuAdi: menu.menuAdi,
          kisiSayisi: menu.kisiSayisi,
          urunler: productsArray.map(p => ({
            id: p.id,
            urunAdi: p.urunAdi,
            miktarGram: p.miktarGram,
            birimFiyat: p.birimFiyat,
            menuId: menu.id
          }))
        });
      });

      renderMenus();
    })
    .catch(err => console.error('Menüler yüklenirken hata:', err.message));
}

// Sayfa yüklendiğinde menüleri çek
window.onload = () => {
  loadMenusFromApi();
};

// Yeni Menü Ekleme
addMenuBtn.addEventListener('click', () => {
  const name = menuNameInput.value.trim();
  if (!name) return alert('Lütfen Menü Adı Girin.');

  const newMenu = {
    menuAdi: name,
    kisiSayisi: 1,
    urunler: []
  };

  fetch('/api/yemekmenuleri/ekle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMenu)
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Hata: ${res.status} - ${text}`);
      }
      return res.json();
    })
    .then(savedMenu => {
      menus.push({
        id: savedMenu.id,
        menuAdi: savedMenu.menuAdi,
        kisiSayisi: savedMenu.kisiSayisi,
        urunler: []
      });
      openMenuId = savedMenu.id;
      menuNameInput.value = '';
      renderMenus();
    })
    .catch(err => alert('Menü eklenirken hata: ' + err.message));
});

// Arama inputu
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderMenus();
});

// Menüleri ve ürünleri çizme
function renderMenus() {
  menuList.innerHTML = '';

  const filteredMenus = menus.filter(menu => {
    if (!searchTerm) return true;
    const menuMatch = menu.menuAdi.toLowerCase().includes(searchTerm);
    const productMatch = menu.urunler.some(p => p.urunAdi.toLowerCase().includes(searchTerm));
    return menuMatch || productMatch;
  });

  filteredMenus.forEach(menu => {
    const isOpen = menu.id === openMenuId;
    const filteredProducts = menu.urunler.filter(p => {
      if (!searchTerm) return true;
      return p.urunAdi.toLowerCase().includes(searchTerm);
    });

    const productsRows = filteredProducts.map(p => {
      const totalQuantity = p.miktarGram * menu.kisiSayisi;
      const totalCostItem = (totalQuantity / 1000) * p.birimFiyat;

      return `
        <tr>
          <td>${p.urunAdi}</td>
          <td>
            <div class="input-group input-group-sm">
              <input type="number" min="0" value="${p.miktarGram}" data-menu-id="${menu.id}" data-prod-id="${p.id}" class="form-control qty-input" />
              <span class="input-group-text">g (kişi başı)</span>
            </div>
            <small class="text-muted">Toplam: ${totalQuantity.toLocaleString('tr-TR')} g</small>
          </td>
          <td>
            <input type="number" min="0" step="0.01" value="${p.birimFiyat}" data-menu-id="${menu.id}" data-prod-id="${p.id}" class="form-control price-input" />
          </td>
          <td>${totalCostItem.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</td>
        </tr>
      `;
    }).join('');

    const totalCost = filteredProducts.reduce((acc, p) => acc + ((p.miktarGram * menu.kisiSayisi) / 1000) * p.birimFiyat, 0);
    const costPerPerson = filteredProducts.reduce((acc, p) => acc + (p.miktarGram / 1000) * p.birimFiyat, 0);

    menuList.innerHTML += `
      <div class="accordion-item mb-3">
        <h2 class="accordion-header" id="heading${menu.id}">
          <button class="accordion-button ${isOpen ? '' : 'collapsed'}" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapse${menu.id}"
            aria-expanded="${isOpen}" aria-controls="collapse${menu.id}"
            data-menu-id="${menu.id}">
            ${menu.menuAdi}
          </button>
        </h2>

        <div id="collapse${menu.id}" class="accordion-collapse collapse ${isOpen ? 'show' : ''}" aria-labelledby="heading${menu.id}" data-bs-parent="#menuList">
          <div class="accordion-body">
            <div class="d-flex align-items-center justify-content-start mb-3 flex-wrap">
              <label for="personCountInput${menu.id}" class="mb-0 fw-semibold me-2">Kişi Sayısı:</label>
              <input id="personCountInput${menu.id}" type="number" min="1" value="${menu.kisiSayisi}" data-menu-id="${menu.id}" class="form-control form-control-sm w-auto person-count-input" />
            </div>

            <table class="table table-sm table-bordered align-middle mb-3">
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Miktar (g)</th>
                  <th>Birim Fiyat (₺ / kg)</th>
                  <th>Toplam (₺)</th>
                </tr>
              </thead>
              <tbody>
                ${productsRows || `<tr><td colspan="4" class="text-center">Ürün yok</td></tr>`}
              </tbody>
            </table>

            <div class="mb-3 d-flex align-items-center flex-wrap">
              <input type="text" placeholder="Ürün Adı" class="form-control form-control-sm me-2 mb-2" id="prodName${menu.id}" style="max-width: 50%;" />
              <input type="number" min="0" step="0.01" placeholder="Birim Fiyat (₺/kg)" class="form-control form-control-sm me-2 mb-2" id="prodPrice${menu.id}" style="max-width: 25%;" />
              <div class="input-group input-group-sm me-2 mb-2" style="max-width: 25%;">
                <input type="number" min="0" placeholder="Miktar (g)" class="form-control" id="prodQty${menu.id}" />
                <span class="input-group-text">g</span>
              </div>
              <button class="btn btn-sm btn-success mb-2" onclick="addProduct(${menu.id})">Ürün Ekle</button>
            </div>

            <div>
              <strong>Kişi Sayısı:</strong> ${menu.kisiSayisi.toLocaleString('tr-TR')} |
              <strong>Toplam Maliyet:</strong> ${totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺ |
              <strong>Kişi Başı Maliyet:</strong> ${costPerPerson.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Event handler'ları yeniden bağla
  document.querySelectorAll('.qty-input').forEach(input => {
    input.onchange = (e) => {
      const menuId = +e.target.dataset.menuId;
      const prodId = +e.target.dataset.prodId;
      const val = parseFloat(e.target.value) || 0;
      const menu = menus.find(m => m.id === menuId);
      if (menu) {
        const product = menu.urunler.find(p => p.id === prodId);
        if (product) {
          product.miktarGram = val;
          updateProduct(menuId, product);
        }
      }
    };
  });

  document.querySelectorAll('.price-input').forEach(input => {
    input.onchange = (e) => {
      const menuId = +e.target.dataset.menuId;
      const prodId = +e.target.dataset.prodId;
      const val = parseFloat(e.target.value) || 0;
      const menu = menus.find(m => m.id === menuId);
      if (menu) {
        const product = menu.urunler.find(p => p.id === prodId);
        if (product) {
          product.birimFiyat = val;
          updateProduct(menuId, product);
        }
      }
    };
  });

  document.querySelectorAll('.person-count-input').forEach(input => {
    input.onchange = (e) => {
      const menuId = +e.target.dataset.menuId;
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      const menu = menus.find(m => m.id === menuId);
      if (menu) {
        menu.kisiSayisi = val;
        updateMenu(menu);
      }
    };
  });

  document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const clickedMenuId = +btn.dataset.menuId;
      if (openMenuId === clickedMenuId) {
        const collapseEl = document.getElementById(`collapse${clickedMenuId}`);
        openMenuId = collapseEl.classList.contains('show') ? clickedMenuId : null;
      } else {
        openMenuId = clickedMenuId;
      }
    });
  });
}

// Yeni ürün ekle
function addProduct(menuId) {
  const prodName = document.getElementById('prodName' + menuId);
  const prodPrice = document.getElementById('prodPrice' + menuId);
  const prodQty = document.getElementById('prodQty' + menuId);

  const name = prodName.value.trim();
  const price = parseFloat(prodPrice.value);
  const qty = parseFloat(prodQty.value);

  if (!name || isNaN(price) || isNaN(qty)) {
    return alert('Lütfen tüm ürün bilgilerini doğru girin!');
  }

  const newProduct = {
    urunAdi: name,
    miktarGram: qty,
    birimFiyat: price,
    menuId: menuId
  };

  fetch(`/api/yemekmenuleri/${menuId}/urunler/ekle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  })
    .then(async res => {
      if (!res.ok) throw new Error('Ürün eklenemedi');
      return res.json();
    })
    .then(savedProduct => {
      const menu = menus.find(m => m.id === menuId);
      if (menu) {
        menu.urunler.push({
          id: savedProduct.id,
          urunAdi: savedProduct.urunAdi,
          miktarGram: savedProduct.miktarGram,
          birimFiyat: savedProduct.birimFiyat,
          menuId: menuId
        });
        prodName.value = '';
        prodPrice.value = '';
        prodQty.value = '';
        openMenuId = menuId;
        renderMenus();
      }
    })
    .catch(err => alert('Ürün eklenirken hata: ' + err.message));
}

// Ürün güncelle
function updateProduct(menuId, product) {
  const updatedProduct = {
    id: product.id,
    urunAdi: product.urunAdi,
    miktarGram: product.miktarGram,
    birimFiyat: product.birimFiyat,
    menuId: menuId
  };

  fetch(`/api/yemekmenuleri/${menuId}/urunler/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
  })
    .then(res => {
      if (!res.ok) throw new Error('Ürün güncellenemedi');
      renderMenus();
    })
    .catch(err => alert(err.message));
}

// Menü güncelle
function updateMenu(menu) {
  const updatedMenu = {
    id: menu.id,
    menuAdi: menu.menuAdi,
    kisiSayisi: menu.kisiSayisi
  };

  fetch(`/api/yemekmenuleri/${menu.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMenu)
  })
    .then(res => {
      if (!res.ok) throw new Error('Menü güncellenemedi');
      renderMenus();
    })
    .catch(err => alert(err.message));
}



    /////////////////////////////////// modalllar
 
  const calcBtn = document.getElementById('calcBtn');
  const calcModal = new bootstrap.Modal(document.getElementById('calcModal'));
  const modalPersonCountInput = document.getElementById('modalPersonCount');
  const productInputsContainer = document.getElementById('productInputsContainer');
  const perPersonList = document.getElementById('perPersonList');
  const addProductBtn = document.getElementById('addProductBtn');

  // Modal Açıldığında
  calcBtn.addEventListener('click', () => {
    modalPersonCountInput.value = 50;
    productInputsContainer.innerHTML = '';
    perPersonList.innerHTML = '';
    addProductInput(); // En az 1 satır göster
    calcModal.show();
  });

  // Kişi sayısı değiştiğinde
  modalPersonCountInput.addEventListener('input', updatePerPersonAmounts);

  // Yeni ürün ekle
  addProductBtn.addEventListener('click', () => {
    addProductInput();
  });

  // Ürün girişi satırı oluştur
  function addProductInput(name = '', amount = '') {
    const div = document.createElement('div');
    div.className = 'input-group mb-2';

    div.innerHTML = `
      <input type="text" class="form-control product-name" placeholder="Ürün Adı" value="${name}" />
      <input type="number" min="0" step="1" class="form-control product-amount" placeholder="Miktar (gram)" value="${amount}" />
      <button type="button" class="btn btn-danger btn-sm remove-product-btn">X</button>
    `;

    productInputsContainer.appendChild(div);

    div.querySelector('.remove-product-btn').addEventListener('click', () => {
      div.remove();
      updatePerPersonAmounts();
    });

    div.querySelector('.product-name').addEventListener('input', updatePerPersonAmounts);
    div.querySelector('.product-amount').addEventListener('input', updatePerPersonAmounts);
  }

  // Hesaplama ve liste güncelleme
  function updatePerPersonAmounts() {
    const personCount = parseInt(modalPersonCountInput.value);
    if (isNaN(personCount) || personCount < 1) return;

    perPersonList.innerHTML = '';

    const products = [...productInputsContainer.querySelectorAll('.input-group')].map(div => {
      const name = div.querySelector('.product-name').value.trim();
      const amount = parseFloat(div.querySelector('.product-amount').value);
      return { name, amount };
    }).filter(p => p.name !== '' && !isNaN(p.amount) && p.amount > 0);

    products.forEach(p => {
      const perPersonAmount = p.amount / personCount;
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${p.name}</span>
        <span>${perPersonAmount.toLocaleString('tr-TR')} g / kişi</span>
      `;
      perPersonList.appendChild(li);
    });
  }


/////////////////////////////////////////
const kgPriceBtn = document.getElementById("kgPriceBtn");
  const kgPriceModal = new bootstrap.Modal(document.getElementById("kgPriceModal"));
  const totalGramInput = document.getElementById("totalGramInput");
  const totalPriceInput = document.getElementById("totalPriceInput");
  const kgPriceResult = document.getElementById("kgPriceResult");
  const calculateKgPriceBtn = document.getElementById("calculateKgPriceBtn");

  kgPriceBtn.addEventListener("click", () => {
    totalGramInput.value = "";
    totalPriceInput.value = "";
    kgPriceResult.classList.add("d-none");
    kgPriceModal.show();
  });

  calculateKgPriceBtn.addEventListener("click", () => {
    const gram = parseFloat(totalGramInput.value);
    const price = parseFloat(totalPriceInput.value);

    if (isNaN(gram) || gram <= 0 || isNaN(price) || price < 0) {
      kgPriceResult.classList.remove("alert-info");
      kgPriceResult.classList.add("alert-danger");
      kgPriceResult.textContent = "Lütfen geçerli bir gram ve fiyat girin!";
      kgPriceResult.classList.remove("d-none");
      return;
    }

    const kgPrice = (price / gram) * 1000;
    kgPriceResult.classList.remove("alert-danger");
    kgPriceResult.classList.add("alert-info");
    kgPriceResult.innerHTML = `<strong>1 kg Fiyatı:</strong> ${kgPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;
    kgPriceResult.classList.remove("d-none");
  });
  ////////////////////////////////////////////////////////////
  
  const kgModal = new bootstrap.Modal(document.getElementById('kgCalcModal'));
  const btnOpenKgCalcModal = document.getElementById('btnOpenKgCalcModal');
  const btnCalculateKgPrice = document.getElementById('btnCalculateKgPrice');
  const kgGramInput = document.getElementById('kgGramInput');
  const kgPriceInput = document.getElementById('kgPriceInput');
  const kgCalcResult = document.getElementById('kgCalcResult');

  btnOpenKgCalcModal.addEventListener('click', () => {
    kgGramInput.value = '';
    kgPriceInput.value = '';
    kgCalcResult.classList.add('d-none');
    kgModal.show();
  });

  btnCalculateKgPrice.addEventListener('click', () => {
    const gram = parseFloat(kgGramInput.value);
    const totalPrice = parseFloat(kgPriceInput.value);

    if (isNaN(gram) || gram <= 0 || isNaN(totalPrice) || totalPrice < 0) {
      kgCalcResult.textContent = 'Lütfen geçerli bir miktar ve tutar giriniz!';
      kgCalcResult.classList.remove('d-none', 'alert-info');
      kgCalcResult.classList.add('alert-danger');
      return;
    }

    const perKgPrice = (totalPrice / gram) * 1000;
    kgCalcResult.innerHTML = `<strong>1 KG Fiyatı:</strong> ${perKgPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;
    kgCalcResult.classList.remove('d-none', 'alert-danger');
    kgCalcResult.classList.add('alert-info');
  });

  const productModal = new bootstrap.Modal(document.getElementById('productModal'));
  const btnOpenProductModal = document.getElementById('btnOpenProductModal');
  const btnSaveProduct = document.getElementById('btnSaveProduct');

  const productNameInput = document.getElementById('productNameInput');
  const productKgPriceInput = document.getElementById('productKgPriceInput');
  const productSuccessMsg = document.getElementById('productSuccessMsg');

  btnOpenProductModal.addEventListener('click', () => {
    productNameInput.value = '';
    productKgPriceInput.value = '';
    productSuccessMsg.classList.add('d-none');
    productModal.show();
  });

  btnSaveProduct.addEventListener('click', () => {
    const name = productNameInput.value.trim();
    const kgPrice = parseFloat(productKgPriceInput.value);

    if (!name || isNaN(kgPrice) || kgPrice <= 0) {
      productSuccessMsg.textContent = "Geçerli bir ürün adı ve fiyat girin!";
      productSuccessMsg.className = "alert alert-danger";
      productSuccessMsg.classList.remove('d-none');
      return;
    }

    // Şimdilik konsola yaz, sonra API ile SQL'e gönderilecek
    console.log("Ürün adı:", name, "KG fiyatı:", kgPrice);

    // Başarı mesajı
    productSuccessMsg.textContent = `"${name}" başarıyla eklendi!`;
    productSuccessMsg.className = "alert alert-success";
    productSuccessMsg.classList.remove('d-none');
  });
///////////////////////////////////////////////////////////////////////////////////// VeriTabanı Kodları Başlıyor... -->


  

