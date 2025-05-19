import React, { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  label: string;
}

interface HeaderProps {
  title?: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

// 导航链接组件，使用 NavLink 自动处理激活状态
const NavLink: React.FC<NavLinkProps> = ({ to, label }) => (
  <RouterNavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) => 
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
      }`
    }
  >
    {label}
  </RouterNavLink>
);

const Header: React.FC<HeaderProps> = ({
  title = "词汇学习助手",
  onThemeToggle,
  isDarkMode = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 导航链接配置
  const navLinks = [
    { path: '/import', label: '导入词汇' },
    { path: '/flashcard', label: '闪卡学习' },
    { path: '/quiz', label: '词汇测验' },
    { path: '/summary', label: '学习总结' },
    { path: '/settings', label: '设置' }
  ];

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <RouterNavLink to="/" className="text-xl font-bold text-white">
                {title}
              </RouterNavLink>
            </div>
            {/* 桌面端导航 */}
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    label={link.label}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            {/* 主题切换按钮 */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="ml-4 p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="ml-auto p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </RouterNavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;