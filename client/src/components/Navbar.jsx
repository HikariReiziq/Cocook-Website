import { NavLink } from 'react-router-dom';
import { Home, Package, BookOpen, Clock } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/inventory', icon: Package, label: 'Inventory' },
    { to: '/recipe', icon: BookOpen, label: 'Recipe' },
    { to: '/history', icon: Clock, label: 'History' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:h-full lg:p-4">
        {/* Logo */}
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Cocook
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manajemen Dapur
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;
