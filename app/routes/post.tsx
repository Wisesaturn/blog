import styles from 'highlight.js/styles/github-dark-dimmed.css';
import type { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const Post = () => {
  return (
    <div className="flex justify-center">
      <div className="prose lg:prose-xl py-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Post;
