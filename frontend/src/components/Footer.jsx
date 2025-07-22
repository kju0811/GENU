import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-300 shadow-md p-4 w-full" aria-label="Main footer">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="nurung.png"
              alt="GENU"
              className="h-10 w-10 rounded-lg"
            />
            <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              GENU
            </span>
          </div>
          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <Link to="mailto:contact@startupful.io" className="hover:text-indigo-500">
                nurung2@angimoring.com
              </Link>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <Link to="tel:+82021234567" className="hover:text-indigo-500">
                +82 02-123-4567
              </Link>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Seoul, Republic of Korea</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">© 2025 GENU. All rights reserved.</div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" aria-label="Twitter" className="hover:text-indigo-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..." />
              </svg>
            </Link>
            <Link to="/" aria-label="LinkedIn" className="hover:text-indigo-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14..." />
              </svg>
            </Link>
            <Link to="/" aria-label="GitHub" className="hover:text-indigo-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477..." />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
