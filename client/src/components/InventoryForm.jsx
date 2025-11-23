import { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
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
    customName: '',
    variant: editItem.variant || '',
    quantity: editItem.quantity,
    unit: editItem.unit,
    expirationDate: editItem.expirationDate.split('T')[0],
    minimumStock: editItem.minimumStock,
    photo: null,
    photoUrl: ''
  } : {
    category: '',
    ingredientType: '',
    ingredientName: '',
    customName: '',
    variant: '',
    quantity: '',
    unit: 'gram',
    expirationDate: '',
    minimumStock: '',
    photo: null,
    photoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(
    editItem?.photo 
      ? (editItem.photo.startsWith('http') ? editItem.photo : `http://localhost:5000${editItem.photo}`)
      : ''
  );
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset dependent fields
      if (name === 'category') {
        newData.ingredientType = '';
        newData.ingredientName = '';
        newData.customName = '';
        newData.variant = '';
      } else if (name === 'ingredientType') {
        newData.ingredientName = '';
        newData.customName = '';
        newData.variant = '';
      } else if (name === 'ingredientName') {
        // If "Custom" selected, clear variant and require custom input
        if (value === 'Custom') {
          newData.customName = '';
          newData.variant = '';
        } else {
          // For non-custom, set variant to the selected name
          newData.variant = value;
          newData.customName = '';
        }
      }
      
      console.log('Form data updated:', newData);
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file, photoUrl: '' }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, photoUrl: url, photo: null }));
    if (url) {
      setPhotoPreview(url);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData(prev => ({ ...prev, photo: file, photoUrl: '' }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== Inventory Form Submit ==>');
    console.log('Form Data:', formData);
    
    // Determine final variant name
    let finalVariant = formData.variant;
    if (formData.ingredientName === 'Custom' && formData.customName) {
      finalVariant = formData.customName;
    } else if (!finalVariant) {
      finalVariant = formData.ingredientName;
    }

    console.log('Final Variant:', finalVariant);
    
    const data = new FormData();
    data.append('category', formData.category);
    data.append('ingredientName', formData.ingredientType);
    data.append('variant', finalVariant);
    data.append('quantity', formData.quantity);
    data.append('unit', formData.unit);
    data.append('expirationDate', formData.expirationDate);
    data.append('minimumStock', formData.minimumStock);
    
    if (formData.photo) {
      data.append('photo', formData.photo);
      console.log('Photo file:', formData.photo.name);
    } else if (formData.photoUrl) {
      data.append('photoUrl', formData.photoUrl);
      console.log('Photo URL:', formData.photoUrl);
    }

    console.log('Sending data to server...');

    try {
      if (editItem) {
        console.log('Updating inventory:', editItem._id);
        const response = await inventoryService.update(editItem._id, data);
        console.log('Update response:', response);
        if (response.success) {
          alert('✅ Bahan berhasil diupdate!');
          onSuccess && onSuccess();
          onClose();
        }
      } else {
        console.log('Creating new inventory...');
        const response = await inventoryService.create(data);
        console.log('Create response:', response);
        if (response.success) {
          alert('✅ Bahan berhasil ditambahkan!');
          onSuccess && onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      alert(error.response?.data?.message || error.message || 'Gagal menyimpan data');
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

          {/* Custom Name Input - Shows when Custom is selected */}
          {formData.ingredientName === 'Custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Bahan Custom *
              </label>
              <input
                type="text"
                name="customName"
                value={formData.customName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Masukkan nama bahan custom (contoh: Beras Organik Premium)"
                required={formData.ingredientName === 'Custom'}
              />
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

          {/* Photo Upload with Drag & Drop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foto Nota Belanja (Opsional)
            </label>
            
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              } ${formData.photoUrl ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={!!formData.photoUrl}
              />
              
              {photoPreview && !formData.photoUrl ? (
                <div className="space-y-2">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Klik untuk upload
                    </button>
                    <span className="text-gray-500 dark:text-gray-400"> atau drag & drop</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, maksimal 5MB
                  </p>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div className="mt-3">
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Atau gunakan link URL</span>
                </div>
              </div>
              
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleUrlChange}
                  className="input-field pl-10"
                  placeholder="https://example.com/photo.jpg"
                  disabled={!!formData.photo}
                />
              </div>
              
              {formData.photoUrl && photoPreview && (
                <div className="mt-2">
                  <img 
                    src={photoPreview} 
                    alt="URL Preview" 
                    className="max-h-40 mx-auto rounded"
                    onError={() => {
                      alert('Gagal memuat gambar dari URL. Periksa kembali URL gambar.');
                      setPhotoPreview('');
                    }}
                  />
                </div>
              )}
            </div>
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
