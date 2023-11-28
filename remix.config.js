/**
 * @type {import('@remix-run/dev').AppConfig}
 */

exports.cacheDirectory = './node_modules/.cache/remix';
exports.ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/*.ts'];
exports.server = process.env.NODE_ENV === 'development' ? undefined : './server.ts';
exports.serverBuildTarget = 'vercel';

exports.appDirectory = 'app';
exports.BuildDirectory = 'public/build';
exports.publicPath = '/build/';

exports.future = {
  v2_meta: true,
};

exports.serverDependenciesToBundle = [
  'unified',
  'bail',
  'trough',
  'vfile',
  'vfile-message',
  'unist-util-stringify-position',
  'refractor/lib/common.js',
  'parse-entities',
  'character-reference-invalid',
  'common',
  /^mdast*/,
  /^refractor*/,
  /^is*/,
  /^unified*/,
  /^micromark*/,
  /^github*/,
  /^unist*/,
  /^hast*/,
  /^rehype*/,
  /^remark*/,
  'remark-gfm',
  'remark-rehype',
  'remark-stringify',
  'remark-breaks',
  'micromark-util-combine-extensions',
  'micromark-util-chunked',
  'micromark-util-character',
  /^micromark-extensions*/,
  'micromark-core-commonmark',
  'micromark-factory-space',
  'micromark-util-normalize-identifier',
  'micromark-util-classify-character',
  'micromark-util-resolve-all',
  'mdast-util-gfm',
  'mdast-util-gfm-autolink-literal',
  'ccount',
  'mdast-util-find-and-replace',
  'unist-util-visit-parents',
  'unist-util-is',
  'mdast-util-gfm-footnote',
  'mdast-util-to-markdown/lib/util/association.js',
  'micromark-util-decode-string',
  'decode-named-character-reference',
  'character-entities',
  'micromark-util-decode-numeric-character-reference',
  'mdast-util-to-markdown/lib/util/container-flow.js',
  'mdast-util-to-markdown/lib/util/indent-lines.js',
  'mdast-util-to-markdown/lib/util/safe.js',
  'mdast-util-to-markdown/lib/util/track.js',
  'mdast-util-gfm-strikethrough',
  'mdast-util-to-markdown/lib/util/container-phrasing.js',
  'mdast-util-gfm-table',
  'mdast-util-to-markdown/lib/handle/inline-code.js',
  'mdast-util-gfm-task-list-item',
  'mdast-util-to-markdown/lib/handle/list-item.js',
  'mdast-util-newline-to-break',
  'remark-parse',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'micromark/lib/parse.js',
  'micromark-util-subtokenize',
  'micromark-factory-destination',
  'micromark-factory-label',
  'micromark-factory-title',
  'micromark-factory-whitespace',
  'micromark-factory',
  'micromark',
  'micromark-util-html-tag-name',
  'micromark/lib/postprocess.js',
  'micromark/lib/preprocess.js',
  'mdast-util-to-hast',
  'unist-builder',
  'unist-util-visit',
  'unist-util-position',
  'unist-util-generated',
  'mdast-util-definitions',
  'rehype-stringify',
  'hast-util-to-html',
  'property-information',
  'html-void-elements',
  'zwitch',
  'stringify-entities',
  'character-entities-legacy',
  'character-entities-html4',
  'comma-separated-tokens',
  'space-separated-tokens',
  'hast-util-whitespace',
  'rehype-highlight',
  'lowlight',
  'fault',
  'hast-util-to-text',
  'hast-util-is-element',
  'unist-util-find-after',
  'remark-math',
  'micromark-extension-math',
  'mdast-util-math',
  'longest-streak',
  'mdast-util-to-markdown/lib/util/pattern-compile.js',
  'rehype-mathjax',
  'hast-util-from-dom',
  'web-namespaces',
  'hastscript',
  'hast-util-parse-selector',
];
