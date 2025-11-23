import { useState, useEffect } from 'react';
import { Plus, Filter, X, Edit2, Trash2, Calendar, Package, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { inventoryService } from '../services';
import { 
  CATEGORIES, 
  UNITS, 
  getIngredientsByCategory, 
  getVariantsByIngredient,
  formatDate,
  getExpirationStatus 
} from '../utils/constants';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByExpiry, setSortByExpiry] = useState(false);
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    category: '',
    ingredientType: '',
    ingredientName: '',
    variant: '',
    quantity: '',
    unit: 'gram',
    expirationDate: '',
    minimumStock: '',
    photo: null
  });

  // Fetch inventory data
  useEffect(() => {
    fetchInventories();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...inventories];

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (sortByExpiry) {
      filtered.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    }

    setFilteredInventories(filtered);
  }, [inventories, selectedCategory, sortByExpiry]);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAll();
      if (response.success) {
        setInventories(response.data);
      }
    } catch (error) {
      console.error('Error fetching inventories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset dependent fields
      if (name === 'category') {
        newData.ingredientType = '';
        newData.ingredientName = '';
        newData.variant = '';
      } else if (name === 'ingredientType') {
        newData.ingredientName = '';
        newData.variant = '';
      } else if (name === 'ingredientName') {
        newData.variant = '';
      }
      
      return newData;
    });
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('category', formData.category);
    data.append('ingredientName', formData.ingredientType);
    data.append('variant', formData.variant || formData.ingredientName);
    data.append('quantity', formData.quantity);
    data.append('unit', formData.unit);
    data.append('expirationDate', formData.expirationDate);
    data.append('minimumStock', formData.minimumStock);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      if (isEditing && selectedItem) {
        const response = await inventoryService.update(selectedItem._id, data);
        if (response.success) {
          await fetchInventories();
          closeFormModal();
        }
      } else {
        const response = await inventoryService.create(data);
        if (response.success) {
          await fetchInventories();
          closeFormModal();
        }
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus bahan ini?')) return;
    
    try {
      const response = await inventoryService.delete(id);
      if (response.success) {
        await fetchInventories();
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Error deleting inventory:', error);
      alert('Gagal menghapus data');
    }
  };

  const openFormModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setSelectedItem(item);
      setFormData({
        category: item.category,
        ingredientType: item.ingredientName,
        ingredientName: item.variant || '',
        variant: item.variant || '',
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: item.expirationDate.split('T')[0],
        minimumStock: item.minimumStock,
        photo: null
      });
    } else {
      setIsEditing(false);
      setSelectedItem(null);
      setFormData({
        category: '',
        ingredientType: '',
        ingredientName: '',
        variant: '',
        quantity: '',
        unit: 'gram',
        expirationDate: '',
        minimumStock: '',
        photo: null
      });
    }
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const getIngredientTypes = () => {
    return formData.category ? getIngredientsByCategory(formData.category) : [];
  };

  const getIngredientNames = () => {
    return formData.category && formData.ingredientType 
      ? getVariantsByIngredient(formData.category, formData.ingredientType) 
      : [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <button
          onClick={() => openFormModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tambah Bahan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter size={16} className="inline mr-2" />
              Filter Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Semua Kategori</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sortByExpiry}
                onChange={(e) => setSortByExpiry(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Urutkan Kadaluarsa Terdekat
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredInventories.length === 0 ? (
        <div className="card text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory ? 'Tidak ada bahan di kategori ini' : 'Belum ada bahan di inventory'}
          </p>
          <button
            onClick={() => openFormModal()}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Bahan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventories.map(item => {
            const expiryStatus = getExpirationStatus(item.expirationDate);
            
            return (
              <div
                key={item._id}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openDetailModal(item)}
              >
                {/* Image */}
                {item.photo ? (
                  <img
                    src={item.photo.startsWith('http') ? item.photo : `http://localhost:5000${item.photo}`}
                    alt={item.ingredientName}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.ingredientName}
                </h3>
                {item.variant && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.variant}
                  </p>
                )}
                
                {/* Stock Info */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stok:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                {/* Expiry Status */}
                <div className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${
                  expiryStatus.status === 'expired' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                  expiryStatus.status === 'critical' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                  expiryStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  <AlertCircle size={14} />
                  <span>{expiryStatus.text}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFormModal(item);
                    }}
                    className="flex-1 btn-secondary flex items-center justify-center gap-1 text-sm py-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                    className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 flex items-center justify-center gap-1 text-sm py-1 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Bahan' : 'Tambah Bahan Baru'}
              </h2>
              <button onClick={closeFormModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Ingredient Type */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jenis Bahan *
                  </label>
                  <select
                    name="ingredientType"
                    value={formData.ingredientType}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih Jenis Bahan</option>
                    {getIngredientTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ingredient Name/Variant */}
              {formData.ingredientType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Bahan *
                  </label>
                  <select
                    name="ingredientName"
                    value={formData.ingredientName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih Nama Bahan</option>
                    {getIngredientNames().map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stok *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Satuan *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Kadaluarsa *
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Minimum Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batas Stok Minimum *
                </label>
                <input
                  type="number"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Foto Nota Belanja (Opsional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="input-field"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeFormModal} className="flex-1 btn-secondary">
                  Batal
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Bahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Bahan</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image */}
              {selectedItem.photo && (
                <img
                  src={selectedItem.photo.startsWith('http') ? selectedItem.photo : `http://localhost:5000${selectedItem.photo}`}
                  alt={selectedItem.ingredientName}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Kategori:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedItem.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nama Bahan:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedItem.ingredientName}</p>
                </div>
                {selectedItem.variant && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Varian:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedItem.variant}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stok Saat Ini:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedItem.quantity} {selectedItem.unit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stok Minimum:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedItem.minimumStock} {selectedItem.unit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tanggal Kadaluarsa:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedItem.expirationDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ditambahkan:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedItem.createdAt)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openFormModal(selectedItem);
                  }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedItem._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={18} />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
