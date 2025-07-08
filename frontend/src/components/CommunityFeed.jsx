import React from 'react';

/**
 * CommunityFeed
 * @param {{ id: number, author: string, title: string, excerpt: string, link: string, likes: number, comments: number }[]} posts
 * - posts: 커뮤니티 게시글 리스트
 */
export default function CommunityFeed({ posts = [] }) {
  return (
    <ul className="space-y-4">
      {posts.map(post => (
        <li key={post.id} className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow">
          <a href={post.link} className="font-medium hover:underline">
            {post.title}
          </a>
          <p className="text-xs text-gray-500 mt-1">by {post.author}</p>
          <div className="flex items-center text-xs text-gray-400 mt-2 space-x-4">
            <span>👍 {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}