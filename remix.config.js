exports.cacheDirectory = './node_modules/.cache/remix';
exports.ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/*.ts'];
exports.server = process.env.NODE_ENV === 'development' ? undefined : './server.ts';
exports.serverBuildTarget = 'vercel';

exports.appDirectory = 'app';
exports.BuildDirectory = 'public/build';
exports.publicPath = '/build/';
