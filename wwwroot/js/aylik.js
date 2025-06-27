   // Tarih bilgisini güncelle
        function updateDates() {
            const now = new Date();
            document.getElementById('updateDate').textContent = now.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            document.getElementById('printDate').textContent = now.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        
        // Sayı formatlama fonksiyonu
        function formatNumber(num) {
            return num.toFixed(2)
                .replace('.', ',') // Ondalık ayracını virgül yap
                .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Binlik ayraçlarını nokta yap
        }

        async function getMaliyet() {
            const ayTablo = document.getElementById('aySec').value;
            const selectedMonthName = document.getElementById('aySec').options[document.getElementById('aySec').selectedIndex].text;
            
            // Seçilen ayı başlıkta göster
            document.getElementById('selectedMonth').textContent = selectedMonthName;
            document.getElementById('printMonth').textContent = selectedMonthName + " Ayı";
            
            // Yükleme göstergesini aktif et
            const spinner = document.getElementById('loadingSpinner');
            spinner.style.display = 'inline-block';
            
            try {
                const response = await fetch('/api/aylikmaliyet?tablo=' + ayTablo);
                const data = await response.json();

                const tbody = document.getElementById('sonucTablo');
                tbody.innerHTML = '';

                if (data.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center py-4">
                                <div class="text-muted">
                                    <i class="fas fa-exclamation-circle me-2"></i>Seçilen aya ait veri bulunamadı
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                let toplamGenel = 0;

                data.forEach(row => {
                    toplamGenel += row.aylikToplamMaliyet;

                    tbody.innerHTML += `
                        <tr>
                            <td>${row.urunAdi}</td>
                            <td class="text-end">${formatNumber(row.aylikToplamMiktarGram)}</td>
                            <td class="text-end">${formatNumber(row.birimFiyat)}</td>
                            <td class="text-end fw-medium">${formatNumber(row.aylikToplamMaliyet)}</td>
                        </tr>`;
                });

                tbody.innerHTML += `
                    <tr class="total-row">
                        <td colspan="3" class="text-end"><i class="fas fa-coins me-2 no-print"></i><span class="print-only">Genel Toplam</span></td>
                        <td class="text-end fw-bold">${formatNumber(toplamGenel)} ₺</td>
                    </tr>`;
            } catch (error) {
                console.error('Hata:', error);
                const tbody = document.getElementById('sonucTablo');
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-4 text-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>Veriler yüklenirken bir hata oluştu
                        </td>
                    </tr>`;
            } finally {
                spinner.style.display = 'none';
            }
        }

        // Sayfa açıldığında otomatik yükle
        window.onload = function() {
            updateDates();
            // Başlangıçta seçili ayı göster
            document.getElementById('selectedMonth').textContent = 
                document.getElementById('aySec').options[document.getElementById('aySec').selectedIndex].text;
            document.getElementById('printMonth').textContent = 
                document.getElementById('aySec').options[document.getElementById('aySec').selectedIndex].text + " Ayı";
            
            getMaliyet();
        };