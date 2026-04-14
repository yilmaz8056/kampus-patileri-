// Başlangıç Mock Verileri
const initialData = [
  { id: 1, type: 'cat', name: "Tarçın", age: "3 Yaşında", location: "Kütüphane Önü", health: "Sağlıklı", vaccine: "Tam (Kuduz, Karma)", neutered: "Kısırlaştırıldı", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 2, type: 'cat', name: "Gece", age: "1.5 Yaşında", location: "Mühendislik Fakültesi", health: "Göz damlası kullanıyor", vaccine: "Karma Eksik", neutered: "Kısırlaştırılmadı", image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 3, type: 'cat', name: "Pamuk", age: "5 Yaşında", location: "Yemekhane", health: "Çok Sağlıklı ve Kilolu", vaccine: "Tam", neutered: "Kısırlaştırıldı", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 4, type: 'cat', name: "Duman", age: "1 Yaşında", location: "Spor Salonu", health: "Sol arka patisinde incinme var", vaccine: "Aşıları Tam", neutered: "Kısırlaştırıldı", image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 5, type: 'cat', name: "Karamel", age: "4 Aylık", location: "Rektörlük", health: "Sağlıklı", vaccine: "Bilinmiyor", neutered: "Kısırlaştırılmadı", image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&auto=format&fit=crop", isAdoptable: true, contact: "0532 000 0000" },
  { id: 6, type: 'dog', name: "Karabaş", age: "4 Yaşında", location: "Güvenlik Kulübesi", health: "Sağlıklı", vaccine: "Tam", neutered: "Kısırlaştırıldı", image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 7, type: 'dog', name: "Dost", age: "Bilinmiyor", location: "Yurtlar Bölgesi", health: "Hafif topallıyor", vaccine: "Karma yapıldı", neutered: "Kısırlaştırılmadı", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop", isAdoptable: true, contact: "IG: @dostsahiplendirme" },
  { id: 8, type: 'dog', name: "Şanslı", age: "6 Yaşında", location: "Merkezi Çimler", health: "Obezite diyeti", vaccine: "Tüm Aşıları Tam", neutered: "Kısırlaştırıldı", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 9, type: 'dog', name: "Cesur", age: "2 Yaşında", location: "Otopark", health: "Sağlıklı", vaccine: "Kuduz Aşısı Gerekli", neutered: "Kısırlaştırılmadı", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" },
  { id: 10, type: 'dog', name: "Gölge", age: "11 Aylık", location: "Ormanlık Alan", health: "Deri tedavisi görüyor", vaccine: "Öncelikli değil", neutered: "Bilinmiyor", image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop", isAdoptable: false, contact: "" }
];

// PWA - Uygulamayı Telefona İndirme Yeteneği
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Sistemi Devrede. Kapsam:', reg.scope))
      .catch(err => console.log('PWA Yüklenemedi:', err));
  });
}

let animals = [];
let currentType = 'cat';
let editingAnimalId = null; 
let currentViewedAnimal = null; 

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

let currentScore = 0;
let unlockedTrophies = [];

function checkTrophies() {
  let newUnlocked = false;
  if (!unlockedTrophies.includes('ilk_merhamet') && currentScore >= 10) {
    unlockedTrophies.push('ilk_merhamet'); newUnlocked = "🐾 İlk Merhamet";
  }
  if (!unlockedTrophies.includes('kampus_kahramani') && currentScore >= 50) {
    unlockedTrophies.push('kampus_kahramani'); newUnlocked = "🛡️ Kampüs Kahramanı";
  }
  const hasGuardian = animals.some(a => a.guardian);
  if (!unlockedTrophies.includes('koruyucu_melek') && hasGuardian) {
    unlockedTrophies.push('koruyucu_melek'); newUnlocked = "👼 Koruyucu Melek";
  }
  
  if (newUnlocked) {
     localStorage.setItem('kampus_trophies', JSON.stringify(unlockedTrophies));
     if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]);
     alert("🏆 TEBRİKLER YENİ KUPA: " + newUnlocked + "\n\nSistem sekmesinden detaylara bakabilirsiniz!");
  }
}

