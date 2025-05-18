import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: Record<string, any>;
  footerProps?: Record<string, any>;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps = {},
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {showHeader && <Header {...headerProps} />}
      
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        {children}
      </main>
      
      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

export default MainLayout;