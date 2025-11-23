import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Recipe from './pages/Recipe';
import History from './pages/History';
import RecipeDetail from './pages/RecipeDetail';
import CookingMode from './pages/CookingMode';
import EditProfile from './pages/EditProfile';
import EditRecipe from './pages/EditRecipe';

// Layout
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="recipe/:id" element={<RecipeDetail />} />
        <Route path="recipe/:id/edit" element={<EditRecipe />} />
        <Route path="recipe/:id/cook" element={<CookingMode />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<EditProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
