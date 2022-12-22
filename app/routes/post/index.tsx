import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import styles from 'highlight.js/styles/github-dark-dimmed.css';
import * as firstPost from './setting.mdx';
import * as secondPost from './welcome.mdx';

const postFromModule = (mod: any) => {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ''),
    ...mod.attributes.meta,
  };
};

export const loader: LoaderFunction = () => {
  return [postFromModule(firstPost), postFromModule(secondPost)];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const BlogIndex = () => {
  const posts = useLoaderData();
  return (
    <div className="flex justify-center">
      <div className="prose lg:prose-xl py-10">
        <h2>글 목록</h2>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
              {post.description ? <p className="m-0 lg:m-0">{post.description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogIndex;
