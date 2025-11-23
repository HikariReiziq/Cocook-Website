import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Play, Users } from 'lucide-react';
import { recipeService } from '../services';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getById(id);
      if (response.success) {
        setRecipe(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
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
        {recipe.image && (
          <img
            src={`http://localhost:5000/${recipe.image}`}
            alt={recipe.name}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {recipe.name}
        </h1>

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
            <span>Oleh: {recipe.createdBy?.name || 'Anonymous'}</span>
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
                  {index + 1}
                </div>
                <p className="flex-1 text-gray-900 dark:text-white pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Cooking Button */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/recipe/${recipe._id}/cook`)}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg"
          >
            <Play size={24} />
            Start CoCook
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
