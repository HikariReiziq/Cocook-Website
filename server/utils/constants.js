// constants.js - Data Constants untuk Cocook

export const CATEGORIES = [
  "Bahan Pokok",
  "Protein",
  "Sayur",
  "Buah",
  "Produk Susu & Olahan",
  "Bumbu & Rempah",
  "Penyedap & Saus",
  "Minuman",
  "Lainnya"
];

export const UNITS = [
  "kg", "gram", "mg", "liter", "ml", "lb", "ton", "kwintal", 
  "lusin", "pcs", "pack", "sdm", "sdt"
];

// Base unit: gram (solid) / ml (liquid)
// Konversi pukul rata untuk MVP
export const CONVERSION_RATES = {
  "kg": 1000,
  "gram": 1,
  "mg": 0.001,
  "ton": 1000000,
  "kwintal": 100000,
  "liter": 1000,
  "ml": 1,
  "sdm": 15,  // 1 sdm = 15ml/15gr (pukul rata)
  "sdt": 5,   // 1 sdt = 5ml/5gr (pukul rata)
  "lb": 453.59,
  "lusin": 12,
  "pcs": 1,
  "pack": 1
};

// Seed Data: Kategori -> Nama Bahan -> Bentuk/Contoh
export const INGREDIENTS_DATA = {
  "Bahan Pokok": {
    "Beras": ["putih", "merah", "ketan", "hitam"],
    "Tepung": ["terigu", "tapioka", "beras", "maizena", "sagu", "mocaf"],
    "Jagung": ["pipilan", "tepung jagung", "polenta"],
    "Umbi": ["kentang", "ubi jalar", "singkong"],
    "Mie": ["mie telur", "mie instan", "bihun", "soun", "kwetiau"],
    "Roti": ["tawar", "gandum", "baguette", "pita"],
    "Oat & biji-bijian": ["oat", "quinoa", "barley", "couscous"]
  },
  "Protein": {
    "Daging sapi": ["has dalam", "iga", "giling"],
    "Daging ayam": ["dada", "paha", "sayap", "hati", "ampela"],
    "Daging kambing/domba": ["potongan", "giling"],
    "Ikan": ["nila", "lele", "salmon", "tuna", "tongkol", "kembung", "sarden"],
    "Seafood": ["udang", "cumi", "kerang", "kepiting"],
    "Telur": ["ayam", "bebek", "puyuh"],
    "Olahan kedelai": ["tahu", "tempe", "edamame"],
    "Kacang-kacangan": ["tanah", "merah", "hijau", "almond", "mete", "walnut", "pistachio"]
  },
  "Sayur": {
    "Daun hijau": ["bayam", "kangkung", "sawi", "selada", "kale", "pakcoy"],
    "Cruciferous": ["brokoli", "kembang kol", "kubis", "brussels sprout"],
    "Umbi": ["wortel", "lobak", "bit"],
    "Buah sayur": ["tomat", "terong", "paprika", "cabai", "labu", "zucchini", "mentimun"],
    "Aromatik": ["bawang merah", "bawang putih", "bawang bombay", "daun bawang"],
    "Jamur": ["tiram", "kancing", "shiitake", "enoki"]
  },
  "Buah": {
    "Tropis": ["pisang", "mangga", "pepaya", "nanas", "jambu", "rambutan", "durian"],
    "Citrus": ["jeruk", "lemon", "lime", "grapefruit"],
    "Berry": ["stroberi", "blueberry", "raspberry", "blackberry"],
    "Lainnya": ["apel", "pir", "anggur", "melon", "semangka", "alpukat", "kiwi", "delima", "persik", "plum"]
  },
  "Produk Susu & Olahan": {
    "Susu": ["sapi", "kambing", "kedelai", "almond", "oat"],
    "Keju": ["cheddar", "mozzarella", "parmesan", "cream cheese", "ricotta", "feta"],
    "Yogurt/Kefir": ["plain", "greek", "drinkable"],
    "Mentega/Margarin": ["salted", "unsalted"],
    "Krim": ["whipping cream", "sour cream"],
    "Susu olahan": ["kental manis", "evaporated milk"]
  },
  "Bumbu & Rempah": {
    "Rempah kering": ["ketumbar", "jintan", "pala", "kayu manis", "cengkeh", "kapulaga", "lada"],
    "Rempah segar": ["jahe", "lengkuas", "kunyit", "serai", "daun jeruk", "daun salam"],
    "Cabai": ["rawit", "merah besar", "hijau", "bubuk cabai"],
    "Daun aromatik": ["basil", "oregano", "thyme", "rosemary", "parsley", "dill"]
  },
  "Penyedap & Saus": {
    "Garam": ["halus", "kasar", "himalaya"],
    "Gula": ["pasir", "merah", "aren", "palm sugar"],
    "Kecap": ["manis", "asin"],
    "Saus": ["sambal", "tomat", "tiram"],
    "Dressing": ["mayones", "mustard"],
    "Vinegar/Cuka": ["apel", "putih", "balsamic"],
    "Minyak": ["kelapa", "sawit", "zaitun", "wijen", "canola", "sunflower"],
    "Kaldu": ["bubuk", "blok"]
  },
  "Minuman": {
    "Teh": ["hijau", "hitam", "oolong", "herbal"],
    "Kopi": ["bubuk", "biji", "instan"],
    "Sirup": ["cocopandan", "melon", "leci"],
    "Minuman serbuk": ["susu bubuk", "cokelat bubuk", "teh tarik instan"],
    "Air mineral & soda": ["botol", "kaleng"],
    "Jus buah kemasan": ["berbagai rasa"]
  },
  "Lainnya": {
    "Cokelat": ["bubuk", "batang", "chips"],
    "Selai": ["kacang", "cokelat", "stroberi", "blueberry"],
    "Madu": ["murni", "campuran"],
    "Agar-agar/Gelatin": ["bubuk", "lembaran"],
    "Tepung roti/Panko": ["halus", "kasar"],
    "Baking powder & soda": ["kemasan kecil"],
    "Es batu": ["balok", "cube"]
  }
};

// Helper function untuk konversi unit ke base unit (gram/ml)
export const convertToBaseUnit = (quantity, unit) => {
  const rate = CONVERSION_RATES[unit];
  if (!rate) {
    throw new Error(`Unit ${unit} tidak dikenali`);
  }
  return quantity * rate;
};

// Helper function untuk mendapatkan semua nama bahan berdasarkan kategori
export const getIngredientsByCategory = (category) => {
  return INGREDIENTS_DATA[category] || {};
};

// Helper function untuk mendapatkan semua varian berdasarkan nama bahan
export const getVariantsByIngredient = (category, ingredientName) => {
  const ingredients = INGREDIENTS_DATA[category];
  if (!ingredients) return [];
  return ingredients[ingredientName] || [];
};
