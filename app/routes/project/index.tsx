import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import fs from 'fs/promises';
import path from 'path';
import parseFrontMatter from 'front-matter';
import type { attributeTypes, postingTypes } from '@Types/post';

const postPath = path.join(process.cwd(), 'app/routes/project/__post');

export const getPosts = async () => {
  const isPath = await fs.readdir(postPath);
  return Promise.all(
    isPath.map(async (filename) => {
      const file = await fs.readFile(path.join(postPath, filename));
      const { attributes } = parseFrontMatter<attributeTypes>(file.toString());

      return {
        slug: filename.replace(/\.mdx?$/, ''),
        ...attributes,
      };
    }),
  );
};

export const loader: LoaderFunction = () => {
  return getPosts();
};

export const ProjectPage = () => {
  const posts = useLoaderData();
  return (
    <>
      <h2>글 목록</h2>
      <ul>
        {posts.map((post: postingTypes) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
            {post.date}
            {post.description ? <p className="m-0 lg:m-0">{post.description}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectPage;
