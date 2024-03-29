import { ILayout } from '$shared/middleware/layout';
import { PostBody, PostEndPoint } from '$shared/types/api';

class Api {
  private baseUrl;

  private updateLayout: (layout: Partial<ILayout>) => void;

  constructor() {
    this.baseUrl = '/api/';
    this.updateLayout = () => {};
  }

  setUpdateLayout(updateLayout: (layout: Partial<ILayout>) => void) {
    this.updateLayout = updateLayout;
  }

  async post<T extends PostEndPoint>(endPoint: T, body: PostBody<T>) {
    const newEndPoint = this.baseUrl + endPoint;
    const config = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.updateLayout({ loading: true });
    const response = await fetch(newEndPoint, config);
    const result = await response.json();
    this.updateLayout({ loading: false });
    return result;
  }
}

const instance = new Api();

export default instance;
