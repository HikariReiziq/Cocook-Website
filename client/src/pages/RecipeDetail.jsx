import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Play, Users, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { recipeService, inventoryService } from '../services';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getById(id);
      if (response.success) {
        setRecipe(response.data);
        await checkIngredientAvailability(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIngredientAvailability = async (recipeData) => {
    try {
      const inventoryResponse = await inventoryService.getAll();
      if (inventoryResponse.success) {
        const inventory = inventoryResponse.data;
        const missing = [];

        recipeData.ingredients.forEach(ingredient => {
          const found = inventory.find(item => 
            item.ingredientName.toLowerCase() === ingredient.ingredientName.toLowerCase() &&
            item.quantity >= ingredient.quantity
          );
          
          if (!found) {
            missing.push(ingredient);
          }
        });

        setMissingIngredients(missing);
      }
    } catch (error) {
      console.error('Error checking ingredients:', error);
    }
  };

  const handleStartCooking = () => {
    if (missingIngredients.length > 0) {
      const missingList = missingIngredients.map(ing => 
        `${ing.ingredientName}${ing.variant ? ' - ' + ing.variant : ''}: ${ing.quantity} ${ing.unit}`
      ).join('\n');
      
      alert(`⚠️ Bahan-bahan Anda untuk membuat resep ini belum memenuhi!\n\nBahan yang kurang:\n${missingList}`);
      return;
    }
    navigate(`/recipe/${recipe._id}/cook`);
  };

  const handleDelete = async () => {
    try {
      const response = await recipeService.delete(recipe._id);
      if (response.success) {
        alert('✅ Resep berhasil dihapus!');
        navigate('/recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(error.response?.data?.message || 'Gagal menghapus resep');
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Memuat resep...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Resep tidak ditemukan</p>
        <button onClick={() => navigate('/recipe')} className="btn-primary mt-4">
          Kembali ke Daftar Resep
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/recipe')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      {/* Recipe Header */}
      <div className="card">
        {recipe.photo && (
          <img
            src={`http://localhost:5000${recipe.photo}`}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {recipe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span>{recipe.cookingTime} menit</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat size={20} />
            <span>{recipe.ingredients.length} bahan</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>{recipe.servings || 1} porsi</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>Oleh: {recipe.user?.name || 'Anonymous'}</span>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Bahan-bahan
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  <span className="font-medium">{ingredient.ingredientName}</span>
                  {ingredient.variant && (
                    <span className="text-gray-600 dark:text-gray-400">
                      - {ingredient.variant}
                    </span>
                  )}
                  <span className="text-gray-600 dark:text-gray-400">
                    : {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Cara Memasak
          </h2>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full font-semibold">
                  {step.stepNumber || (index + 1)}
                </div>
                <p className="flex-1 text-gray-900 dark:text-white pt-1">
                  {step.instruction || step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Ingredients Warning */}
        {missingIngredients.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Bahan belum lengkap
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                  Anda kekurangan {missingIngredients.length} bahan:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  {missingIngredients.slice(0, 3).map((ing, idx) => (
                    <li key={idx}>
                      • {ing.ingredientName}{ing.variant ? ` - ${ing.variant}` : ''}: {ing.quantity} {ing.unit}
                    </li>
                  ))}
                  {missingIngredients.length > 3 && (
                    <li>• dan {missingIngredients.length - 3} bahan lainnya</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStartCooking}
            className="btn-primary flex items-center justify-center gap-2 py-4 text-lg"
          >
            <Play size={24} />
            Start CoCook
          </button>

          {/* Edit & Delete buttons - Only show for recipe owner */}
          {user && recipe.user && user.id === recipe.user._id && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/recipe/${recipe._id}/edit`)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
              >
                <Edit2 size={20} />
                Edit Resep
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 py-3 transition-colors"
              >
                <Trash2 size={20} />
                Hapus Resep
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Hapus Resep?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Apakah Anda yakin ingin menghapus resep "{recipe.title}"? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
