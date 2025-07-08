import React from 'react';

/**
 * RelatedNews
 * @param {{ id: number, title: string, summary: string, url: string }[]} articles
 * - articles: 관련 뉴스 리스트
 */
export default function RelatedNews({ articles = [] }) {
  return (
    <ul className="space-y-4">
      {articles.map(item => (
        <li key={item.id} className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
            {item.title}
          </a>
          <p className="text-sm text-gray-500 mt-1">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
