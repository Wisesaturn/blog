import { PostBody, PostEndPoint } from '$shared/types/api';

class Api {
  private baseUrl;

  constructor() {
    this.baseUrl = '/api/';
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
    const response = await fetch(newEndPoint, config);
    const result = await response.json();
    return result;
  }
}

const instance = new Api();

export default instance;
