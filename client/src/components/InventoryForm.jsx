import { useState } from 'react';
import { X } from 'lucide-react';
import { inventoryService } from '../services';
import { 
  CATEGORIES, 
  UNITS, 
  getIngredientsByCategory, 
  getVariantsByIngredient 
} from '../utils/constants';

const InventoryForm = ({ isOpen, onClose, onSuccess, editItem = null }) => {
  const [formData, setFormData] = useState(editItem ? {
    category: editItem.category,
    ingredientType: editItem.ingredientName,
    ingredientName: editItem.variant || '',
    variant: editItem.variant || '',
    quantity: editItem.quantity,
    unit: editItem.unit,
    expirationDate: editItem.expirationDate.split('T')[0],
    minimumStock: editItem.minimumStock,
    photo: null
  } : {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
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
      if (editItem) {
        const response = await inventoryService.update(editItem._id, data);
        if (response.success) {
          onSuccess && onSuccess();
          onClose();
        }
      } else {
        const response = await inventoryService.create(data);
        if (response.success) {
          onSuccess && onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIngredientTypes = () => {
    return formData.category ? getIngredientsByCategory(formData.category) : [];
  };

  const getIngredientNames = () => {
    return formData.category && formData.ingredientType 
      ? getVariantsByIngredient(formData.category, formData.ingredientType) 
      : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editItem ? 'Edit Bahan' : 'Tambah Bahan Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={isSubmitting}>
              Batal
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
