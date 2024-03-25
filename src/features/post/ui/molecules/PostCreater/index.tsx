/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useRef } from 'react';
import { Form, useNavigate } from '@remix-run/react';

import { IPost } from '$features/post/types/post';

import useMiddleware from '$shared/hooks/useMiddleware';
import Icons from '$shared/ui/atoms/icons';
import Input from '$shared/ui/molecules/Input';
import instance from '$shared/api/instance';
import convertString from '$shared/lib/convertString';
import useLayout from '$shared/hooks/useLayout';

export default function PostCreater() {
  const { env } = useMiddleware();
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreatePost = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;
    updateLayout({
      loading: true,
    });
    const { category, plain_title }: IPost = await instance.post('create', { title: inputValue });
    updateLayout({
      loading: false,
    });
    navigate(`/posts/${category}/${convertString(plain_title, 'spaceToDash')}`);
  };

  return (
    <>
      {env.NODE_ENV === 'development' && (
        <Form method="post" action="/posts">
          <div className="flex w-fit gap-2 justify-center items-center">
            <Input ref={inputRef} placeholder="게시물 제목을 입력하세요" />
            <button type="submit" onClick={handleCreatePost}>
              <Icons.Refresh type="border" size="large" />
            </button>
          </div>
        </Form>
      )}
    </>
  );
}
