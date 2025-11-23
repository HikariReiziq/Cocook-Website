import { useState, useEffect } from 'react';
import { Plus, X, Trash2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../services';
import { 
  CATEGORIES, 
  UNITS, 
  getIngredientsByCategory, 
  getVariantsByIngredient 
} from '../utils/constants';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
    photoPreview: '',
    ingredients: [],
    steps: [],
    cookingTime: '',
    servings: 1,
    isPublic: true
  });

  // Temporary ingredient form
  const [tempIngredient, setTempIngredient] = useState({
    category: '',
    ingredientType: '',
    ingredientName: '',
    customName: '',
    quantity: '',
    unit: 'gram'
  });

  // Temporary step
  const [tempStep, setTempStep] = useState('');

  useEffect(() => {
    console.log('EditRecipe: Mounting with ID:', id);
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      console.log('EditRecipe: Fetching recipe with ID:', id);
      setLoading(true);
      const response = await recipeService.getById(id);
      console.log('EditRecipe: Recipe response:', response);
      
      if (response.success) {
        const recipe = response.data;
        console.log('EditRecipe: Recipe data:', recipe);
        
        setFormData({
          title: recipe.title,
          description: recipe.description || '',
          photo: null,
          photoPreview: recipe.photo ? `http://localhost:5000${recipe.photo}` : '',
          ingredients: recipe.ingredients || [],
          steps: recipe.steps || [],
          cookingTime: recipe.cookingTime,
          servings: recipe.servings || 1,
          isPublic: recipe.isPublic !== undefined ? recipe.isPublic : true
        });
        console.log('EditRecipe: Form data set successfully');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      console.error('Error details:', error.response);
      alert('Gagal memuat data resep: ' + (error.response?.data?.message || error.message));
      navigate('/recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setTempIngredient(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'category') {
        newData.ingredientType = '';
        newData.ingredientName = '';
        newData.customName = '';
      } else if (name === 'ingredientType') {
        newData.ingredientName = '';
        newData.customName = '';
      } else if (name === 'ingredientName') {
        if (value !== 'Custom') {
          newData.customName = '';
        }
      }
      
      return newData;
    });
  };

  const addIngredient = () => {
    if (!tempIngredient.category || !tempIngredient.ingredientType || 
        !tempIngredient.ingredientName || !tempIngredient.quantity) {
      alert('Lengkapi semua field bahan terlebih dahulu');
      return;
    }

    // Check if Custom is selected but customName is empty
    if (tempIngredient.ingredientName === 'Custom' && !tempIngredient.customName.trim()) {
      alert('Masukkan nama bahan custom');
      return;
    }

    // Determine final variant name
    const finalVariant = tempIngredient.ingredientName === 'Custom' 
      ? tempIngredient.customName.trim()
      : tempIngredient.ingredientName;

    const ingredient = {
      category: tempIngredient.category,
      ingredientName: tempIngredient.ingredientType,
      variant: finalVariant,
      quantity: parseFloat(tempIngredient.quantity),
      unit: tempIngredient.unit
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }));

    setTempIngredient({
      category: '',
      ingredientType: '',
      ingredientName: '',
      customName: '',
      quantity: '',
      unit: 'gram'
    });
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    if (!tempStep.trim()) {
      alert('Tulis langkah terlebih dahulu');
      return;
    }

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, tempStep.trim()]
    }));

    setTempStep('');
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('=== Recipe Edit Submit ==>');
    console.log('Recipe ID:', id);
    console.log('Title:', formData.title);
    console.log('Description:', formData.description);
    console.log('Cooking Time:', formData.cookingTime);
    console.log('Servings:', formData.servings);
    console.log('New Photo:', formData.photo);
    console.log('Ingredients:', formData.ingredients);
    console.log('Steps:', formData.steps);

    if (formData.ingredients.length === 0) {
      alert('Tambahkan minimal 1 bahan');
      setIsSubmitting(false);
      return;
    }

    if (formData.steps.length === 0) {
      alert('Tambahkan minimal 1 langkah');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('cookingTime', formData.cookingTime || 0);
    data.append('servings', formData.servings || 1);
    data.append('isPublic', formData.isPublic);
    data.append('ingredients', JSON.stringify(formData.ingredients));
    data.append('steps', JSON.stringify(formData.steps));
    
    // Only append photo if a new one is selected
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const response = await recipeService.update(id, data);
      console.log('Recipe update response:', response);
      if (response.success) {
        alert('✅ Resep "' + formData.title + '" berhasil diperbarui!');
        navigate(`/recipe/${id}`);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      alert('❌ Gagal memperbarui resep: ' + (error.response?.data?.message || error.message || 'Terjadi kesalahan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIngredientTypes = () => {
    return tempIngredient.category ? getIngredientsByCategory(tempIngredient.category) : [];
  };

  const getIngredientNames = () => {
    return tempIngredient.category && tempIngredient.ingredientType 
      ? getVariantsByIngredient(tempIngredient.category, tempIngredient.ingredientType) 
      : [];
  };

  console.log('EditRecipe: Render - loading:', loading, 'formData.title:', formData.title);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Memuat data resep...</div>
        </div>
      </div>
    );
  }

  if (!formData.title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center card max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">Resep tidak ditemukan atau gagal dimuat</p>
          <button 
            onClick={() => navigate('/recipe')}
            className="btn-primary"
          >
            Kembali ke Daftar Resep
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/recipe/${id}`)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Resep</h1>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Resep *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Contoh: Nasi Goreng Ala Rumah"
              required
            />
          </div>

          {/* Recipe Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi (Opsional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ceritakan tentang resep ini..."
              rows="3"
            />
          </div>

          {/* Cooking Time & Servings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Waktu Memasak (menit) *
              </label>
              <input
                type="number"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Porsi *
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                placeholder="4"
                required
              />
            </div>
          </div>

          {/* Recipe Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foto Resep {formData.photoPreview && '(Opsional - Biarkan kosong untuk tidak mengubah foto)'}
            </label>
            
            {/* Photo Preview */}
            {formData.photoPreview && (
              <div className="mb-3">
                <img
                  src={formData.photoPreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload foto baru hanya jika ingin mengganti foto resep
            </p>
          </div>

          {/* Ingredients Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bahan-bahan
            </h3>

            {/* Add Ingredient Form */}
            <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="category"
                  value={tempIngredient.category}
                  onChange={handleIngredientChange}
                  className="input-field"
                >
                  <option value="">Pilih Kategori</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {tempIngredient.category && (
                  <select
                    name="ingredientType"
                    value={tempIngredient.ingredientType}
                    onChange={handleIngredientChange}
                    className="input-field"
                  >
                    <option value="">Pilih Jenis Bahan</option>
                    {getIngredientTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                )}
              </div>

              {tempIngredient.ingredientType && (
                <select
                  name="ingredientName"
                  value={tempIngredient.ingredientName}
                  onChange={handleIngredientChange}
                  className="input-field"
                >
                  <option value="">Pilih Nama Bahan</option>
                  {getIngredientNames().map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              )}

              {/* Custom Name Input */}
              {tempIngredient.ingredientName === 'Custom' && (
                <div className="border-2 border-primary-300 dark:border-primary-600 rounded-lg p-3 bg-primary-50 dark:bg-primary-900/20">
                  <input
                    type="text"
                    name="customName"
                    value={tempIngredient.customName}
                    onChange={handleIngredientChange}
                    className="input-field"
                    placeholder="Masukkan nama bahan custom"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Masukkan nama spesifik untuk bahan ini
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="quantity"
                  value={tempIngredient.quantity}
                  onChange={handleIngredientChange}
                  className="input-field col-span-2"
                  placeholder="Jumlah"
                  min="0"
                  step="0.01"
                />
                <select
                  name="unit"
                  value={tempIngredient.unit}
                  onChange={handleIngredientChange}
                  className="input-field"
                >
                  {UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={addIngredient}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Tambah Bahan
              </button>
            </div>

            {/* Ingredients List */}
            {formData.ingredients.length > 0 && (
              <div className="space-y-2">
                {formData.ingredients.map((ing, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ing.ingredientName} - {ing.variant}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                        ({ing.quantity} {ing.unit})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Steps Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Langkah-langkah
            </h3>

            {/* Add Step Form */}
            <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <textarea
                value={tempStep}
                onChange={(e) => setTempStep(e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Tulis langkah memasak..."
              />
              <button
                type="button"
                onClick={addStep}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Tambah Langkah
              </button>
            </div>

            {/* Steps List */}
            {formData.steps.length > 0 && (
              <div className="space-y-2">
                {formData.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                  >
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-900 dark:text-white">{step}</p>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.')) {
                  alert('❌ Perubahan dibatalkan');
                  navigate(`/recipe/${id}`);
                }
              }} 
              className="flex-1 btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
