/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useRef } from 'react';
import { Form, useNavigate } from '@remix-run/react';

import { IPost } from '$features/post/types/post';

import Icons from '$shared/ui/atoms/icons';
import Input from '$shared/ui/molecules/Input';
import instance from '$shared/api/instance';
import convertString from '$shared/lib/convertString';

export default function PostCreater() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreatePost = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;
    const { category, plain_title }: IPost = await instance.post('article', { title: inputValue });
    navigate(`/posts/${category}/${convertString(plain_title, 'spaceToDash')}`);
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
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