function initApp() {
  const savedTheme = localStorage.getItem('kampus-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  const savedScore = localStorage.getItem('kampus_score');
  if (savedScore) {
    currentScore = parseInt(savedScore);
    document.getElementById('user-score').innerHTML = `<i class="fa-solid fa-gem"></i> ${currentScore} Puan`;
  }

  const savedTrophies = localStorage.getItem('kampus_trophies');
  if (savedTrophies) unlockedTrophies = JSON.parse(savedTrophies);

  const storedData = localStorage.getItem('kampus_hayvanlari_v2');
  if (storedData) {
    animals = JSON.parse(storedData);
  } else {
    animals = initialData;
    saveData();
  }
  renderAnimals();
}

function updateScore(points) {
  currentScore += points;
  localStorage.setItem('kampus_score', currentScore);
  const scoreEl = document.getElementById('user-score');
  scoreEl.innerHTML = `<i class="fa-solid fa-gem"></i> ${currentScore} Puan`;
  scoreEl.style.transform = 'scale(1.2)';
  setTimeout(() => scoreEl.style.transform = 'scale(1)', 300);
  checkTrophies();
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " yıl önce";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " ay önce";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " gün önce";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " saat önce";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " dakika önce";
  return "Şimdi";
}

function saveData() {
  try {
    localStorage.setItem('kampus_hayvanlari_v2', JSON.stringify(animals));
    if ('vibrate' in navigator) navigator.vibrate(50); // Haptik Titreşim!
    checkTrophies();
    return true;
  } catch (e) {
    alert("Kayıt başarısız! Müsait alan dolmuş olabilir veya tarayıcı kısıtlıyor. (" + e.name + ")");
    return false;
  }
}

function renderAnimals() {
  const grid = document.getElementById('animal-grid');
  grid.innerHTML = ''; 
  
  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.toLowerCase();

  let filteredAnimals = currentType === 'adopt' 
    ? animals.filter(a => a.isAdoptable === true)
    : animals.filter(a => a.type === currentType);
    
  if (searchText) {
    filteredAnimals = filteredAnimals.filter(a => 
      a.name.toLowerCase().includes(searchText) || 
      a.location.toLowerCase().includes(searchText)
    );
  }
  
  if (currentType === 'system') {
    const totalAnimals = animals.length;
    const dogs = animals.filter(a => a.type === 'dog').length;
    const cats = animals.filter(a => a.type === 'cat').length;
    const sosCount = animals.filter(a => a.isSOS).length;
    const adoptCount = animals.filter(a => a.isAdoptable).length;

    grid.innerHTML = `
      <div style="grid-column: 1/-1; display:flex; flex-direction:column; gap:1.5rem;">
         <div style="background:var(--bg-color); padding:1.5rem; border-radius:1rem; border:1px solid var(--glass-border); box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
           <h2 style="margin-bottom:1rem; color:var(--text-dark);"><i class="fa-solid fa-trophy"></i> Başarımlar (Kupalar)</h2>
           <div style="display:flex; flex-direction:column; gap:0.5rem;">
             <div style="padding:0.8rem; border-radius:0.5rem; display:flex; align-items:center; gap:0.5rem; background:${unlockedTrophies.includes('ilk_merhamet') ? '#fef3c7' : 'rgba(0,0,0,0.05)'}; border:${unlockedTrophies.includes('ilk_merhamet') ? '1px solid #f59e0b' : 'none'}; color:${unlockedTrophies.includes('ilk_merhamet') ? '#d97706' : 'var(--text-light)'}">
                <i class="fa-solid fa-medal" style="font-size:1.5rem;"></i> <div><b>İlk Merhamet:</b> <br><span style="font-size:0.8rem">Sisteme 10 İyilik Puanı kazandır.</span></div>
             </div>
             <div style="padding:0.8rem; border-radius:0.5rem; display:flex; align-items:center; gap:0.5rem; background:${unlockedTrophies.includes('kampus_kahramani') ? '#fef3c7' : 'rgba(0,0,0,0.05)'}; border:${unlockedTrophies.includes('kampus_kahramani') ? '1px solid #f59e0b' : 'none'}; color:${unlockedTrophies.includes('kampus_kahramani') ? '#d97706' : 'var(--text-light)'}">
                <i class="fa-solid fa-medal" style="font-size:1.5rem;"></i> <div><b>Kampüs Kahramanı:</b> <br><span style="font-size:0.8rem">50 Puana ulaş.</span></div>
             </div>
             <div style="padding:0.8rem; border-radius:0.5rem; display:flex; align-items:center; gap:0.5rem; background:${unlockedTrophies.includes('koruyucu_melek') ? '#f3e8ff' : 'rgba(0,0,0,0.05)'}; border:${unlockedTrophies.includes('koruyucu_melek') ? '1px solid #a855f7' : 'none'}; color:${unlockedTrophies.includes('koruyucu_melek') ? '#7e22ce' : 'var(--text-light)'}">
                <i class="fa-solid fa-shield-halved" style="font-size:1.5rem;"></i> <div><b>Koruyucu Melek:</b> <br><span style="font-size:0.8rem">Bir canın sorumluluğunu üstlen.</span></div>
             </div>
           </div>
         </div>

         <div style="background:var(--bg-color); padding:1.5rem; border-radius:1rem; border:1px solid var(--glass-border); box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
           <h2 style="margin-bottom:1rem; color:var(--text-dark);"><i class="fa-solid fa-chart-pie"></i> Kampüs İstatistikleri</h2>
           <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
             <div style="background:#3b82f6; color:white; padding:1rem; border-radius:0.8rem; text-align:center;">
               <h3 style="font-size:2rem; margin:0;">${totalAnimals}</h3><p style="margin:0; font-size:0.85rem; opacity:0.9;">Kayıtlı Can</p>
             </div>
             <div style="background:#f59e0b; color:white; padding:1rem; border-radius:0.8rem; text-align:center;">
               <h3 style="font-size:2rem; margin:0;">${currentScore}</h3><p style="margin:0; font-size:0.85rem; opacity:0.9;">Toplam Puanınız</p>
             </div>
             <div style="background:#ef4444; color:white; padding:1rem; border-radius:0.8rem; text-align:center;">
               <h3 style="font-size:2rem; margin:0;">${sosCount}</h3><p style="margin:0; font-size:0.85rem; opacity:0.9;">Acil Durum (SOS)</p>
             </div>
             <div style="background:#10b981; color:white; padding:1rem; border-radius:0.8rem; text-align:center;">
               <h3 style="font-size:2rem; margin:0;">${adoptCount}</h3><p style="margin:0; font-size:0.85rem; opacity:0.9;">Yuva Arayan</p>
             </div>
           </div>
         </div>

         <div style="background:var(--bg-color); padding:1.5rem; border-radius:1rem; border:1px solid var(--glass-border); box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
           <h2 style="margin-bottom:0.5rem; color:var(--text-dark);"><i class="fa-solid fa-cloud-arrow-up"></i> Cihaz Senkronizasyonu (Sync)</h2>
           <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:1rem;">Zaten bir veriniz varsa Kod panelini kopyalayabilirsiniz, veya boş cihaza kod yapıştırarak anında indirebilirsiniz.</p>
           <textarea id="sync-data-textarea" rows="4" style="width:100%; padding:0.8rem; border-radius:0.5rem; border:1px solid var(--active-color); background:rgba(0,0,0,0.02); resize:none; font-family:monospace; font-size:0.7rem; box-sizing:border-box;" placeholder="JSON Cihaz Senkronizasyon Kodu buraya gelecek..."></textarea>
           <div style="display:flex; gap:0.5rem; margin-top:0.8rem;">
              <button id="export-sync-btn" class="submit-btn" style="margin-top:0; flex:1; background:#8b5cf6;"><i class="fa-solid fa-copy"></i> Kodu Kopyala</button>
              <button id="import-sync-btn" class="submit-btn" style="margin-top:0; flex:1; background:#ef4444;"><i class="fa-solid fa-download"></i> Kodu Yükle</button>
           </div>
         </div>
      </div>
    `;

    document.getElementById('export-sync-btn').addEventListener('click', () => {
       const exportData = JSON.stringify(animals);
       document.getElementById('sync-data-textarea').value = exportData;
       navigator.clipboard.writeText(exportData);
       alert("🎉 Sistem verileri başarıyla panele kopyalandı! Artık bunu Whatsapp vb. ile kopyalayıp arkadaşlarınıza gönderebilirsiniz.");
    });

    document.getElementById('import-sync-btn').addEventListener('click', () => {
       const text = document.getElementById('sync-data-textarea').value;
       if (!text) return alert("Lütfen boş alana Kod metnini yapıştırın!");
       if (confirm("⚠️ DİKKAT: İçeri aktarım yaparsanız telefonunuzdaki mevcut listeler KOMPLE SİLİNECEK ve bu kodun içindekiler yüklenecektir! Emin misiniz?")) {
         try {
           const parsed = JSON.parse(text);
           if (Array.isArray(parsed)) {
             animals = parsed;
             saveData();
             alert("✅ Veriler Mükemmel Şekilde Yüklendi! Yeni cihazla senkronize oldunuz. Sayfa yenileniyor...");
             location.reload();
           } else {
             alert("Hatalı veri yapısı! (Dizi değil)");
           }
         } catch(e) {
           alert("Hata! Kod bozuk veya kopuk kopyalanmış: " + e.message);
         }
       }
    });

    return;
  }

  if (filteredAnimals.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 2rem;">Henüz kayıtlı canlı bulunamadı.</p>`;
    return;
  }

  filteredAnimals.forEach(animal => {
    const card = document.createElement('div');
    card.className = animal.isSOS ? 'cat-card sos-card' : 'cat-card'; 
    
    let badgesHTML = '';
    if (animal.type === 'station') {
       const badgeColor = animal.stationState && animal.stationState.includes('Dolu') ? '#10b981' : (animal.stationState && animal.stationState.includes('Boş') ? '#ef4444' : '#f59e0b');
       badgesHTML = `<div style="background:${badgeColor}; color:white; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3);"><i class="fa-solid fa-info-circle"></i> ${animal.stationState || 'Durum Bilinmiyor'}</div>`;
    } else {
       const adoptBadge = animal.isAdoptable ? `<div style="background:#10b981; color:white; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3);"><i class="fa-solid fa-house-chimney-heart"></i> Yuva Arıyor</div>` : '';
       const isUnneutered = animal.neutered && (animal.neutered === 'Kısırlaştırılmadı' || animal.neutered.toLowerCase().includes('kısırlaştırılmadı'));
       const neuteredBadge = isUnneutered ? `<div style="background:#ef4444; color:white; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3);"><i class="fa-solid fa-triangle-exclamation"></i> Kısır Değil</div>` : '';
       badgesHTML = adoptBadge + neuteredBadge;
    }

    const sosBadge = animal.isSOS && animal.type !== 'station' ? `<div class="sos-badge">🚨 ACİL DURUM</div>` : '';

    card.innerHTML = `
      <div class="cat-img-wrapper" style="position:relative;">
        ${sosBadge}
        <div style="position:absolute; top:8px; right:8px; display:flex; flex-direction:column; gap:0.4rem; z-index:10; align-items:flex-end;">
          ${badgesHTML}
        </div>
        <img src="${animal.image}" alt="${animal.name}">
      </div>
      <div class="cat-info">
        <h3>${animal.name}</h3>
        <p><i class="fa-solid fa-location-dot"></i> ${animal.location}</p>
      </div>
    `;
    card.addEventListener('click', () => openDetailModal(animal));
    grid.appendChild(card);
  });
}

function setupEventListeners() {
  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const root = document.documentElement;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      currentType = targetBtn.dataset.type;
      
      if (currentType === 'dog') {
        root.style.setProperty('--active-color', '#3b82f6');
      } else if (currentType === 'adopt') {
        root.style.setProperty('--active-color', '#10b981'); // Yuva arayanlar için tatlı yeşil ton
      } else if (currentType === 'station') {
        root.style.setProperty('--active-color', '#eab308'); // İstasyonlar için sarı sıcak ton
      } else if (currentType === 'system') {
        root.style.setProperty('--active-color', '#8b5cf6'); // Sistem için estetik mor ton
      } else {
        root.style.setProperty('--active-color', '#ff8c42');
      }
      renderAnimals();
    });
  });

  const fabAdd = document.getElementById('fab-add');
  const detailModal = document.getElementById('animal-modal');
  const addModal = document.getElementById('add-modal');
  const zoomModal = document.getElementById('image-zoom-modal');
  const closeDetail = document.getElementById('close-detail-modal');
  const closeAdd = document.getElementById('close-add-modal');
  const closeZoom = document.getElementById('close-zoom-modal');
  const addForm = document.getElementById('add-form');
  const editAnimalBtn = document.getElementById('edit-animal-btn');
  const mImg = document.getElementById('m-img');

  const adoptCheckbox = document.getElementById('a-adopt');
  const contactContainer = document.getElementById('a-contact-container');

  const aTypeToggle = document.getElementById('a-type');
  const animalOnlyFields = document.getElementById('animal-only-fields');
  const stationOnlyFields = document.getElementById('station-only-fields');

  aTypeToggle.addEventListener('change', (e) => {
     if (e.target.value === 'station') {
        animalOnlyFields.style.display = 'none';
        stationOnlyFields.style.display = 'block';
     } else {
        animalOnlyFields.style.display = 'block';
        stationOnlyFields.style.display = 'none';
     }
  });

  // Adopsiyon Checkbox Değişim Dinleyicisi
  adoptCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      contactContainer.style.display = 'block';
    } else {
      contactContainer.style.display = 'none';
      document.getElementById('a-contact').value = ''; // temizle
    }
  });

  // Arama Kutusu ve Tema Dinleyicileri
  document.getElementById('search-input').addEventListener('input', () => renderAnimals());

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      root.removeAttribute('data-theme');
      localStorage.setItem('kampus-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('kampus-theme', 'dark');
    }
  });

  // Mama Ver Butonu (Beslenme Takibi)
  const feedBtn = document.getElementById('feed-animal-btn');
  feedBtn.addEventListener('click', () => {
     if (currentViewedAnimal) {
       const idx = animals.findIndex(a => a.id === currentViewedAnimal.id);
       if (idx !== -1) {
          animals[idx].lastFed = Date.now();
          saveData();
          updateScore(10); // Puan artır
          openDetailModal(animals[idx]); // Ekranı canlı tazele!
       }
     }
  });

  // Koruyucu Ol Butonu (Guardian)
  const guardianBtn = document.getElementById('guardian-btn');
  guardianBtn.addEventListener('click', () => {
     if (currentViewedAnimal) {
       const protector = prompt("Süper Etkileşim! Lütfen isminizi veya takma adınızı girin:");
       if (protector && protector.trim() !== '') {
          const idx = animals.findIndex(a => a.id === currentViewedAnimal.id);
          if (idx !== -1) {
             animals[idx].guardian = protector.trim();
             saveData();
             alert("Tebrikler! Artık profilinde sizin korumanızda olduğu herkese görünecek. 🛡️✨");
             openDetailModal(animals[idx]); // Ekranı tazele
          }
       }
     }
  });
  
  // Sosyal Paylaşım Butonu (Web Share API)
  const shareBtn = document.getElementById('share-btn');
  shareBtn.addEventListener('click', () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    if (navigator.share && currentViewedAnimal) {
       navigator.share({
         title: 'Kampüs Patileri Yardım Çağrısı',
         text: `Acil! ${currentViewedAnimal.name} isimli canımız (${currentViewedAnimal.location} bölgesinde) doğa koruma uygulamasında yardım bekliyor. Lütfen ilgilenelim!`,
         url: window.location.href
       })
       .then(() => console.log('Başarıyla paylaşıldı'))
       .catch((error) => console.log('Paylaşım hatası', error));
    } else {
       alert("Cihazınızın tarayıcısı otomatik paylaşım donanımını desteklemiyor.");
    }
  });
  
  // Kamera ve Resim Dosyası isim gösterme akıllı aracı
  const handleFileName = (e) => {
     if(e.target.files && e.target.files[0]) {
        document.getElementById('selected-file-name').textContent = "Seçilen: " + e.target.files[0].name;
     }
  };
  document.getElementById('a-image-file').addEventListener('change', handleFileName);
  document.getElementById('a-camera-file').addEventListener('change', handleFileName);

  // Hayvan Silme Butonu
  const deleteBtn = document.getElementById('delete-animal-btn');
  deleteBtn.addEventListener('click', () => {
     if (editingAnimalId) {
        if (confirm("Bu hayvanın kaydını kalıcı olarak silmek istediğinize emin misiniz? (Örn: Sahiplendirildiyse veya aramızdan ayrıldıysa)")) {
           animals = animals.filter(a => a.id !== editingAnimalId);
           saveData();
           renderAnimals();
           closeModal(addModal);
        }
     }
  });

  // YENİ EKLE BUTONU
  fabAdd.addEventListener('click', () => {
    editingAnimalId = null;
    document.querySelector('#add-modal h2').innerText = 'Yeni Hayvan Ekle';
    document.getElementById('a-image-help').innerText = 'Bilgisayardan/Telefondan resim seçin. (Zorunlu)';
    document.getElementById('delete-animal-btn').style.display = 'none'; // Ekleme yaparken gizle
    addForm.reset();
    
    document.getElementById('a-sos').checked = false;
    document.querySelectorAll('input[name="trait"]').forEach(cb => cb.checked = false);

    adoptCheckbox.checked = false;
    contactContainer.style.display = 'none';
    
    openModal(addModal);
  });

  // GÜNCELLE BUTONU (Detay Modalından)
  editAnimalBtn.addEventListener('click', () => {
    if (!currentViewedAnimal) return;
    
    editingAnimalId = currentViewedAnimal.id;
    document.querySelector('#add-modal h2').innerText = 'Hayvanı Güncelle';
    document.getElementById('a-image-help').innerText = 'Fotoğraf seçmezseniz mevcut fotoğraf ile kalır.';
    document.getElementById('a-image-file').required = false;
    document.getElementById('a-camera-file').required = false;
    document.getElementById('delete-animal-btn').style.display = 'block'; // Güncellerken Silmeyi Göster

    // Alanları eski bilgilerle doldur
    document.getElementById('a-type').value = currentViewedAnimal.type;
    document.getElementById('a-name').value = currentViewedAnimal.name;
    document.getElementById('a-age').value = currentViewedAnimal.age || 'Bilinmiyor';
    document.getElementById('a-location').value = currentViewedAnimal.location;
    document.getElementById('a-health').value = currentViewedAnimal.health;
    document.getElementById('a-vaccine').value = currentViewedAnimal.vaccine;
    
    if (['Kısırlaştırıldı', 'Kısırlaştırılmadı', 'Bilinmiyor'].includes(currentViewedAnimal.neutered)) {
       document.getElementById('a-neutered').value = currentViewedAnimal.neutered;
    } else {
       const isUnneutered = currentViewedAnimal.neutered && currentViewedAnimal.neutered.toLowerCase().includes('kısırlaştırılmadı');
       document.getElementById('a-neutered').value = isUnneutered ? 'Kısırlaştırılmadı' : 'Bilinmiyor';
    }

    adoptCheckbox.checked = currentViewedAnimal.isAdoptable || false;
    document.getElementById('a-contact').value = currentViewedAnimal.contact || '';
    contactContainer.style.display = currentViewedAnimal.isAdoptable ? 'block' : 'none';

    document.getElementById('a-sos').checked = currentViewedAnimal.isSOS || false;
    document.querySelectorAll('input[name="trait"]').forEach(cb => {
      cb.checked = currentViewedAnimal.traits && currentViewedAnimal.traits.includes(cb.value);
    });

    closeModal(detailModal);
    openModal(addModal);
  });

  closeAdd.addEventListener('click', () => closeModal(addModal));
  closeDetail.addEventListener('click', () => closeModal(detailModal));
  closeZoom.addEventListener('click', () => closeModal(zoomModal));

  [detailModal, addModal, zoomModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  mImg.addEventListener('click', () => {
    document.getElementById('z-img').src = mImg.src;
    openModal(zoomModal);
  });

  // Form Yükleme Modülü
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const galeryFile = document.getElementById('a-image-file').files[0];
    const cameraFile = document.getElementById('a-camera-file').files[0];
    const file = galeryFile || cameraFile;
    const submitBtn = addForm.querySelector('.submit-btn');

    // Eğer güncelleme yapıyor ve resim seçmemişse (Foto değiştirmek istemiyorsa)
    if (editingAnimalId && !file) {
      submitBtn.innerText = "Güncelleniyor...";
      submitBtn.style.opacity = "0.7";
      submitBtn.disabled = true;

      const idx = animals.findIndex(a => a.id === editingAnimalId);
      if (idx !== -1) {
        animals[idx].type = document.getElementById('a-type').value;
        animals[idx].name = document.getElementById('a-name').value;
        animals[idx].location = document.getElementById('a-location').value;
        if (animals[idx].type === 'station') {
          animals[idx].stationState = document.getElementById('a-station-state').value;
        } else {
          animals[idx].age = document.getElementById('a-age').value;
          animals[idx].health = document.getElementById('a-health').value;
          animals[idx].vaccine = document.getElementById('a-vaccine').value;
          animals[idx].neutered = document.getElementById('a-neutered').value;
          animals[idx].isAdoptable = document.getElementById('a-adopt').checked;
          animals[idx].contact = document.getElementById('a-contact').value;
          animals[idx].isSOS = document.getElementById('a-sos').checked;
          animals[idx].traits = Array.from(document.querySelectorAll('input[name="trait"]:checked')).map(cb => cb.value);
        }
        saveData();
      }

      renderAnimals();
      closeModal(addModal);
      submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
      submitBtn.style.opacity = "1";
      submitBtn.disabled = false;
      return; 
    }

    if (!file && !editingAnimalId) {
      alert("Lütfen bir fotoğraf seçin!");
      return;
    }

    submitBtn.innerText = "İşleniyor...";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    try {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          try {
            const MAX_WIDTH = 600;
            const scaleSize = Math.min(1, MAX_WIDTH / (img.width || 1));
            
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            
            canvas.width = (img.width * scaleSize) || MAX_WIDTH;
            canvas.height = (img.height * scaleSize) || MAX_WIDTH;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

            if (editingAnimalId) {
              const idx = animals.findIndex(a => a.id === editingAnimalId);
              if (idx !== -1) {
                animals[idx].type = document.getElementById('a-type').value;
                animals[idx].name = document.getElementById('a-name').value;
                animals[idx].image = compressedBase64;
                animals[idx].location = document.getElementById('a-location').value;
                if (animals[idx].type === 'station') {
                  animals[idx].stationState = document.getElementById('a-station-state').value;
                } else {
                  animals[idx].age = document.getElementById('a-age').value;
                  animals[idx].health = document.getElementById('a-health').value;
                  animals[idx].vaccine = document.getElementById('a-vaccine').value;
                  animals[idx].neutered = document.getElementById('a-neutered').value;
                  animals[idx].isAdoptable = document.getElementById('a-adopt').checked;
                  animals[idx].contact = document.getElementById('a-contact').value;
                  animals[idx].isSOS = document.getElementById('a-sos').checked;
                  animals[idx].traits = Array.from(document.querySelectorAll('input[name="trait"]:checked')).map(cb => cb.value);
                }
              }
              const saved = saveData(); 
              if (saved) {
                renderAnimals();
                closeModal(addModal);
              }
            } else {
              const newAnimal = {
                id: Date.now(),
                type: document.getElementById('a-type').value,
                name: document.getElementById('a-name').value,
                image: compressedBase64,
                location: document.getElementById('a-location').value
              };
              
              if (newAnimal.type === 'station') {
                 newAnimal.stationState = document.getElementById('a-station-state').value;
              } else {
                 newAnimal.age = document.getElementById('a-age').value;
                 newAnimal.health = document.getElementById('a-health').value;
                 newAnimal.vaccine = document.getElementById('a-vaccine').value;
                 newAnimal.neutered = document.getElementById('a-neutered').value;
                 newAnimal.isAdoptable = document.getElementById('a-adopt').checked;
                 newAnimal.contact = document.getElementById('a-contact').value;
                 newAnimal.isSOS = document.getElementById('a-sos').checked;
                 newAnimal.traits = Array.from(document.querySelectorAll('input[name="trait"]:checked')).map(cb => cb.value);
              }
              
              animals.push(newAnimal);
              const saved = saveData(); 
              if (!saved) {
                 animals.pop();
              } else {
                 if (newAnimal.type === currentType || (currentType === 'adopt' && newAnimal.isAdoptable)) renderAnimals();
                 closeModal(addModal);
              }
            }

            submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
          } catch (processError) {
            alert("Resim işlenirken hata oluştu!");
            submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
          }
        };
        
        img.onerror = function() {
          const confirmResult = confirm("Fotoğraf tarayıcı tarafından okunamadı! Bozuk veya HEIC formatı olabilir. Varsayılan temsilci ile ilerlemek ister misiniz?");
          if(confirmResult) {
            const defaultCat = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format";
            const defaultDog = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format";
            const selectedType = document.getElementById('a-type').value;
            const defImage = selectedType === 'cat' ? defaultCat : defaultDog;

            if (editingAnimalId) {
               const idx = animals.findIndex(a => a.id === editingAnimalId);
               if (idx !== -1) {
                  animals[idx].image = defImage;
                  animals[idx].age = document.getElementById('a-age').value;
                  animals[idx].isAdoptable = document.getElementById('a-adopt').checked;
                  animals[idx].contact = document.getElementById('a-contact').value;
                  animals[idx].isSOS = document.getElementById('a-sos').checked;
                  animals[idx].traits = Array.from(document.querySelectorAll('input[name="trait"]:checked')).map(cb => cb.value);
                  saveData();
               }
            } else {
               animals.push({
                  id: Date.now(), type: selectedType, name: document.getElementById('a-name').value,
                  age: document.getElementById('a-age').value,
                  image: defImage, location: document.getElementById('a-location').value,
                  health: document.getElementById('a-health').value, vaccine: document.getElementById('a-vaccine').value,
                  neutered: document.getElementById('a-neutered').value,
                  isAdoptable: document.getElementById('a-adopt').checked,
                  contact: document.getElementById('a-contact').value,
                  isSOS: document.getElementById('a-sos').checked,
                  traits: Array.from(document.querySelectorAll('input[name="trait"]:checked')).map(cb => cb.value)
               });
               saveData();
            }
            renderAnimals();
            closeModal(addModal);
          }
          submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
          submitBtn.style.opacity = "1";
          submitBtn.disabled = false;
        };
        img.src = event.target.result;
      };
      
      reader.onerror = function() {
        alert("Dosya yüklenirken okuma hatası oluştu.");
        submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;
      };

      reader.readAsDataURL(file);
    } catch (e) {
      alert("Beklenmeyen hata oldu: " + e.message);
      submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Kaydet';
      submitBtn.style.opacity = "1";
      submitBtn.disabled = false;
    }
  });
}

