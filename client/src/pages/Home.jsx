import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { inventoryService, historyService } from '../services';
import { getExpirationStatus, formatDateTime } from '../utils/constants';
import InventoryForm from '../components/InventoryForm';

const Home = () => {
  const [dashboard, setDashboard] = useState({
    nearExpiry: [],
    lowStock: [],
    expired: [],
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, historyRes] = await Promise.all([
        inventoryService.getDashboard(),
        historyService.getStats(),
      ]);

      if (dashboardRes.success) {
        setDashboard(dashboardRes.data);
      }

      if (historyRes.success) {
        setRecentHistory(historyRes.data.recentHistory);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button 
          onClick={() => setShowInventoryForm(true)}
          className="lg:hidden btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Bahan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Near Expiry */}
        <div className="card border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Akan Kadaluarsa
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {dashboard.nearExpiry.length}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </div>

        {/* Low Stock */}
        <div className="card border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stok Menipis
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {dashboard.lowStock.length}
              </p>
            </div>
            <TrendingDown className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>

        {/* Expired */}
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sudah Kadaluarsa
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {dashboard.expired.length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Near Expiry Items */}
      {dashboard.nearExpiry.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚠️ Segera Kadaluarsa
          </h2>
          <div className="space-y-3">
            {dashboard.nearExpiry.map((item) => {
              const status = getExpirationStatus(item.expirationDate);
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.ingredientName}
                      {item.variant && (
                        <span className="text-sm text-gray-500"> - {item.variant}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <span className={`text-sm font-medium text-${status.color}-600`}>
                    {status.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      {dashboard.lowStock.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📉 Stok Menipis
          </h2>
          <div className="space-y-3">
            {dashboard.lowStock.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.ingredientName}
                    {item.variant && (
                      <span className="text-sm text-gray-500"> - {item.variant}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Min. stok: {item.minimumStock} {item.unit}
                  </p>
                </div>
                <span className="text-sm font-medium text-orange-600">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {recentHistory.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🕐 Aktivitas Terbaru
          </h2>
          <div className="space-y-2">
            {recentHistory.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.detail}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(item.timestamp)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.action === 'Create'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : item.action === 'Update'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : item.action === 'Delete'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}
                >
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB (Floating Action Button) */}
      <button 
        onClick={() => setShowInventoryForm(true)}
        className="fixed bottom-20 right-4 lg:bottom-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Inventory Form Modal */}
      <InventoryForm 
        isOpen={showInventoryForm}
        onClose={() => setShowInventoryForm(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Home;
