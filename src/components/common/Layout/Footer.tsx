import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  copyrightText?: string;
  links?: Array<{ label: string; to: string }>;
  showSocialLinks?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  copyrightText = `© ${new Date().getFullYear()} 词汇学习助手`,
  links = [
    { label: '关于我们', to: '/about' },
    { label: '使用帮助', to: '/help' },
    { label: '隐私政策', to: '/privacy' },
  ],
  showSocialLinks = true,
}) => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* 品牌和版权信息 */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="font-bold text-xl text-gray-800 dark:text-gray-200">词汇学习助手</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {copyrightText}
            </p>
          </div>
          
          {/* 链接列表 */}
          <div className="flex flex-wrap justify-center md:justify-end">
            <div className="mb-6 md:mb-0">
              <ul className="flex space-x-6">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 社交链接 */}
            {showSocialLinks && (
              <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-6">
                <div className="flex justify-center md:justify-end space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="GitHub"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="Twitter"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.126 1.195 4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;