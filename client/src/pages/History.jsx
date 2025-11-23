import { useState, useEffect } from 'react';
import { Filter, History as HistoryIcon } from 'lucide-react';
import { historyService } from '../services';
import { formatDateTime } from '../utils/constants';

const History = () => {
  const [histories, setHistories] = useState([]);
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const actions = ['Create', 'Update', 'Delete', 'Cook'];
  const categories = ['Inventory', 'Recipe', 'Profile'];

  useEffect(() => {
    fetchHistories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [histories, selectedAction, selectedCategory]);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const response = await historyService.getAll();
      if (response.success) {
        setHistories(response.data);
      }
    } catch (error) {
      console.error('Error fetching histories:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...histories];

    if (selectedAction) {
      filtered = filtered.filter(item => item.action === selectedAction);
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredHistories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Create':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Update':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Delete':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'Cook':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Inventory':
        return '📦';
      case 'Recipe':
        return '🍳';
      case 'Profile':
        return '👤';
      default:
        return '📝';
    }
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Memuat riwayat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Riwayat Aktivitas
        </h1>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Filter</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kegiatan
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="input-field"
            >
              <option value="">Semua Kegiatan</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {(selectedAction || selectedCategory) && (
          <button
            onClick={() => {
              setSelectedAction('');
              setSelectedCategory('');
            }}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* History Table */}
      {filteredHistories.length === 0 ? (
        <div className="card text-center py-12">
          <HistoryIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {selectedAction || selectedCategory 
              ? 'Tidak ada riwayat dengan filter tersebut' 
              : 'Belum ada riwayat aktivitas'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDateTime(item.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(item.action)}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {item.detail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center gap-2">
                        <span>{getCategoryIcon(item.category)}</span>
                        <span className="text-gray-900 dark:text-white">{item.category}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {currentItems.map((item) => (
              <div key={item._id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(item.action)}`}>
                    {item.action}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white mb-2">
                  {item.detail}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{getCategoryIcon(item.category)}</span>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredHistories.length)} dari {filteredHistories.length} aktivitas
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Prev
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === pageNumber
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
