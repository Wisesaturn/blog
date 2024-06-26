import { IMiddleware } from '$shared/middleware/_index';
import { ILayout } from '$shared/middleware/layout';

declare global {
  type Hierarchy = 'primary' | 'secondary';
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

/**
 * @summary firestore interface
 */
export interface IFireStore {
  collection: string;
  category: string;
  title: string;
}
