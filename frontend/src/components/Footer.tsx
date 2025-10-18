'use client';

import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, Code, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Tutorials', href: '#tutorials' },
      { name: 'Status', href: '#status' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/cipherstudio' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/cipherstudio' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/cipherstudio' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@cipherstudio.com' }
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border-t-2`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-2">
              <Logo size="sm" showText={true} />
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 max-w-md`}>
              CipherStudio is a modern, browser-based React IDE that provides a complete development environment for React projects. Built for developers, by developers.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-6 pt-4 border-t-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2 md:mb-0`}>
              © {currentYear} CipherStudio. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Code className="h-3 w-3 mr-1" />
                Built with React & Next.js
              </div>
              <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Zap className="h-3 w-3 mr-1" />
                Powered by Vercel
              </div>
              <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by developers
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