function openModal(modalElement) {
  modalElement.classList.remove('hidden');
  setTimeout(() => { modalElement.classList.add('active'); }, 10);
}

function closeModal(modalElement) {
  modalElement.classList.remove('active');
  setTimeout(() => { modalElement.classList.add('hidden'); }, 300);
}

function openDetailModal(animal) {
  currentViewedAnimal = animal; 

  const detailModal = document.getElementById('animal-modal');
  document.getElementById('m-img').src = animal.image;
  document.getElementById('m-name').textContent = animal.name;
  
  // Koruyucu Rozeti Yönetimi
  const guardianBadge = document.getElementById('m-guardian-badge');
  const guardianBtn = document.getElementById('guardian-btn');
  const guardianName = document.getElementById('m-guardian-name');
  if (animal.guardian) {
    guardianBadge.style.display = 'flex';
    guardianName.textContent = animal.guardian;
    guardianBtn.style.display = 'none';
  } else {
    guardianBadge.style.display = 'none';
    guardianBtn.style.display = 'block';
  }
  
  // Karakter Kapsüllerini Doldurma
  const traitsContainer = document.getElementById('m-traits');
  traitsContainer.innerHTML = '';
  if (animal.traits && animal.traits.length > 0) {
    animal.traits.forEach(t => {
      traitsContainer.innerHTML += `<div class="trait-capsule">${t}</div>`;
    });
  }
  
  const statusGrid = document.querySelector('.status-grid');
  const feedBtn = document.getElementById('feed-animal-btn');
  const lastFedEl = document.getElementById('m-last-fed');
  
  if (animal.type === 'station') {
     statusGrid.style.display = 'none';
     document.getElementById('m-traits').style.display = 'none';
     feedBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Suyu/Mamayı Tazeledim';
     feedBtn.style.backgroundColor = '#3b82f6';
     if (animal.lastFed) {
       lastFedEl.textContent = "Son Yenilenme: " + timeAgo(animal.lastFed);
       lastFedEl.style.color = "var(--primary-color)";
     } else {
       lastFedEl.textContent = "Son Yenilenme: Henüz veri yok";
       lastFedEl.style.color = "var(--text-light)";
     }
  } else {
     statusGrid.style.display = 'grid';
     document.getElementById('m-traits').style.display = 'flex';
     feedBtn.innerHTML = '<i class="fa-solid fa-bone"></i> Bugün Mama Verdim';
     feedBtn.style.backgroundColor = '#f59e0b';
     if (animal.lastFed) {
       lastFedEl.textContent = "Son beslenme: " + timeAgo(animal.lastFed);
       lastFedEl.style.color = "var(--primary-color)";
     } else {
       lastFedEl.textContent = "Son beslenme: Henüz veri yok";
       lastFedEl.style.color = "var(--text-light)";
     }
  }

  document.getElementById('m-age').textContent = animal.age || 'Bilinmiyor';
  document.getElementById('m-location').textContent = animal.location;
  document.getElementById('m-health').textContent = animal.health;
  document.getElementById('m-vaccine').textContent = animal.vaccine;
  document.getElementById('m-neutered').textContent = animal.neutered;
  
  const neuteredCard = document.getElementById('m-neutered-card');
  const isUnneutered = animal.neutered && (animal.neutered === 'Kısırlaştırılmadı' || animal.neutered.toLowerCase().includes('kısırlaştırılmadı'));
  
  if (isUnneutered) {
    neuteredCard.style.background = '#fef2f2';
    neuteredCard.style.border = '2px solid #ef4444';
    neuteredCard.querySelector('i').style.color = '#ef4444';
    neuteredCard.querySelector('h3').style.color = '#ef4444';
    document.getElementById('m-neutered').style.color = '#b91c1c';
    document.getElementById('m-neutered').style.fontWeight = 'bold';
    document.getElementById('m-neutered').textContent = 'Kısırlaştırılmadı (DİKKAT!)';
  } else {
    neuteredCard.style.background = 'var(--card-bg)';
    neuteredCard.style.border = 'none';
    neuteredCard.querySelector('i').style.color = 'var(--primary-color)';
    neuteredCard.querySelector('h3').style.color = 'var(--text-dark)';
    document.getElementById('m-neutered').style.color = 'var(--text-light)';
    document.getElementById('m-neutered').style.fontWeight = 'normal';
  }
  
  // Sahiplendirme Rozetleri ve İletişim Bilgileri
  const badge = document.getElementById('m-adopt-badge');
  const contactCard = document.getElementById('m-adopt-card');
  
  if (animal.isAdoptable) {
    badge.style.display = 'flex';
    contactCard.style.display = 'block';
    document.getElementById('m-contact').textContent = animal.contact || 'Belirtilmedi';
  } else {
    badge.style.display = 'none';
    contactCard.style.display = 'none';
  }
  
  // QR Kodu İşlemleri (API Bağlantısı ve Buton Reset)
  const qrBtn = document.getElementById('generate-qr-btn');
  const qrImg = document.getElementById('m-qr-img');
  const qrHelp = document.getElementById('m-qr-help');
  
  qrImg.style.display = 'none'; // Eski QR'ı gizle
  qrHelp.style.display = 'none';
  
  // EventListener'ı sıfırlamak için klon yapısı (Birden fazla basmayı engeller)
  const newQrBtn = qrBtn.cloneNode(true);
  qrBtn.parentNode.replaceChild(newQrBtn, qrBtn);
  
  newQrBtn.addEventListener('click', () => {
    // API'ye gönderilecek kimlik metni
    const qrData = encodeURIComponent(`Kampüs Patileri: ${animal.name} (${animal.location})`);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=111827&bgcolor=ffffff&qzone=1&margin=0&data=${qrData}`;
    qrImg.style.display = 'block';
    qrHelp.style.display = 'block';
  });

  openModal(detailModal);
}
