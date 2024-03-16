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
