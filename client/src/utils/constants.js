export const CATEGORIES = [
  "UTILITAS & DASAR",
  "BUMBU & REMPAH",
  "SAYURAN SEGAR",
  "BUAH-BUAHAN",
  "PROTEIN HEWANI",
  "BAHAN KERING (PANTRY)",
  "SAUS MINYAK & PENYEDAP",
  "DAIRY & OLAHAN",
  "BAHAN BAKING",
  "MINUMAN",
  "CONSUMABLES (NON-FOOD)"
];

export const UNITS = [
  "kg", "gram", "mg", "liter", "ml", "lb", "ton", "kwintal",
  "lusin", "pcs", "pack", "sdm", "sdt", "siung", "batang", "ikat"
];

export const INGREDIENTS_DATA = {
  "UTILITAS & DASAR": {
    "Air (Water)": ["Air Mineral Galon (19L)", "Air Mineral Botol (330ml/600ml/1.5L)", "Air RO (Reverse Osmosis)", "Air Soda (Sparkling Water)", "Air Suling (Distilled Water - untuk mesin kopi)", "Custom"],
    "Es (Ice)": ["Es Batu Kristal (Cube)", "Es Balok", "Es Serut (Crushed Ice)", "Dry Ice (Biang Es)", "Custom"],
    "Bahan Bakar": ["Gas LPG (3kg/12kg/50kg)", "Gas Kaleng (Butane Portable)", "Arang Batok", "Arang Briket", "Spiritus/Parafin gel", "Custom"]
  },
  "BUMBU & REMPAH": {
    "Aromatik Segar": ["Bawang merah", "Bawang putih", "Bawang bombay (kuning/merah)", "Daun bawang", "Kucai", "Bawang prei", "Custom"],
    "Rimpang (Rhizomes)": ["Jahe (gajah/emprit)", "Lengkuas (Laos)", "Kunyit", "Kencur", "Temu kunci", "Temulawak", "Custom"],
    "Batang & Bunga": ["Serai (Sereh)", "Kecombrang (Honje)", "Bunga lawang (Pekak)", "Cengkeh", "Custom"],
    "Daun Aromatik (Asia)": ["Daun jeruk purut", "Daun salam", "Daun kunyit", "Daun pandan", "Daun kari (Salam koja)", "Daun kemangi", "Custom"],
    "Daun Aromatik (Barat)": ["Parsley (Flat/Curly)", "Oregano", "Basil", "Thyme", "Rosemary", "Dill", "Mint", "Sage", "Tarragon", "Bay leaf", "Custom"],
    "Rempah Biji Kering": ["Lada (putih/hitam/sichuan)", "Ketumbar", "Jintan", "Kapulaga (putih/hijau)", "Adas manis", "Klabet", "Biji pala", "Custom"],
    "Kayu & Kulit": ["Kayu manis (stick/bubuk)", "Kayu secang", "Custom"],
    "Pedas & Asam": ["Cabai rawit", "Cabai merah", "Cabai hijau", "Paprika bubuk", "Chili flakes", "Asam jawa", "Asam kandis", "Terasi", "Belimbing wuluh", "Custom"]
  },
  "SAYURAN SEGAR": {
    "Sayuran Daun": ["Bayam (hijau/merah)", "Kangkung", "Sawi (hijau/putih/pahit)", "Selada (keriting/romaine/iceberg)", "Kale", "Pakcoy", "Kailan", "Daun singkong", "Daun pepaya", "Custom"],
    "Sayuran Bunga": ["Brokoli", "Kembang kol", "Tebu telur", "Jantung pisang", "Custom"],
    "Sayuran Buah": ["Tomat (merah/hijau/cherry)", "Mentimun", "Terong (ungu/lalap)", "Labu siam", "Oyong", "Pare", "Zucchini", "Paprika (segar)", "Kabocha", "Custom"],
    "Umbi & Akar": ["Wortel", "Lobak", "Bit (Beetroot)", "Bengkoang", "Lotus root", "Kentang (Tes/Rendang)", "Ubi jalar", "Singkong", "Talas", "Custom"],
    "Polong & Jamur": ["Buncis", "Kacang panjang", "Kapri", "Petai", "Jengkol", "Jamur (Kancing/Tiram/Shiitake/Enoki/Kuping)", "Custom"],
    "Tunas": ["Tauge (kacang hijau)", "Tauge kedelai", "Alfalfa", "Custom"]
  },
  "BUAH-BUAHAN": {
    "Buah Tropis": ["Pisang", "Mangga", "Pepaya", "Nanas", "Rambutan", "Salak", "Manggis", "Durian", "Nangka", "Sawo", "Sirsak", "Kelapa Muda", "Custom"],
    "Buah Impor/Subtropis": ["Apel", "Pir", "Anggur", "Persik", "Plum", "Kiwi", "Stroberi", "Blueberry", "Lemon", "Custom"],
    "Citrus & Melon": ["Jeruk (Sunkist/Nipis/Limau/Bali)", "Semangka", "Melon", "Blewah", "Custom"],
    "Buah Lemak": ["Alpukat", "Zaitun (buah)", "Custom"]
  },
  "PROTEIN HEWANI": {
    "Daging Sapi": ["Tenderloin", "Sirloin", "Rib Eye", "Brisket", "Iga", "Buntut", "Giling", "Lidah", "Paru", "Babat", "Tetelan", "Custom"],
    "Unggas": ["Ayam (Utuh/Fillet/Paha/Sayap/Ceker)", "Bebek", "Burung Dara", "Telur (Ayam/Bebek/Puyuh)", "Custom"],
    "Ikan": ["Tuna", "Salmon", "Kakap", "Kerapu", "Tenggiri", "Tongkol", "Kembung", "Dori", "Gurame", "Nila", "Lele", "Patin", "Custom"],
    "Seafood": ["Udang (Peci/Windu/Vannamei)", "Cumi-cumi", "Sotong", "Gurita", "Kerang (Dara/Hijau/Batik)", "Kepiting", "Rajungan", "Custom"]
  },
  "BAHAN KERING (PANTRY)": {
    "Beras & Biji": ["Beras (Putih/Merah/Hitam/Pandan Wangi/Basmati/Shirataki)", "Ketan", "Jagung pipil", "Quinoa", "Oat", "Custom"],
    "Tepung": ["Terigu (Rendah/Sedang/Tinggi)", "Tapioka", "Maizena", "Sagu", "Tepung Beras", "Tepung Ketan", "Hunkwe", "Tepung Roti (Panir/Panko)", "Custom"],
    "Pasta & Mie": ["Spaghetti", "Fettuccine", "Penne", "Macaroni", "Fusilli", "Lasagna", "Mie telor", "Bihun", "Soun", "Kwetiau kering", "Custom"],
    "Kacang-kacangan": ["Kacang tanah", "Kacang hijau", "Kacang merah", "Kedelai", "Kacang mete", "Almond", "Walnut", "Custom"],
    "Kerupuk & Makanan Kering": ["Kerupuk (Udang/Bawang/Ikan/Aci)", "Emping", "Rengginang", "Ebi kering", "Ikan asin", "Teri kering", "Custom"],
    "Kaleng (Canned)": ["Sarden", "Tuna kaleng", "Kornet", "Jamur kaleng", "Jagung kaleng", "Buah kaleng (Leci/Peach)", "Custom"]
  },
  "SAUS MINYAK & PENYEDAP": {
    "Minyak": ["Minyak goreng sawit", "Minyak kelapa", "Olive Oil (Extra Virgin/Cooking)", "Minyak Wijen", "Minyak Canola", "Minyak Jagung", "Ghee", "Custom"],
    "Kecap & Saus Asia": ["Kecap Manis", "Kecap Asin", "Saus Tiram", "Kecap Ikan", "Kecap Inggris", "Saus Teriyaki", "Saus Hoisin", "Minyak Cabai", "Angciu (Arak masak)", "Mirin", "Custom"],
    "Saus Barat": ["Saus Tomat", "Saus Sambal", "Mayones", "Mustard", "BBQ Sauce", "Tabasco", "Custom"],
    "Cuka (Acids)": ["Cuka Dapur (Masak)", "Cuka Apel", "Cuka Beras", "Balsamic Vinegar", "Air Lemon Botolan", "Custom"],
    "Bumbu Bubuk": ["Garam (Halus/Kasar/Himalaya)", "Gula (Pasir/Halus/Aren/Merah)", "MSG (Vetsin)", "Kaldu Bubuk (Ayam/Sapi/Jamur)", "Terasi Bubuk", "Ngohiong", "Custom"]
  },
  "DAIRY & OLAHAN": {
    "Susu & Krim": ["Susu Segar", "Susu UHT", "Susu Evaporasi", "Kental Manis", "Whipping Cream", "Cooking Cream", "Santan (Instan)", "Custom"],
    "Keju & Fermentasi": ["Keju (Cheddar/Mozzarella/Parmesan/Cream Cheese)", "Yogurt", "Butter (Mentega)", "Margarin", "Shortening", "Custom"],
    "Olahan Protein": ["Tahu", "Tempe", "Oncom", "Sosis", "Bakso", "Nugget", "Smoked Beef", "Ham", "Pepperoni", "Custom"],
    "Frozen Food": ["French Fries", "Mix Vegetables", "Kulit Lumpia/Dimsum beku", "Kebab beku", "Custom"]
  },
  "BAHAN BAKING": {
    "Pengembang": ["Baking Powder", "Baking Soda", "Ragi Instan (Fermipan)", "SP/Ovalet", "Cream of Tartar", "Custom"],
    "Pelengkap": ["Gelatin", "Agar-agar", "Pasta (Vanilla/Pandan)", "Pewarna Makanan", "Cokelat Bubuk", "Cokelat Batang", "Choco Chips", "Meises", "Custom"]
  },
  "MINUMAN": {
    "Teh & Kopi": ["Teh (Hitam/Hijau/Melati)", "Kopi (Biji/Bubuk/Instan)", "Matcha Powder", "Custom"],
    "Sirup & Serbuk": ["Sirup (Berbagai rasa)", "Madu", "Gula Cair", "Cokelat Bubuk Minuman", "Susu Bubuk", "Custom"]
  },
  "CONSUMABLES (NON-FOOD)": {
    "Pembungkus": ["Aluminium Foil", "Plastic Wrap", "Baking Paper", "Plastik Vakum", "Kantong Plastik", "Custom"],
    "Pembersih Dapur": ["Sabun Cuci Piring", "Spons", "Sabun Tangan", "Tisu Dapur", "Cairan Pembersih Lantai", "Custom"],
    "Lainnya": ["Tusuk Sate", "Tusuk Gigi", "Sedotan", "Karet Gelang", "Lilin", "Custom"]
  }
};

