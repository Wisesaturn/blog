import { IMiddleware } from '$shared/middleware/_index';
import { ILayout } from '$shared/middleware/layout';

declare global {
  interface GlobalLoaderData {
    layout: ILayout;
    middleware: IMiddleware;
  }
  interface GlobalAnimation {
    animation?: {
      variants: AnimationProps['variants'];
    };
  }
}

/**
 * @summary sitemap interface
 */
export interface ISitemap {
  loc: string;
  lastmod?: string;
  priority?: string;
  changeFreq?: 'daily' | 'weekly' | 'monthly' | 'hourly' | 'yearly' | 'always' | 'never';
}
