import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop (Hidden on mobile) */}
      <aside className="hidden lg:block lg:w-64 lg:fixed lg:h-screen bg-white dark:bg-gray-800 shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 pb-20 lg:pb-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom Navigation Mobile (Hidden on desktop) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
          <Navbar />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
