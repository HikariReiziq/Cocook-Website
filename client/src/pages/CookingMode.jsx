import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ArrowRight, Check } from 'lucide-react';
import { recipeService } from '../services';

const CookingMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);

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

  const handleExit = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari mode memasak?')) {
      navigate(`/recipe/${id}`);
    }
  };

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!window.confirm('Selesai memasak? Stok bahan akan otomatis berkurang.')) {
      return;
    }

    try {
      setFinishing(true);
      const response = await recipeService.finishCooking(id);
      
      if (response.success) {
        alert('✅ Selamat! Masakan selesai dan stok bahan telah diperbarui.');
        navigate('/recipe');
      }
    } catch (error) {
      console.error('Error finishing cooking:', error);
      alert(error.response?.data?.message || 'Gagal menyelesaikan masakan. Coba lagi.');
    } finally {
      setFinishing(false);
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

  const isLastStep = currentStep === recipe.steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 -m-6 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {recipe.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Langkah {currentStep + 1} dari {recipe.steps.length}
          </p>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={20} />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="card max-w-3xl w-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full text-xl font-bold">
                {currentStep + 1}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Langkah {currentStep + 1}
              </h2>
            </div>
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
              {recipe.steps[currentStep]}
            </p>
          </div>

          {/* Ingredients for this step (optional feature) */}
          {currentStep === 0 && (
            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                📝 Bahan yang dibutuhkan:
              </h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    • {ingredient.ingredientName}
                    {ingredient.variant && ` - ${ingredient.variant}`}
                    : {ingredient.quantity} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 max-w-3xl mx-auto w-full">
        <button
          onClick={handleExit}
          className="flex-1 btn-secondary py-4 text-lg"
        >
          Exit
        </button>
        <button
          onClick={handleNext}
          disabled={finishing}
          className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2"
        >
          {finishing ? (
            'Menyelesaikan...'
          ) : isLastStep ? (
            <>
              <Check size={24} />
              Selesai
            </>
          ) : (
            <>
              Next
              <ArrowRight size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CookingMode;
