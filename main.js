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

function initApp() {
  const savedTheme = localStorage.getItem('kampus-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const storedData = localStorage.getItem('kampus_hayvanlari_v2');
  if (storedData) {
    animals = JSON.parse(storedData);
  } else {
    animals = initialData;
    saveData();
  }
  renderAnimals();
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
  
  if (filteredAnimals.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 2rem;">Henüz kayıtlı canlı bulunamadı.</p>`;
    return;
  }

  filteredAnimals.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'cat-card'; 
    
    // Sahiplendirme Badges'i (Artık absolute değil, kapsayıcıya uyacak)
    const adoptBadge = animal.isAdoptable 
        ? `<div style="background:#10b981; color:white; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3);"><i class="fa-solid fa-house-chimney-heart"></i> Yuva Arıyor</div>` 
        : '';
        
    // Kısırlaştırılmadı Badges'i (Absolute değil)
    const isUnneutered = animal.neutered && (animal.neutered === 'Kısırlaştırılmadı' || animal.neutered.toLowerCase().includes('kısırlaştırılmadı'));
    const neuteredBadge = isUnneutered
        ? `<div style="background:#ef4444; color:white; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.3);"><i class="fa-solid fa-triangle-exclamation"></i> Kısır Değil</div>` 
        : '';

    card.innerHTML = `
      <div class="cat-img-wrapper" style="position:relative;">
        <div style="position:absolute; top:8px; right:8px; display:flex; flex-direction:column; gap:0.4rem; z-index:10; align-items:flex-end;">
          ${adoptBadge}
          ${neuteredBadge}
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
          openDetailModal(animals[idx]); // Ekranı canlı tazele!
       }
     }
  });

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
    document.getElementById('a-image-file').required = true;
    document.getElementById('delete-animal-btn').style.display = 'none'; // Ekleme yaparken gizle
    addForm.reset();
    
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

    const fileInput = document.getElementById('a-image-file');
    const file = fileInput.files[0];
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
        animals[idx].age = document.getElementById('a-age').value;
        animals[idx].location = document.getElementById('a-location').value;
        animals[idx].health = document.getElementById('a-health').value;
        animals[idx].vaccine = document.getElementById('a-vaccine').value;
        animals[idx].neutered = document.getElementById('a-neutered').value;
        animals[idx].isAdoptable = document.getElementById('a-adopt').checked;
        animals[idx].contact = document.getElementById('a-contact').value;
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
                animals[idx].age = document.getElementById('a-age').value;
                animals[idx].image = compressedBase64;
                animals[idx].location = document.getElementById('a-location').value;
                animals[idx].health = document.getElementById('a-health').value;
                animals[idx].vaccine = document.getElementById('a-vaccine').value;
                animals[idx].neutered = document.getElementById('a-neutered').value;
                animals[idx].isAdoptable = document.getElementById('a-adopt').checked;
                animals[idx].contact = document.getElementById('a-contact').value;
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
                age: document.getElementById('a-age').value,
                image: compressedBase64,
                location: document.getElementById('a-location').value,
                health: document.getElementById('a-health').value,
                vaccine: document.getElementById('a-vaccine').value,
                neutered: document.getElementById('a-neutered').value,
                isAdoptable: document.getElementById('a-adopt').checked,
                contact: document.getElementById('a-contact').value
              };
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
                  contact: document.getElementById('a-contact').value
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
  
  // Mama Takibi Yazısı
  const lastFedEl = document.getElementById('m-last-fed');
  if (animal.lastFed) {
    lastFedEl.textContent = "Son beslenme: " + timeAgo(animal.lastFed);
    lastFedEl.style.color = "var(--primary-color)";
  } else {
    lastFedEl.textContent = "Son beslenme: Henüz veri yok";
    lastFedEl.style.color = "var(--text-light)";
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

  openModal(detailModal);
}
