import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import fs from 'fs/promises';
import path from 'path';
import parseFrontMatter from 'front-matter';
import type { attributeTypes } from '@Types/post';
import PostCardSection from '@components/Section/PostCard';

const isDevelopment = process.env.NODE_ENV === 'development';
const postPath = path.join(process.cwd(), `${isDevelopment ? `app/routes/project` : ``}/__post`);

export const getPosts = async () => {
  const isPath = await fs.readdir(postPath);
  return Promise.all(
    isPath.map(async (filename) => {
      const file = await fs.readFile(path.join(postPath, filename));
      const { attributes, body } = parseFrontMatter<attributeTypes>(file.toString());

      return {
        slug: filename.replace(/\.mdx?$/, ''),
        ...attributes,
        body,
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
    <div className="h-full">
      <PostCardSection data={posts} />
    </div>
  );
};

export default ProjectPage;
