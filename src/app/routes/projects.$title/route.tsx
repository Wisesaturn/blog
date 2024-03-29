import { LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';

import getProject from '$features/project/api/getProject';

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const project = await getProject({ title });
  return json({ project });
}

export default function ProjectPage() {
  const { project } = useLoaderData<typeof loader>();

  return <div>ProjectPage</div>;
}
