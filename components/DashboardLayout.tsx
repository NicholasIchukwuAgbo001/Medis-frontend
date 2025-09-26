import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserRole } from '../types';
import { LogoIcon, DashboardIcon, PatientIcon, RecordIcon, LogoutIcon, BellIcon, AnalyticsIcon, SettingsIcon } from './icons/IconComponents';
import ThemeToggle from './ThemeToggle';
import Avatar from './Avatar';

interface NavItem {
  name: string;
  icon: React.FC<{ className?: string }>;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: DashboardIcon, roles: [UserRole.Admin, UserRole.Patient] },
  // Admin Links
  { name: 'Patients', icon: PatientIcon, roles: [UserRole.Admin] },
  { name: 'Medical Records', icon: RecordIcon, roles: [UserRole.Admin] },
  { name: 'Analytics', icon: AnalyticsIcon, roles: [UserRole.Admin] },
  // Patient Links
  { name: 'My Records', icon: RecordIcon, roles: [UserRole.Patient] },
  // Common Link
  { name: 'Settings', icon: SettingsIcon, roles: [UserRole.Admin, UserRole.Patient] },
];

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeItem: string;
  onNavItemClick: (item: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, children, activeItem, onNavItemClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-medis-light-border dark:border-medis-light-gray/20">
        <LogoIcon className="h-8 w-auto text-medis-primary" />
        <span className="ml-3 text-2xl font-heading font-bold text-medis-light-text dark:text-white">Medis</span>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-2">
        {filteredNavItems.map((item) => (
          <motion.a
            key={item.name}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavItemClick(item.name); if(sidebarOpen) setSidebarOpen(false); }}
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`
              ${activeItem === item.name ? 'bg-medis-primary/10 text-medis-primary dark:text-white border-l-4 border-medis-primary' : 'text-medis-light-muted dark:text-medis-gray hover:bg-gray-100 dark:hover:bg-medis-light-gray/50 hover:text-medis-light-text dark:hover:text-white border-l-4 border-transparent'}
              group flex items-center px-4 py-3 text-base font-medium rounded-r-md transition-all duration-150
            `}
          >
            <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
            {item.name}
          </motion.a>
        ))}
      </nav>
      <motion.div
        whileHover={{ x: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="flex-shrink-0 p-4 border-t border-medis-light-border dark:border-medis-light-gray/20"
      >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onLogout(); }}
            className="group flex items-center px-2 py-3 text-base font-medium rounded-md text-medis-light-muted dark:text-medis-gray hover:bg-gray-100 dark:hover:bg-medis-light-gray/50 hover:text-medis-light-text dark:hover:text-white transition-colors duration-150"
          >
            <LogoutIcon className="mr-4 flex-shrink-0 h-6 w-6" />
            Logout
          </a>
      </motion.div>
    </div>
  );

  return (
    <div className="flex h-screen bg-medis-light-bg dark:bg-medis-secondary-dark">
       {/* Mobile sidebar */}
       <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-medis-light-card dark:bg-medis-secondary">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SidebarContent />
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-medis-light-card dark:bg-medis-secondary">
            <SidebarContent />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-medis-light-card dark:bg-medis-secondary shadow-lg dark:shadow-medis-secondary-dark/50">
          <button
            type="button"
            className="px-4 border-r border-medis-light-border dark:border-medis-light-gray/20 text-medis-light-muted dark:text-medis-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-medis-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-xl font-heading font-bold my-auto text-medis-light-text dark:text-medis-dark">{activeItem}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <motion.div whileHover={{ scale: 1.1 }}>
                <ThemeToggle />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="ml-3 p-1 rounded-full text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-medis-light-card dark:focus:ring-offset-medis-secondary focus:ring-medis-primary"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon />
              </motion.button>

              <div className="ml-3 relative flex items-center">
                <Avatar user={user} />
                <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-medis-light-text dark:text-medis-dark">{user.name}</p>
                    <p className="text-xs font-medium text-medis-light-muted dark:text-medis-gray">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-6"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;