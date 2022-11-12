// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
exports.mdx = async (filename) => {
  const [rehypeHighlight, rehypeAutolinkHeadings, rehypeSlug, remarkGfm] = await Promise.all([
    import('rehype-highlight').then((mod) => mod.default),
    import('rehype-autolink-headings').then((mod) => mod.default),
    import('rehype-slug').then((mod) => mod.default),
    import('remark-gfm').then((mod) => mod.default),
  ]);

  return {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
          test: ['h2'],
        },
      ],
      rehypeHighlight,
    ],
  };
};

exports.cacheDirectory = './node_modules/.cache/remix';
exports.ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'];
exports.server = process.env.NODE_ENV === 'development' ? undefined : './server.ts';
exports.serverBuildTarget = 'vercel';
