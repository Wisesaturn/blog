import { useParams, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import getPost from '@utils/api/getPost';

export async function loader({ params }: LoaderArgs) {
  const { id } = params;
  return getPost('review', id!);
}

export default function ReviewPage() {
  const post = useLoaderData();

  return <>{post.body}</>;
}
