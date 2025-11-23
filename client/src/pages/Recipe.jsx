import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Clock, ChefHat, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services';
import { 
  CATEGORIES, 
  UNITS, 
  getIngredientsByCategory, 
  getVariantsByIngredient 
} from '../utils/constants';

const Recipe = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    ingredients: [],
    steps: [],
    cookingTime: ''
  });

  // Temporary ingredient form
  const [tempIngredient, setTempIngredient] = useState({
    category: '',
    ingredientType: '',
    ingredientName: '',
    quantity: '',
    unit: 'gram'
  });

  // Temporary step
  const [tempStep, setTempStep] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getAll();
      if (response.success) {
        setRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setTempIngredient(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'category') {
        newData.ingredientType = '';
        newData.ingredientName = '';
      } else if (name === 'ingredientType') {
        newData.ingredientName = '';
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

    const ingredient = {
      category: tempIngredient.category,
      ingredientName: tempIngredient.ingredientType,
      variant: tempIngredient.ingredientName,
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

    if (formData.ingredients.length === 0) {
      alert('Tambahkan minimal 1 bahan');
      return;
    }

    if (formData.steps.length === 0) {
      alert('Tambahkan minimal 1 langkah');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('cookingTime', formData.cookingTime);
    data.append('ingredients', JSON.stringify(formData.ingredients));
    data.append('steps', JSON.stringify(formData.steps));
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await recipeService.create(data);
      if (response.success) {
        await fetchRecipes();
        closeFormModal();
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan resep');
    }
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({
      name: '',
      image: null,
      ingredients: [],
      steps: [],
      cookingTime: ''
    });
    setTempIngredient({
      category: '',
      ingredientType: '',
      ingredientName: '',
      quantity: '',
      unit: 'gram'
    });
    setTempStep('');
  };

  const getIngredientTypes = () => {
    return tempIngredient.category ? getIngredientsByCategory(tempIngredient.category) : [];
  };

  const getIngredientNames = () => {
    return tempIngredient.category && tempIngredient.ingredientType 
      ? getVariantsByIngredient(tempIngredient.category, tempIngredient.ingredientType) 
      : [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Memuat resep...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resep Masakan</h1>
        <button
          onClick={() => setShowFormModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tambah Resep</span>
        </button>
      </div>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="card text-center py-12">
          <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Belum ada resep
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Bagikan resep favoritmu dengan komunitas!
          </p>
          <button
            onClick={() => setShowFormModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Resep Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <div
              key={recipe._id}
              className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              {/* Image */}
              {recipe.image ? (
                <img
                  src={`http://localhost:5000/${recipe.image}`}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                  <ChefHat size={48} className="text-gray-400" />
                </div>
              )}

              {/* Content */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {recipe.name}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{recipe.cookingTime} menit</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>{recipe.ingredients.length} bahan</span>
                </div>
              </div>

              {/* Creator Info */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Oleh: {recipe.createdBy?.name || 'Anonymous'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tambah Resep Baru
              </h2>
              <button onClick={closeFormModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Recipe Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Resep *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Contoh: Nasi Goreng Ala Rumah"
                  required
                />
              </div>

              {/* Cooking Time */}
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

              {/* Recipe Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Foto Resep *
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="input-field"
                  required
                />
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
                <button type="button" onClick={closeFormModal} className="flex-1 btn-secondary">
                  Batal
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Simpan Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