// Helper function untuk get ingredients by category
export const getIngredientsByCategory = (category) => {
  return INGREDIENTS_DATA[category] ? Object.keys(INGREDIENTS_DATA[category]) : [];
};

// Helper function untuk get variants by ingredient
export const getVariantsByIngredient = (category, ingredientName) => {
  return INGREDIENTS_DATA[category]?.[ingredientName] || [];
};

// Format date helper
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format datetime helper
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate days until expiration
export const getDaysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get expiration status
export const getExpirationStatus = (expirationDate) => {
  const days = getDaysUntilExpiration(expirationDate);
  
  if (days < 0) {
    return { status: 'expired', color: 'red', text: 'Kadaluarsa' };
  } else if (days === 0) {
    return { status: 'today', color: 'red', text: 'Hari ini' };
  } else if (days <= 3) {
    return { status: 'critical', color: 'orange', text: `${days} hari lagi` };
  } else if (days <= 7) {
    return { status: 'warning', color: 'yellow', text: `${days} hari lagi` };
  } else {
    return { status: 'safe', color: 'green', text: `${days} hari lagi` };
  }
};

// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.(com|co|id|net|org|edu|gov|mil|biz|info|name|museum|coop|aero|[a-z]{2})$/i;
  return re.test(String(email).toLowerCase());
};

// Password validation - must have uppercase, lowercase, and number
export const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const minLength = password.length >= 6;
  
  return {
    isValid: hasUpperCase && hasLowerCase && hasNumber && minLength,
    errors: {
      uppercase: !hasUpperCase ? 'Password harus mengandung huruf besar' : null,
      lowercase: !hasLowerCase ? 'Password harus mengandung huruf kecil' : null,
      number: !hasNumber ? 'Password harus mengandung angka' : null,
      length: !minLength ? 'Password minimal 6 karakter' : null
    }
  };
};
