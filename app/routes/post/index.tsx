import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
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

export const BlogIndex = () => {
  const posts = useLoaderData();
  return (
    <>
      <h2>글 목록</h2>
      <ul>
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
            {post.description ? <p className="m-0 lg:m-0">{post.description}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogIndex;
