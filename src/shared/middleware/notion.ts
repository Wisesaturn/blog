import path from 'path';
import { createRequire } from 'module';

const { Client } = createRequire(import.meta.url)(
  path.join(process.cwd(), 'node_modules/@notionhq/client'),
);

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

export default notion;
