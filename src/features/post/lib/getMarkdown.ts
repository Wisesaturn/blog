/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { createRequire } from 'module';

import notion from '$shared/middleware/notion';

const { NotionToMarkdown } = createRequire(import.meta.url)(
  path.join(process.cwd(), 'node_modules/notion-to-md'),
);

const n2m = new NotionToMarkdown({ notionClient: notion, convertImagesToBase64: true });

// ---------- embed settings (codepen)
n2m.setCustomTransformer('embed', async (block: any) => {
  const { embed } = block;
  if (!embed?.url) return '';
  if (embed.url.includes('codepen')) {
    const dataSlug = embed.url.split('/')[5].split('?')[0];
    return `<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash=${dataSlug} data-user="Wisesaturn"
    style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    </p>`;
  }

  return '';
});

// ---------- image settings
n2m.setCustomTransformer('image', async (block: any) => {
  const { image } = block;
  const caption =
    image.caption
      .map((cap: any) => {
        if (cap.href !== null) {
          return `<a href=${cap.href}>${cap.plain_text}</a>`;
        }

        return `${cap.plain_text}`;
      })
      .join('') || '';
  const plainCaption = image.caption
    .map((cap: any) => cap.plain_text)
    .join('')
    .replace(/&nbsp;/g, ' ');

  if (image.type === 'external') {
    const { url } = image.external;
    const alt = plainCaption || 'image';
    const plainAlt = alt.replace(/&nbsp;/g, ' ');
    return `<img loading="lazy" width="500" height="500" src="${url}" alt="${plainAlt}" />
  <div class="image-caption">${caption}</div>`;
  }

  const { url = '' } = image.file;
  const alt = plainCaption || decodeURIComponent(path.basename(url)).split('?').shift();
  const plainAlt = alt.replace(/&nbsp;/g, ' ');

  return `<img loading="lazy" width="500" height="500" src="${url}" alt="${plainAlt}" />
  <div class="image-caption">${caption}</div>`;
});

// ---------- heading settings
n2m.setCustomTransformer('heading_1', async (block: any) => {
  const text = block.heading_1.rich_text[0].plain_text;
  return `## ${text}`;
});

n2m.setCustomTransformer('heading_2', async (block: any) => {
  const text = block.heading_2.rich_text[0].plain_text;
  return `### ${text}`;
});

n2m.setCustomTransformer('heading_3', async (block: any) => {
  const text = block.heading_3.rich_text[0].plain_text;
  return `#### ${text}`;
});

// ---------- code block settings
n2m.setCustomTransformer('code', async (block: any) => {
  const { language } = block.code;
  const title = block.code.caption ? block.code.caption[0]?.plain_text : '';
  const content = block.code.rich_text[0]?.plain_text.trim();
  if (title) {
    return `<h5 class="code-title">${title}</h5>

\`\`\`${language}
${content}
\`\`\`
  `;
  }

  return block;
});

/**
 * @summary 노션 페이지를 마크다운으로 변환하는 함수입니다.
 * @environment server
 * @param notionPageId
 * @returns
 */
export default async function getMarkdown(notionPageId: string): Promise<string> {
  const mdblocks = await n2m.pageToMarkdown(notionPageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString.parent;
}
